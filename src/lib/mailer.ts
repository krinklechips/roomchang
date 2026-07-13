import nodemailer, { type Transporter } from "nodemailer";
import { sendTelegramAlert } from "@/lib/alert";

// Best-effort throttle so a burst of failed sends can't spam Telegram. Module
// scope = per warm serverless instance (good enough; failures are rare).
let lastFailureAlertMs = 0;
const FAILURE_ALERT_THROTTLE_MS = 15 * 60 * 1000;

/**
 * Transactional email via SMTP (SiteGround).
 *
 * Configured entirely from env so the provider can change without code edits:
 *   SMTP_HOST  e.g. sm12.siteground.biz
 *   SMTP_PORT  e.g. 465   (secure/SSL when 465, STARTTLS otherwise)
 *   SMTP_USER  the mailbox to authenticate as, e.g. contact@roomchang.com
 *   SMTP_PASS  that mailbox's password
 *   SMTP_FROM  default From header, e.g. "Roomchang Dental <contact@roomchang.com>"
 *
 * Fail-loud: if SMTP isn't configured, we log an error and return ok:false
 * rather than silently pretending the email was sent.
 */

let transporter: Transporter | null = null;

function getTransport(): Transporter | null {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.error(
      "[mailer] SMTP not configured (need SMTP_HOST, SMTP_USER, SMTP_PASS) — email not sent",
    );
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }
  return transporter;
}

/**
 * Health probe: connects to the SMTP server and performs a real AUTH login
 * WITHOUT sending anything. Catches silently-broken credentials (e.g. the
 * July 2026 "535 Incorrect authentication data" outage where patients saw
 * success but the clinic received no enquiry emails for 2 days).
 */
export async function verifySmtp(): Promise<{ ok: boolean; error?: string }> {
  const tx = getTransport();
  if (!tx) return { ok: false, error: "SMTP not configured" };
  try {
    await tx.verify();
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg };
  }
}

/** Default From header — the authenticated mailbox by convention. */
export const MAIL_FROM =
  process.env.SMTP_FROM ||
  `Roomchang Dental <${process.env.SMTP_USER || "contact@roomchang.com"}>`;

export async function sendMail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  from?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const tx = getTransport();
  if (!tx) return { ok: false, error: "SMTP not configured" };

  try {
    await tx.sendMail({
      from: opts.from || MAIL_FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      replyTo: opts.replyTo,
    });
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[mailer] send failed:", msg);

    // Instant alert: a failed transactional email means a patient enquiry /
    // booking notification just black-holed (the July 2026 outage went
    // unnoticed for 2 days). Fire immediately, throttled, never block/throw.
    const now = Date.now();
    if (now - lastFailureAlertMs > FAILURE_ALERT_THROTTLE_MS) {
      lastFailureAlertMs = now;
      await sendTelegramAlert(
        `🚨 Roomchang EMAIL FAILED to send — ${msg}\n\n` +
          `A patient enquiry/booking notification did NOT reach the clinic (the enquiry IS still saved in the database). ` +
          `Fix: SiteGround → reset the mailbox password → update SMTP_PASS in Vercel → redeploy.`,
      ).catch(() => {
        // Alerting must never break email handling.
      });
    }

    return { ok: false, error: msg };
  }
}
