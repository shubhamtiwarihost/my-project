<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    api_error('Method not allowed', 405);
}

try {
    $body = api_body();
    $name = trim((string) ($body['name'] ?? ''));
    $email = trim((string) ($body['email'] ?? ''));
    $subject = trim((string) ($body['subject'] ?? ''));
    $message = trim((string) ($body['message'] ?? ''));

    if ($name === '' || $email === '' || $subject === '' || $message === '') {
        api_error('Name, email, subject and message are required.');
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        api_error('Invalid email address.');
    }

    $id = Tracker::saveContact($body);
    api_json(['ok' => true, 'id' => $id]);
} catch (Throwable $e) {
    $debug = (bool) (api_config()['debug'] ?? false);
    api_error($debug ? $e->getMessage() : 'Could not save message', 500);
}
