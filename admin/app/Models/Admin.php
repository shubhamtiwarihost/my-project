<?php

declare(strict_types=1);

namespace App\Models;

use App\Core\Database;
use PDO;

final class Admin
{
    public static function findByEmail(string $email): ?array
    {
        $sql = 'SELECT a.*, r.slug AS role_slug, r.name AS role_name
                FROM admins a
                INNER JOIN roles r ON r.id = a.role_id
                WHERE a.email = :email AND a.deleted_at IS NULL
                LIMIT 1';
        $stmt = Database::connection()->prepare($sql);
        $stmt->execute(['email' => $email]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function findById(int $id): ?array
    {
        $sql = 'SELECT a.*, r.slug AS role_slug, r.name AS role_name
                FROM admins a
                INNER JOIN roles r ON r.id = a.role_id
                WHERE a.id = :id AND a.deleted_at IS NULL
                LIMIT 1';
        $stmt = Database::connection()->prepare($sql);
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function touchLogin(int $id): void
    {
        $stmt = Database::connection()->prepare(
            'UPDATE admins SET last_login_at = NOW() WHERE id = :id'
        );
        $stmt->execute(['id' => $id]);
    }

    public static function updatePassword(int $id, string $hash): void
    {
        $stmt = Database::connection()->prepare(
            'UPDATE admins SET password_hash = :hash WHERE id = :id AND deleted_at IS NULL'
        );
        $stmt->execute(['hash' => $hash, 'id' => $id]);
    }
}
