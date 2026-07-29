<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Auth;
use App\Core\Controller;
use App\Core\Csrf;
use App\Core\Database;
use App\Models\AuditLog;
use App\Models\Dashboard;

final class MessageController extends Controller
{
    public function index(): void
    {
        $this->requireAuth();
        $status = trim((string) ($_GET['status'] ?? ''));
        $sql = 'SELECT * FROM contact_messages WHERE deleted_at IS NULL';
        $params = [];
        if (in_array($status, ['Unread', 'Read', 'Replied'], true)) {
            $sql .= ' AND status = :status';
            $params['status'] = $status;
        }
        $sql .= ' ORDER BY created_at DESC';
        $stmt = Database::connection()->prepare($sql);
        $stmt->execute($params);

        $this->render('messages.index', [
            'title'    => 'Contact Messages',
            'messages' => $stmt->fetchAll(),
            'filter'   => $status,
            'success'  => flash('success'),
            'unread'   => Dashboard::unreadMessages(),
        ]);
    }

    public function updateStatus(string $id): void
    {
        $this->requireAuth();
        Csrf::requireValid();
        $mid = (int) $id;
        $status = (string) ($_POST['status'] ?? 'Read');
        if (!in_array($status, ['Unread', 'Read', 'Replied'], true)) {
            $status = 'Read';
        }
        Database::connection()->prepare(
            'UPDATE contact_messages SET status = :status WHERE id = :id AND deleted_at IS NULL'
        )->execute(['status' => $status, 'id' => $mid]);
        AuditLog::write(Auth::id(), 'update', 'contact_messages', $mid, null, ['status' => $status]);
        flash('success', 'Message status updated.');
        redirect('/messages');
    }

    public function delete(string $id): void
    {
        $this->requireAuth();
        Csrf::requireValid();
        $mid = (int) $id;
        Database::connection()->prepare(
            'UPDATE contact_messages SET deleted_at = NOW(), is_active = 0 WHERE id = :id'
        )->execute(['id' => $mid]);
        AuditLog::write(Auth::id(), 'soft_delete', 'contact_messages', $mid, null, null);
        flash('success', 'Message deleted.');
        redirect('/messages');
    }
}
