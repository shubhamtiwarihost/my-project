<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Auth;
use App\Core\Controller;
use App\Core\Csrf;
use App\Models\AuditLog;
use App\Models\Dashboard;
use App\Models\Media;

final class MediaController extends Controller
{
    public function index(): void
    {
        $this->requireAuth();
        $this->render('media.index', [
            'title'  => 'Media Manager',
            'items'  => Media::all(),
            'success'=> flash('success'),
            'error'  => flash('error'),
            'unread' => Dashboard::unreadMessages(),
        ]);
    }

    public function upload(): void
    {
        $this->requireAuth();
        Csrf::requireValid();

        if (empty($_FILES['file']['tmp_name'])) {
            flash('error', 'No file uploaded.');
            redirect('/media');
        }

        $file = $_FILES['file'];
        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            flash('error', 'Upload failed.');
            redirect('/media');
        }

        $max = (int) config('upload.max_bytes', 10 * 1024 * 1024);
        if (($file['size'] ?? 0) > $max) {
            flash('error', 'File too large.');
            redirect('/media');
        }

        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mime  = $finfo->file($file['tmp_name']) ?: 'application/octet-stream';
        $allowed = array_merge(
            (array) config('upload.allowed_images', []),
            (array) config('upload.allowed_docs', [])
        );
        if (!in_array($mime, $allowed, true)) {
            flash('error', 'File type not allowed: ' . $mime);
            redirect('/media');
        }

        $original = (string) ($file['name'] ?? 'upload');
        $ext = strtolower(pathinfo($original, PATHINFO_EXTENSION) ?: 'bin');
        $isImage = str_starts_with($mime, 'image/');
        $folder = $isImage ? 'images' : 'documents';
        $uuid = $this->uuid();
        $filename = $uuid . '.' . $ext;
        $relative = $folder . '/' . $filename;
        $destDir = base_path('storage/uploads/' . $folder);
        if (!is_dir($destDir)) {
            mkdir($destDir, 0755, true);
        }
        $dest = $destDir . '/' . $filename;

        if (!move_uploaded_file($file['tmp_name'], $dest)) {
            flash('error', 'Could not save uploaded file.');
            redirect('/media');
        }

        $width = $height = null;
        if ($isImage && function_exists('getimagesize')) {
            $size = @getimagesize($dest);
            if (is_array($size)) {
                $width = $size[0] ?? null;
                $height = $size[1] ?? null;
            }
        }

        $id = Media::create([
            'uuid'          => $uuid,
            'disk'          => 'local',
            'path'          => $relative,
            'filename'      => $filename,
            'original_name' => $original,
            'extension'     => $ext,
            'mime_type'     => $mime,
            'size'          => (int) $file['size'],
            'width'         => $width,
            'height'        => $height,
            'alt_text'      => trim((string) ($_POST['alt_text'] ?? '')),
            'folder'        => $folder,
            'uploaded_by'   => Auth::id(),
        ]);

        AuditLog::write(Auth::id(), 'create', 'media', $id, null, ['filename' => $filename]);
        flash('success', 'Uploaded successfully. Media ID: ' . $id);
        redirect('/media');
    }

    public function delete(string $id): void
    {
        $this->requireAuth();
        Csrf::requireValid();
        $mediaId = (int) $id;
        $row = Media::find($mediaId);
        if ($row) {
            Media::softDelete($mediaId);
            AuditLog::write(Auth::id(), 'soft_delete', 'media', $mediaId, $row, null);
            flash('success', 'Media deleted.');
        }
        redirect('/media');
    }

    private function uuid(): string
    {
        $data = random_bytes(16);
        $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
        $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
}
