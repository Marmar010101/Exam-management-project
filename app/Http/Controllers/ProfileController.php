<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile page.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Profile', [
            'auth' => [
                'user' => $user
            ],
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        // Pour des raisons de sécurité, les informations du profil sont en lecture seule
        // Seul le mot de passe et la photo peuvent être modifiés
        return Redirect::route('profile.edit')->with('error', 'Profile information is read-only. Only password and photo can be changed.');
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = Auth::user();

        // Vérifier le mot de passe actuel
        if (!Hash::check($validated['current_password'], $user->password)) {
            return back()->withErrors(['current_password' => 'The current password is incorrect.']);
        }

        // Mettre à jour le mot de passe
        $user->update([
            'password' => Hash::make($validated['new_password'])
        ]);

        return back()->with('success', 'Password updated successfully.');
    }

    /**
     * Update the user's profile photo.
     */
    public function updatePhoto(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'profile_photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120', // Max 5MB
        ]);

        $user = Auth::user();

        if ($request->hasFile('profile_photo')) {
            $file = $request->file('profile_photo');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('profile-photos', $filename, 'public');
            
            // Mettre à jour le chemin de la photo dans la base de données
            $user->update([
                'profile_photo_path' => 'profile-photos/' . $filename
            ]);
        }

        return back()->with('success', 'Profile photo updated successfully.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        // Pour des raisons de sécurité, la suppression n'est pas autorisée
        // Seul le chef de département peut gérer les comptes
        return Redirect::route('profile.edit')->with('error', 'Account deletion is not allowed. Please contact the Head of Department.');
    }
}
