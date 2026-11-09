// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const state = vi.hoisted(() => ({
  source: "payload", failure: false,
  translationFailure: false,
  docs: [] as { id: number; name: Record<string, string>; department: string }[],
  insert: vi.fn(), rpc: vi.fn(), mail: vi.fn(), from: vi.fn(),
}));
vi.mock("@/lib/mailer", () => ({ sendMail: state.mail }));
vi.mock("@/lib/supabase-admin", () => ({ supabaseAdmin: { from: state.from, rpc: state.rpc } }));
vi.mock("@/lib/payload-source", () => ({
  isPayloadSource: () => state.source === "payload",
  getPublishedPayloadDoctorNames: async () => {
    if (state.failure) throw new Error("Directory offline");
    return state.docs;
  },
}));
import { POST as enquire } from "./enquiry/route";
import { POST as book } from "./book/route";
import { buildSystemPrompt } from "@/lib/chatbot-system-prompt";

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-09T08:00:00Z"));
  state.source = "payload";
  state.failure = false;
  state.translationFailure = false;
  state.docs = [
    { id: 1, name: { en: "Dr. Current Resident", kh: "វេជ្ជបណ្ឌិត បច្ចុប្បន្ន", cn: "现任医生" }, department: "GENERAL" },
    { id: 2, name: { en: "Dr. Current Consultant", kh: "វេជ្ជបណ្ឌិត ទីប្រឹក្សា", cn: "顾问医生" }, department: "SENIOR_CONSULTANT" },
  ];
  state.insert.mockResolvedValue({ error: null });
  state.rpc.mockResolvedValue({ data: "fixture-booking", error: null });
  state.mail.mockResolvedValue({ ok: true });
  state.from.mockImplementation((table: string) => {
    if (table === "enquiries") return { insert: state.insert };
    if (table === "doctors") return { select: () => ({ eq: async (field: string, value: boolean) => {
      expect([field, value]).toEqual(["published", true]);
      return { data: state.docs.map(d => ({ ...d, name: d.name.en })), error: state.failure ? { message: "offline" } : null };
    } }) };
    if (table === "content_translations") return { select: () => ({ eq: () => ({ eq: () => ({ in: () => ({ in: async () => ({ data: state.docs.flatMap(d => [{ entity_id: String(d.id), value: d.name.kh }, { entity_id: String(d.id), value: d.name.cn }]), error: state.translationFailure ? { message: "offline" } : null }) }) }) }) }) };
    throw new Error(`Unexpected table: ${table}`);
  });
});
afterEach(() => { vi.useRealTimers(); });

describe.each(["payload", "legacy"])("%s doctor submission checks", source => {
  beforeEach(() => { state.source = source; });
  describe.each(["en", "kh", "cn"])("%s", locale => {
    const request = (route: string, doctor: unknown) => new NextRequest(`https://sandbox.example.test/api/${route}`, {
      method: "POST", headers: { "Content-Type": "application/json", Referer: `https://sandbox.example.test/${locale}/contact` },
      body: JSON.stringify({ name: "Non-patient fixture", phone: "+85500000000", treatment: "Fixture", date: "2026-11-10", time: "10:00", doctor }),
    });
    it.each(["Dr. Thiv Samora", "Dr. Mora", "Samora", "Mora", "Dr. Current Stranger", "Resident", { name: "Dr. Current Resident" }, 42, "Dr. Current Resident" + " ".repeat(125)])("rejects unavailable or invalid doctor %j before any write", async doctor => {
      for (const [route, handler] of [["enquiry", enquire], ["book", book]] as const) {
        const res = await handler(request(route, doctor));
        expect(res.status).toBe(400);
        expect(await res.json()).toMatchObject({ code: "DOCTOR_UNAVAILABLE" });
      }
      expect(state.insert).not.toHaveBeenCalled();
      expect(state.rpc).not.toHaveBeenCalled();
      expect(state.mail).not.toHaveBeenCalled();
    });
    it("accepts the published name in this language and records its canonical name", async () => {
      for (const [route, handler] of [["enquiry", enquire], ["book", book]] as const) {
        expect((await handler(request(route, state.docs[0].name[locale]))).status).toBe(200);
      }
      expect(state.insert).toHaveBeenCalledWith(expect.objectContaining({ doctor: "Dr. Current Resident" }));
      expect(state.rpc).toHaveBeenCalledWith("book_appointment_slot", expect.objectContaining({ p_doctor: "Dr. Current Resident" }));
    });
    it("preserves consultant enquiries without allowing consultant slot bookings", async () => {
      expect((await enquire(request("enquiry", state.docs[1].name[locale]))).status).toBe(200);
      expect((await book(request("book", state.docs[1].name[locale]))).status).toBe(400);
      expect(state.insert).toHaveBeenCalledWith(expect.objectContaining({ doctor: "Dr. Current Consultant" }));
      expect(state.rpc).not.toHaveBeenCalled();
    });
    it("fails closed on a directory outage, without any writes or email", async () => {
      state.failure = true;
      for (const [route, handler] of [["enquiry", enquire], ["book", book]] as const) {
        const res = await handler(request(route, state.docs[0].name[locale]));
        expect(res.status).toBe(503);
        expect(await res.json()).toMatchObject({ code: "DOCTOR_LOOKUP_UNAVAILABLE" });
      }
      expect(state.insert).not.toHaveBeenCalled();
      expect(state.rpc).not.toHaveBeenCalled();
      expect(state.mail).not.toHaveBeenCalled();
    });
    it.each(["", undefined, null, "   "])("keeps an explicit no-preference request %j valid even during a directory outage", async doctor => {
      state.failure = true;
      expect((await enquire(request("enquiry", doctor))).status).toBe(200);
      expect((await book(request("book", doctor))).status).toBe(200);
      expect(state.insert).toHaveBeenCalledWith(expect.objectContaining({ doctor: null }));
      expect(state.rpc).toHaveBeenCalledWith("book_appointment_slot", expect.objectContaining({ p_doctor: "" }));
    });
    it("rejects ambiguous full names, never selecting an arbitrary doctor", async () => {
      state.docs.push({ ...state.docs[0], id: 3 });
      expect((await enquire(request("enquiry", state.docs[0].name[locale]))).status).toBe(400);
      expect(state.insert).not.toHaveBeenCalled();
    });
    it("reads current publication state on every request, not a cached eligibility list", async () => {
      const name = state.docs[0].name[locale];
      expect((await enquire(request("enquiry", name))).status).toBe(200);
      state.docs.shift();
      state.insert.mockClear(); state.mail.mockClear();
      expect((await enquire(request("enquiry", name))).status).toBe(400);
      expect((await book(request("book", name))).status).toBe(400);
      expect(state.insert).not.toHaveBeenCalled();
      expect(state.rpc).not.toHaveBeenCalled();
      expect(state.mail).not.toHaveBeenCalled();
    });
    it("does not confuse multiple localized spellings of one full name with two different doctors", async () => {
      state.docs[0].name.cn = "current resident";
      expect((await enquire(request("enquiry", "Dr. Current Resident"))).status).toBe(200);
    });
  });
});

it("fails closed if legacy name translations cannot be read", async () => {
  state.source = "legacy"; state.translationFailure = true;
  const res = await enquire(new NextRequest("https://sandbox.example.test/api/enquiry", {
    method: "POST", body: JSON.stringify({ name: "Fixture", phone: "00000000", doctor: state.docs[0].name.en }),
  }));
  expect(res.status).toBe(503);
  expect(state.insert).not.toHaveBeenCalled();
});

it("instructs the booking assistant to use exact directory names and an empty no-preference value", () => {
  const prompt = buildSystemPrompt({ services: [], pricingSnapshot: [], doctors: [] });
  expect(prompt).toContain("Use the full doctor name exactly as listed");
  expect(prompt).toContain('set "doctor" to an empty string');
});
