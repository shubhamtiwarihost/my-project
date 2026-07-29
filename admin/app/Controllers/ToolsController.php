<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Auth;
use App\Core\Controller;
use App\Core\Csrf;
use App\Models\AuditLog;
use App\Models\Dashboard;
use App\Services\ContentSeeder;

final class ToolsController extends Controller
{
    public function index(): void
    {
        $this->requireAuth();
        $this->render('tools.index', [
            'title'   => 'CMS Tools',
            'success' => flash('success'),
            'error'   => flash('error'),
            'unread'  => Dashboard::unreadMessages(),
        ]);
    }

    public function seedContent(): void
    {
        $this->requireAuth();
        Csrf::requireValid();

        $result = ContentSeeder::run();
        if (!($result['ok'] ?? false)) {
            flash('error', 'Seed failed: ' . ($result['error'] ?? 'unknown error'));
            redirect('/tools');
        }

        AuditLog::write(Auth::id(), 'create', 'section_items', null, null, $result['report'] ?? []);
        flash('success', 'All website sections were seeded successfully. Review each section and adjust as needed.');
        redirect('/sections');
    }
}
