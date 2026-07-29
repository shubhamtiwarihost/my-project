# Step 5 — Section CRUD

## What’s done

Full Create / Read / Update / Soft-Delete for every website section:

| Section | Admin path | CRUD |
|---|---|---|
| Profile | `/sections/profile` | Update singleton fields + resume PDF media |
| Navbar | `/sections/navbar` | CTA label |
| Hero | `/sections/hero` | Background image + CTA items |
| About | `/sections/about` | Copy, stats, highlights, bring items |
| Skills | `/sections/skills` | Groups + also-used tags |
| Experience | `/sections/experience` | Job entries |
| Education | `/sections/education` | Education entries |
| Projects | `/sections/projects` | Project cards + note |
| Contact | `/sections/contact` | Contact copy |
| Footer | `/sections/footer` | Tagline / copyright |

Also available globally:
- Navigation, Social, SEO, Settings, Media, Messages, Analytics

### Extra CRUD controls
- Section active / inactive
- Item active / inactive
- Display order per item
- Soft delete
- Media select dropdown (images/PDFs from Media Manager)
- **Tools → Seed** loads full portfolio content into MySQL in one click

## Hostinger steps

1. Re-upload updated `admin/` folder
2. Login → **Tools / Seed** → **Run full content seed**
3. **Media Manager** → upload resume PDF + hero image
4. **Sections → Profile** → select resume PDF  
   **Sections → Hero** → select background image
5. Rebuild frontend with `VITE_API_BASE=https://YOUR-DOMAIN/api`
6. Visit site — content comes from DB via `/api/content.php`
