/**
 * Screenshot every image-bearing page on the live production site.
 * Usage: node scripts/screenshot-all.js
 * Output: docs/screenshots/{desktop,mobile}/<page-slug>.jpg
 *
 * Uses playwright-core with the locally installed Google Chrome.
 */
const { chromium } = require("playwright-core");
const path = require("node:path");
const fs = require("node:fs");

const BASE_URL = "https://roomchang.vercel.app/en";
const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const PAGES = [
  // Core pages
  { slug: "home",                    path: "/" },
  { slug: "about",                   path: "/about" },
  { slug: "about-facilities",        path: "/about/facilities" },
  { slug: "about-news",              path: "/about/news" },
  { slug: "about-community",         path: "/about/community" },
  { slug: "about-partnerships",      path: "/about/partnerships" },
  { slug: "about-testimonials",      path: "/about/testimonials" },
  { slug: "about-vision-mission",    path: "/about/vision-mission-values" },
  { slug: "about-director-message",  path: "/about/director-message" },
  // Services
  { slug: "services",                path: "/services" },
  { slug: "services-preventive",     path: "/services/preventive-dentistry" },
  { slug: "services-cosmetic",       path: "/services/cosmetic-dentistry" },
  { slug: "services-implants",       path: "/services/dental-implants" },
  { slug: "services-orthodontics",   path: "/services/orthodontics" },
  { slug: "services-crowns",         path: "/services/dental-crowns" },
  { slug: "services-endodontics",    path: "/services/endodontics" },
  { slug: "services-pediatric",      path: "/services/pediatric-dentistry" },
  { slug: "services-periodontics",   path: "/services/periodontics" },
  { slug: "services-dentures",       path: "/services/dentures" },
  { slug: "services-oral-surgery",   path: "/services/oral-surgery" },
  { slug: "services-fmr",            path: "/services/full-mouth-reconstruction" },
  { slug: "services-whitening",      path: "/services/teeth-whitening" },
  { slug: "services-sleep-apnea",    path: "/services/sleep-apnea" },
  // Technology
  { slug: "technology",              path: "/technology" },
  { slug: "technology-cad-cam",      path: "/technology/cad-cam" },
  { slug: "technology-clear-aligner",path: "/technology/ca-clear-aligner" },
  { slug: "technology-invisalign",   path: "/technology/invisalign" },
  { slug: "technology-ortho-tain",   path: "/technology/ortho-tain" },
  { slug: "technology-resmed",       path: "/technology/resmed-apnealink" },
  { slug: "technology-beyond",       path: "/technology/beyond-whitening" },
  { slug: "technology-icon",         path: "/technology/icon-vestibular" },
  { slug: "technology-sterilisation",path: "/technology/sterilisation" },
  // Other key pages
  { slug: "team",                    path: "/team" },
  { slug: "international",           path: "/international" },
  { slug: "international-price-comparison", path: "/international/price-comparison" },
  { slug: "pricing",                 path: "/pricing" },
  { slug: "clinical-results",        path: "/clinical-results" },
  { slug: "contact",                 path: "/contact" },
  { slug: "blog-dentist-talks",      path: "/blog/dentist-talks" },
];

const DESKTOP = { width: 1440, height: 900 };
const MOBILE  = { width: 390,  height: 844 };

const OUT_DIR = path.join(__dirname, "../docs/screenshots");

async function screenshotPage(page, url, outPath) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });
  // Let animations settle
  await page.waitForTimeout(800);
  await page.screenshot({ path: outPath, fullPage: true, type: "jpeg", quality: 80 });
}

async function run() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });

  let done = 0;
  const total = PAGES.length * 2;

  for (const { slug, path: pagePath } of PAGES) {
    const url = BASE_URL + pagePath;

    // Desktop
    const ctxD = await browser.newContext({ viewport: DESKTOP });
    const pageD = await ctxD.newPage();
    const outD = path.join(OUT_DIR, "desktop", `${slug}.jpg`);
    try {
      await screenshotPage(pageD, url, outD);
      done++;
      process.stdout.write(`\r[${done}/${total}] desktop/${slug}.jpg`);
    } catch (e) {
      console.log(`\n  SKIP desktop/${slug}: ${e.message.split("\n")[0]}`);
      done++;
    }
    await ctxD.close();

    // Mobile
    const ctxM = await browser.newContext({
      viewport: MOBILE,
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
    });
    const pageM = await ctxM.newPage();
    const outM = path.join(OUT_DIR, "mobile", `${slug}.jpg`);
    try {
      await screenshotPage(pageM, url, outM);
      done++;
      process.stdout.write(`\r[${done}/${total}] mobile/${slug}.jpg   `);
    } catch (e) {
      console.log(`\n  SKIP mobile/${slug}: ${e.message.split("\n")[0]}`);
      done++;
    }
    await ctxM.close();
  }

  await browser.close();
  console.log(`\n\nDone — ${done} screenshots in docs/screenshots/`);

  // Write an index file
  const lines = ["# Page screenshots\n",
    `Generated: ${new Date().toISOString()}\n`,
    `Site: ${BASE_URL}\n\n`,
    "## Desktop (1440px)\n",
    ...PAGES.map(p => `- [${p.slug}](desktop/${p.slug}.jpg) — \`/en${p.path}\``),
    "\n## Mobile (390px)\n",
    ...PAGES.map(p => `- [${p.slug}](mobile/${p.slug}.jpg) — \`/en${p.path}\``),
  ];
  fs.writeFileSync(path.join(OUT_DIR, "README.md"), lines.join("\n"));
  console.log("Index written → docs/screenshots/README.md");
}

run().catch(err => { console.error(err); process.exit(1); });
