<?php

declare(strict_types=1);

namespace App\Models;

use App\Core\Database;

final class Dashboard
{
    public static function widgets(): array
    {
        $stmt = Database::connection()->query(
            'SELECT * FROM dashboard_widgets
             WHERE deleted_at IS NULL AND is_active = 1
             ORDER BY sort_order ASC'
        );
        return $stmt->fetchAll();
    }

    public static function count(string $table, ?string $whereSql = null, array $params = []): int
    {
        $sql = "SELECT COUNT(*) AS c FROM {$table} WHERE deleted_at IS NULL";
        if ($whereSql) {
            $sql .= ' AND ' . $whereSql;
        }
        $stmt = Database::connection()->prepare($sql);
        $stmt->execute($params);
        return (int) ($stmt->fetch()['c'] ?? 0);
    }

    public static function unreadMessages(): int
    {
        return self::count('contact_messages', "status = 'Unread'");
    }

    public static function visitorsToday(): int
    {
        return self::count('visitors', 'DATE(visited_at) = CURDATE()');
    }

    public static function visitorsMonth(): int
    {
        return self::count('visitors', 'YEAR(visited_at) = YEAR(CURDATE()) AND MONTH(visited_at) = MONTH(CURDATE())');
    }

    public static function downloadsToday(): int
    {
        return self::count('resume_downloads', 'DATE(downloaded_at) = CURDATE()');
    }

    public static function downloadsMonth(): int
    {
        return self::count('resume_downloads', 'YEAR(downloaded_at) = YEAR(CURDATE()) AND MONTH(downloaded_at) = MONTH(CURDATE())');
    }

    public static function topPages(int $limit = 5): array
    {
        $stmt = Database::connection()->prepare(
            'SELECT landing_page, COUNT(*) AS hits
             FROM visitors
             WHERE deleted_at IS NULL
             GROUP BY landing_page
             ORDER BY hits DESC
             LIMIT :lim'
        );
        $stmt->bindValue('lim', $limit, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public static function recentMessages(int $limit = 5): array
    {
        $stmt = Database::connection()->prepare(
            'SELECT id, name, email, subject, status, created_at
             FROM contact_messages
             WHERE deleted_at IS NULL
             ORDER BY created_at DESC
             LIMIT :lim'
        );
        $stmt->bindValue('lim', $limit, \PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}
