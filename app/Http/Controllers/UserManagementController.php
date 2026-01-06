<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserManagementController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index()
    {
        $users = User::all()
            ->map(function ($user) {
                $userData = [
                    'id' => $user->id,
                    'matricule' => $user->matricule,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => $user->created_at->format('d/m/Y')
                ];

                // Add role-specific data (simplified for now)
                switch ($user->role) {
                    case 'student':
                        $userData['student_info'] = [
                            'level' => 'N/A',
                            'speciality' => 'N/A'
                        ];
                        break;
                    case 'teacher':
                        $userData['teacher_info'] = [
                            'department' => 'N/A'
                        ];
                        break;
                    case 'responsable':
                        $userData['responsable_info'] = [
                            'department' => 'N/A'
                        ];
                        break;
                    case 'head_department':
                    case 'headdepartment':
                        $userData['headdepartment_info'] = [
                            'department' => 'N/A'
                        ];
                        break;
                }

                return $userData;
            });

        return Inertia::render('HeadDepartment/account_management/management', [
            'users' => $users
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'matricule' => 'required|string|max:255|unique:users',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:student,teacher,responsable,head_department'
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);

        // Create role-specific profile (simplified - no relations exist yet)
        switch ($validated['role']) {
            case 'student':
                // Student::create(['user_id' => $user->id]); // Commented out - table doesn't exist
                break;
            case 'teacher':
                // Teacher::create(['user_id' => $user->id]); // Commented out - table doesn't exist
                break;
            case 'responsable':
                // Responsable::create(['user_id' => $user->id]); // Commented out - table doesn't exist
                break;
            case 'head_department':
                // HeadDepartment::create(['user_id' => $user->id]); // Commented out - table doesn't exist
                break;
        }

        return redirect()->back()->with('success', 'Utilisateur créé avec succès');
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'matricule' => 'required|string|max:255|unique:users,matricule,' . $user->id,
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|in:student,teacher,responsable,head_department'
        ]);

        // Prevent changing role of head_department
        if ($user->role === 'head_department' && $validated['role'] !== 'head_department') {
            return redirect()->back()->with('error', 'Impossible de modifier le rôle du Head Department');
        }

        $user->update($validated);

        return redirect()->back()->with('success', 'Utilisateur mis à jour avec succès');
    }

    /**
     * Remove the specified user.
     */
    public function destroy(User $user)
    {
        // Prevent deletion of head_department
        if ($user->role === 'head_department') {
            return redirect()->back()->with('error', 'Le Head Department ne peut pas être supprimé');
        }

        // Delete role-specific profile first (simplified - no relations exist yet)
        switch ($user->role) {
            case 'student':
                // $user->student?->delete(); // Commented out - table doesn't exist
                break;
            case 'teacher':
                // $user->teacher?->delete(); // Commented out - table doesn't exist
                break;
            case 'responsable':
                // $user->responsable?->delete(); // Commented out - table doesn't exist
                break;
            case 'head_department':
                // $user->headDepartment?->delete(); // Commented out - table doesn't exist
                break;
        }

        $user->delete();

        return redirect()->back()->with('success', 'Utilisateur supprimé avec succès');
    }
}
