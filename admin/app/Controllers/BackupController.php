<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Database;
use App\Models\Dashboard;

final class BackupController extends Controller
{
    public function index(): void
    {
        $this->requireAuth();
        $stmt = Database::connection()->query(
            'SELECT * FROM backups WHERE deleted_at IS NULL ORDER BY created_at DESC LIMIT 50'
        );
        $this->render('backups.index', [
            'title'   => 'Backups',
            'backups' => $stmt->fetchAll(),
            'unread'  => Dashboard::unreadMessages(),
        ]);
    }
}
