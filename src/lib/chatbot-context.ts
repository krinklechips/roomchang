import { supabase } from "./supabase";

export type ChatbotContext = {
  services: string[];
  pricingSnapshot: string[];
  doctors: {
    name: string;
    credentials: string;
    role: string;
    specialty: string[];
    languages: string[];
  }[];
};

let cached: { data: ChatbotContext; ts: number } | null = null;
const TTL = 5 * 60 * 1000; // 5 minutes

export async function getChatbotContext(): Promise<ChatbotContext> {
  const now = Date.now();
  if (cached && now - cached.ts < TTL) return cached.data;

  const [servicesRes, pricingRes, doctorsRes] = await Promise.all([
    supabase.from("services").select("name").order("order"),
    supabase
      .from("pricing_items")
      .select("name, price, categoryId")
      .order("order")
      .limit(60),
    supabase
      .from("doctors")
      .select("name, credentials, role, specialty, languages")
      .eq("published", true)
      .order("order"),
  ]);

  const services = (servicesRes.data ?? []).map(
    (s: { name: string }) => s.name,
  );

  const pricingSnapshot = (pricingRes.data ?? []).map(
    (p: { name: string; price: string }) => `${p.name}: $${p.price}`,
  );

  const doctors = (doctorsRes.data ?? []).map(
    (d: {
      name: string;
      credentials: string;
      role: string;
      specialty: string[];
      languages: string[];
    }) => ({
      name: d.name,
      credentials: d.credentials || "",
      role: d.role || "",
      specialty: d.specialty || [],
      languages: d.languages || [],
    }),
  );

  const data: ChatbotContext = { services, pricingSnapshot, doctors };
  cached = { data, ts: now };
  return data;
}
