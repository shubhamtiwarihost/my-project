<?php

declare(strict_types=1);

namespace App\Services;

use PDO;

/**
 * Creates every table the CMS needs and seeds the base rows
 * (role, sections, form fields, navigation, social links, SEO, settings).
 * Safe to run again: existing tables and rows are left alone.
 */
final class Installer
{
    /** Columns shared by every table. */
    private const COMMON = "
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        sort_order INT NOT NULL DEFAULT 0,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
        deleted_at DATETIME NULL DEFAULT NULL";

    private static function tables(): array
    {
        return [
            'roles' => "
                slug VARCHAR(60) NOT NULL,
                name VARCHAR(120) NOT NULL,
                UNIQUE KEY uq_roles_slug (slug)",
            'admins' => "
                role_id BIGINT UNSIGNED NOT NULL,
                name VARCHAR(150) NOT NULL,
                email VARCHAR(190) NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                last_login_at DATETIME NULL DEFAULT NULL,
                UNIQUE KEY uq_admins_email (email),
                KEY idx_admins_role (role_id)",
            'media' => "
                uuid CHAR(36) NOT NULL,
                disk VARCHAR(40) NOT NULL DEFAULT 'local',
                path VARCHAR(500) NOT NULL,
                filename VARCHAR(255) NOT NULL,
                original_name VARCHAR(255) NOT NULL,
                extension VARCHAR(20) NULL,
                mime_type VARCHAR(120) NOT NULL,
                size BIGINT UNSIGNED NOT NULL DEFAULT 0,
                width INT NULL,
                height INT NULL,
                alt_text VARCHAR(255) NULL,
                folder VARCHAR(120) NULL,
                uploaded_by BIGINT UNSIGNED NULL,
                uploaded_at DATETIME NULL DEFAULT NULL,
                UNIQUE KEY uq_media_uuid (uuid)",
            'sections' => "
                slug VARCHAR(80) NOT NULL,
                name VARCHAR(150) NOT NULL,
                description VARCHAR(500) NULL,
                section_type VARCHAR(20) NOT NULL DEFAULT 'singleton',
                api_enabled TINYINT(1) NOT NULL DEFAULT 1,
                UNIQUE KEY uq_sections_slug (slug)",
            'field_definitions' => "
                section_id BIGINT UNSIGNED NOT NULL,
                item_type VARCHAR(60) NOT NULL DEFAULT 'default',
                field_key VARCHAR(80) NOT NULL,
                field_label VARCHAR(150) NOT NULL,
                field_type VARCHAR(30) NOT NULL DEFAULT 'text',
                is_required TINYINT(1) NOT NULL DEFAULT 0,
                help_text VARCHAR(500) NULL,
                placeholder VARCHAR(255) NULL,
                default_value TEXT NULL,
                options_json TEXT NULL,
                KEY idx_field_definitions_section (section_id, item_type)",
            'section_items' => "
                section_id BIGINT UNSIGNED NOT NULL,
                parent_id BIGINT UNSIGNED NULL,
                uuid CHAR(36) NOT NULL,
                item_type VARCHAR(60) NOT NULL DEFAULT 'default',
                label VARCHAR(255) NULL,
                UNIQUE KEY uq_section_items_uuid (uuid),
                KEY idx_section_items_section (section_id, item_type)",
            'field_values' => "
                section_item_id BIGINT UNSIGNED NOT NULL,
                field_definition_id BIGINT UNSIGNED NOT NULL,
                value_text LONGTEXT NULL,
                media_id BIGINT UNSIGNED NULL,
                KEY idx_field_values_item (section_item_id),
                KEY idx_field_values_definition (field_definition_id)",
            'navigation_items' => "
                parent_id BIGINT UNSIGNED NULL,
                title VARCHAR(150) NOT NULL,
                url VARCHAR(500) NOT NULL,
                icon VARCHAR(80) NULL,
                target VARCHAR(10) NOT NULL DEFAULT '_self',
                location VARCHAR(10) NOT NULL DEFAULT 'header'",
            'social_links' => "
                platform VARCHAR(60) NOT NULL,
                label VARCHAR(150) NULL,
                url VARCHAR(500) NOT NULL,
                icon_key VARCHAR(60) NULL,
                media_id BIGINT UNSIGNED NULL",
            'seo_pages' => "
                page_key VARCHAR(80) NOT NULL,
                page_name VARCHAR(150) NULL,
                meta_title VARCHAR(255) NULL,
                meta_description TEXT NULL,
                meta_keywords TEXT NULL,
                og_title VARCHAR(255) NULL,
                og_description TEXT NULL,
                og_image_media_id BIGINT UNSIGNED NULL,
                canonical_url VARCHAR(500) NULL,
                robots VARCHAR(60) NOT NULL DEFAULT 'index,follow',
                UNIQUE KEY uq_seo_pages_key (page_key)",
            'site_settings' => "
                setting_group VARCHAR(60) NOT NULL DEFAULT 'general',
                setting_key VARCHAR(100) NOT NULL,
                setting_value LONGTEXT NULL,
                value_type VARCHAR(20) NOT NULL DEFAULT 'text',
                media_id BIGINT UNSIGNED NULL,
                label VARCHAR(150) NULL,
                help_text VARCHAR(500) NULL,
                UNIQUE KEY uq_site_settings_key (setting_key)",
            'dashboard_widgets' => "
                slug VARCHAR(80) NOT NULL,
                title VARCHAR(150) NOT NULL,
                widget_type VARCHAR(30) NOT NULL DEFAULT 'stat',
                config_json TEXT NULL,
                UNIQUE KEY uq_dashboard_widgets_slug (slug)",
            'contact_messages' => "
                name VARCHAR(150) NOT NULL,
                email VARCHAR(190) NOT NULL,
                subject VARCHAR(255) NULL,
                phone VARCHAR(50) NULL,
                message TEXT NOT NULL,
                status VARCHAR(20) NOT NULL DEFAULT 'Unread',
                ip_address VARCHAR(45) NULL,
                user_agent VARCHAR(500) NULL,
                KEY idx_contact_messages_created (created_at)",
            'resume_downloads' => "
                media_id BIGINT UNSIGNED NULL,
                ip_address VARCHAR(45) NOT NULL,
                browser VARCHAR(100) NULL,
                device VARCHAR(50) NULL,
                operating_system VARCHAR(100) NULL,
                country VARCHAR(100) NULL,
                region VARCHAR(120) NULL,
                city VARCHAR(120) NULL,
                isp VARCHAR(190) NULL,
                source VARCHAR(60) NULL,
                user_agent VARCHAR(500) NULL,
                referrer VARCHAR(500) NULL,
                downloaded_at DATETIME NOT NULL,
                KEY idx_resume_downloads_downloaded_at (downloaded_at)",
            'visitors' => "
                ip_address VARCHAR(45) NOT NULL,
                browser VARCHAR(100) NULL,
                device VARCHAR(50) NULL,
                operating_system VARCHAR(100) NULL,
                landing_page VARCHAR(500) NULL,
                referrer VARCHAR(500) NULL,
                country VARCHAR(100) NULL,
                city VARCHAR(120) NULL,
                session_id VARCHAR(64) NULL,
                user_agent VARCHAR(500) NULL,
                visited_at DATETIME NOT NULL,
                KEY idx_visitors_visited_at (visited_at)",
            'backups' => "
                uuid CHAR(36) NULL,
                label VARCHAR(190) NULL,
                backup_type VARCHAR(30) NOT NULL DEFAULT 'full',
                status VARCHAR(30) NOT NULL DEFAULT 'completed',
                file_size BIGINT UNSIGNED NULL,
                media_id BIGINT UNSIGNED NULL,
                created_by BIGINT UNSIGNED NULL",
            'audit_logs' => "
                user_id BIGINT UNSIGNED NULL,
                action VARCHAR(60) NOT NULL,
                table_name VARCHAR(80) NOT NULL,
                record_id BIGINT UNSIGNED NULL,
                old_values LONGTEXT NULL,
                new_values LONGTEXT NULL,
                ip_address VARCHAR(45) NULL,
                browser VARCHAR(60) NULL,
                user_agent VARCHAR(500) NULL",
        ];
    }

    /** slug => [name, type, description, [item_type => [field_key => [label, type]]]] */
    private static function sections(): array
    {
        $t = static fn (string $label, string $type = 'text') => [$label, $type];

        return [
            'profile' => ['Profile', 'singleton', 'Name, role, contact details and resume.', [
                'default' => [
                    'name' => $t('Full name'), 'short_name' => $t('Short name'), 'initials' => $t('Initials'),
                    'role' => $t('Role'), 'tagline' => $t('Tagline', 'textarea'), 'stack_line' => $t('Stack line'),
                    'availability' => $t('Availability'), 'location' => $t('Location'),
                    'email' => $t('Email', 'email'), 'phone' => $t('Phone', 'tel'), 'phone_alt' => $t('Alternate phone', 'tel'),
                    'resume_pdf' => $t('Resume PDF', 'pdf'),
                ],
            ]],
            'navbar' => ['Navbar', 'singleton', 'Top navigation button.', [
                'default' => ['cta_label' => $t('Button label')],
            ]],
            'hero' => ['Hero', 'mixed', 'First screen of the site.', [
                'default' => ['background_image' => $t('Background image', 'image')],
                'cta' => ['label' => $t('Label'), 'href' => $t('Link'), 'icon_key' => $t('Icon key'), 'style' => $t('Style')],
            ]],
            'about' => ['About', 'mixed', 'Summary, stats and highlights.', [
                'default' => [
                    'eyebrow' => $t('Eyebrow'), 'title' => $t('Title'), 'subtitle' => $t('Subtitle', 'textarea'),
                    'leadership_title' => $t('Summary heading'), 'leadership_body' => $t('Summary paragraphs', 'json'),
                    'bring_title' => $t('"What I bring" heading'),
                ],
                'stat' => ['num' => $t('Number'), 'label' => $t('Label')],
                'highlight' => ['title' => $t('Title'), 'desc' => $t('Description', 'textarea')],
                'bring_item' => ['text' => $t('Text')],
            ]],
            'skills' => ['Skills', 'mixed', 'Skill groups and extra technologies.', [
                'default' => ['title' => $t('Title'), 'subtitle' => $t('Subtitle', 'textarea')],
                'skill_group' => ['title' => $t('Group title'), 'skills' => $t('Skills', 'json')],
                'also_used' => ['label' => $t('Label')],
            ]],
            'experience' => ['Experience', 'mixed', 'Work history.', [
                'default' => ['title' => $t('Title'), 'subtitle' => $t('Subtitle', 'textarea')],
                'experience' => [
                    'role' => $t('Role'), 'company' => $t('Company'), 'period' => $t('Period'), 'duration' => $t('Duration'),
                    'type' => $t('Employment type'), 'location' => $t('Location'),
                    'highlights' => $t('Highlights', 'json'), 'tech' => $t('Technologies', 'json'),
                ],
            ]],
            'education' => ['Education', 'collection', 'Degrees and certifications.', [
                'education' => ['title' => $t('Title'), 'issuer' => $t('Issuer')],
            ]],
            'projects' => ['Projects', 'mixed', 'Featured projects.', [
                'default' => ['title' => $t('Title'), 'subtitle' => $t('Subtitle', 'textarea'), 'note' => $t('Note', 'textarea')],
                'project' => [
                    'title' => $t('Title'), 'category' => $t('Category'), 'badge' => $t('Badge'),
                    'desc' => $t('Description', 'textarea'), 'features' => $t('Features', 'json'), 'tech' => $t('Technologies', 'json'),
                ],
            ]],
            'contact' => ['Contact', 'singleton', 'Contact section copy.', [
                'default' => [
                    'eyebrow' => $t('Eyebrow'), 'title' => $t('Title'), 'subtitle' => $t('Subtitle', 'textarea'),
                    'response_note' => $t('Response note'), 'response_body' => $t('Response body', 'textarea'),
                    'form_title' => $t('Form title'), 'success_title' => $t('Success title'), 'success_body' => $t('Success body'),
                ],
            ]],
            'footer' => ['Footer', 'singleton', 'Footer tagline and copyright.', [
                'default' => ['tagline' => $t('Tagline'), 'copyright_name' => $t('Copyright name')],
            ]],
        ];
    }

    /** @return string[] human-readable log of what was done */
    public static function run(PDO $pdo): array
    {
        $log = [];

        foreach (self::tables() as $name => $columns) {
            $exists = self::tableExists($pdo, $name);
            $pdo->exec(
                "CREATE TABLE IF NOT EXISTS {$name} (
                    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
                    {$columns},
                    " . self::COMMON . "
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
            );
            if (!$exists) {
                $log[] = "Created table {$name}";
            }
        }

        if (self::seedRows($pdo, 'roles', 'slug', [
            ['slug' => 'super_admin', 'name' => 'Super Admin', 'sort_order' => 1],
            ['slug' => 'editor', 'name' => 'Editor', 'sort_order' => 2],
            ['slug' => 'viewer', 'name' => 'Viewer', 'sort_order' => 3],
        ])) {
            $log[] = 'Added roles';
        }

        $added = 0;
        $order = 0;
        foreach (self::sections() as $slug => [$name, $type, $description, $items]) {
            $order++;
            $added += self::seedRows($pdo, 'sections', 'slug', [[
                'slug' => $slug, 'name' => $name, 'section_type' => $type, 'description' => $description, 'sort_order' => $order,
            ]]);
            $sectionId = (int) self::value($pdo, 'SELECT id FROM sections WHERE slug = ?', [$slug]);

            foreach ($items as $itemType => $fields) {
                $sort = 0;
                foreach ($fields as $key => [$label, $fieldType]) {
                    $sort++;
                    $has = self::value(
                        $pdo,
                        'SELECT id FROM field_definitions WHERE section_id = ? AND item_type = ? AND field_key = ?',
                        [$sectionId, $itemType, $key]
                    );
                    if (!$has) {
                        $pdo->prepare(
                            'INSERT INTO field_definitions (section_id, item_type, field_key, field_label, field_type, sort_order)
                             VALUES (?, ?, ?, ?, ?, ?)'
                        )->execute([$sectionId, $itemType, $key, $label, $fieldType, $sort]);
                        $added++;
                    }
                }
            }
        }
        if ($added) {
            $log[] = 'Added sections and form fields';
        }

        $nav = [];
        foreach (['Home', 'About', 'Skills', 'Experience', 'Projects', 'Contact'] as $i => $title) {
            $nav[] = ['title' => $title, 'url' => '#' . strtolower($title), 'location' => 'header', 'sort_order' => $i + 1];
        }
        if ((int) self::value($pdo, 'SELECT COUNT(*) FROM navigation_items') === 0) {
            self::seedRows($pdo, 'navigation_items', 'title', $nav);
            $log[] = 'Added navigation';
        }

        if (self::seedRows($pdo, 'social_links', 'platform', [
            ['platform' => 'linkedin', 'label' => 'LinkedIn', 'url' => 'https://www.linkedin.com/in/shubham-tiwari', 'icon_key' => 'linkedin', 'sort_order' => 1],
            ['platform' => 'github', 'label' => 'GitHub', 'url' => 'https://github.com/shubhamtiwari', 'icon_key' => 'github', 'sort_order' => 2],
        ])) {
            $log[] = 'Added social links';
        }

        if (self::seedRows($pdo, 'seo_pages', 'page_key', [[
            'page_key' => 'home',
            'page_name' => 'Home',
            'meta_title' => 'Shubham Tiwari | Senior Software Engineer',
            'meta_description' => 'Shubham Tiwari — Senior Software Engineer with 7+ years building high-throughput backend systems and distributed microservices with PHP, Laravel, Zend, Drupal and AWS.',
            'robots' => 'index,follow',
        ]])) {
            $log[] = 'Added SEO page';
        }

        if (self::seedRows($pdo, 'site_settings', 'setting_key', [
            ['setting_group' => 'theme', 'setting_key' => 'primary_color', 'setting_value' => '#b8f000', 'value_type' => 'color', 'label' => 'Primary colour', 'sort_order' => 1],
            ['setting_group' => 'theme', 'setting_key' => 'theme_color', 'setting_value' => '#07090c', 'value_type' => 'color', 'label' => 'Browser theme colour', 'sort_order' => 2],
            ['setting_group' => 'general', 'setting_key' => 'maintenance_mode', 'setting_value' => '0', 'value_type' => 'boolean', 'label' => 'Maintenance mode', 'sort_order' => 10],
            ['setting_group' => 'resume', 'setting_key' => 'resume_media_id', 'setting_value' => '', 'value_type' => 'media', 'label' => 'Resume PDF', 'sort_order' => 50],
        ])) {
            $log[] = 'Added site settings';
        }

        if (self::seedRows($pdo, 'dashboard_widgets', 'slug', [
            ['slug' => 'visitors', 'title' => 'Visitors', 'sort_order' => 1],
            ['slug' => 'cv_downloads', 'title' => 'CV downloads', 'sort_order' => 2],
            ['slug' => 'unread_messages', 'title' => 'Unread messages', 'sort_order' => 3],
        ])) {
            $log[] = 'Added dashboard widgets';
        }

        return $log;
    }

    /** Creates the admin account, or resets its password if the email already exists. */
    public static function saveAdmin(PDO $pdo, string $email, string $name, string $password): string
    {
        $hash = password_hash($password, PASSWORD_DEFAULT);
        $id = self::value($pdo, 'SELECT id FROM admins WHERE email = ?', [$email]);
        if ($id) {
            $pdo->prepare('UPDATE admins SET password_hash = ?, is_active = 1, deleted_at = NULL WHERE id = ?')
                ->execute([$hash, $id]);
            return 'Password updated for ' . $email;
        }
        $roleId = (int) self::value($pdo, "SELECT id FROM roles WHERE slug = 'super_admin'");
        $pdo->prepare('INSERT INTO admins (role_id, name, email, password_hash) VALUES (?, ?, ?, ?)')
            ->execute([$roleId, $name, $email, $hash]);
        return 'Created admin account ' . $email;
    }

    public static function hasContent(PDO $pdo): bool
    {
        return (int) self::value($pdo, 'SELECT COUNT(*) FROM section_items WHERE deleted_at IS NULL') > 0;
    }

    private static function tableExists(PDO $pdo, string $name): bool
    {
        try {
            $pdo->query("SELECT 1 FROM {$name} LIMIT 1");
            return true;
        } catch (\Throwable) {
            return false;
        }
    }

    private static function value(PDO $pdo, string $sql, array $params = []): mixed
    {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchColumn();
    }

    /** Inserts rows whose $uniqueColumn value is not present yet. Returns how many were added. */
    private static function seedRows(PDO $pdo, string $table, string $uniqueColumn, array $rows): int
    {
        $added = 0;
        foreach ($rows as $row) {
            if (self::value($pdo, "SELECT id FROM {$table} WHERE {$uniqueColumn} = ?", [$row[$uniqueColumn]])) {
                continue;
            }
            $columns = array_keys($row);
            $pdo->prepare(
                "INSERT INTO {$table} (" . implode(', ', $columns) . ') VALUES (' . implode(', ', array_fill(0, count($columns), '?')) . ')'
            )->execute(array_values($row));
            $added++;
        }
        return $added;
    }
}
