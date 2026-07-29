<?php

declare(strict_types=1);

namespace App\Core;

use App\Models\Admin;

final class Auth
{
    public static function check(): bool
    {
        return isset($_SESSION['admin_id']);
    }

    public static function id(): ?int
    {
        return isset($_SESSION['admin_id']) ? (int) $_SESSION['admin_id'] : null;
    }

    public static function user(): ?array
    {
        if (!self::check()) {
            return null;
        }
        return Admin::findById((int) $_SESSION['admin_id']);
    }

    public static function attempt(string $email, string $password): bool
    {
        $admin = Admin::findByEmail($email);
        if (!$admin || !(int) $admin['is_active'] || $admin['deleted_at'] !== null) {
            return false;
        }

        if (!password_verify($password, $admin['password_hash'])) {
            return false;
        }

        session_regenerate_id(true);
        $_SESSION['admin_id']    = (int) $admin['id'];
        $_SESSION['admin_name']  = $admin['name'];
        $_SESSION['admin_email'] = $admin['email'];
        $_SESSION['role_slug']   = $admin['role_slug'] ?? null;

        Admin::touchLogin((int) $admin['id']);
        return true;
    }

    public static function logout(): void
    {
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $p = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
        }
        session_destroy();
    }

    public static function requireLogin(): void
    {
        if (!self::check()) {
            redirect('/login');
        }
    }
}
