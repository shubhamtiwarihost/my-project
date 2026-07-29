# Portfolio CMS — Public API (Step 4)

Exposes MySQL content to the React frontend.

## Endpoints

| URL | Method | Purpose |
|---|---|---|
| `/api/content.php` | GET | Full website content JSON |
| `/api/visit.php` | POST | Track visitor |
| `/api/download.php` | POST | Track resume download |
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
