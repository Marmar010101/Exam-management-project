<?php

namespace App\Exports;

use App\Models\Module;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class ModulesExport implements FromCollection, WithHeadings, WithMapping
{
    protected $modules;

    public function __construct($modules)
    {
        $this->modules = $modules;
    }

    public function collection()
    {
        return $this->modules;
    }

    public function headings(): array
    {
        return [
            'Code',
            'Nom du Module',
            'Description',
            'Système',
            'Niveau',
            'Semestre',
            'Spécialité',
            'Crédits',
            'Coefficient',
            'Volume CM',
            'Volume TD',
            'Enseignant',
            'Méthodes d\'évaluation',
            'Prérequis',
        ];
    }

    public function map($module): array
    {
        return [
            $module->code,
            $module->module_name,
            $module->description ?? '',
            $module->system_type_label,
            $module->level_label,
            strtoupper($module->semester),
            $module->specialty_label ?? 'Tronc Commun',
            $module->credits,
            $module->coefficient,
            $module->volume_cm,
            $module->volume_td,
            $module->teacher?->name ?? '',
            implode(', ', $module->evaluation_methods ?? []),
            $module->prerequisites->pluck('code')->implode(', ') ?? '',
        ];
    }
}
