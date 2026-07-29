<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Auth;
use App\Core\Controller;
use App\Core\Csrf;
use App\Models\Admin;
use App\Models\AuditLog;
use App\Models\Dashboard;

final class AccountController extends Controller
{
    public function password(): void
    {
        $this->requireAuth();
        $this->render('account.password', [
            'title'   => 'Change Password',
            'success' => flash('success'),
            'error'   => flash('error'),
            'unread'  => Dashboard::unreadMessages(),
        ]);
    }

    public function updatePassword(): void
    {
        $this->requireAuth();
        Csrf::requireValid();

        $current = (string) ($_POST['current_password'] ?? '');
        $new     = (string) ($_POST['new_password'] ?? '');
        $confirm = (string) ($_POST['confirm_password'] ?? '');

        $user = Auth::user();
        if (!$user || !password_verify($current, $user['password_hash'])) {
            flash('error', 'Current password is incorrect.');
            redirect('/account/password');
        }
        if (strlen($new) < 8) {
            flash('error', 'New password must be at least 8 characters.');
            redirect('/account/password');
        }
        if ($new !== $confirm) {
            flash('error', 'New passwords do not match.');
            redirect('/account/password');
        }

        Admin::updatePassword((int) $user['id'], password_hash($new, PASSWORD_DEFAULT));
        AuditLog::write(Auth::id(), 'update', 'admins', (int) $user['id'], null, ['password' => 'changed']);
        flash('success', 'Password updated successfully.');
        redirect('/account/password');
    }
}
