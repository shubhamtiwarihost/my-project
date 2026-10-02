# Portfolio CMS — Public API (Step 4)

Exposes MySQL content to the React frontend.

## Endpoints

| URL | Method | Purpose |
|---|---|---|
| `/api/content.php` | GET | Full website content JSON |
| `/api/visit.php` | POST | Track visitor |
| `/api/cv.php?src=hero` | GET | **Tracked CV download** — sends the PDF, then records the download |
| `/api/download.php` | POST | Track resume download (JS beacon) |
| `/api/contact.php` | POST | Save contact message |
| `/api/media.php?id=1` | GET | Stream media file |
| `/api/media.php?id=1&download=1` | GET | Download + track resume |

## Hostinger deploy

1. Upload `api/` next to your site (e.g. `public_html/api/`)
2. Ensure `admin/config/config.php` has the correct DB password
3. Ensure `admin/storage/uploads` is writable
4. Set frontend env before build:

```bash
VITE_API_BASE=https://gyaando.com/api npm run build
```

5. Deploy the Vite `dist/` output as usual

## Local test

```bash
# terminal 1 — PHP built-in server from project root
php -S 127.0.0.1:8080 -t .

# terminal 2
npm run dev
```

Vite proxies `/api` → `http://127.0.0.1:8080/api`.

## CV download tracking

Every "Download CV" button links to `/api/cv.php`. The server sends the PDF (the resume
published in the admin panel, or the bundled `Shubham_Tiwari_CV.pdf`) and then stores one row
in `resume_downloads`:

| Stored | Example |
|---|---|
| Date and time (IST) | `2026-10-02 16:46:08` |
| Location (from IP via ipwho.is) | Bengaluru, Karnataka, India + ISP |
| Device | Desktop · macOS · Chrome |
| Came from | `linkedin.com`, `google.com`, `direct`, or `utm_source` |
| Button | `hero` / `contact` |

- Bots and repeat requests from the same visitor within 15 seconds are not counted.
- Missing columns (`region`, `isp`, `source`) are added automatically on first use.
- If the database is down the PDF is still served and the download is queued in
  `admin/storage/queue/` until the database is reachable again.
- View the report at **Admin → CV Downloads** (filters, per-day chart, CSV export).
