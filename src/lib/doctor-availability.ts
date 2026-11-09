import "server-only";
import { supabaseAdmin } from "./supabase-admin";
import { getPublishedPayloadDoctorNames, isPayloadSource } from "./payload-source";
import { sanitizeDoctor } from "./booking-validation";

type DoctorNames = { name: string | Record<string, string | null>; department: string };

async function publishedDoctors(): Promise<DoctorNames[]> {
  if (isPayloadSource()) return getPublishedPayloadDoctorNames();
  const { data, error } = await supabaseAdmin.from("doctors")
    .select("id,name,department").eq("published", true);
  if (error || !data) throw new Error("Doctor lookup failed");
  if (!data.length) return [];
  const translations = await supabaseAdmin.from("content_translations")
    .select("entity_id,value").eq("entity_type", "doctor").eq("field", "name")
    .in("locale", ["km", "zh"]).in("entity_id", data.map(d => String(d.id)));
  if (translations.error || !translations.data) throw new Error("Doctor name lookup failed");
  return data.map(d => ({
    department: d.department,
    name: Object.fromEntries([
      ["en", d.name],
      ...translations.data.filter(t => t.entity_id === String(d.id) && typeof t.value === "string")
        .map((t, i) => [`translation${i}`, t.value]),
    ]),
  }));
}

type DoctorValidation = { doctor: string } | {
  error: string; code: "DOCTOR_UNAVAILABLE" | "DOCTOR_LOOKUP_UNAVAILABLE"; status: 400 | 503;
};

export async function validatePreferredDoctor(raw: unknown, residentOnly: boolean): Promise<DoctorValidation> {
  const unavailable = { error: "The selected doctor is unavailable. Please choose another doctor or no preference.", code: "DOCTOR_UNAVAILABLE", status: 400 } as const;
  if (raw == null) return { doctor: "" };
  if (typeof raw !== "string" || raw.length > 120) return unavailable;
  if (!raw.trim()) return { doctor: "" };
  try {
    const doctors = await publishedDoctors();
    const matches: string[] = [];
    for (const doctor of doctors) {
      const names = typeof doctor.name === "string" ? { en: doctor.name } : doctor.name;
      if (!names || typeof names.en !== "string" || !names.en.trim() || typeof doctor.department !== "string") {
        throw new Error("Invalid doctor directory");
      }
      // Enquiries can request a consultant; the slot-booking policy is resident-only.
      if (residentOnly && doctor.department === "SENIOR_CONSULTANT") continue;
      if (Object.values(names).some(n => typeof n === "string" && sanitizeDoctor(raw, [n]))) matches.push(names.en);
    }
    return matches.length === 1 ? { doctor: matches[0] } : unavailable;
  } catch {
    return { error: "Doctor availability could not be checked. Please try again shortly.", code: "DOCTOR_LOOKUP_UNAVAILABLE", status: 503 };
  }
}
