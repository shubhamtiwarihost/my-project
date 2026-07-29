<?php

declare(strict_types=1);

namespace App\Models;

use App\Core\Database;
use PDO;

final class Media
{
    public static function all(int $limit = 100): array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM media WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT :lim'
        );
        $stmt->bindValue('lim', $limit, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public static function find(int $id): ?array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM media WHERE id = :id AND deleted_at IS NULL LIMIT 1'
        );
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function create(array $data): int
    {
        $stmt = Database::connection()->prepare(
            'INSERT INTO media
             (uuid, disk, path, filename, original_name, extension, mime_type, size, width, height, alt_text, folder, uploaded_by, uploaded_at)
             VALUES
             (:uuid, :disk, :path, :filename, :original_name, :extension, :mime_type, :size, :width, :height, :alt_text, :folder, :uploaded_by, NOW())'
        );
        $stmt->execute($data);
        return (int) Database::connection()->lastInsertId();
    }

    public static function softDelete(int $id): void
    {
        $stmt = Database::connection()->prepare(
            'UPDATE media SET deleted_at = NOW(), is_active = 0 WHERE id = :id'
        );
        $stmt->execute(['id' => $id]);
    }
}
