import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "./render";
import messages from "../../messages/en.json";
import AffiliatesPage from "@/app/[locale]/admin/affiliates/page";
import AdminPricingPage from "@/app/[locale]/admin/pricing/page";
import { ConsentBanner } from "@/components/site/consent-banner";

const db = vi.hoisted(() => ({ from: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient: () => db }));

beforeEach(() => {
  document.cookie = "rc_consent=; path=/; max-age=0";
  delete window.gtag;
  delete window.dataLayer;
});

afterEach(() => {
  document.cookie = "rc_consent=; path=/; max-age=0";
  delete window.gtag;
  delete window.dataLayer;
});

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => { resolve = done; });
  return { promise, resolve };
}

describe("admin initial reads", () => {
  it("keeps affiliates loading until the agent read completes and displays visit/lead counts", async () => {
    const response = deferred<{ data: unknown[] }>();
    db.from.mockImplementation((table: string) => {
      if (table === "referral_agents") return { select: () => ({ order: () => response.promise }) };
      if (table === "referral_visits") return { select: async () => ({ data: [{ agent_code: "AGENT" }, { agent_code: "AGENT" }] }) };
      if (table === "enquiries") return { select: () => ({ not: async () => ({ data: [{ agent_code: "AGENT" }] }) }) };
      throw new Error(`Unexpected table: ${table}`);
    });
    render(<AffiliatesPage />);
    expect(screen.getByText("Loading agents…")).toBeInTheDocument();
    await act(async () => {
      response.resolve({ data: [{ id: "agent-1", name: "Agent One", code: "AGENT", notes: null, active: true, created_at: "2026-01-01" }] });
    });
    expect(screen.queryByText("Loading agents…")).not.toBeInTheDocument();
    expect(screen.getByText("Agent One")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getAllByText("2")).toHaveLength(2);
    expect(screen.getAllByText("1")).toHaveLength(3);
  });

  it("leaves the existing affiliates empty state when the initial read has no data", async () => {
    db.from.mockReturnValue({ select: () => ({ order: async () => ({ data: null }) }) });
    render(<AffiliatesPage />);
    expect(await screen.findByText("No agents yet. Create one above to get started.")).toBeInTheDocument();
    expect(screen.queryByText("Loading agents…")).not.toBeInTheDocument();
  });

  it("preserves the affiliates loading state and refreshed active status after a toggle", async () => {
    const agent = { id: "agent-1", name: "Agent One", code: "AGENT", notes: null, active: true, created_at: "2026-01-01" };
    const refreshed = deferred<{ data: unknown[] }>();
    let reads = 0;
    db.from.mockImplementation((table: string) => {
      if (table === "referral_agents") return {
        select: () => ({ order: () => ++reads === 1 ? Promise.resolve({ data: [agent] }) : refreshed.promise }),
        update: () => ({ eq: async () => ({ error: null }) }),
      };
      if (table === "referral_visits") return { select: async () => ({ data: [] }) };
      if (table === "enquiries") return { select: () => ({ not: async () => ({ data: [] }) }) };
      throw new Error(`Unexpected table: ${table}`);
    });
    const user = userEvent.setup();
    render(<AffiliatesPage />);
    await user.click(await screen.findByRole("button", { name: "Deactivate" }));
    expect(screen.getByText("Loading agents…")).toBeInTheDocument();
    await act(async () => { refreshed.resolve({ data: [{ ...agent, active: false }] }); });
    expect(screen.getByText("Inactive")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Activate" })).toBeInTheDocument();
    expect(screen.queryByText("Loading agents…")).not.toBeInTheDocument();
  });

  it("keeps pricing loading until its read completes, then displays the editable rows", async () => {
    const response = deferred<Response>();
    vi.stubGlobal("fetch", vi.fn(() => response.promise));
    render(<AdminPricingPage />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
    await act(async () => {
      response.resolve(Response.json({ categories: [{ id: "implants", title: "Implants", icon: "", items: [{ id: "row-1", ada: "D6010", name: "Implant", note: "per tooth", price: "600.00", aus: "1500.00" }] }] }));
    });
    expect(screen.getByDisplayValue("Implant")).toBeInTheDocument();
    expect(screen.getByDisplayValue("600.00")).toBeInTheDocument();
    expect(screen.queryByText("Loading…")).not.toBeInTheDocument();
  });

  it("retains the pricing error message when the read fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { status: 500 })));
    render(<AdminPricingPage />);
    expect(await screen.findByText("Could not load pricing data.")).toBeInTheDocument();
    expect(screen.queryByText("Loading…")).not.toBeInTheDocument();
  });

  it("reloads canonical pricing row IDs after saving so the next save updates rather than duplicates", async () => {
    const canonical = deferred<Response>();
    const initial = { categories: [{ id: "implants", title: "Implants", icon: "", items: [] as unknown[] }] };
    const savedBodies: unknown[] = [];
    let reads = 0;
    vi.stubGlobal("fetch", vi.fn(async (input: string, init?: RequestInit) => {
      if (input !== "/api/admin/pricing") throw new Error(`Unexpected URL: ${input}`);
      if (init?.method === "POST") {
        savedBodies.push(JSON.parse(init.body as string));
        return Response.json({ lastUpdated: "2026-10-21" });
      }
      return ++reads === 1 ? Response.json(initial) : canonical.promise.then((response) => response.clone());
    }));
    const user = userEvent.setup();
    render(<AdminPricingPage />);
    await user.click((await screen.findAllByRole("button", { name: /add row/i }))[0]);
    await user.type(screen.getByPlaceholderText("Treatment name…"), "New row");
    await user.click(screen.getByRole("button", { name: "Save Changes" }));
    expect(savedBodies[0]).toMatchObject({ categories: [{ items: [{ name: "New row" }] }] });
    await act(async () => {
      canonical.resolve(Response.json({ categories: [{ ...initial.categories[0], items: [{ id: "new-row", ada: "", name: "Canonical new row", note: "", price: "", aus: "" }] }] }));
    });
    expect(screen.getByDisplayValue("Canonical new row")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Save Changes" }));
    expect(savedBodies[1]).toMatchObject({ categories: [{ items: [{ id: "new-row", name: "Canonical new row" }] }] });
  });
});

describe("consent visibility and updates", () => {
  it("emits no banner during server rendering", () => {
    const html = renderToString(
      <NextIntlClientProvider locale="en" messages={messages} timeZone="Asia/Phnom_Penh">
        <ConsentBanner />
      </NextIntlClientProvider>,
    );
    expect(html).toBe("");
  });

  it("hydrates hidden server output and then shows the banner without a mismatch", async () => {
    const ui = <NextIntlClientProvider locale="en" messages={messages} timeZone="Asia/Phnom_Penh"><ConsentBanner /></NextIntlClientProvider>;
    const container = document.createElement("div");
    container.innerHTML = renderToString(ui);
    document.body.appendChild(container);
    const errors: unknown[] = [];
    let root!: ReturnType<typeof hydrateRoot>;
    try {
      await act(async () => { root = hydrateRoot(container, ui, { onRecoverableError: (error) => errors.push(error) }); });
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(errors).toEqual([]);
    } finally {
      act(() => root?.unmount());
      container.remove();
    }
  });

  it.each(["granted", "denied"])("does not show the banner or resend an existing %s choice", (value) => {
    document.cookie = `rc_consent=${value}; path=/`;
    window.gtag = vi.fn();
    render(<ConsentBanner />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(window.gtag).not.toHaveBeenCalled();
  });

  it.each([
    ["Accept All", "granted"],
    ["Only Necessary", "denied"],
  ])("persists %s and applies all four Consent Mode fields", async (button, value) => {
    window.gtag = vi.fn();
    const user = userEvent.setup();
    render(<ConsentBanner />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Cookie Policy" })).toHaveAttribute("href", "/en/cookie-policy");
    await user.click(screen.getByRole("button", { name: button }));
    expect(document.cookie).toContain(`rc_consent=${value}`);
    expect(window.gtag).toHaveBeenCalledExactlyOnceWith("consent", "update", {
      ad_storage: value,
      analytics_storage: value,
      ad_user_data: value,
      ad_personalization: value,
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("uses dataLayer when gtag has not loaded", async () => {
    const user = userEvent.setup();
    render(<ConsentBanner />);
    await user.click(screen.getByRole("button", { name: "Only Necessary" }));
    expect(window.dataLayer).toEqual([["consent", "update", {
      ad_storage: "denied",
      analytics_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    }]]);
    expect(document.cookie).toContain("rc_consent=denied");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
