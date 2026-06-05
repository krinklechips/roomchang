# Legacy-site (roomchang.com) image migration manifest

All images below are still served from the **old WordPress site** (`roomchang.com`).
To remove the legacy dependency: download each, upload to R2 (or `public/`), then
the DB / code references get repointed.

- **Total: 66 images** — 56 in the database, 10 in code (`src/lib/news.ts`).
- Suggested R2 keys use the `roomchang/` prefix with clean lowercase-hyphen names.
- When you're ready, tell me the new base URL/keys and I'll repoint every reference.

---

## 1. Partner logos — DB `partners.logo_src` (2)

| Partner | Legacy URL | Suggested R2 key |
|---|---|---|
| AIA | https://roomchang.com/wp-content/uploads/2023/02/AIA.jpg | `roomchang/partners/aia.jpg` |
| CCU Bank | https://roomchang.com/wp-content/uploads/2024/10/CCU-Bank.jpg | `roomchang/partners/ccu-bank.jpg` |

---

## 2. Community articles — DB `community_articles` (11 covers + 43 gallery = 54)

Suggested keys: `roomchang/community/<slug>/cover.<ext>` and `.../gallery-NN.<ext>`

### 27th-anniversary-blood-donation
- cover: https://roomchang.com/wp-content/uploads/2023/12/photo_2022-12-12_16-53-12__2_.jpg

### 28th-anniversary-blood-donation  (cover + 6 gallery)
- cover: https://roomchang.com/wp-content/uploads/2023/12/WhatsApp-Image-2023-12-14-at-08.00.33.jpeg
- gallery: https://roomchang.com/wp-content/uploads/2025/07/l__1_-1024x671-1.jpg
- gallery: https://roomchang.com/wp-content/uploads/2025/07/l__3_-1024x656-1.jpg
- gallery: https://roomchang.com/wp-content/uploads/2025/07/l__4_-1024x684-1.jpg
- gallery: https://roomchang.com/wp-content/uploads/2025/07/l__5_-1024x681-1.jpg
- gallery: https://roomchang.com/wp-content/uploads/2025/07/l__6_-1024x656-1.jpg
- gallery: https://roomchang.com/wp-content/uploads/2025/07/l__7_-1024x707-1.jpg

### 29th-anniversary-blood-donation  (cover + 24 gallery)
- cover: https://roomchang.com/wp-content/uploads/2024/12/470221513_1143548607331480_5822147168748663462_n-1024x684.jpg
- gallery (24): all `https://roomchang.com/wp-content/uploads/2024/12/<id>_<id>_n-1024x684.jpg`
  - 470221513_1143548607331480_5822147168748663462_n
  - 469902352_1143546590665015_8388443056376266821_n
  - 469980754_1143548250664849_4276858010319304654_n
  - 470038314_1143546630665011_187032868367702458_n
  - 470004838_1143547430664931_1892292209901703817_n
  - 469902769_1143547393998268_3370512166390482333_n
  - 470174466_1143547617331579_8864260880647931888_n
  - 469844911_1143547827331558_7698883575650287848_n
  - 470075134_1143548453998162_5217773811482666978_n
  - 469958789_1143547903998217_2316756198663876536_n
  - 470009796_1143547867331554_7873435276215901884_n
  - 470192823_1143547790664895_6010588543878168348_n
  - 469900306_1143546830664991_1292802476260164634_n
  - 470109199_1143547010664973_7580722409496090464_n
  - 469945333_1143547137331627_2684580967008793481_n
  - 469956028_1143547970664877_4235112589517671675_n
  - 469958959_1143548283998179_1248628111850630648_n
  - 469979049_1143548307331510_5401505671914125836_n
  - 469983833_1143547280664946_4905831473115988165_n
  - 470174451_1143547773998230_8189347784964404012_n
  - 469998219_1143547533998254_2063302581537520693_n
  - 470005367_1143547030664971_8273428027325302947_n
  - 470208193_1143547543998253_7667100304178277120_n
  - 470212250_1143548367331504_7718747991686912852_n

### battambang-mobile-clinic
- cover: https://roomchang.com/wp-content/uploads/2014/11/Giving-back-with-a-smile.jpg

### campu-brightstar-hidden-talent-contest
- cover: https://roomchang.com/wp-content/uploads/2023/02/Campu-Bright-Star_Web.jpg

### covid-19-community-support
- cover: https://roomchang.com/wp-content/uploads/2025/07/IMG_2809-1-1-1024x768.jpg

### early-childhood-development-rhb
- cover: https://roomchang.com/wp-content/uploads/2014/11/Early-childhood-development-school-program_RHB-Indochina-bank-Roomchang-Dental.jpg

### kantha-bopha-blood-drives  (cover + 8 gallery)
- cover: https://roomchang.com/wp-content/uploads/2013/08/Blood-donate-to-Kuntha-Bopha_Roomchang-in-the-community.jpg
- gallery: https://roomchang.com/wp-content/uploads/2017/09/All-staff-at-Roomchang-Teams-@Kantha-bopha.jpg
- gallery: https://roomchang.com/wp-content/uploads/2017/09/@Roomchang-all-Dentist-Bunhean.jpg
- gallery: https://roomchang.com/wp-content/uploads/2017/09/@Roomchang-all-Dentist-pheakdey.jpg
- gallery: https://roomchang.com/wp-content/uploads/2018/01/1.-Roomchang-in-the-community_Blood-donate-2-1024x1024.jpg
- gallery: https://roomchang.com/wp-content/uploads/2018/01/3.-Roomchang-in-the-community_Blood-donate-1024x1024.jpg
- gallery: https://roomchang.com/wp-content/uploads/2018/01/4.-Roomchang-in-the-community_Blood-donate-2-1024x1024.jpg
- gallery: https://roomchang.com/wp-content/uploads/2018/01/5.-Roomchang-in-the-community_Blood-donate-2-1024x1024.jpg
- gallery: https://roomchang.com/wp-content/uploads/2018/01/6.-Roomchang-in-the-community_Blood-donate-1024x1024.jpg

### mobile-community-clinic
- cover: https://roomchang.com/wp-content/uploads/2013/08/Roomchang-in-the-community_The-mobile-community-clinic.jpg

### nepal-earthquake-charitable-response
- cover: https://roomchang.com/wp-content/uploads/2023/02/Nepal-Earthquake-1.jpg

### oral-health-education-footprints  (cover + 5 gallery)
- cover: https://roomchang.com/wp-content/uploads/2019/10/IMG_20191003_093022.jpg
- gallery: https://roomchang.com/wp-content/uploads/2025/07/IMG_20191002_095135-1-1024x768.jpg
- gallery: https://roomchang.com/wp-content/uploads/2025/07/IMG_20191002_110000-1-1024x768.jpg
- gallery: https://roomchang.com/wp-content/uploads/2025/07/IMG_20191003_093022-1-1024x768.jpg
- gallery: https://roomchang.com/wp-content/uploads/2025/07/IMG_20191004_094504-1-1024x768.jpg
- gallery: https://roomchang.com/wp-content/uploads/2025/07/IMG_20191004_100910-1-1024x768.jpg

---

## 3. News articles — code `src/lib/news.ts` (10)

These are a hardcoded array (`NEWS_ARTICLES`), not in the DB. Suggested keys:
`roomchang/news/<slug>/cover.<ext>`

| news.ts line | Legacy URL |
|---|---|
| 20 | https://roomchang.com/wp-content/uploads/2023/02/ISO-9001-2015-300x139-1.png |
| 37 | https://roomchang.com/wp-content/uploads/2015/12/DSC_7984.jpg |
| 53 | https://roomchang.com/wp-content/uploads/2023/02/1-1-300x201-1.jpg |
| 68 | https://roomchang.com/wp-content/uploads/2023/02/01.jpg |
| 85 | https://roomchang.com/wp-content/uploads/2023/02/Roomchang-Dental-Hospital-Awarded-ISO-90012008-for-Sixth-Time-1.jpg |
| 100 | https://roomchang.com/wp-content/uploads/2023/02/Opening-of-Roomchang-Rose-Condo-Branch-1.jpg |
| 116 | https://roomchang.com/wp-content/uploads/2023/02/Roomchang-earns-international-accreditation-for-dental-quality-a-sixth-time.jpg |
| 132 | https://roomchang.com/wp-content/uploads/2023/02/Roomchang-Dental-Care-in-Cambodia.jpg |
| 148 | https://roomchang.com/wp-content/uploads/2023/02/Getting-dental-care-in-Cambodia-A-visit-to-Roomchang.jpg |
| 165 | https://roomchang.com/wp-content/uploads/2023/02/Top-Cambodian-dentist-credits-Germany-for-training.jpg |
| 183 | https://roomchang.com/wp-content/uploads/2023/02/Expectations-exceeded-at-new-dental-hospital.jpg |

---

## Notes (not blocking — informational)
- `src/app/layout.tsx:85` JSON-LD logo points at `https://roomchang.com/brand/roomchang-logo-header-padded.png`. This is intentional (canonical production domain) and resolves once the Next site is live at roomchang.com — the file already exists at `public/brand/roomchang-logo-header-padded.png`. No action needed.
- roomchang.com URLs in `*.test.ts` files are test fixtures, not real image links — ignore.

## When R2 is populated
Tell me the base (e.g. `https://pub-2b835c19d8644293b271deaeb97352b1.r2.dev/roomchang/...`) and I will:
1. `UPDATE` the `partners` and `community_articles` rows to the new URLs.
2. Repoint the 10 image paths in `src/lib/news.ts`.
3. Verify nothing 404s and rebuild.
