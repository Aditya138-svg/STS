<?php

namespace App\Http\Controllers\Admin\MySettings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class MyProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Admin/MySettings/MyProfile', [
            'user' => $request->user(),
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'company_name' => ['nullable', 'string', 'max:255'],
            'phone1' => ['nullable', 'string', 'max:20'],
            'phone2' => ['nullable', 'string', 'max:20'],
            'profile_pic' => ['nullable', 'image', 'max:5120'], // 5MB max
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'cc_email' => ['nullable', 'string'],
            'can_notify_new_order' => ['nullable', 'boolean'],
        ]);

        $data = $request->only(['name', 'email', 'company_name', 'phone1', 'phone2', 'cc_email']);
        
        $data['can_notify_new_order'] = $request->boolean('can_notify_new_order') ? 1 : 0;

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        if ($request->hasFile('profile_pic')) {
            // Delete old pic if exists
            if ($user->profile_pic) {
                Storage::disk('public')->delete($user->profile_pic);
            }
            $path = $request->file('profile_pic')->store('profile_pics', 'public');
            $data['profile_pic'] = $path;
        }

        $user->update($data);

        return redirect()->back()->with('success', 'Profile updated successfully.');
    }
}
