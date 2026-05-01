<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Guest UI flags & contact/social (formerly config/constants.php entries)
    |--------------------------------------------------------------------------
    */

    'christmas_theme' => filter_var(env('CHRISTMAS_THEME', false), FILTER_VALIDATE_BOOLEAN),

    'default_warehouse' => [
        'phone' => env('STS_WAREHOUSE_PHONE', '(555) 555-0100'),
    ],

    'schedule_me_email' => env('STS_SCHEDULE_EMAIL', 'schedule@example.com'),

    'social_media' => [
        'facebook' => env('STS_SOCIAL_FACEBOOK', '#'),
        'instagram' => env('STS_SOCIAL_INSTAGRAM', '#'),
        'x_twitter' => env('STS_SOCIAL_X_TWITTER', '#'),
    ],

    's3_storage_url' => rtrim((string) env('AWS_URL', ''), '/'),

    /*
    |--------------------------------------------------------------------------
    | Role identifiers (extend when your User model exposes roles)
    |--------------------------------------------------------------------------
    */

    'roles' => [
        'corporate' => env('STS_ROLE_CORPORATE', 'corporate'),
        'non_corporate' => env('STS_ROLE_NON_CORPORATE', 'non_corporate'),
        'warehouse' => env('STS_ROLE_WAREHOUSE', 'warehouse'),
        'office' => env('STS_ROLE_OFFICE', 'office'),
        'admin' => env('STS_ROLE_ADMIN', 'admin'),
    ],
    /*
    |--------------------------------------------------------------------------
    | Admin user list — roles (UI labels only; does not change how DB stores values)
    |--------------------------------------------------------------------------
    */

    /** Ordered options for “Choose Role” (display + filter target label). */
    'user_role_options' => [
        'Admin',
        'External Customer',
        'Internal Handling',
        'Office',
        'Warehouse',
    ],

    /**
     * Map whatever is stored in users.user_role → friendly label above.
     * Add keys to match your existing stored values (slugs, integers as strings, etc.).
     */
    'user_role_display_map' => [
        '1' => 'Admin',
        '2' => 'External Customer',
        '3' => 'Internal Handling',
        '4' => 'Office',
        '5' => 'Warehouse',
        'admin' => 'Admin',
        'Admin' => 'Admin',
        'corporate' => 'External Customer',
        'non_corporate' => 'External Customer',
        'external_customer' => 'External Customer',
        'External Customer' => 'External Customer',
        'internal' => 'Internal Handling',
        'internal_handling' => 'Internal Handling',
        'Internal Handling' => 'Internal Handling',
        'office' => 'Office',
        'Office' => 'Office',
        'warehouse' => 'Warehouse',
        'Warehouse' => 'Warehouse',
    ],

    /**
     * Optional: numeric / legacy codes stored in DB → friendly label (for filter + table).
     */
    'user_role_legacy_map' => [
        '1' => 'Admin',
        '2' => 'External Customer',
        '3' => 'Internal Handling',
        '4' => 'Office',
        '5' => 'Warehouse',
    ],


    'user_active_flag' => env('STS_USER_ACTIVE', '1'),
    'user_inactive_flag' => env('STS_USER_INACTIVE', '0'),
    'help_guide_base_url' => rtrim((string) env('STS_HELP_GUIDE_BASE_URL', ''), '/'),
    /*
    |--------------------------------------------------------------------------
    | Guest marketing chrome (hero + footer)
    |--------------------------------------------------------------------------
    */

    'guest_hero_image' => env('STS_GUEST_HERO_IMAGE', 'images/homebackground.jpg'),

    'footer' => [
        'copyright' => env('STS_FOOTER_COPYRIGHT', 'Copyright © '.date('Y').' '.config('app.name')),
        'feedback_href' => env('STS_FEEDBACK_HREF', 'mailto:'.config('mail.from.address')),
        'links' => [
            ['label' => 'Florida Schedule', 'href' => env('STS_URL_FL_SCHEDULE', '#')],
            ['label' => 'FAQs', 'href' => env('STS_URL_FAQ', '#')],
            ['label' => 'Terms & Conditions', 'href' => env('STS_URL_TERMS', '#')],
            ['label' => 'Privacy Policy', 'href' => env('STS_URL_PRIVACY', '#')],
            ['label' => 'STS Info', 'href' => env('STS_URL_INFO', '#')],
        ],
    ],

];
