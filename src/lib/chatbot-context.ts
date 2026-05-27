import { supabase } from "./supabase";

export type ChatbotContext = {
  services: string[];
  pricingSnapshot: string[];
  doctors: { name: string; title: string }[];
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
    supabase.from("doctors").select("name, title").order("order"),
  ]);

  const services = (servicesRes.data ?? []).map(
    (s: { name: string }) => s.name,
  );

  const pricingSnapshot = (pricingRes.data ?? []).map(
    (p: { name: string; price: string }) => `${p.name}: $${p.price}`,
  );

  const doctors = (doctorsRes.data ?? []).map(
    (d: { name: string; title: string }) => ({
      name: d.name,
      title: d.title,
    }),
  );

  const data: ChatbotContext = { services, pricingSnapshot, doctors };
  cached = { data, ts: now };
  return data;
}
