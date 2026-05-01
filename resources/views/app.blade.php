<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>STS</title>
    <link rel="icon" href="data:,">
    <!-- css for guest page -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <link href="{{ asset('css/style.css') }}" rel="stylesheet">
    <link href="{{ asset('css/design.css') }}" rel="stylesheet">
    <link href="{{ asset('css/customer.css') }}" rel="stylesheet">
    <!-- css for auth page -->
    <link href="{{ asset('css/auth.css') }}" rel="stylesheet">
    @vite('resources/js/app.js')
</head>
<body class="skin-blue sidebar-mini">
    @inertia
</body>
</html>