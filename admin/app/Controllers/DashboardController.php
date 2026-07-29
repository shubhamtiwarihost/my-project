<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Core\Controller;
use App\Models\Dashboard;
use App\Models\Section;

final class DashboardController extends Controller
{
    public function index(): void
    {
        $this->requireAuth();

        $stats = [
            'total_visitors'    => Dashboard::count('visitors'),
            'today_visitors'    => Dashboard::visitorsToday(),
            'monthly_visitors'  => Dashboard::visitorsMonth(),
            'total_downloads'   => Dashboard::count('resume_downloads'),
            'today_downloads'   => Dashboard::downloadsToday(),
            'monthly_downloads' => Dashboard::downloadsMonth(),
            'unread_messages'   => Dashboard::unreadMessages(),
            'sections'          => count(Section::allActive()),
            'media'             => Dashboard::count('media'),
        ];

        $this->render('dashboard.index', [
            'title'          => 'Dashboard',
            'widgets'        => Dashboard::widgets(),
            'stats'          => $stats,
            'topPages'       => Dashboard::topPages(),
            'recentMessages' => Dashboard::recentMessages(),
            'unread'         => $stats['unread_messages'],
        ]);
    }
}
