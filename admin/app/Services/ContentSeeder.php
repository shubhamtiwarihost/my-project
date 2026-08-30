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
                'role' => 'Senior Software Engineer',
                'tagline' => '7+ years building high-throughput, fault-tolerant backend systems and distributed microservices with PHP, Laravel, Zend, Drupal, and cloud-native deployments.',
                'stack_line' => 'PHP • Laravel • Zend • Drupal • MongoDB • AWS • REST / GraphQL',
                'availability' => 'Open to new opportunities',
                'location' => 'Bengaluru, India',
                'email' => 'shubhamtiwariforjob@gmail.com',
                'phone' => '+91 86993 82375',
            ], $report);

            self::seedSingleton($pdo, 'navbar', [
                'cta_label' => "Let's Talk",
            ], $report);

            self::seedSingleton($pdo, 'hero', [], $report);
            self::replaceCollection($pdo, 'hero', 'cta', [
                ['label' => 'Get In Touch', 'href' => '#contact', 'icon_key' => 'mail', 'style' => 'primary'],
                ['label' => 'View Projects', 'href' => '#projects', 'icon_key' => 'monitor', 'style' => 'ghost'],
                ['label' => 'LinkedIn', 'href' => 'https://www.linkedin.com/in/shubham-tiwari', 'icon_key' => 'linkedin', 'style' => 'ghost'],
            ], $report);

            self::seedSingleton($pdo, 'about', [
                'eyebrow' => 'About',
                'title' => 'Backend systems & distributed architecture',
                'subtitle' => 'Senior backend engineer focused on high-throughput services, data-tier modernization, and high availability.',
                'leadership_title' => 'Professional summary',
                'leadership_body' => json_encode([
                    'Senior Software Engineer with 7+ years of core backend engineering experience building high-throughput, fault-tolerant enterprise web applications and distributed microservices.',
                    'Proven expertise in PHP (7.x/8.x), modern MVC frameworks (Laravel, Zend, CodeIgniter), event-driven systems, caching strategies, and large-scale data tier modernization (MySQL to MongoDB). Strong background in OOP design, RESTful/GraphQL APIs, cloud-native deployments on AWS/Azure, CI/CD automation, and database query optimization.',
                ], JSON_UNESCAPED_UNICODE),
                'bring_title' => 'What I bring',
            ], $report);

            self::replaceCollection($pdo, 'about', 'stat', [
                ['num' => '7+', 'label' => 'Years Experience'],
                ['num' => '5', 'label' => 'Companies'],
                ['num' => '99.9%', 'label' => 'Availability Focus'],
            ], $report);

            self::replaceCollection($pdo, 'about', 'highlight', [
                ['title' => 'Backend Architecture', 'desc' => 'High-throughput PHP services, modular microservices, and fault-tolerant designs for enterprise workloads.'],
                ['title' => 'Data Tier Modernization', 'desc' => 'Schema modernization, query indexing, and MySQL-to-MongoDB migrations that cut P99 read latency under peak traffic.'],
                ['title' => 'APIs & Event Systems', 'desc' => 'RESTful and GraphQL contracts, caching layers, and event-driven integrations across web and mobile clients.'],
                ['title' => 'Cloud & DevOps', 'desc' => 'AWS (EC2, S3, RDS, CloudWatch), Azure, Docker, and CI/CD pipelines that cut release overhead and build failures.'],
            ], $report);

            self::replaceCollection($pdo, 'about', 'bring_item', [
                ['text' => 'Distributed systems & microservices on PHP 8.x'],
                ['text' => 'High-performance REST & GraphQL API design'],
                ['text' => 'MySQL → MongoDB data-tier modernization'],
                ['text' => 'Redis / Memcached caching for peak traffic'],
                ['text' => 'AWS / Azure, Docker & CI/CD automation'],
            ], $report);

            self::seedSingleton($pdo, 'skills', [
                'title' => 'Technical skills for production backends.',
                'subtitle' => 'Languages, frameworks, APIs, data stores, and cloud practices used to ship high-availability systems.',
            ], $report);

            self::replaceCollection($pdo, 'skills', 'skill_group', [
                ['title' => 'Languages & Backend', 'skills' => json_encode(['PHP (7.x/8.x)', 'Node.js', 'JavaScript (ES6+)', 'SQL', 'Core Java'])],
                ['title' => 'Frameworks & CMS', 'skills' => json_encode(['Laravel', 'Zend Framework', 'CodeIgniter', 'Drupal (7–10)', 'WordPress'])],
                ['title' => 'Architecture & APIs', 'skills' => json_encode(['Microservices', 'RESTful APIs', 'GraphQL', 'Redis', 'Memcached', 'Event-Driven'])],
                ['title' => 'Databases & Storage', 'skills' => json_encode(['MySQL', 'MongoDB', 'Query Optimization', 'Schema Modernization'])],
                ['title' => 'Cloud, DevOps & CI/CD', 'skills' => json_encode(['AWS (EC2, S3, RDS, CloudWatch)', 'Microsoft Azure', 'Docker', 'Git', 'CI/CD', 'Linux'])],
                ['title' => 'Engineering Practices', 'skills' => json_encode(['System Design', 'TDD', 'PHPUnit', 'Agile/Scrum', 'Code Reviews', 'High Availability'])],
            ], $report);

            $also = ['Generators','Design Patterns','Connection Pooling','ActiveBatch','SOAP APIs','Webhooks','SOLID','Production Debugging'];
            self::replaceCollection(
                $pdo,
                'skills',
                'also_used',
                array_map(static fn ($label) => ['label' => $label], $also),
                $report
            );

            self::seedSingleton($pdo, 'experience', [
                'title' => 'Professional experience',
                'subtitle' => 'Backend systems and distributed architecture across edtech, Fortune 500 CMS, and enterprise platforms.',
            ], $report);

            self::replaceCollection($pdo, 'experience', 'experience', [
                [
                    'role' => 'Senior Software Engineer', 'company' => 'ALLEN Digital', 'period' => 'May 2025 — Present',
                    'duration' => 'Present', 'type' => 'Full-time', 'location' => 'Bengaluru, India',
                    'highlights' => json_encode([
                        'Architected and scaled the backend for the enterprise Question Repository System serving high-concurrency educational workloads using PHP 8.x, Zend Framework, and modular microservices.',
                        'Spearheaded data tier migration of unstructured exam assets from MySQL to MongoDB, reducing P99 read latencies by ~35% and improving concurrent database throughput under peak exam traffic.',
                        'Designed and standardized high-performance RESTful API contracts with distributed caching layers (Redis/Memcached), maintaining 99.9% service availability across web and mobile platforms.',
                        'Automated deployment workflows with Docker and CI/CD pipelines, decreasing release overhead and build failure rates by 40%.',
                        'Collaborated with Product, Frontend, and DevOps in 2-week Agile sprints; authored technical design specs and led code reviews for backend modules.',
                    ]),
                    'tech' => json_encode(['PHP 8.x', 'Zend', 'MongoDB', 'MySQL', 'Redis', 'Docker', 'CI/CD']),
                ],
                [
                    'role' => 'Senior Software Engineer', 'company' => 'Softtek', 'period' => 'May 2022 — Jan 2025',
                    'duration' => '2 yrs 9 mos', 'type' => 'Full-time', 'location' => 'Bengaluru, India',
                    'highlights' => json_encode([
                        'Engineered and maintained high-traffic enterprise platforms and custom PHP services on Drupal 8/9/10 for Fortune 500 corporate clients.',
                        'Identified critical system bottlenecks and tuned complex MySQL queries, improving average page load performance by 30%.',
                        'Integrated third-party enterprise REST/SOAP APIs, authentication layers, and webhooks within cloud-hosted environments (Microsoft Azure / AWS).',
                        'Enforced strict coding standards, conducted peer reviews, and mentored junior engineers on SOLID principles and clean architecture.',
                    ]),
                    'tech' => json_encode(['Drupal 8/9/10', 'PHP', 'MySQL', 'REST/SOAP', 'Azure', 'AWS']),
                ],
                [
                    'role' => 'Software Engineer', 'company' => 'Soroco India', 'period' => 'Sep 2021 — Jan 2022',
                    'duration' => '5 mos', 'type' => 'Full-time', 'location' => 'Bengaluru, India',
                    'highlights' => json_encode([
                        'Developed scalable transaction management and scheduling backend modules using Laravel and REST APIs.',
                        'Implemented automated infrastructure deployment workflows and cloud asset management on AWS.',
                    ]),
                    'tech' => json_encode(['Laravel', 'REST APIs', 'AWS']),
                ],
                [
                    'role' => 'Software Engineer', 'company' => 'Erfolg', 'period' => 'Jul 2019 — Jul 2021',
                    'duration' => '2 yrs', 'type' => 'Full-time', 'location' => 'Chandigarh, India',
                    'highlights' => json_encode([
                        'Built core server-side business logic and normalized relational databases utilizing PHP and MySQL for high-volume management portals.',
                        'Implemented secure API integrations and optimized SQL queries, reducing API response times under concurrent request loads.',
                    ]),
                    'tech' => json_encode(['PHP', 'MySQL', 'REST APIs']),
                ],
                [
                    'role' => 'Software Engineer', 'company' => 'Univisionz', 'period' => 'Dec 2017 — Jun 2019',
                    'duration' => '1 yr 7 mos', 'type' => 'Full-time', 'location' => 'Mohali, India',
                    'highlights' => json_encode([
                        'Developed custom WordPress CMS architectures, bespoke plugins, and reusable Core PHP backend components.',
                        'Constructed asynchronous data pipelines with RESTful APIs, AJAX, and JavaScript for seamless frontend-backend integration.',
                    ]),
                    'tech' => json_encode(['WordPress', 'Core PHP', 'REST APIs', 'JavaScript']),
                ],
            ], $report);

            self::replaceCollection($pdo, 'education', 'education', [
                [
                    'title' => 'B.Tech — Computer Science & Engineering',
                    'issuer' => 'Punjab Technical University, Punjab, India · 2013 – 2017',
                ],
            ], $report);

            self::seedSingleton($pdo, 'projects', [
                'title' => 'Key projects & systems architecture',
                'subtitle' => 'Assessment engines, enterprise CMS, and GraphQL integration platforms — built for throughput, uptime, and scale.',
                'note' => 'Key systems spanning assessment engines, Fortune 500 enterprise CMS, and GraphQL-backed digital asset platforms — with ownership across architecture, performance, and production reliability.',
            ], $report);

            self::replaceCollection($pdo, 'projects', 'project', [
                [
                    'title' => 'ALLEN Question Repository & Assessment Engine', 'category' => 'EdTech Backend', 'badge' => 'PHP 8',
                    'desc' => 'Enterprise question repository managing millions of assessment records with high-throughput read paths and decoupled data ingestion pipelines.',
                    'features' => json_encode(['Millions of assessment records at scale', 'High-throughput read paths', 'Decoupled data ingestion pipelines', 'MySQL + MongoDB hybrid data tier']),
                    'tech' => json_encode(['PHP 8', 'Zend', 'MongoDB', 'MySQL', 'REST APIs', 'Docker']),
                ],
                [
                    'title' => 'WabtecCorp Enterprise Platform', 'category' => 'Enterprise CMS', 'badge' => 'Drupal',
                    'desc' => 'Enterprise content platform with resilient backend modules and cloud-hosted data workflows ensuring 99.9% uptime.',
                    'features' => json_encode(['Drupal 9/10 enterprise CMS', 'Resilient backend modules', 'Cloud-hosted data workflows', '99.9% uptime focus']),
                    'tech' => json_encode(['Drupal 9/10', 'PHP', 'Cloud Hosting', 'REST']),
                ],
                [
                    'title' => 'Browzwear 3D Integration Platform', 'category' => 'Digital Assets', 'badge' => 'GraphQL',
                    'desc' => 'Unified data synchronization services integrating GraphQL endpoints with backend business modules for digital asset management.',
                    'features' => json_encode(['GraphQL + REST synchronization', 'Digital asset management flows', 'Unified backend business modules', 'Relational DB integration']),
                    'tech' => json_encode(['PHP', 'GraphQL', 'REST APIs', 'Relational DB']),
                ],
            ], $report);

            self::seedSingleton($pdo, 'contact', [
                'eyebrow' => 'Contact',
                'title' => "Let's discuss backend systems, distributed architecture, and scalable delivery.",
                'subtitle' => 'Reach out via email, phone, or LinkedIn. Open to senior backend roles focused on PHP, microservices, data-tier modernization, and cloud-native delivery.',
                'response_note' => 'Typically responds within 24 hours',
                'response_body' => 'Open to Senior Software Engineer / backend systems roles. Based in Bengaluru, India.',
                'form_title' => 'Send a message',
                'success_title' => 'Message sent successfully!',
                'success_body' => "I'll get back to you within 24 hours.",
            ], $report);

            self::seedSingleton($pdo, 'footer', [
                'tagline' => 'Senior Software Engineer · Backend Systems & Distributed Architecture',
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
