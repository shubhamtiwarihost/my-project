<?php

declare(strict_types=1);

namespace App\Models;

use App\Core\Database;

final class AuditLog
{
    public static function write(
        ?int $userId,
        string $action,
        string $tableName,
        ?int $recordId = null,
        mixed $oldValues = null,
        mixed $newValues = null
    ): void {
        $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
        $browser = self::browser($ua);
        $stmt = Database::connection()->prepare(
            'INSERT INTO audit_logs
             (user_id, action, table_name, record_id, old_values, new_values, ip_address, browser, user_agent)
             VALUES (:uid, :action, :table_name, :rid, :old_v, :new_v, :ip, :browser, :ua)'
        );
        $stmt->execute([
            'uid'        => $userId,
            'action'     => $action,
            'table_name' => $tableName,
            'rid'        => $recordId,
            'old_v'      => $oldValues === null ? null : json_encode($oldValues, JSON_UNESCAPED_UNICODE),
            'new_v'      => $newValues === null ? null : json_encode($newValues, JSON_UNESCAPED_UNICODE),
            'ip'         => $_SERVER['REMOTE_ADDR'] ?? null,
            'browser'    => $browser,
            'ua'         => substr((string) $ua, 0, 500),
        ]);
    }

    private static function browser(string $ua): string
    {
        foreach (['Edg' => 'Edge', 'Chrome' => 'Chrome', 'Firefox' => 'Firefox', 'Safari' => 'Safari'] as $needle => $name) {
            if (stripos($ua, $needle) !== false) {
                return $name;
            }
        }
        return 'Unknown';
    }
}
