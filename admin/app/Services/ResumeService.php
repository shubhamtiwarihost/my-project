<?php

declare(strict_types=1);

namespace App\Services;

use App\Core\Database;
use App\Models\Media;
use App\Models\Section;
use PDO;

/**
 * Keeps the active resume PDF in sync across:
 * - site_settings.resume_media_id
 * - profile section field resume_pdf
 */
final class ResumeService
{
    public static function activeMedia(): ?array
    {
        $id = self::activeMediaId();
        return $id ? Media::find($id) : null;
    }

    public static function activeMediaId(): ?int
    {
        $pdo = Database::connection();

        // Prefer site setting
        $stmt = $pdo->prepare(
            'SELECT media_id, setting_value FROM site_settings
             WHERE setting_key = :key AND deleted_at IS NULL LIMIT 1'
        );
        $stmt->execute(['key' => 'resume_media_id']);
        $row = $stmt->fetch();
        if ($row) {
            if (!empty($row['media_id'])) {
                return (int) $row['media_id'];
            }
            if (ctype_digit((string) $row['setting_value'])) {
                return (int) $row['setting_value'];
            }
        }

        // Fallback: profile field
        $section = Section::findBySlug('profile');
        if (!$section) {
            return null;
        }
        $item = Section::ensureSingletonItem((int) $section['id'], 'default');
        $values = Section::valuesForItem((int) $item['id']);
        if (!empty($values['resume_pdf']['media_id'])) {
            return (int) $values['resume_pdf']['media_id'];
        }
        if (!empty($values['resume_pdf']['value_text']) && ctype_digit((string) $values['resume_pdf']['value_text'])) {
            return (int) $values['resume_pdf']['value_text'];
        }
        return null;
    }

    public static function setActive(int $mediaId): void
    {
        $media = Media::find($mediaId);
        if (!$media) {
            throw new \InvalidArgumentException('Media not found.');
        }
        if (!str_contains((string) $media['mime_type'], 'pdf')) {
            throw new \InvalidArgumentException('Resume must be a PDF file.');
        }

        $pdo = Database::connection();

        // Update site_settings
        $check = $pdo->prepare(
            'SELECT id FROM site_settings WHERE setting_key = :key AND deleted_at IS NULL LIMIT 1'
        );
        $check->execute(['key' => 'resume_media_id']);
        $sid = $check->fetchColumn();
        if ($sid) {
            $pdo->prepare(
                'UPDATE site_settings
                 SET setting_value = :val, media_id = :mid, value_type = \'media\', updated_at = NOW()
                 WHERE id = :id'
            )->execute([
                'val' => (string) $mediaId,
                'mid' => $mediaId,
                'id'  => $sid,
            ]);
        } else {
            $pdo->prepare(
                'INSERT INTO site_settings (setting_group, setting_key, setting_value, value_type, media_id, label, sort_order)
                 VALUES (\'resume\', \'resume_media_id\', :val, \'media\', :mid, \'Resume PDF\', 50)'
            )->execute(['val' => (string) $mediaId, 'mid' => $mediaId]);
        }

        // Sync profile.resume_pdf field_value
        $section = Section::findBySlug('profile');
        if (!$section) {
            return;
        }
        $item = Section::ensureSingletonItem((int) $section['id'], 'default');
        $defs = Section::fieldDefinitions((int) $section['id']);
        $resumeDef = null;
        foreach ($defs as $def) {
            if ($def['item_type'] === 'default' && $def['field_key'] === 'resume_pdf') {
                $resumeDef = $def;
                break;
            }
        }
        if ($resumeDef) {
            Section::upsertValue((int) $item['id'], (int) $resumeDef['id'], (string) $mediaId, $mediaId);
        }
    }
}
