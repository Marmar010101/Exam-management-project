<?php

namespace App\Http\Controllers\Headdepartment;

use App\Models\User;
use Inertia\Inertia;

class AccountManagementController extends Controller
{
    public function index($type = 'students')
    {
        switch ($type) {
            case 'teachers':
                // Données fictives pour les enseignants - la table teachers n'existe plus
                $data = [
                    ['id' => 1, 'first_name' => 'Dr.', 'last_name' => 'Omar', 'email' => 'omar.brahimi@univ.dz'],
                    ['id' => 2, 'first_name' => 'Dr.', 'last_name' => 'Leila', 'email' => 'leila.khaled@univ.dz']
                ];
                break;

            case 'responsables':
                // Données fictives pour les responsables - la table responsables n'existe plus
                $data = [
                    ['id' => 1, 'first_name' => 'M.', 'last_name' => 'Karim', 'email' => 'karim.bensalem@univ.dz']
                ];
                break;

            case 'headdepartment':
                // Données fictives pour les head departments - la table headdepartments n'existe plus
                $data = [
                    ['id' => 1, 'first_name' => 'Pr.', 'last_name' => 'Nadia', 'email' => 'nadia.brahimi@univ.dz']
                ];
                break;

            default:
                // Données fictives pour les étudiants - la table students n'existe plus
                $data = [
                    ['id' => 1, 'first_name' => 'Ahmed', 'last_name' => 'Benali', 'email' => 'ahmed.benali@univ.dz'],
                    ['id' => 2, 'first_name' => 'Fatima', 'last_name' => 'Mohamed', 'email' => 'fatima.mohamed@univ.dz'],
                    ['id' => 3, 'first_name' => 'Mohamed', 'last_name' => 'Ali', 'email' => 'mohamed.ali@univ.dz']
                ];
                $type = 'students';
        }

        return Inertia::render('AccountManagement', [
            'type' => $type,
            'data' => $data,
        ]);
    }
}
