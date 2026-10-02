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
  'name' => 'u932835494_myportfolio',
  'user' => 'u932835494_myportfolio',
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
- Visitor analytics
- **CV Downloads report**: how many times, date, time (IST), location, device, source — with filters and CSV export
- Change password
- Backups list UI

## Local development without MySQL

Create `admin/config/config.local.php` (git-ignored) to override any config value, e.g.:

```php
<?php
return ['debug' => true, 'db' => ['dsn' => 'sqlite:/path/to/dev.sqlite', 'user' => null, 'pass' => null]];
```

## First-time setup (creates the tables)

Open `/admin/public/install.php`, enter the **database password** from the hosting panel and
the admin email + password you want. It creates all tables, loads the portfolio content and
creates the admin login. Safe to run again (it also resets that admin's password).

`/api/health.php` shows whether the database connects and the tables exist.

## Forgot the admin password

Open `/admin/public/reset_admin_password.php` and enter the **database password** from the
hosting panel plus a new admin password.

## Next steps

- **Step 4:** Connect React frontend to MySQL/API
- **Step 5:** Expand CRUD polish per section
