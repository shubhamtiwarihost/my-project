# Portfolio CMS — Database Design (Step 2 Revised)

## 1. ER Diagram

```mermaid
erDiagram
  roles ||--o{ admins : has
  roles ||--o{ role_permissions : grants
  permissions ||--o{ role_permissions : mapped
  admins ||--o{ media : uploads
  admins ||--o{ api_tokens : owns
  admins ||--o{ audit_logs : performs
  admins ||--o{ backups : triggers

  sections ||--o{ field_definitions : defines
  sections ||--o{ section_items : contains
  section_items ||--o{ section_items : parent_of
  section_items ||--o{ field_values : has
  field_definitions ||--o{ field_values : typed_by
  media ||--o{ field_values : file_ref
  media ||--o{ social_links : icon
  media ||--o{ seo_pages : og_image
  media ||--o{ site_settings : asset
  media ||--o{ resume_downloads : resume_file
  media ||--o{ media_attachments : usage
  media ||--o{ backups : archive_file
  navigation_items ||--o{ navigation_items : parent_of

  roles {
    bigint id PK
    varchar slug UK
    varchar name
    tinyint is_active
    int sort_order
    datetime deleted_at
  }

  permissions {
    bigint id PK
    varchar slug UK
    varchar module
  }

  admins {
    bigint id PK
    bigint role_id FK
    varchar email UK
    varchar password_hash
  }

  media {
    bigint id PK
    char uuid UK
    varchar filename
    varchar original_name
    varchar mime_type
    bigint size
    datetime uploaded_at
  }

  sections {
    bigint id PK
    varchar slug UK
    enum section_type
    tinyint api_enabled
  }

  field_definitions {
    bigint id PK
    bigint section_id FK
    varchar item_type
    varchar field_key
    enum field_type
  }

  section_items {
    bigint id PK
    bigint section_id FK
    bigint parent_id FK
    char uuid UK
    varchar item_type
  }

  field_values {
    bigint id PK
    bigint section_item_id FK
    bigint field_definition_id FK
    bigint media_id FK
    longtext value_text
  }

  navigation_items {
    bigint id PK
    varchar title
    varchar url
    int sort_order
    tinyint is_active
  }

  social_links {
    bigint id PK
    varchar platform
    varchar url
    bigint media_id FK
  }

  seo_pages {
    bigint id PK
    varchar page_key UK
    varchar meta_title
    bigint og_image_media_id FK
  }

  site_settings {
    bigint id PK
    varchar setting_key UK
    longtext setting_value
    bigint media_id FK
  }

  dashboard_widgets {
    bigint id PK
    varchar slug UK
    enum widget_type
    json config_json
  }

  contact_messages {
    bigint id PK
    varchar name
    varchar email
    enum status
    datetime created_at
  }

  resume_downloads {
    bigint id PK
    bigint media_id FK
    varchar ip_address
    datetime downloaded_at
  }

  visitors {
    bigint id PK
    varchar ip_address
    varchar landing_page
    varchar session_id
    datetime visited_at
  }

  backups {
    bigint id PK
    char uuid UK
    enum backup_type
    enum status
  }

  audit_logs {
    bigint id PK
    bigint user_id FK
    varchar action
    varchar table_name
    bigint record_id
    json old_values
    json new_values
  }

  api_tokens {
    bigint id PK
    bigint admin_id FK
    char token_hash UK
    json abilities
  }
```

## 2. Database Flow Diagram

```mermaid
flowchart TB
  subgraph Public["Public Website / Future Mobile App"]
    FE[React Frontend]
    API[Future REST API]
  end

  subgraph CMS["Admin Dashboard Core PHP"]
    LOGIN[Login / RBAC]
    DYN[Dynamic Form Engine]
    MEDIA_UI[Media Manager]
    ANALYTICS[Analytics Views]
  end

  subgraph Auth["Auth Layer"]
    R[roles]
    P[permissions]
    RP[role_permissions]
    A[admins]
    T[api_tokens]
  end

  subgraph Content["Schema-Driven Content"]
    S[sections]
    FD[field_definitions]
    SI[section_items]
    FV[field_values]
  end

  subgraph Shared["Shared Resources"]
    M[media]
    NAV[navigation_items]
    SOC[social_links]
    SEO[seo_pages]
    SET[site_settings]
    W[dashboard_widgets]
  end

  subgraph Events["Inbound Events"]
    CM[contact_messages]
    RD[resume_downloads]
    V[visitors]
  end

  subgraph Ops["Operations"]
    B[backups]
    AL[audit_logs]
  end

  FE -->|read published content| Content
  FE -->|track visit / download / message| Events
  API -->|same tables| Content
  API -->|Bearer token| T

  LOGIN --> A
  A --> R
  R --> RP
  RP --> P

  DYN -->|load form schema| FD
  DYN -->|load / save| SI
  DYN -->|load / save| FV
  FD --> S
  SI --> S
  FV --> SI
  FV --> FD
  FV -->|files| M

  MEDIA_UI --> M
  ANALYTICS --> Events
  ANALYTICS --> W

  FE --> NAV
  FE --> SOC
  FE --> SEO
  FE --> SET

  DYN --> AL
  MEDIA_UI --> AL
  B --> M
```

## 3. Dynamic Form Contract (Admin)

```
GET section by slug
  → field_definitions WHERE section_id AND is_active AND deleted_at IS NULL
  → ORDER BY item_type, sort_order

For each field_definition:
  field_type → HTML input:
    text/url/email/tel/number/color → <input>
    textarea/richtext               → <textarea>
    boolean                         → checkbox
    select/multiselect              → <select> from options_json
    image/file/pdf                  → media picker → stores media_id
    json/repeater                   → structured editor → value_text JSON

Save:
  upsert section_items + field_values
  write audit_logs(user_id, action, table_name, record_id, old_values, new_values, ...)
```

**Rule:** Adding a row to `field_definitions` must make the field appear in the admin form with **zero PHP form markup changes**.

## 4. Complete SQL Schema

File: [`schema.sql`](./schema.sql)

Includes:
- Full DDL (all tables, FKs, indexes)
- Sample seed data (roles, permissions, sections, field definitions, navigation, social, SEO, theme settings, widgets, sample profile values, sample contact message)

## 5. Seed Highlights

| Area | Seeded |
|---|---|
| Roles | `super_admin`, `editor`, `viewer` |
| Admin | `admin@example.com` (change password immediately) |
| Sections | profile, navbar, hero, about, skills, experience, education, projects, contact, footer |
| Field defs | Auto-form fields for all current frontend content |
| Navigation | Home → Contact anchors |
| Theme settings | primary/secondary color, logo, favicon, dark mode, maintenance, GA, GTM |
| Widgets | Visitors, downloads, unread messages, charts, top pages |
| Contact | 1 Unread sample message |

## 6. Index Coverage

Indexes exist for: `slug`, `created_at`, `media_id`, `section_id`, `section_item_id` (item_id), `downloaded_at`, `visited_at`, plus status/email/session/FK columns used in filters.
