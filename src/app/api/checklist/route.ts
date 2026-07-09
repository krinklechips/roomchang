import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";

function escHtml(str: string): string {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#x27;");
}

function trunc(str: unknown, maxLen: number): string {
  if (typeof str !== "string") return "";
  return str.slice(0, maxLen);
}

const STEPS = [
  {
    label: "01",
    title: "Send Us Your X-rays or Photos",
    detail:
      "Email or WhatsApp your dental records, existing X-rays, or clear photos of your teeth to our team for an initial assessment.",
    action: "Email: contact@roomchang.com | WhatsApp: +855 69 811 338",
  },
  {
    label: "02",
    title: "Receive a Treatment Plan & Quote",
    detail:
      "Within 1–2 business days, you’ll receive a detailed treatment plan with costs, timelines, and what to expect at each visit.",
    action: "We’ll email your plan directly — no obligation.",
  },
  {
    label: "03",
    title: "Book Your Dates",
    detail:
      "Once you’re happy to proceed, we’ll schedule your appointments around your travel dates and confirm everything in writing.",
    action: "Let us know your preferred dates and we’ll handle the rest.",
  },
  {
    label: "04",
    title: "Arrive — We Handle the Rest",
    detail:
      "Our team can assist with airport directions, accommodation recommendations near our clinic, and a warm welcome on arrival.",
    action: "We’re located in central Phnom Penh, close to major hotels.",
  },
  {
    label: "05",
    title: "Treatment & Follow-up",
    detail:
      "Receive your treatment in a modern, hospital-standard facility. We’ll provide digital records and a full report for your home dentist.",
    action: "You’ll leave with everything your home dentist needs.",
  },
];

function buildHtml(name: string): string {
  const safeName = escHtml(name);
  const firstName = safeName.split(" ")[0] || safeName;

  const stepRows = STEPS.map(
    (s) => `
      <tr>
        <td style="padding:20px 24px;border-bottom:1px solid #f0e8ef;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td width="48" valign="top" style="padding-right:16px;">
                <div style="width:40px;height:40px;border-radius:12px;background:#cc3771;color:#ffffff;font-size:13px;font-weight:700;text-align:center;line-height:40px;">
                  ${s.label}
                </div>
              </td>
              <td valign="top">
                <p style="margin:0;font-size:15px;font-weight:700;color:#2c1a28;">${escHtml(s.title)}</p>
                <p style="margin:6px 0 0;font-size:13px;line-height:1.6;color:#705569;">${escHtml(s.detail)}</p>
                <p style="margin:8px 0 0;font-size:12px;color:#cc3771;font-weight:600;">${escHtml(s.action)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>`,
  ).join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7f3f6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f3f6;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(57,28,45,0.08);max-width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#cc3771,#7e2f66);padding:32px;">
            <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;">Your Treatment Checklist</p>
            <p style="margin:6px 0 0;font-size:14px;color:rgba(255,255,255,0.8);">Roomchang Dental Hospital &mdash; International Patient Guide</p>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:28px 24px 8px;">
            <p style="margin:0;font-size:15px;line-height:1.7;color:#2c1a28;">
              Hi ${firstName},
            </p>
            <p style="margin:10px 0 0;font-size:14px;line-height:1.7;color:#705569;">
              Here&rsquo;s your step-by-step guide to getting dental treatment at Roomchang. Follow along at your own pace &mdash; and reply to this email any time you have questions.
            </p>
          </td>
        </tr>

        <!-- Steps -->
        <tr>
          <td style="padding:16px 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${stepRows}
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:8px 24px 28px;" align="center">
            <a href="https://www.roomchang.com/contact" style="display:inline-block;background:#cc3771;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:999px;font-size:14px;font-weight:700;box-shadow:0 8px 24px rgba(204,55,113,0.25);">
              Start Your Treatment Plan
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 24px;border-top:1px solid #f0e8ef;background:#faf7f9;">
            <p style="margin:0;font-size:12px;line-height:1.6;color:#705569;">
              Roomchang Dental Hospital &bull; Established 1996<br>
              Phnom Penh, Cambodia &bull; <a href="https://www.roomchang.com" style="color:#cc3771;">roomchang.com</a><br><br>
              WhatsApp: <a href="https://api.whatsapp.com/send/?phone=85569811338" style="color:#cc3771;">+855 69 811 338</a>
              &bull; Email: <a href="mailto:contact@roomchang.com" style="color:#cc3771;">contact@roomchang.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    const cleanName = trunc(name, 120).trim();
    const cleanEmail = trunc(email, 254).trim();

    if (!cleanName) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!cleanEmail || !/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(cleanEmail)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const html = buildHtml(cleanName);

    const { ok, error: emailError } = await sendMail({
      to: cleanEmail,
      subject: `Your Treatment Checklist — Roomchang Dental Hospital`,
      html,
    });

    if (!ok) {
      console.error("[checklist] email send failed:", emailError);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
