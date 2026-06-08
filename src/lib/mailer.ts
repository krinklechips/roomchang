import nodemailer, { type Transporter } from "nodemailer";

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
    return { ok: false, error: msg };
  }
}
