<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Auth;
use App\Core\Controller;
use App\Core\Csrf;
use App\Models\AuditLog;
use App\Models\Dashboard;
use App\Models\Media;
use App\Services\ResumeService;

final class ResumeController extends Controller
{
    public function index(): void
    {
        $this->requireAuth();
        $active = ResumeService::activeMedia();
        $pdfs = array_values(array_filter(
            Media::all(100),
            static fn ($m) => str_contains((string) $m['mime_type'], 'pdf')
        ));

        $this->render('resume.index', [
            'title'   => 'Resume PDF',
            'active'  => $active,
            'pdfs'    => $pdfs,
            'success' => flash('success'),
            'error'   => flash('error'),
            'unread'  => Dashboard::unreadMessages(),
        ]);
    }

    public function upload(): void
    {
        $this->requireAuth();
        Csrf::requireValid();

        if (empty($_FILES['file']['tmp_name'])) {
            flash('error', 'Please choose a PDF file.');
            redirect('/resume');
        }

        $file = $_FILES['file'];
        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            flash('error', 'Upload failed.');
            redirect('/resume');
        }

        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($file['tmp_name']) ?: '';
        if ($mime !== 'application/pdf') {
            flash('error', 'Only PDF files are allowed for resume.');
            redirect('/resume');
        }

        $max = (int) config('upload.max_bytes', 10 * 1024 * 1024);
        if (($file['size'] ?? 0) > $max) {
            flash('error', 'File too large (max 10MB).');
            redirect('/resume');
        }

        $original = (string) ($file['name'] ?? 'resume.pdf');
        $ext = 'pdf';
        $uuid = $this->uuid();
        $filename = $uuid . '.' . $ext;
        $relative = 'documents/' . $filename;
        $destDir = base_path('storage/uploads/documents');
        if (!is_dir($destDir)) {
            mkdir($destDir, 0755, true);
        }
        $dest = $destDir . '/' . $filename;
        if (!move_uploaded_file($file['tmp_name'], $dest)) {
            flash('error', 'Could not save uploaded file.');
            redirect('/resume');
        }

        $mediaId = Media::create([
            'uuid'          => $uuid,
            'disk'          => 'local',
            'path'          => $relative,
            'filename'      => $filename,
            'original_name' => $original,
            'extension'     => $ext,
            'mime_type'     => 'application/pdf',
            'size'          => (int) $file['size'],
            'width'         => null,
            'height'        => null,
            'alt_text'      => 'Resume PDF',
            'folder'        => 'documents',
            'uploaded_by'   => Auth::id(),
        ]);

        ResumeService::setActive($mediaId);
        AuditLog::write(Auth::id(), 'create', 'media', $mediaId, null, ['resume' => true, 'filename' => $original]);
        flash('success', 'Resume uploaded and set as the public download file.');
        redirect('/resume');
    }

    public function setActive(): void
    {
        $this->requireAuth();
        Csrf::requireValid();
        $mediaId = (int) ($_POST['media_id'] ?? 0);
        try {
            ResumeService::setActive($mediaId);
            AuditLog::write(Auth::id(), 'update', 'site_settings', null, null, ['resume_media_id' => $mediaId]);
            flash('success', 'Active resume updated. Visitors will download this file.');
        } catch (\Throwable $e) {
            flash('error', $e->getMessage());
        }
        redirect('/resume');
    }

    private function uuid(): string
    {
        $data = random_bytes(16);
        $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
        $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }
}
