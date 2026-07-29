<?php

declare(strict_types=1);

namespace App\Core;

final class Router
{
    /** @var array<string, array{0:class-string,1:string}> */
    private array $routes = [];

    public function __construct(array $routes)
    {
        $this->routes = $routes;
    }

    public function dispatch(string $method, string $uri): void
    {
        $method = strtoupper($method);
        if ($method === 'POST' && isset($_POST['_method'])) {
            $override = strtoupper((string) $_POST['_method']);
            if (in_array($override, ['PUT', 'PATCH', 'DELETE'], true)) {
                $method = $override;
            }
        }

        $uri = '/' . trim($uri, '/');
        if ($uri !== '/') {
            $uri = rtrim($uri, '/');
        }

        foreach ($this->routes as $key => $handler) {
            [$routeMethod, $routePath] = explode('|', $key, 2);
            if (strtoupper($routeMethod) !== $method) {
                continue;
            }

            $pattern = preg_replace('#\{([a-zA-Z_]+)\}#', '(?P<$1>[^/]+)', $routePath);
            $pattern = '#^' . $pattern . '$#';

            if (!preg_match($pattern, $uri, $matches)) {
                continue;
            }

            $params = array_filter(
                $matches,
                static fn ($k) => !is_int($k),
                ARRAY_FILTER_USE_KEY
            );

            [$class, $action] = $handler;
            $controller = new $class();
            call_user_func_array([$controller, $action], $params);
            return;
        }

        http_response_code(404);
        view('partials.404', ['title' => 'Not Found']);
    }
}
