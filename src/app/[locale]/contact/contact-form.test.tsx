import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "./contact-form";
import en from "../../../../messages/en.json";
import kh from "../../../../messages/km.json";
import cn from "../../../../messages/zh.json";

const searchParams = new URLSearchParams("doctor=Dr.%20Thiv%20Samora");
vi.mock("next/navigation", () => ({ useSearchParams: () => searchParams }));
vi.mock("@/components/ui/date-picker", () => ({ DatePicker: () => <input name="date" /> }));
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe.each([["en", en], ["kh", kh], ["cn", cn]] as const)("%s stale doctor form", (locale, messages) => {
  it.each([[400, "DOCTOR_UNAVAILABLE"], [503, "DOCTOR_LOOKUP_UNAVAILABLE"]])("preserves entered fields after HTTP %i and lets the visitor correct their preference", async (status, code) => {
    const alert = vi.spyOn(window, "alert").mockImplementation(() => {});
    const fetcher = vi.fn().mockResolvedValue({ ok: false, status, json: async () => ({ code }) });
    vi.stubGlobal("fetch", fetcher);
    const { container } = render(<NextIntlClientProvider locale={locale} messages={messages} timeZone="Asia/Phnom_Penh">
      <ContactForm branches={[]} doctors={[]} />
    </NextIntlClientProvider>);
    const form = container.querySelector("form")!;
    const input = (name: string) => form.querySelector<HTMLInputElement>(`[name="${name}"]`)!;
    fireEvent.change(input("name"), { target: { value: "Non-patient fixture" } });
    fireEvent.change(input("phone"), { target: { value: "00000000" } });
    fireEvent.change(input("message"), { target: { value: "Keep this text" } });
    fireEvent.submit(form);
    await waitFor(() => expect(alert).toHaveBeenCalledWith(messages.contactForm.error.generic));
    expect(JSON.parse(fetcher.mock.calls[0][1].body)).toMatchObject({ doctor: "Dr. Thiv Samora" });
    expect(input("name").value).toBe("Non-patient fixture");
    expect(input("message").value).toBe("Keep this text");
    expect(input("doctor").value).toBe("Dr. Thiv Samora");
    if (code === "DOCTOR_UNAVAILABLE") expect(container.querySelector("#doctor")).toHaveFocus();
    fireEvent.change(container.querySelector("#doctor")!, { target: { value: "" } });
    expect(input("doctor").value).toBe("");
    expect(input("message").value).toBe("Keep this text");
    alert.mockRestore();
  });
});
