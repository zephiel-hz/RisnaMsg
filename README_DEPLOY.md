Panduan menjalankan workspace ini secara lokal dan di Railway

Persyaratan:
- Node.js 18+ (disarankan Node 20)
- pnpm (atau gunakan corepack)

Jalankan secara lokal (development):

1. Pasang dependensi:

```bash
pnpm install
```

2. Jalankan semua paket yang memiliki skrip `dev` (parallel):

```bash
pnpm -w -r --parallel --if-present run dev
```

Jalankan secara lokal (production build + start):

```bash
pnpm install
pnpm -w run build
# set PORT (PowerShell)
$env:PORT=3000; pnpm --filter ./artifacts/api-server start

# or using .env file with a dotenv runner or your shell:
# PORT=3000 pnpm --filter ./artifacts/api-server start
```

Men-deploy ke Railway:

- Railway akan mencoba menjalankan `Procfile` jika ada. Repositori ini menyertakan `Procfile` yang menjalankan:

```
web: pnpm -w run start
```

- Alternatif: Railway dapat memakai `Dockerfile` yang ada untuk membangun image dan menjalankan container.
- Jika Anda memisahkan layanan di Railway (mis. API server terpisah dari front-end), buat project Railway terpisah per layanan dan set `Start Command` ke `pnpm --filter ./artifacts/api-server start` untuk hanya menjalankan API.

Running lokal dengan satu perintah:

Anda bisa menjalankan seluruh layanan development dari root dengan:

```bash
pnpm run dev
```

Perintah ini akan menjalankan:
- `artifacts/api-server` pada `http://localhost:3000`
- `artifacts/mockup-sandbox` pada `http://localhost:3001`
- `artifacts/special-message` pada `http://localhost:3002`

Jika Anda ingin memuat environment variables dari file `.env`, jalankan:

```bash
pnpm run dev:env
```

File `railway.json` telah ditambahkan untuk membantu konfigurasi deployment otomatis (lihat `railway.json`).

Notes:
- Pada Windows, skrip `dev` di paket `artifacts/api-server` sudah menggunakan `cross-env` agar `NODE_ENV` bekerja cross-platform.
- Pastikan variable lingkungan (DB, API keys) diset di Railway (Environment > Variables) sesuai kebutuhan aplikasi.
