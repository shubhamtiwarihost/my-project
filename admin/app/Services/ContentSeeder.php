<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\Database;
use PDO;

/**
 * Seeds all website sections from the known portfolio content.
 * Safe to re-run: soft-deletes previous items for seeded sections, then recreates.
 */
final class ContentSeeder
{
    public static function run(): array
    {
        $pdo = Database::connection();
        $pdo->beginTransaction();
        try {
            $report = [];

            self::seedSingleton($pdo, 'profile', [
                'name' => 'Shubham Tiwari',
                'short_name' => 'Shubham Tiwari',
                'initials' => 'ST',
                'role' => 'Elite Senior PHP Developer',
                'tagline' => '6+ years building high-performance backend systems, enterprise CMS platforms, and scalable web applications with PHP, Laravel, Drupal, and AWS.',
                'stack_line' => 'PHP • Laravel • Drupal • AWS • REST APIs',
                'availability' => 'Open to new opportunities',
                'location' => 'Bangalore, India',
                'email' => 'ershubhamtiwari@yahoo.com',
                'phone' => '+91 86993 82375',
                'phone_alt' => '+91 80909 15141',
            ], $report);

            self::seedSingleton($pdo, 'navbar', [
                'cta_label' => "Let's Talk",
            ], $report);

            self::seedSingleton($pdo, 'hero', [], $report);
            self::replaceCollection($pdo, 'hero', 'cta', [
                ['label' => 'Get In Touch', 'href' => '#contact', 'icon_key' => 'mail', 'style' => 'primary'],
                ['label' => 'View Projects', 'href' => '#projects', 'icon_key' => 'monitor', 'style' => 'ghost'],
                ['label' => 'LinkedIn', 'href' => 'https://www.linkedin.com/in/shubham-tiwari-35077193', 'icon_key' => 'linkedin', 'style' => 'ghost'],
            ], $report);

            self::seedSingleton($pdo, 'about', [
                'eyebrow' => 'About',
                'title' => 'Experience summary',
                'subtitle' => 'Backend-focused PHP engineering across enterprise CMS and scalable platforms.',
                'leadership_title' => 'Backend & platform focus',
                'leadership_body' => json_encode([
                    'I build high-performance backend systems and enterprise CMS platforms with a focus on reliability, security, and scale. My work spans PHP, Laravel, Drupal (7–10), REST APIs, GraphQL, and MySQL optimization.',
                    'Experienced with AWS cloud infrastructure, CI/CD pipelines, and modern development practices to deliver robust digital platforms for large user bases and enterprise clients.',
                ], JSON_UNESCAPED_UNICODE),
                'bring_title' => 'What I bring',
            ], $report);

            self::replaceCollection($pdo, 'about', 'stat', [
                ['num' => '6+', 'label' => 'Years Experience'],
                ['num' => '5', 'label' => 'Companies'],
                ['num' => '4+', 'label' => 'Key Platforms'],
            ], $report);

            self::replaceCollection($pdo, 'about', 'highlight', [
                ['title' => 'Backend Architecture', 'desc' => 'Scalable PHP and Laravel services designed for performance, maintainability, and production reliability.'],
                ['title' => 'Enterprise CMS', 'desc' => 'Drupal 7–10 platforms for corporate and enterprise clients, with custom modules and performance tuning.'],
                ['title' => 'API & Integrations', 'desc' => 'REST APIs, GraphQL, OAuth2, and JWT enabling secure integrations across internal and external systems.'],
                ['title' => 'Cloud & DevOps', 'desc' => 'AWS (EC2, S3, RDS, Lambda), Docker, and CI/CD pipelines for secure, scalable deployments.'],
            ], $report);

            self::replaceCollection($pdo, 'about', 'bring_item', [
                ['text' => 'High-performance PHP backend systems'],
                ['text' => 'Enterprise CMS platforms with Drupal 7–10'],
                ['text' => 'REST API & GraphQL design and integrations'],
                ['text' => 'MySQL / PostgreSQL schema optimization'],
                ['text' => 'AWS infrastructure, Docker & CI/CD delivery'],
            ], $report);

            self::seedSingleton($pdo, 'skills', [
                'title' => 'Technical skills, organized for delivery.',
                'subtitle' => 'Clean groupings that reflect real-world execution: PHP backends, Drupal CMS, APIs, databases, and AWS cloud delivery.',
            ], $report);

            self::replaceCollection($pdo, 'skills', 'skill_group', [
                ['title' => 'Languages', 'skills' => json_encode(['PHP', 'JavaScript'])],
                ['title' => 'Frameworks & CMS', 'skills' => json_encode(['Laravel', 'Drupal (7/8/9/10)', 'CodeIgniter'])],
                ['title' => 'Frontend', 'skills' => json_encode(['HTML5', 'CSS3', 'React', 'Bootstrap', 'jQuery'])],
                ['title' => 'APIs & Auth', 'skills' => json_encode(['REST API', 'GraphQL', 'OAuth2', 'JWT'])],
                ['title' => 'Databases', 'skills' => json_encode(['MySQL', 'PostgreSQL', 'NoSQL'])],
                ['title' => 'Cloud & DevOps', 'skills' => json_encode(['AWS (EC2, S3, RDS, Lambda)', 'Docker', 'CI/CD', 'Jenkins', 'Git', 'GitHub', 'Composer'])],
            ], $report);

            $also = ['Agile','JIRA','Jenkins','Composer','GitHub','OAuth2','JWT','GraphQL','Lambda','RDS','S3','EC2'];
            self::replaceCollection(
                $pdo,
                'skills',
                'also_used',
                array_map(static fn ($label) => ['label' => $label], $also),
                $report
            );

            self::seedSingleton($pdo, 'experience', [
                'title' => 'Professional experience',
                'subtitle' => 'Backend and CMS delivery across digital learning, enterprise apps, and production platforms.',
            ], $report);

            self::replaceCollection($pdo, 'experience', 'experience', [
                [
                    'role' => 'Software Engineer', 'company' => 'Allen Digital', 'period' => 'May 2025 — Present',
                    'duration' => 'Present', 'type' => 'Full-time', 'location' => 'Bangalore, India',
                    'highlights' => json_encode([
                        'Develop backend services supporting digital learning platforms used by large user bases.',
                        'Improve platform reliability and scalability through backend system enhancements.',
                        'Support integrations and system improvements for enterprise web platforms.',
                    ]),
                    'tech' => json_encode(['PHP', 'Laravel', 'MySQL', 'REST APIs', 'AWS']),
                ],
                [
                    'role' => 'Software Engineer', 'company' => 'Softtek', 'period' => 'May 2022 — Jan 2025',
                    'duration' => '2 yrs 9 mos', 'type' => 'Full-time', 'location' => 'Bangalore, India',
                    'highlights' => json_encode([
                        'Developed enterprise web applications using PHP, Laravel, and Drupal CMS.',
                        'Designed optimized database schemas improving application performance.',
                        'Built REST APIs enabling integrations between internal and external enterprise systems.',
                    ]),
                    'tech' => json_encode(['PHP', 'Laravel', 'Drupal', 'MySQL', 'REST APIs']),
                ],
                [
                    'role' => 'Software Engineer', 'company' => 'Soroco India Pvt Ltd', 'period' => 'Sep 2021 — Jan 2022',
                    'duration' => '5 mos', 'type' => 'Full-time', 'location' => 'Bangalore, India',
                    'highlights' => json_encode([
                        'Developed Drupal-based web applications for enterprise client projects.',
                        'Built responsive web platforms using PHP, HTML, CSS, and JavaScript.',
                    ]),
                    'tech' => json_encode(['PHP', 'Drupal', 'HTML5', 'CSS3', 'JavaScript']),
                ],
                [
                    'role' => 'Software Engineer', 'company' => 'Erfolg', 'period' => 'Jul 2019 — Jul 2021',
                    'duration' => '2 yrs', 'type' => 'Full-time', 'location' => 'Bangalore, India',
                    'highlights' => json_encode([
                        'Developed custom backend applications and CMS-driven platforms.',
                        'Collaborated with product teams to design scalable software solutions.',
                    ]),
                    'tech' => json_encode(['PHP', 'CMS', 'MySQL', 'JavaScript']),
                ],
                [
                    'role' => 'Software Engineer', 'company' => 'Univisionz', 'period' => 'Dec 2017 — Jun 2019',
                    'duration' => '1 yr 7 mos', 'type' => 'Full-time', 'location' => 'Chandigarh, India',
                    'highlights' => json_encode([
                        'Built PHP-based websites and CMS systems including e-commerce platforms.',
                        'Developed backend modules, payment integrations, and database structures.',
                    ]),
                    'tech' => json_encode(['PHP', 'CMS', 'MySQL', 'E-commerce']),
                ],
            ], $report);

            self::replaceCollection($pdo, 'education', 'education', [
                [
                    'title' => 'B.Tech — Computer Science',
                    'issuer' => 'Lovely Professional University · 2013 – 2017',
                ],
            ], $report);

            self::seedSingleton($pdo, 'projects', [
                'title' => 'Enterprise backends, CMS & learning platforms',
                'subtitle' => 'Selected platforms spanning banking, corporate CMS, edtech, and real estate — with ownership from architecture through production support.',
                'note' => 'Selected platform work spanning enterprise banking, corporate CMS, edtech, and real estate backends — with ownership across architecture, delivery, and production support.',
            ], $report);

            self::replaceCollection($pdo, 'projects', 'project', [
                [
                    'title' => 'Targus Platform', 'category' => 'Enterprise Banking', 'badge' => 'Backend',
                    'desc' => 'Enterprise banking backend platform built with PHP, SQL, and AWS for secure, scalable financial workflows.',
                    'features' => json_encode(['Enterprise banking backend services', 'SQL-backed data architecture', 'AWS cloud infrastructure', 'Secure production delivery']),
                    'tech' => json_encode(['PHP', 'SQL', 'AWS']),
                ],
                [
                    'title' => 'Wabteccorp.com', 'category' => 'Corporate CMS', 'badge' => 'Drupal',
                    'desc' => 'Drupal-based corporate platform with optimized performance for enterprise content and web delivery.',
                    'features' => json_encode(['Drupal CMS architecture', 'Corporate content platform', 'Performance optimization', 'Enterprise web delivery']),
                    'tech' => json_encode(['Drupal', 'PHP', 'MySQL']),
                ],
                [
                    'title' => 'Mindmygrades.com', 'category' => 'EdTech Platform', 'badge' => 'Core PHP',
                    'desc' => 'Online learning platform backend built with Core PHP and MySQL, supporting digital education workflows.',
                    'features' => json_encode(['Online learning backend', 'Core PHP application layer', 'MySQL data model', 'Student and content workflows']),
                    'tech' => json_encode(['Core PHP', 'MySQL']),
                ],
                [
                    'title' => 'Activeadultliving.com', 'category' => 'Real Estate', 'badge' => 'Backend',
                    'desc' => 'Real estate platform backend serving US communities with content and listing-driven web experiences.',
                    'features' => json_encode(['Real estate platform backend', 'Community-focused web delivery', 'US market platform support', 'Content and listing workflows']),
                    'tech' => json_encode(['PHP', 'CMS', 'MySQL']),
                ],
            ], $report);

            self::seedSingleton($pdo, 'contact', [
                'eyebrow' => 'Contact',
                'title' => "Let's discuss backend systems, CMS platforms, and scalable PHP delivery.",
                'subtitle' => 'Reach out via email, phone, or LinkedIn — clear communication and fast response. Open to senior PHP, Laravel, Drupal, and AWS-focused roles.',
                'response_note' => 'Typically responds within 24 hours',
                'response_body' => 'Open to senior PHP / Laravel / Drupal roles and complex backend or enterprise CMS engagements. Based in Bangalore, India.',
                'form_title' => 'Send a message',
                'success_title' => 'Message sent successfully!',
                'success_body' => "I'll get back to you within 24 hours.",
            ], $report);

            self::seedSingleton($pdo, 'footer', [
                'tagline' => 'Elite Senior PHP Developer · Laravel · Drupal · AWS',
                'copyright_name' => 'Shubham Tiwari',
            ], $report);

            $pdo->commit();
            return ['ok' => true, 'report' => $report];
        } catch (\Throwable $e) {
            $pdo->rollBack();
            return ['ok' => false, 'error' => $e->getMessage()];
        }
    }

    private static function sectionId(PDO $pdo, string $slug): int
    {
        $stmt = $pdo->prepare('SELECT id FROM sections WHERE slug = :slug AND deleted_at IS NULL LIMIT 1');
        $stmt->execute(['slug' => $slug]);
        $id = $stmt->fetchColumn();
        if (!$id) {
            throw new \RuntimeException("Section not found: {$slug}");
        }
        return (int) $id;
    }

    private static function softDeleteItems(PDO $pdo, int $sectionId, ?string $itemType = null): void
    {
        $sql = 'UPDATE section_items SET deleted_at = NOW(), is_active = 0
                WHERE section_id = :sid AND deleted_at IS NULL';
        $params = ['sid' => $sectionId];
        if ($itemType !== null) {
            $sql .= ' AND item_type = :type';
            $params['type'] = $itemType;
        }
        $pdo->prepare($sql)->execute($params);
    }

    private static function seedSingleton(PDO $pdo, string $slug, array $fields, array &$report): void
    {
        $sectionId = self::sectionId($pdo, $slug);
        self::softDeleteItems($pdo, $sectionId, 'default');

        $itemId = self::createItem($pdo, $sectionId, 'default', ucfirst($slug), 1);
        self::writeFields($pdo, $sectionId, $itemId, 'default', $fields);
        $report[$slug]['default'] = $itemId;
    }

    private static function replaceCollection(PDO $pdo, string $slug, string $itemType, array $rows, array &$report): void
    {
        $sectionId = self::sectionId($pdo, $slug);
        self::softDeleteItems($pdo, $sectionId, $itemType);
        $ids = [];
        foreach ($rows as $i => $fields) {
            $label = (string) ($fields['title'] ?? $fields['label'] ?? $fields['role'] ?? $fields['company'] ?? $fields['text'] ?? ($itemType . ' ' . ($i + 1)));
            $itemId = self::createItem($pdo, $sectionId, $itemType, $label, $i + 1);
            self::writeFields($pdo, $sectionId, $itemId, $itemType, $fields);
            $ids[] = $itemId;
        }
        $report[$slug][$itemType] = $ids;
    }

    private static function createItem(PDO $pdo, int $sectionId, string $type, string $label, int $sort): int
    {
        $uuid = self::uuid();
        $stmt = $pdo->prepare(
            'INSERT INTO section_items (section_id, item_type, label, uuid, is_active, sort_order)
             VALUES (:sid, :type, :label, :uuid, 1, :sort)'
        );
        $stmt->execute([
            'sid' => $sectionId,
            'type' => $type,
            'label' => $label,
            'uuid' => $uuid,
            'sort' => $sort,
        ]);
        return (int) $pdo->lastInsertId();
    }

    private static function writeFields(PDO $pdo, int $sectionId, int $itemId, string $itemType, array $fields): void
    {
        if (!$fields) {
            return;
        }
        $stmt = $pdo->prepare(
            'SELECT id, field_key, field_type FROM field_definitions
             WHERE section_id = :sid AND item_type = :type AND deleted_at IS NULL AND is_active = 1'
        );
        $stmt->execute(['sid' => $sectionId, 'type' => $itemType]);
        $defs = $stmt->fetchAll();
        $byKey = [];
        foreach ($defs as $d) {
            $byKey[$d['field_key']] = $d;
        }

        $ins = $pdo->prepare(
            'INSERT INTO field_values (section_item_id, field_definition_id, value_text, media_id, sort_order)
             VALUES (:iid, :fid, :val, :mid, 0)'
        );

        foreach ($fields as $key => $value) {
            if (!isset($byKey[$key])) {
                continue;
            }
            $def = $byKey[$key];
            $mediaId = null;
            $text = is_array($value) ? json_encode($value, JSON_UNESCAPED_UNICODE) : (string) $value;
            if (in_array($def['field_type'], ['image', 'file', 'pdf'], true) && ctype_digit($text)) {
                $mediaId = (int) $text;
            }
            $ins->execute([
                'iid' => $itemId,
                'fid' => $def['id'],
                'val' => $text,
                'mid' => $mediaId,
            ]);
        }
    }

    private static function uuid(): string
    {
        $data = random_bytes(16);
        $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
        $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
}
