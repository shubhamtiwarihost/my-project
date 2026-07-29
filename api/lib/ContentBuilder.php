<?php

declare(strict_types=1);

/**
 * Builds the same content shape the React app expects.
 */
final class ContentBuilder
{
    public static function build(string $mediaBaseUrl): array
    {
        $pdo = Database::pdo();

        $profileMap = self::sectionMap($pdo, 'profile', 'default');
        $aboutMap   = self::sectionMap($pdo, 'about', 'default');
        $skillsMap  = self::sectionMap($pdo, 'skills', 'default');
        $expMap     = self::sectionMap($pdo, 'experience', 'default');
        $projMap    = self::sectionMap($pdo, 'projects', 'default');
        $contactMap = self::sectionMap($pdo, 'contact', 'default');
        $footerMap  = self::sectionMap($pdo, 'footer', 'default');
        $navbarMap  = self::sectionMap($pdo, 'navbar', 'default');
        $heroMap    = self::sectionMap($pdo, 'hero', 'default');

        $social = self::socialLinks($pdo);
        $linkedin = self::socialUrl($social, 'linkedin');
        $github   = self::socialUrl($social, 'github');

        $email = self::val($profileMap, 'email', 'ershubhamtiwari@yahoo.com');
        $phone = self::val($profileMap, 'phone', '+91 86993 82375');
        $phoneDigits = preg_replace('/\D+/', '', $phone) ?: '';

        $resumeMediaId = self::mediaIdFrom($profileMap, 'resume_pdf');
        if (!$resumeMediaId) {
            $resumeMediaId = self::settingMediaId($pdo, 'resume_media_id');
        }

        $heroBgId = self::mediaIdFrom($heroMap, 'background_image');
        $heroBg = $heroBgId
            ? rtrim($mediaBaseUrl, '/') . '/media.php?id=' . $heroBgId
            : null;

        $profile = [
            'name'         => self::val($profileMap, 'name', 'Shubham Tiwari'),
            'shortName'    => self::val($profileMap, 'short_name', 'Shubham Tiwari'),
            'initials'     => self::val($profileMap, 'initials', 'ST'),
            'role'         => self::val($profileMap, 'role', 'Elite Senior PHP Developer'),
            'tagline'      => self::val($profileMap, 'tagline', ''),
            'stackLine'    => self::val($profileMap, 'stack_line', ''),
            'availability' => self::val($profileMap, 'availability', 'Open to new opportunities'),
            'location'     => self::val($profileMap, 'location', 'Bangalore, India'),
            'email'        => $email,
            'emailMailto'  => 'mailto:' . $email,
            'phone'        => $phone,
            'phoneHref'    => $phoneDigits !== '' ? 'tel:+' . ltrim($phoneDigits, '+') : null,
            'phoneAlt'     => self::val($profileMap, 'phone_alt', ''),
            'linkedin'     => $linkedin,
            'github'       => $github,
            'resumeUrl'    => $resumeMediaId ? rtrim($mediaBaseUrl, '/') . '/media.php?id=' . $resumeMediaId . '&download=1' : null,
            'stats'        => self::mapItems($pdo, 'about', 'stat', static function (array $v): array {
                return [
                    'num'   => self::val($v, 'num', ''),
                    'label' => self::val($v, 'label', ''),
                ];
            }),
        ];

        // If no stats from about/stat items, leave empty array (frontend can still render)
        if (!$profile['stats']) {
            $profile['stats'] = [];
        }

        $navLinks = self::navigation($pdo);

        $about = [
            'eyebrow'         => self::val($aboutMap, 'eyebrow', 'About'),
            'title'           => self::val($aboutMap, 'title', 'Experience summary'),
            'subtitle'        => self::val($aboutMap, 'subtitle', ''),
            'leadershipTitle' => self::val($aboutMap, 'leadership_title', ''),
            'leadershipBody'  => self::jsonArray(self::val($aboutMap, 'leadership_body', '[]')),
            'bringTitle'      => self::val($aboutMap, 'bring_title', 'What I bring'),
            'bringItems'      => self::mapItems($pdo, 'about', 'bring_item', static fn ($v) => self::val($v, 'text', '')),
            'highlights'      => self::mapItems($pdo, 'about', 'highlight', static function (array $v, int $i): array {
                return [
                    'id'    => 'highlight-' . ($i + 1),
                    'title' => self::val($v, 'title', ''),
                    'desc'  => self::val($v, 'desc', ''),
                ];
            }),
        ];

        $skillGroups = self::mapItems($pdo, 'skills', 'skill_group', static function (array $v): array {
            return [
                'title'  => self::val($v, 'title', ''),
                'skills' => self::jsonArray(self::val($v, 'skills', '[]')),
            ];
        });

        $alsoUsed = self::mapItems($pdo, 'skills', 'also_used', static fn ($v) => self::val($v, 'label', ''));

        $experiences = self::mapItems($pdo, 'experience', 'experience', static function (array $v): array {
            return [
                'role'       => self::val($v, 'role', ''),
                'company'    => self::val($v, 'company', ''),
                'period'     => self::val($v, 'period', ''),
                'duration'   => self::val($v, 'duration', ''),
                'type'       => self::val($v, 'type', 'Full-time'),
                'location'   => self::val($v, 'location', ''),
                'highlights' => self::jsonArray(self::val($v, 'highlights', '[]')),
                'tech'       => self::jsonArray(self::val($v, 'tech', '[]')),
            ];
        });

        $education = self::mapItems($pdo, 'education', 'education', static function (array $v): array {
            return [
                'title'  => self::val($v, 'title', ''),
                'issuer' => self::val($v, 'issuer', ''),
            ];
        });

        $projects = self::mapItems($pdo, 'projects', 'project', static function (array $v): array {
            return [
                'title'    => self::val($v, 'title', ''),
                'category' => self::val($v, 'category', ''),
                'badge'    => self::val($v, 'badge', ''),
                'desc'     => self::val($v, 'desc', ''),
                'features' => self::jsonArray(self::val($v, 'features', '[]')),
                'tech'     => self::jsonArray(self::val($v, 'tech', '[]')),
            ];
        });

        $contactCopy = [
            'eyebrow'      => self::val($contactMap, 'eyebrow', 'Contact'),
            'title'        => self::val($contactMap, 'title', ''),
            'subtitle'     => self::val($contactMap, 'subtitle', ''),
            'responseNote' => self::val($contactMap, 'response_note', ''),
            'responseBody' => self::val($contactMap, 'response_body', ''),
            'formTitle'    => self::val($contactMap, 'form_title', 'Send a message'),
            'successTitle' => self::val($contactMap, 'success_title', 'Message sent successfully!'),
            'successBody'  => self::val($contactMap, 'success_body', ''),
        ];

        $heroCtas = self::mapItems($pdo, 'hero', 'cta', static function (array $v): array {
            return [
                'label'   => self::val($v, 'label', ''),
                'href'    => self::val($v, 'href', '#'),
                'iconKey' => self::val($v, 'icon_key', ''),
                'style'   => self::val($v, 'style', 'ghost'),
            ];
        });

        $seo = self::seoHome($pdo);
        $settings = self::settings($pdo, $mediaBaseUrl);

        return [
            'ok'           => true,
            'generatedAt'  => gmdate('c'),
            'profile'      => $profile,
            'navLinks'     => $navLinks,
            'about'        => $about,
            'skillGroups'  => $skillGroups,
            'alsoUsed'     => array_values(array_filter($alsoUsed)),
            'experiences'  => $experiences,
            'education'    => $education,
            'projects'     => $projects,
            'projectsNote' => self::val($projMap, 'note', ''),
            'skillsCopy'   => [
                'title'    => self::val($skillsMap, 'title', 'Technical skills, organized for delivery.'),
                'subtitle' => self::val($skillsMap, 'subtitle', ''),
            ],
            'experienceCopy' => [
                'title'    => self::val($expMap, 'title', 'Professional experience'),
                'subtitle' => self::val($expMap, 'subtitle', ''),
            ],
            'projectsCopy' => [
                'title'    => self::val($projMap, 'title', 'Enterprise backends, CMS & learning platforms'),
                'subtitle' => self::val($projMap, 'subtitle', ''),
            ],
            'contactCopy'  => $contactCopy,
            'footer'       => [
                'tagline'       => self::val($footerMap, 'tagline', 'Elite Senior PHP Developer · Laravel · Drupal · AWS'),
                'copyrightName' => self::val($footerMap, 'copyright_name', $profile['shortName']),
            ],
            'navbar'       => [
                'ctaLabel' => self::val($navbarMap, 'cta_label', "Let's Talk"),
            ],
            'hero'         => [
                'backgroundUrl' => $heroBg,
                'ctas'          => $heroCtas,
            ],
            'socialLinks'  => $social,
            'seo'          => $seo,
            'settings'     => $settings,
        ];
    }

    private static function sectionMap(PDO $pdo, string $slug, string $itemType): array
    {
        $stmt = $pdo->prepare(
            'SELECT si.id FROM section_items si
             INNER JOIN sections s ON s.id = si.section_id
             WHERE s.slug = :slug AND s.deleted_at IS NULL AND s.is_active = 1
               AND si.item_type = :type AND si.deleted_at IS NULL AND si.is_active = 1
             ORDER BY si.sort_order ASC, si.id ASC
             LIMIT 1'
        );
        $stmt->execute(['slug' => $slug, 'type' => $itemType]);
        $itemId = $stmt->fetchColumn();
        if (!$itemId) {
            return [];
        }
        return self::valuesMap($pdo, (int) $itemId);
    }

    private static function valuesMap(PDO $pdo, int $itemId): array
    {
        $stmt = $pdo->prepare(
            'SELECT fd.field_key, fd.field_type, fv.value_text, fv.media_id
             FROM field_values fv
             INNER JOIN field_definitions fd ON fd.id = fv.field_definition_id
             WHERE fv.section_item_id = :id AND fv.deleted_at IS NULL AND fv.is_active = 1'
        );
        $stmt->execute(['id' => $itemId]);
        $out = [];
        foreach ($stmt->fetchAll() as $row) {
            $out[$row['field_key']] = $row;
        }
        return $out;
    }

    /** @return list<array> */
    private static function mapItems(PDO $pdo, string $slug, string $itemType, callable $mapper): array
    {
        $stmt = $pdo->prepare(
            'SELECT si.id FROM section_items si
             INNER JOIN sections s ON s.id = si.section_id
             WHERE s.slug = :slug AND s.deleted_at IS NULL AND s.is_active = 1
               AND si.item_type = :type AND si.deleted_at IS NULL AND si.is_active = 1
             ORDER BY si.sort_order ASC, si.id ASC'
        );
        $stmt->execute(['slug' => $slug, 'type' => $itemType]);
        $ids = $stmt->fetchAll(PDO::FETCH_COLUMN);
        $out = [];
        foreach ($ids as $i => $id) {
            $map = self::valuesMap($pdo, (int) $id);
            $out[] = $mapper($map, (int) $i);
        }
        return $out;
    }

    private static function navigation(PDO $pdo): array
    {
        $stmt = $pdo->query(
            "SELECT title, url FROM navigation_items
             WHERE deleted_at IS NULL AND is_active = 1
               AND location IN ('header','both')
             ORDER BY sort_order ASC, id ASC"
        );
        $rows = $stmt->fetchAll();
        return array_map(static fn ($r) => [
            'label' => $r['title'],
            'href'  => $r['url'],
        ], $rows);
    }

    private static function socialLinks(PDO $pdo): array
    {
        $stmt = $pdo->query(
            'SELECT platform, label, url, icon_key FROM social_links
             WHERE deleted_at IS NULL AND is_active = 1
             ORDER BY sort_order ASC, id ASC'
        );
        return $stmt->fetchAll();
    }

    private static function socialUrl(array $social, string $platform): string
    {
        foreach ($social as $row) {
            if (strcasecmp((string) $row['platform'], $platform) === 0) {
                return (string) $row['url'];
            }
        }
        return '';
    }

    private static function seoHome(PDO $pdo): array
    {
        $stmt = $pdo->prepare(
            'SELECT * FROM seo_pages WHERE page_key = :key AND deleted_at IS NULL AND is_active = 1 LIMIT 1'
        );
        $stmt->execute(['key' => 'home']);
        $row = $stmt->fetch() ?: [];
        return [
            'metaTitle'       => $row['meta_title'] ?? '',
            'metaDescription' => $row['meta_description'] ?? '',
            'metaKeywords'    => $row['meta_keywords'] ?? '',
            'ogTitle'         => $row['og_title'] ?? '',
            'ogDescription'   => $row['og_description'] ?? '',
            'robots'          => $row['robots'] ?? 'index,follow',
            'canonicalUrl'    => $row['canonical_url'] ?? '',
        ];
    }

    private static function settings(PDO $pdo, string $mediaBaseUrl): array
    {
        $stmt = $pdo->query(
            'SELECT setting_key, setting_value, value_type, media_id
             FROM site_settings WHERE deleted_at IS NULL AND is_active = 1'
        );
        $out = [];
        foreach ($stmt->fetchAll() as $row) {
            $key = $row['setting_key'];
            if ($row['value_type'] === 'media') {
                $mid = $row['media_id'] ?: (ctype_digit((string) $row['setting_value']) ? (int) $row['setting_value'] : null);
                $out[$key] = $mid ? rtrim($mediaBaseUrl, '/') . '/media.php?id=' . $mid : null;
            } elseif ($row['value_type'] === 'boolean') {
                $out[$key] = ((string) $row['setting_value'] === '1');
            } else {
                $out[$key] = $row['setting_value'];
            }
        }
        return $out;
    }

    private static function settingMediaId(PDO $pdo, string $key): ?int
    {
        $stmt = $pdo->prepare(
            'SELECT media_id, setting_value FROM site_settings
             WHERE setting_key = :key AND deleted_at IS NULL LIMIT 1'
        );
        $stmt->execute(['key' => $key]);
        $row = $stmt->fetch();
        if (!$row) {
            return null;
        }
        if (!empty($row['media_id'])) {
            return (int) $row['media_id'];
        }
        if (ctype_digit((string) $row['setting_value'])) {
            return (int) $row['setting_value'];
        }
        return null;
    }

    private static function val(array $map, string $key, string $default = ''): string
    {
        if (!isset($map[$key])) {
            return $default;
        }
        $v = $map[$key]['value_text'];
        return $v === null || $v === '' ? $default : (string) $v;
    }

    private static function mediaIdFrom(array $map, string $key): ?int
    {
        if (!isset($map[$key])) {
            return null;
        }
        if (!empty($map[$key]['media_id'])) {
            return (int) $map[$key]['media_id'];
        }
        $t = $map[$key]['value_text'] ?? null;
        return ctype_digit((string) $t) ? (int) $t : null;
    }

    private static function jsonArray(string $raw): array
    {
        if ($raw === '') {
            return [];
        }
        $decoded = json_decode($raw, true);
        if (!is_array($decoded)) {
            // allow newline-separated fallback
            return array_values(array_filter(array_map('trim', preg_split('/\r\n|\r|\n/', $raw) ?: [])));
        }
        return array_values($decoded);
    }
}
