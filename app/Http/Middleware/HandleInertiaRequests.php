<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    // Populate when your schema exposes these:
                    'profile_pic' => $user->profile_pic ?? null,
                    'created_at' => $user->created_at?->toIso8601String(),
                    'role' => $user->role ?? null,
                    'last_login_display' => static::formatLastLoginDisplay($user),
                ] : null,
            ],
            'notifications' => $user ? [
                'unread_count' => 0,
                'items' => [],
            ] : null,
            'sts' => [
                'rootUrl' => rtrim(url('/'), '/'),
                'christmasTheme' => (bool) config('sts.christmas_theme'),
                'appName' => config('app.name'),
                'warehousePhone' => config('sts.default_warehouse.phone'),
                'scheduleEmail' => config('sts.schedule_me_email'),
                'social' => config('sts.social_media'),
                's3StorageUrl' => config('sts.s3_storage_url') ? config('sts.s3_storage_url').'/' : '',
                'roles' => config('sts.roles'),
                'routes' => $this->sharedGuestRoutes($request),
                'heroImage' => config('sts.guest_hero_image'),
                'footer' => config('sts.footer'),
            ],
            'flash' => [
               'success' => fn () => $request->session()->get('success'),
               'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }

    /**
     * Shown in the guest top bar when `users.last_login_at` exists.
     */
    protected static function formatLastLoginDisplay(?\Illuminate\Contracts\Auth\Authenticatable $user): ?string
    {
        if (! $user instanceof \Illuminate\Database\Eloquent\Model) {
            return null;
        }

        $raw = $user->getAttributes()['last_login_at'] ?? null;
        if ($raw === null) {
            return null;
        }

        return \Carbon\Carbon::parse($raw)
            ->timezone(config('app.timezone'))
            ->format('M j, Y g:ia');
    }

    /**
     * Relative URLs so subdirectory installs (e.g. /sts/public) work when APP_URL matches.
     *
     * @return array<string, string>
     */
    protected function sharedGuestRoutes(Request $request): array
    {
        $names = [
            'guest.home',
            'guest.about',
            'guest.contact',
            'guest.shipping_calculator',
            'guest.shipping_calculator.calculate',
            'guest.track_order',
            'guest.tracking_order',
            'guest.tracking_order_by_refPhn',
            'guest.create_quote',
            'guest.service_areas',
            'guest.faq',
            'guest.order_notes',
            'login',
            'register',
            'logout',
            'dashboard',
            'profile',
            'terms',
            'privacy',
            'password.request',
            'password.email',
            'password.update',
            'password.confirm.store',
            'user-profile-information.update',
            'user-password.update',
        ];

        $out = [];
        $baseUrl = rtrim($request->getBaseUrl(), '/');

        foreach ($names as $name) {
            if (! Route::has($name)) {
                $out[$name] = '#';
                continue;
            }

            $path = route($name, [], false);
            $out[$name] = str_starts_with($path, '/')
                ? ($baseUrl.$path)
                : $path;
        }

        return $out;
    }
}
