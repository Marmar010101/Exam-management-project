<?php

namespace App\Imports;

use App\Models\Module;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;

class ModulesImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnError, SkipsOnFailure
{
    public function model(array $row)
    {
        return new Module([
            'code' => strtoupper($row['code'] ?? ''),
            'module_name' => $row['nom_du_module'] ?? $row['module_name'] ?? '',
            'description' => $row['description'] ?? null,
            'system_type' => $this->mapSystemType($row['systeme'] ?? $row['system_type'] ?? ''),
            'level' => $this->mapLevel($row['niveau'] ?? $row['level'] ?? ''),
            'semester' => strtolower($row['semestre'] ?? $row['semester'] ?? ''),
            'credits' => (int) ($row['credits'] ?? 4),
            'coefficient' => (float) ($row['coefficient'] ?? 1.0),
            'volume_cm' => (int) ($row['volume_cm'] ?? 0),
            'volume_td' => (int) ($row['volume_td'] ?? 0),
            'specialty' => $this->mapSpecialty($row['specialite'] ?? $row['specialty'] ?? null),
            'objectives' => $row['objectifs'] ?? $row['objectives'] ?? null,
            'resources' => $row['ressources'] ?? $row['resources'] ?? null,
            'evaluation_methods' => $this->parseEvaluationMethods($row['methodes_evaluation'] ?? $row['evaluation_methods'] ?? ''),
        ]);
    }

    public function rules(): array
    {
        return [
            'code' => 'required|string|max:10',
            'nom_du_module' => 'required|string|max:255',
            'systeme' => 'required|in:ing,lmd,Système Ingénieur,Système LMD',
            'niveau' => 'required|string',
            'semestre' => 'required|in:s1,s2,S1,S2',
            'credits' => 'required|integer|min:1|max:10',
            'coefficient' => 'nullable|numeric|min:1|max:5',
            'volume_cm' => 'nullable|integer|min:0|max:60',
            'volume_td' => 'nullable|integer|min:0|max:90',
        ];
    }

    private function mapSystemType($value)
    {
        return match(strtolower($value)) {
            'ing', 'système ingénieur' => 'ing',
            'lmd', 'système lmd' => 'lmd',
            default => 'ing'
        };
    }

    private function mapLevel($value)
    {
        return match(strtolower($value)) {
            '1ère année ingénieur', 'ing1' => 'ing1',
            '2ème année ingénieur', 'ing2' => 'ing2',
            '3ème année ingénieur', 'ing3' => 'ing3',
            '4ème année ingénieur', 'ing4' => 'ing4',
            '5ème année ingénieur', 'ing5' => 'ing5',
            'licence 1', 'l1' => 'l1',
            'licence 2', 'l2' => 'l2',
            'licence 3', 'l3' => 'l3',
            'master 1', 'm1' => 'm1',
            'master 2', 'm2' => 'm2',
            default => $value
        };
    }

    private function mapSpecialty($value)
    {
        if (empty($value)) return null;
        
        return match(strtolower($value)) {
            'intelligence artificielle', 'ia' => 'ia',
            'génie logiciel', 'gl' => 'gl',
            'réseaux', 'res' => 'res',
            'systèmes d\'information et communication', 'sic' => 'sic',
            default => $value
        };
    }

    private function parseEvaluationMethods($value)
    {
        if (empty($value)) return [];
        
        $methods = [];
        $parts = explode(',', $value);
        
        foreach ($parts as $part) {
            $method = trim(strtolower($part));
            if (in_array($method, ['exam', 'examen', 'tp', 'travaux pratiques', 'project', 'projet', 'continuous', 'contrôle continu'])) {
                $methods[] = match($method) {
                    'exam', 'examen' => 'exam',
                    'tp', 'travaux pratiques' => 'tp',
                    'project', 'projet' => 'project',
                    'continuous', 'contrôle continu' => 'continuous',
                    default => $method
                };
            }
        }
        
        return $methods;
    }
}
