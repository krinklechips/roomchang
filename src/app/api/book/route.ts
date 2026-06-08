import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";
import { supabaseAdmin } from "@/lib/supabase-admin";

const SLOT_TIMES = buildSlotTimes();

function buildSlotTimes(): Set<string> {
  const slots = new Set<string>();
  for (let hour = 8; hour <= 17; hour++) {
    for (const minute of [0, 30]) {
      if (hour === 17 && minute === 30) continue;
      slots.add(`${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
    }
  }
  return slots;
}


function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function trunc(str: unknown, maxLen: number): string {
  if (typeof str !== "string") return "";
  return str.slice(0, maxLen);
}

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && value === date.toISOString().slice(0, 10);
}

function isSunday(value: string): boolean {
  return new Date(`${value}T00:00:00.000Z`).getUTCDay() === 0;
}

function normalizeTime(value: string): string {
  const match = value.match(/^(\d{2}):(\d{2})(?::\d{2})?$/);
  if (!match) return "";
  return `${match[1]}:${match[2]}`;
}

function buildRows(rows: [string, string][]): string {
  return rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #f0e8ef;font-size:13px;color:#705569;white-space:nowrap;font-weight:600;">${label}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #f0e8ef;font-size:13px;color:#2c1a28;">${value || "—"}</td>
        </tr>`,
    )
    .join("");
}

function buildEmailHtml({
  title,
  subtitle,
  rows,
  notes,
}: {
  title: string;
  subtitle: string;
  rows: [string, string][];
  notes: string;
}): string {
  const tableRows = buildRows(rows);
  const safeNotes = escHtml(notes).replace(/\n/g, "<br>");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f7f3f6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f3f6;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(57,28,45,0.08);">
        <tr>
          <td style="background:#cc3771;padding:28px 32px;">
            <p style="margin:0;font-size:18px;font-weight:700;color:#ffffff;letter-spacing:0.02em;">${escHtml(title)}</p>
            <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.75);">${escHtml(subtitle)}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 32px;">
            <p style="margin:0 0 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#cc3771;">Appointment Details</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #f0e8ef;border-radius:10px;overflow:hidden;">
              ${tableRows}
            </table>
          </td>
        </tr>
        ${
          notes
            ? `<tr>
          <td style="padding:0 32px 24px;">
            <p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#cc3771;">Notes</p>
            <p style="margin:0;font-size:14px;line-height:1.7;color:#2c1a28;background:#f7f3f6;border-radius:10px;padding:16px;">${safeNotes}</p>
          </td>
        </tr>`
            : ""
        }
        <tr>
          <td style="padding:20px 32px 28px;border-top:1px solid #f0e8ef;">
            <p style="margin:0;font-size:12px;color:#705569;">Roomchang Dental Hospital will review this pending appointment and follow up soon.</p>
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

    const cleanName = trunc(body.name, 120).trim();
    const cleanEmail = trunc(body.email, 254).trim();
    const cleanPhone = trunc(body.phone, 40).trim();
    const cleanTelegram = trunc(body.telegram, 80).trim();
    const cleanTreatment = trunc(body.treatment, 120).trim();
    const cleanDate = trunc(body.date, 20).trim();
    const cleanTime = normalizeTime(trunc(body.time, 20).trim());
    const cleanBranch = trunc(body.branch, 120).trim();
    const cleanDoctor = trunc(body.doctor, 120).trim();
    const cleanNotes = trunc(body.notes, 2000).trim();

    if (!cleanName) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!cleanEmail && !cleanPhone) {
      return NextResponse.json({ error: "Email or phone is required" }, { status: 400 });
    }

    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    if (!cleanTreatment) {
      return NextResponse.json({ error: "Treatment is required" }, { status: 400 });
    }

    if (!isValidDate(cleanDate) || isSunday(cleanDate)) {
      return NextResponse.json({ error: "Valid Monday-Saturday date is required" }, { status: 400 });
    }

    if (!SLOT_TIMES.has(cleanTime)) {
      return NextResponse.json({ error: "Valid appointment time is required" }, { status: 400 });
    }

    const { data: bookingId, error: bookingError } = await supabaseAdmin.rpc(
      "book_appointment_slot",
      {
        p_name: cleanName,
        p_email: cleanEmail,
        p_phone: cleanPhone,
        p_telegram: cleanTelegram,
        p_treatment: cleanTreatment,
        p_date: cleanDate,
        p_time: cleanTime,
        p_branch: cleanBranch,
        p_doctor: cleanDoctor,
        p_notes: cleanNotes,
      },
    );

    if (bookingError) {
      const message = bookingError.message.toLowerCase();
      if (message.includes("slot_not_available")) {
        return NextResponse.json({ error: "Slot is no longer available" }, { status: 409 });
      }

      console.error("[book] Supabase booking error:", bookingError);
      return NextResponse.json({ error: "Failed to book appointment" }, { status: 500 });
    }

    const rows: [string, string][] = [
      ["Name", escHtml(cleanName)],
      ["Email", cleanEmail ? escHtml(cleanEmail) : "—"],
      ["Phone / WhatsApp", cleanPhone ? escHtml(cleanPhone) : "—"],
      ["Telegram", cleanTelegram ? escHtml(cleanTelegram) : "—"],
      ["Treatment", escHtml(cleanTreatment)],
      ["Preferred Date", escHtml(cleanDate)],
      ["Preferred Time", escHtml(cleanTime)],
      ["Preferred Branch", cleanBranch ? escHtml(cleanBranch) : "—"],
      ["Preferred Doctor", cleanDoctor ? escHtml(cleanDoctor) : "—"],
    ];

    const patientHtml = buildEmailHtml({
      title: "Roomchang Dental Hospital",
      subtitle: "Appointment request received",
      rows,
      notes: cleanNotes,
    });

    if (cleanEmail) {
      const { ok, error: patientEmailError } = await sendMail({
        to: cleanEmail,
        subject: "Roomchang appointment request received",
        html: patientHtml,
      });
      if (!ok) {
        console.error("[book] Patient email error:", patientEmailError);
      }
    }

    const toEmail = process.env.ENQUIRY_TO_EMAIL || "contact@roomchang.com";
    const clinicHtml = buildEmailHtml({
      title: "Roomchang Dental Hospital",
      subtitle: "New pending appointment request",
      rows: [["Booking ID", escHtml(String(bookingId))], ...rows],
      notes: cleanNotes,
    });

    const { ok: clinicOk, error: clinicEmailError } = await sendMail({
      to: toEmail,
      replyTo: cleanEmail || undefined,
      subject: `New appointment request - ${cleanName} at ${cleanTime}`,
      html: clinicHtml,
    });
    if (!clinicOk) {
      console.error("[book] Clinic email error:", clinicEmailError);
    }

    return NextResponse.json({ ok: true, bookingId });
  } catch (err) {
    console.error("[book] Error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
