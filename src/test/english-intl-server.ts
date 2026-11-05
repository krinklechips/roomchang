import { vi } from "vitest";

// Supply the missing Next request context, retaining the real ICU translator and copy.
vi.mock("next-intl/server", async () => {
  const { createTranslator } = await import("next-intl");
  const { default: messages } = await import("../../messages/en.json");

  return {
    getLocale: async () => "en",
    setRequestLocale: vi.fn(),
    getTranslations: async (options?: string | { locale?: string; namespace?: string }) => {
      const locale = typeof options === "object" ? options.locale ?? "en" : "en";
      if (locale !== "en") throw new Error("The English test fixture requires locale en");

      return createTranslator({
        locale,
        messages: messages as import("next-intl").AbstractIntlMessages,
        namespace: typeof options === "string" ? options : options?.namespace,
        timeZone: "Asia/Phnom_Penh",
      });
    },
  };
});
