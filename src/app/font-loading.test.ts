import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const rootDir = join(__dirname, "..", "..");
// The root layout lives inside [locale] (no src/app/layout.tsx) so the locale
// comes from params instead of getLocale() — keeps every route statically
// renderable (ISR).
const layoutSource = readFileSync(join(rootDir, "src/app/[locale]/layout.tsx"), "utf8");
const globalsCss = readFileSync(join(rootDir, "src/app/globals.css"), "utf8");

describe("root font loading", () => {
  it("uses CSS-hosted brand font variables without next/font runtime loaders", () => {
    // Brand fonts (Manrope/Gotham/Cormorant) must stay CSS-hosted — next/font
    // on them caused 500s on dynamic pages. Only the locale-gated fonts
    // (Battambang for /kh, Noto Sans SC for /cn) may use next/font.
    expect(layoutSource).not.toMatch(/import\s*\{[^}]*(Manrope|Gotham|Cormorant)[^}]*\}\s*from\s*"next\/font/);

    expect(globalsCss).toContain("@font-face");
    expect(globalsCss).toContain("--font-manrope: \"Manrope\"");
    expect(globalsCss).toContain("--font-gotham: \"Gotham\"");
    expect(globalsCss).toContain("/fonts/manrope/manrope-latin.woff2");
    expect(globalsCss).toContain("/fonts/gotham/GothamHTF-Book.otf");
    expect(globalsCss).toContain("/fonts/gotham/GothamHTF-BookItalic.otf");
    expect(globalsCss).toContain("/fonts/gotham/GothamHTF-Medium.otf");
    expect(globalsCss).toContain("/fonts/gotham/GothamHTF-Bold.otf");
    expect(globalsCss).toContain("/fonts/gotham/GothamHTF-Black.otf");
  });
});
