// @vitest-environment node
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import nodemailer from "nodemailer";
import sharp from "sharp";
import { sanitizeHtml } from "./sanitize";

const lock = JSON.parse(readFileSync(resolve(process.cwd(), "package-lock.json"), "utf8"));

describe("website security dependency floors", () => {
  // These guards prevent accidental reintroduction of known affected releases;
  // they are not exploit reproductions or a replacement for advisory scans.
  it.each([
    ["next", "16.4.4"],
    ["sharp", "0.35.5"],
    ["nodemailer", "10.1.7"],
    ["sanitize-html", "2.18.1"],
    ["react", "19.2.6"],
    ["react-dom", "19.2.6"],
  ])("keeps %s on a patched stable release", (name, minimum) => {
    const version = lock.packages[`node_modules/${name}`]?.version;
    expect(version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(version.localeCompare(minimum, "en", { numeric: true })).toBeGreaterThanOrEqual(0);
  });
});

describe("patched dependency compatibility at website boundaries", () => {
  it.each([
    ["en", "International patients"],
    ["kh", "អ្នកជំងឺអន្តរជាតិ"],
    ["cn", "国际患者"],
  ])("preserves %s content while removing executable HTML", (_locale, text) => {
    const result = sanitizeHtml(`<h2>${text}</h2><p class="body">${text}</p><script>alert(1)</script><a href="javascript:alert(1)">unsafe</a><img src="https://example.invalid/photo.jpg" onerror="alert(1)">`);
    expect(result).toContain(`<h2>${text}</h2>`);
    expect(result).toContain(`<p class="body">${text}</p>`);
    expect(result).toContain('src="https://example.invalid/photo.jpg"');
    expect(result).not.toMatch(/<script|onerror|javascript:/i);
  });

  it("retains legitimate SVG processing without exposing network resources", async () => {
    const input = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="8" height="6"><rect width="8" height="6" fill="#cc3366"/></svg>');
    const output = await sharp(input).png().toBuffer();
    const metadata = await sharp(output).metadata();
    expect(metadata).toMatchObject({ format: "png", width: 8, height: 6 });
    expect(await sharp(output).stats()).toMatchObject({ isOpaque: true });
  });

  it("preserves multilingual message data using an offline transport only", async () => {
    const transport = nodemailer.createTransport({ jsonTransport: true });
    const html = "<p>International patients · អ្នកជំងឺអន្តរជាតិ · 国际患者</p>";
    const info = await transport.sendMail({
      from: "fixture@example.invalid", to: "patient@example.invalid",
      subject: "Offline compatibility fixture", html, replyTo: "staff@example.invalid",
    });
    const message = JSON.parse(String(info.message));
    expect(message.html).toBe(html);
    expect(info.envelope).toEqual({ from: "fixture@example.invalid", to: ["patient@example.invalid"] });
  });
});
