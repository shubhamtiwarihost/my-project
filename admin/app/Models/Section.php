<?php

declare(strict_types=1);

namespace App\Models;

use App\Core\Database;
use PDO;

final class Section
{
    public static function allActive(): array
    {
        $stmt = Database::connection()->query(
            'SELECT * FROM sections WHERE deleted_at IS NULL ORDER BY sort_order ASC, id ASC'
        );
        return $stmt->fetchAll();
    }

    public static function findBySlug(string $slug): ?array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM sections WHERE slug = :slug AND deleted_at IS NULL LIMIT 1'
        );
        $stmt->execute(['slug' => $slug]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function fieldDefinitions(int $sectionId): array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM field_definitions
             WHERE section_id = :sid AND deleted_at IS NULL AND is_active = 1
             ORDER BY item_type ASC, sort_order ASC, id ASC'
        );
        $stmt->execute(['sid' => $sectionId]);
        return $stmt->fetchAll();
    }

    public static function items(int $sectionId, ?string $itemType = null): array
    {
        $sql = 'SELECT * FROM section_items
                WHERE section_id = :sid AND deleted_at IS NULL';
        $params = ['sid' => $sectionId];
        if ($itemType !== null) {
            $sql .= ' AND item_type = :type';
            $params['type'] = $itemType;
        }
        $sql .= ' ORDER BY sort_order ASC, id ASC';
        $stmt = Database::connection()->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public static function valuesForItem(int $itemId): array
    {
        $stmt = Database::connection()->prepare(
            'SELECT fv.*, fd.field_key, fd.field_type, fd.field_label
             FROM field_values fv
             INNER JOIN field_definitions fd ON fd.id = fv.field_definition_id
             WHERE fv.section_item_id = :iid AND fv.deleted_at IS NULL AND fv.is_active = 1
             ORDER BY fv.sort_order ASC, fv.id ASC'
        );
        $stmt->execute(['iid' => $itemId]);
        $rows = $stmt->fetchAll();
        $out = [];
        foreach ($rows as $row) {
            $out[$row['field_key']] = $row;
        }
        return $out;
    }

    public static function ensureSingletonItem(int $sectionId, string $itemType = 'default'): array
    {
        $items = self::items($sectionId, $itemType);
        if ($items) {
            return $items[0];
        }
        $uuid = self::uuid();
        $stmt = Database::connection()->prepare(
            'INSERT INTO section_items (section_id, item_type, label, uuid, sort_order)
             VALUES (:sid, :type, :label, :uuid, 1)'
        );
        $stmt->execute([
            'sid'   => $sectionId,
            'type'  => $itemType,
            'label' => ucfirst($itemType),
            'uuid'  => $uuid,
        ]);
        $id = (int) Database::connection()->lastInsertId();
        return self::findItem($id) ?? [];
    }

    public static function findItem(int $id): ?array
    {
        $stmt = Database::connection()->prepare(
            'SELECT * FROM section_items WHERE id = :id AND deleted_at IS NULL LIMIT 1'
        );
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function createItem(int $sectionId, string $itemType, string $label, int $sortOrder = 0): int
    {
        $stmt = Database::connection()->prepare(
            'INSERT INTO section_items (section_id, item_type, label, uuid, sort_order)
             VALUES (:sid, :type, :label, :uuid, :sort)'
        );
        $stmt->execute([
            'sid'   => $sectionId,
            'type'  => $itemType,
            'label' => $label,
            'uuid'  => self::uuid(),
            'sort'  => $sortOrder,
        ]);
        return (int) Database::connection()->lastInsertId();
    }

    public static function softDeleteItem(int $id): void
    {
        $stmt = Database::connection()->prepare(
            'UPDATE section_items SET deleted_at = NOW(), is_active = 0 WHERE id = :id'
        );
        $stmt->execute(['id' => $id]);
    }

    public static function updateItemMeta(int $id, array $meta): void
    {
        $fields = [];
        $params = ['id' => $id];
        if (array_key_exists('label', $meta)) {
            $fields[] = 'label = :label';
            $params['label'] = (string) $meta['label'];
        }
        if (array_key_exists('sort_order', $meta)) {
            $fields[] = 'sort_order = :sort_order';
            $params['sort_order'] = (int) $meta['sort_order'];
        }
        if (array_key_exists('is_active', $meta)) {
            $fields[] = 'is_active = :is_active';
            $params['is_active'] = (int) $meta['is_active'] ? 1 : 0;
        }
        if (!$fields) {
            return;
        }
        $sql = 'UPDATE section_items SET ' . implode(', ', $fields) . ' WHERE id = :id AND deleted_at IS NULL';
        Database::connection()->prepare($sql)->execute($params);
    }

    public static function setSectionActive(int $sectionId, bool $active): void
    {
        $stmt = Database::connection()->prepare(
            'UPDATE sections SET is_active = :active WHERE id = :id AND deleted_at IS NULL'
        );
        $stmt->execute(['active' => $active ? 1 : 0, 'id' => $sectionId]);
    }

    public static function upsertValue(int $itemId, int $fieldDefId, ?string $text, ?int $mediaId = null): void
    {
        $pdo = Database::connection();
        $stmt = $pdo->prepare(
            'SELECT id FROM field_values
             WHERE section_item_id = :iid AND field_definition_id = :fid AND sort_order = 0 AND deleted_at IS NULL
             LIMIT 1'
        );
        $stmt->execute(['iid' => $itemId, 'fid' => $fieldDefId]);
        $existing = $stmt->fetch();

        if ($existing) {
            $upd = $pdo->prepare(
                'UPDATE field_values SET value_text = :val, media_id = :mid, updated_at = NOW()
                 WHERE id = :id'
            );
            $upd->execute([
                'val' => $text,
                'mid' => $mediaId,
                'id'  => $existing['id'],
            ]);
            return;
        }

        $ins = $pdo->prepare(
            'INSERT INTO field_values (section_item_id, field_definition_id, value_text, media_id, sort_order)
             VALUES (:iid, :fid, :val, :mid, 0)'
        );
        $ins->execute([
            'iid' => $itemId,
            'fid' => $fieldDefId,
            'val' => $text,
            'mid' => $mediaId,
        ]);
    }

    private static function uuid(): string
    {
        $data = random_bytes(16);
        $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
        $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
}
