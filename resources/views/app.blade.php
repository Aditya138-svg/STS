<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>STS</title>
    <link rel="icon" type="image/png" href="{{ asset('images/logo2.png') }}">
    <!-- css for guest page -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <link href="{{ asset('css/style.css') }}" rel="stylesheet">
    <link href="{{ asset('css/design.css') }}" rel="stylesheet">
    <link href="{{ asset('css/customer.css') }}" rel="stylesheet">
    <!-- css for auth page -->
    <link href="{{ asset('css/auth.css') }}?v=2" rel="stylesheet">
</head>
<body class="skin-blue sidebar-mini">
    @inertia
</body>
</html>