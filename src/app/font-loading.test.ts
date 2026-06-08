import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const rootDir = join(__dirname, "..", "..");
const layoutSource = readFileSync(join(rootDir, "src/app/layout.tsx"), "utf8");
const globalsCss = readFileSync(join(rootDir, "src/app/globals.css"), "utf8");

describe("root font loading", () => {
  it("uses CSS-hosted brand font variables without next/font runtime loaders", () => {
    expect(layoutSource).not.toContain("next/font");

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
