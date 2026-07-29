<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Auth;
use App\Core\Controller;
use App\Core\Csrf;
use App\Models\AuditLog;

final class AuthController extends Controller
{
    public function showLogin(): void
    {
        if (Auth::check()) {
            redirect('/');
        }
        view('auth.login', [
            'title' => 'Login',
            'error' => flash('error'),
        ]);
    }

    public function login(): void
    {
        Csrf::requireValid();

        $email = trim((string) ($_POST['email'] ?? ''));
        $password = (string) ($_POST['password'] ?? '');

        if ($email === '' || $password === '') {
            flash('error', 'Email and password are required.');
            redirect('/login');
        }

        if (!Auth::attempt($email, $password)) {
            flash('error', 'Invalid credentials or inactive account.');
            redirect('/login');
        }

        AuditLog::write(Auth::id(), 'login', 'admins', Auth::id(), null, null);
        redirect('/');
    }

    public function logout(): void
    {
        Csrf::requireValid();
        Auth::logout();
        redirect('/login');
    }
}
