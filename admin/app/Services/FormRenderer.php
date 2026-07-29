<?php

declare(strict_types=1);

namespace App\Services;

/**
 * Renders admin form inputs from field_definitions rows.
 * Adding a new field_definitions row auto-renders without PHP form edits.
 */
final class FormRenderer
{
    /**
     * @param array<int, array> $definitions
     * @param array<string, array> $values keyed by field_key
     */
    public static function renderGroup(array $definitions, array $values = [], string $itemType = 'default', string $namePrefix = 'fields'): string
    {
        $html = '';
        foreach ($definitions as $field) {
            if (($field['item_type'] ?? 'default') !== $itemType) {
                continue;
            }
            $html .= self::renderField($field, $values[$field['field_key']] ?? null, $namePrefix);
        }
        return $html;
    }

    public static function renderField(array $field, ?array $valueRow = null, string $namePrefix = 'fields'): string
    {
        $key   = (string) $field['field_key'];
        $label = (string) $field['field_label'];
        $type  = (string) $field['field_type'];
        $req   = (int) ($field['is_required'] ?? 0) === 1;
        $help  = (string) ($field['help_text'] ?? '');
        $ph    = (string) ($field['placeholder'] ?? '');
        $name  = $namePrefix . '[' . $key . ']';
        $id    = 'field_' . preg_replace('/[^a-z0-9_]/i', '_', $key);
        $val   = $valueRow['value_text'] ?? ($field['default_value'] ?? '');
        $mediaId = $valueRow['media_id'] ?? null;

        $required = $req ? 'required' : '';
        $star = $req ? ' <span class="text-danger">*</span>' : '';

        $input = match ($type) {
            'textarea', 'richtext' => sprintf(
                '<textarea class="form-control" id="%s" name="%s" rows="4" placeholder="%s" %s>%s</textarea>',
                e($id), e($name), e($ph), $required, e((string) $val)
            ),
            'boolean' => sprintf(
                '<div class="form-check form-switch mt-1">
                    <input type="hidden" name="%s" value="0">
                    <input class="form-check-input" type="checkbox" role="switch" id="%s" name="%s" value="1" %s>
                 </div>',
                e($name), e($id), e($name), ((string) $val === '1' || $val === 1) ? 'checked' : ''
            ),
            'select' => self::selectInput($id, $name, $field['options_json'] ?? null, (string) $val, $required),
            'image', 'file', 'pdf' => self::mediaInput($id, $name, $type, $mediaId, (string) $val),
            'json' => sprintf(
                '<textarea class="form-control font-monospace" id="%s" name="%s" rows="5" placeholder="%s" %s>%s</textarea>
                 <div class="form-text">Enter valid JSON (array or object).</div>',
                e($id), e($name), e($ph ?: '["item1","item2"]'), $required, e((string) $val)
            ),
            'color' => sprintf(
                '<input type="color" class="form-control form-control-color" id="%s" name="%s" value="%s" %s>',
                e($id), e($name), e($val !== '' ? (string) $val : '#0b6e4f'), $required
            ),
            'number' => sprintf(
                '<input type="number" class="form-control" id="%s" name="%s" value="%s" placeholder="%s" %s>',
                e($id), e($name), e((string) $val), e($ph), $required
            ),
            'email' => sprintf(
                '<input type="email" class="form-control" id="%s" name="%s" value="%s" placeholder="%s" %s>',
                e($id), e($name), e((string) $val), e($ph), $required
            ),
            'tel' => sprintf(
                '<input type="tel" class="form-control" id="%s" name="%s" value="%s" placeholder="%s" %s>',
                e($id), e($name), e((string) $val), e($ph), $required
            ),
            'url' => sprintf(
                '<input type="url" class="form-control" id="%s" name="%s" value="%s" placeholder="%s" %s>',
                e($id), e($name), e((string) $val), e($ph), $required
            ),
            'datetime' => sprintf(
                '<input type="datetime-local" class="form-control" id="%s" name="%s" value="%s" %s>',
                e($id), e($name), e((string) $val), $required
            ),
            default => sprintf(
                '<input type="text" class="form-control" id="%s" name="%s" value="%s" placeholder="%s" %s>',
                e($id), e($name), e((string) $val), e($ph), $required
            ),
        };

        $keyEsc   = e($key);
        $typeEsc  = e($type);
        $labelEsc = e($label);

        $helpHtml = $help !== '' ? '<div class="form-text">' . e($help) . '</div>' : '';

        return <<<HTML
        <div class="mb-3" data-field-key="{$keyEsc}" data-field-type="{$typeEsc}">
            <label class="form-label" for="{$id}">{$labelEsc}{$star}</label>
            {$input}
            {$helpHtml}
        </div>
        HTML;
    }

    private static function selectInput(string $id, string $name, mixed $optionsJson, string $val, string $required): string
    {
        $options = [];
        if (is_string($optionsJson) && $optionsJson !== '') {
            $decoded = json_decode($optionsJson, true);
            if (is_array($decoded)) {
                $options = $decoded;
            }
        } elseif (is_array($optionsJson)) {
            $options = $optionsJson;
        }

        $html = '<select class="form-select" id="' . e($id) . '" name="' . e($name) . '" ' . $required . '>';
        $html .= '<option value="">Select…</option>';
        foreach ($options as $opt) {
            $opt = (string) $opt;
            $sel = $opt === $val ? 'selected' : '';
            $html .= '<option value="' . e($opt) . '" ' . $sel . '>' . e($opt) . '</option>';
        }
        $html .= '</select>';
        return $html;
    }

    private static function mediaInput(string $id, string $name, string $type, mixed $mediaId, string $val): string
    {
        $accept = match ($type) {
            'pdf' => 'application/pdf',
            'image' => 'image/*',
            default => '*/*',
        };
        $current = $mediaId ? 'Current media ID: ' . e((string) $mediaId) : 'No file linked yet';
        $mediaUrl = htmlspecialchars(url('media'), ENT_QUOTES, 'UTF-8');
        $mediaVal = htmlspecialchars((string) ($mediaId ?? ''), ENT_QUOTES, 'UTF-8');
        return <<<HTML
        <div class="input-group">
            <input type="number" class="form-control" id="{$id}" name="{$name}" value="{$mediaVal}" placeholder="Media ID">
            <a class="btn btn-outline-secondary" href="{$mediaUrl}" target="_blank">Open Media</a>
        </div>
        <div class="form-text">{$current}. Upload in Media Manager, then paste the media ID here. (accept: {$accept})</div>
        HTML;
    }
}
