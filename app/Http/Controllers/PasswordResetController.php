<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PasswordResetController extends Controller
{
    /**
     * Affiche la page de demande de mot de passe oublié
     */
    public function showRequestForm()
    {
        return view('auth.forgot-password');
    }

    /**
     * Traite la demande de mot de passe oublié
     */
    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();
        
        if ($user) {
            // Notifier le chef de département
            $this->notifyHeadDepartment($user);
            
            return back()->with('status', 'Password reset request has been sent to the Head of Department.');
        }

        return back()->withErrors(['email' => 'We could not find a user with that email address.']);
    }

    /**
     * Notifie le chef de département
     */
    private function notifyHeadDepartment($user)
    {
        // Récupérer le chef de département
        $headDepartment = User::where('role', 'headdepartment')->first();
        
        if ($headDepartment) {
            // Créer une notification pour le chef de département
            Notification::create([
                'user_id' => $headDepartment->id,
                'title' => 'Password Reset Request',
                'message' => "User {$user->name} ({$user->email}) has requested a password reset.",
                'type' => 'password_reset',
                'data' => json_encode([
                    'user_id' => $user->id,
                    'user_email' => $user->email,
                    'user_name' => $user->name,
                    'requested_at' => now()->toDateTimeString()
                ])
            ]);
        }
    }

    /**
     * Affiche la page de réinitialisation du mot de passe
     */
    public function showResetForm(Request $request, $token = null)
    {
        return view('auth.reset-password', ['token' => $token]);
    }

    /**
     * Réinitialise le mot de passe
     */
    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:8',
        ]);

        // Ici, vous implémenteriez la logique de réinitialisation réelle
        // Pour l'instant, nous allons juste simuler
        
        return redirect()->route('login')->with('status', 'Your password has been reset!');
    }
}
