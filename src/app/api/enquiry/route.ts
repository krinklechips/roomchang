import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, country, treatment, branch, doctor, date, message } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Read referral cookie if present
    const agent_code = request.cookies.get("rc_ref")?.value ?? null;

    // 1. Save to Supabase
    const { error: dbError } = await supabase.from("enquiries").insert({
      id: crypto.randomUUID(),
      name,
      email: email ?? null,
      phone: phone ?? null,
      country: country ?? null,
      treatment: treatment ?? null,
      branch: branch ?? null,
      doctor: doctor ?? null,
      date: date ?? null,
      message: message ?? null,
      agent_code,
      read: false,
    });

    if (dbError) {
      console.error("Supabase enquiry insert error:", dbError);
      return NextResponse.json({ error: "Failed to save enquiry" }, { status: 500 });
    }

    // 2. Send email notification
    const toEmail = process.env.ENQUIRY_TO_EMAIL ?? "contact@roomchang.com";

    const rows = [
      ["Name",               name],
      ["Email",              email || "—"],
      ["Phone / WhatsApp",   phone || "—"],
      ["Country",            country || "—"],
      ["Treatment",          treatment || "—"],
      ["Preferred Branch",   branch || "—"],
      ["Preferred Doctor",   doctor || "—"],
      ["Preferred Date",     date || "—"],
      ["Referral Code",      agent_code || "—"],
    ];

    const tableRows = rows
      .map(([label, value]) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0e8ef;font-size:13px;color:#705569;white-space:nowrap;font-weight:600;">${label}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0e8ef;font-size:13px;color:#2c1a28;">${value}</td>
        </tr>`)
      .join("");

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f7f3f6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f3f6;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(57,28,45,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#cc3771;padding:28px 32px;">
            <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;letter-spacing:0.02em;">Roomchang Dental Hospital</p>
            <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.75);">New Enquiry / Appointment Request</p>
          </td>
        </tr>

        <!-- Patient message -->
        ${message ? `
        <tr>
          <td style="padding:24px 32px 0;">
            <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#cc3771;">Message from Patient</p>
            <p style="margin:0;font-size:14px;line-height:1.7;color:#2c1a28;background:#f7f3f6;border-radius:10px;padding:16px;">${message.replace(/\n/g, "<br>")}</p>
          </td>
        </tr>` : ""}

        <!-- Details table -->
        <tr>
          <td style="padding:24px 32px;">
            <p style="margin:0 0 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#cc3771;">Enquiry Details</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0e8ef;border-radius:10px;overflow:hidden;">
              ${tableRows}
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px 28px;border-top:1px solid #f0e8ef;">
            <p style="margin:0;font-size:12px;color:#705569;">
              This enquiry was submitted via the Roomchang website contact form.
              Reply directly to <a href="mailto:${email}" style="color:#cc3771;">${email || "the patient"}</a> to respond.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const { error: emailError } = await resend.emails.send({
      from: "Roomchang Website <noreply@roomchang.com>",
      to: [toEmail],
      replyTo: email || undefined,
      subject: `New Enquiry — ${name}${treatment ? ` (${treatment})` : ""}`,
      html,
    });

    if (emailError) {
      // Don't fail the request — enquiry is already saved to DB
      console.error("Resend email error:", emailError);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
