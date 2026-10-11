# Qase Hybrid Agent

AI agent (Claude Code) membaca test case di **Qase**, mengeksekusinya lewat **Playwright MCP**,
mencatat hasil + evidence ke Qase, lalu **meng-generate spec Playwright permanen**.
Regression berikutnya dijalankan oleh spec tersebut tanpa AI.

```
Qase case ──► /qase-explore ──► Playwright MCP (browser) ──► hasil + screenshot ke Qase run
                    │
                    └──► tests/generated/*.spec.ts (diverifikasi otomatis)
                                   │
                    /qase-regress / CI ──► npm run test:qase ──► Qase run (reporter)
```

## 1. Prasyarat

- Node.js 18+ dan Claude Code terpasang.
- Project di Qase (contoh kode: `SDEMO`) dan **API token**: Qase → avatar → *API tokens*.

## 2. Setup (Windows, PowerShell)

```powershell
cd D:\qase-hybrid-agent
npm install
npx playwright install chromium
copy .env.example .env      # lalu isi QASE_API_TOKEN dan QASE_PROJECT
```

`.mcp.json` membaca token dari environment Claude Code (bukan dari `.env`), jadi set juga di shell
sebelum menjalankan `claude`:

```powershell
$env:QASE_API_TOKEN = "token_kamu"          # sesi ini saja
# atau permanen:  setx QASE_API_TOKEN "token_kamu"   (lalu buka terminal baru)
claude
```

Saat pertama kali dibuka, Claude Code akan minta persetujuan memakai MCP server dari `.mcp.json`.
Setujui, lalu cek dengan `/mcp` bahwa `qase` dan `playwright` berstatus connected.

### macOS / Linux / WSL
Ganti isi `.mcp.json`: hapus `"cmd", "/c"`, jadikan `"command": "npx"` dan args mulai dari `"-y"`.

### Qase Enterprise
- **Custom domain:** tambahkan `"QASE_API_DOMAIN": "api.namaperusahaan.qase.io"` di blok `env` server `qase`.
- **Hosted MCP (tanpa token):** ganti blok `qase` dengan
  `{ "type": "http", "url": "https://mcp.qase.io/mcp" }`.

## 3. Alur pilot

| Langkah | Perintah di Claude Code | Hasil |
|---|---|---|
| 1 | `/qase-seed` | Suite "SauceDemo – Hybrid Pilot" + 5 case dibuat di Qase |
| 2 | `/qase-explore suite:<id>` | Run `[AI Explore]` di Qase, evidence di `evidence/`, spec di `tests/generated/` |
| 3 | `/qase-regress` | Spec dijalankan, reporter membuat run `[Regression]` di Qase |

Case 5 sengaja gagal (bug asli SauceDemo di `problem_user`), supaya terlihat alur failure
dari explore → spec merah → regression mengklasifikasikannya sebagai *known bug*.

Tanpa Claude Code pun regression tetap jalan:

```powershell
npm test              # lokal, tanpa kirim ke Qase
npm run test:qase     # kirim hasil ke Qase
npm run report        # buka HTML report
```

## 4. Struktur

```
.mcp.json                 Qase MCP + Playwright MCP
CLAUDE.md                 Aturan agent: status, evidence, aturan generate spec, safety
.claude/commands/         /qase-seed, /qase-explore, /qase-regress
docs/seed-cases.md        5 test case pilot SauceDemo
docs/spec-template.ts     Pola spec yang wajib diikuti agent
tests/generated/          Spec hasil generate (di-commit)
evidence/                 Screenshot explore (di-ignore git)
playwright.config.ts      baseURL, data-test sebagai testId, screenshot on, Qase reporter
```

## 5. Sebelum dipakai ke aplikasi kantor

- Ganti `BASE_URL` dan kredensial di `.env`; jangan pernah taruh password di Qase atau spec.
- Mulai dari 2–3 case read-only (login, navigasi, filter) sebelum case yang menyimpan data.
- Perhatikan `testIdAttribute` di `playwright.config.ts`: sesuaikan dengan atribut yang dipakai
  aplikasinya (mis. `data-testid`, `id`), atau hapus kalau tidak ada.
