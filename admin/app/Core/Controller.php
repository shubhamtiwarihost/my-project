<?php

declare(strict_types=1);

namespace App\Core;

abstract class Controller
{
    protected function requireAuth(): void
    {
        Auth::requireLogin();
    }

    protected function render(string $view, array $data = [], string $layout = 'layouts.app'): void
    {
        $data['authUser'] = Auth::user();
        ob_start();
        view($view, $data);
        $content = ob_get_clean() ?: '';
        view($layout, array_merge($data, ['content' => $content]));
    }
}
