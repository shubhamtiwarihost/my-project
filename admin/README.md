# Portfolio Admin CMS (Step 3)

Core PHP + MySQL + Bootstrap 5 admin dashboard.

## Local / Hostinger setup

1. Upload the `admin/` folder to your hosting (e.g. `public_html/admin/`).
2. Point the web root for admin to `admin/public/` **or** visit:
   `https://gyaando.com/admin/public/`
3. Edit credentials in `admin/config/config.php`:

```php
'db' => [
  'host' => 'localhost',
  'name' => 'u932835494_portfolio',
  'user' => 'u932835494_portfolio',
  'pass' => 'YOUR_DB_PASSWORD',
],
```

4. Ensure `admin/storage/uploads` is writable (`chmod 755` or `775`).
5. Login with seeded admin:
   - Email: `admin@example.com`
   - Password: `password` (change immediately via **Change Password**)

> The seeded hash is Laravel/PHP’s common demo hash for `password`. Reset it after first login.

## Features in Step 3

- Secure login (PDO + password_hash + CSRF + session)
- Dashboard home + unread message badge
- Section management with **auto forms from `field_definitions`**
- Media upload (images/PDF)
- Navigation, Social, SEO, Website Settings
- Contact messages inbox
- Visitor + Resume download analytics (+ CSV export)
- Change password
- Backups list UI

## Next steps

- **Step 4:** Connect React frontend to MySQL/API
- **Step 5:** Expand CRUD polish per section
