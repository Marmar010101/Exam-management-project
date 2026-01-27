<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;

class AdvancedModuleController extends Controller
{
    public function index()
    {
        $modules = Module::with(['teacher', 'level.cycle', 'speciality', 'semester', 'prerequisites'])
            ->orderBy('code')
            ->get()
            ->map(function ($module) {
                return [
                    'id' => $module->id,
                    'module_name' => $module->module_name,
                    'code' => $module->code,
                    'description' => $module->description,
                    'system_type' => $module->system_type,
                    'level' => $module->level,
                    'semester' => $module->semester,
                    'credits' => $module->credits,
                    'coefficient' => $module->coefficient,
                    'volume_cm' => $module->volume_cm,
                    'volume_td' => $module->volume_td,
                    'specialty' => $module->specialty,
                    'objectives' => $module->objectives,
                    'resources' => $module->resources,
                    'evaluation_methods' => $module->evaluation_methods,
                    'teacher' => $module->teacher,
                    'speciality' => $module->speciality,
                    'level' => $module->level,
                    'semester' => $module->semester,
                    'prerequisites' => $module->prerequisites,
                    'system_type_label' => $module->system_type_label,
                    'level_label' => $module->level_label,
                    'specialty_label' => $module->specialty_label,
                ];
            });

        return Inertia::render('HeadDepartment/advanced-modules', [
            'modules' => $modules
        ]);
    }

    public function create()
    {
        $teachers = Teacher::orderBy('name')->get();
        $existingModules = Module::orderBy('code')->get(['id', 'code', 'module_name']);

        return Inertia::render('HeadDepartment/advanced-modules-create', [
            'teachers' => $teachers,
            'existingModules' => $existingModules
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|unique:modules|regex:/^[A-Z]{3}[0-9]{3}$/',
            'module_name' => 'required|max:255',
            'description' => 'nullable',
            'system_type' => 'required|in:ing,lmd',
            'level' => 'required',
            'semester' => 'required|in:s1,s2',
            'credits' => 'required|integer|min:1|max:10',
            'coefficient' => 'integer|min:1|max:5',
            'volume_cm' => 'integer|min:0|max:60',
            'volume_td' => 'integer|min:0|max:90',
            'specialty' => 'nullable|in:ia,gl,res,sic',
            'teacher_id' => 'nullable|exists:teachers,id',
            'objectives' => 'nullable',
            'resources' => 'nullable',
            'evaluation_methods' => 'nullable|array',
            'evaluation_methods.*' => 'in:exam,tp,project,continuous',
            'prerequisites' => 'nullable|array',
            'prerequisites.*' => 'exists:modules,id',
        ]);

        // Generate code if not provided
        if (empty($validated['code'])) {
            $validated['code'] = $this->generateModuleCode($validated);
        }

        $module = Module::create([
            'code' => strtoupper($validated['code']),
            'module_name' => $validated['module_name'],
            'description' => $validated['description'] ?? null,
            'system_type' => $validated['system_type'],
            'level' => $validated['level'],
            'semester' => $validated['semester'],
            'credits' => $validated['credits'],
            'coefficient' => $validated['coefficient'] ?? 1,
            'volume_cm' => $validated['volume_cm'] ?? 0,
            'volume_td' => $validated['volume_td'] ?? 0,
            'specialty' => $validated['specialty'] ?? null,
            'objectives' => $validated['objectives'] ?? null,
            'resources' => $validated['resources'] ?? null,
            'evaluation_methods' => $validated['evaluation_methods'] ?? [],
            'teacher_id' => $validated['teacher_id'] ?? null,
        ]);

        // Handle prerequisites
        if (!empty($validated['prerequisites'])) {
            $module->prerequisites()->sync($validated['prerequisites']);
        }

        return redirect()->route('advanced-modules.index')
            ->with('success', "Module {$module->code} ajouté avec succès!");
    }

    public function edit(Module $module)
    {
        $teachers = Teacher::orderBy('name')->get();
        $existingModules = Module::orderBy('code')->get(['id', 'code', 'module_name']);
        
        $module->load(['prerequisites', 'teacher']);

        return Inertia::render('HeadDepartment/advanced-modules-edit', [
            'module' => $module,
            'teachers' => $teachers,
            'existingModules' => $existingModules
        ]);
    }

    public function update(Request $request, Module $module)
    {
        $validated = $request->validate([
            'code' => 'required|unique:modules,code,' . $module->id . '|regex:/^[A-Z]{3}[0-9]{3}$/',
            'module_name' => 'required|max:255',
            'description' => 'nullable',
            'system_type' => 'required|in:ing,lmd',
            'level' => 'required',
            'semester' => 'required|in:s1,s2',
            'credits' => 'required|integer|min:1|max:10',
            'coefficient' => 'integer|min:1|max:5',
            'volume_cm' => 'integer|min:0|max:60',
            'volume_td' => 'integer|min:0|max:90',
            'specialty' => 'nullable|in:ia,gl,res,sic',
            'teacher_id' => 'nullable|exists:teachers,id',
            'objectives' => 'nullable',
            'resources' => 'nullable',
            'evaluation_methods' => 'nullable|array',
            'evaluation_methods.*' => 'in:exam,tp,project,continuous',
            'prerequisites' => 'nullable|array',
            'prerequisites.*' => 'exists:modules,id',
        ]);

        $module->update([
            'code' => strtoupper($validated['code']),
            'module_name' => $validated['module_name'],
            'description' => $validated['description'] ?? null,
            'system_type' => $validated['system_type'],
            'level' => $validated['level'],
            'semester' => $validated['semester'],
            'credits' => $validated['credits'],
            'coefficient' => $validated['coefficient'] ?? 1,
            'volume_cm' => $validated['volume_cm'] ?? 0,
            'volume_td' => $validated['volume_td'] ?? 0,
            'specialty' => $validated['specialty'] ?? null,
            'objectives' => $validated['objectives'] ?? null,
            'resources' => $validated['resources'] ?? null,
            'evaluation_methods' => $validated['evaluation_methods'] ?? [],
            'teacher_id' => $validated['teacher_id'] ?? null,
        ]);

        // Handle prerequisites
        if (!empty($validated['prerequisites'])) {
            $module->prerequisites()->sync($validated['prerequisites']);
        } else {
            $module->prerequisites()->detach();
        }

        return redirect()->route('advanced-modules.index')
            ->with('success', "Module {$module->code} mis à jour avec succès!");
    }

    public function destroy(Module $module)
    {
        $moduleCode = $module->code;
        $module->delete();

        return redirect()->route('advanced-modules.index')
            ->with('success', "Module {$moduleCode} supprimé avec succès!");
    }

    public function duplicate(Module $module)
    {
        $newModule = $module->replicate();
        $newModule->code = $this->generateModuleCode([
            'system_type' => $module->system_type,
            'level' => $module->level,
            'specialty' => $module->specialty
        ]);
        $newModule->module_name = $module->module_name . ' (Copie)';
        $newModule->save();

        // Copy prerequisites
        $newModule->prerequisites()->sync($module->prerequisites->pluck('id'));

        return redirect()->route('advanced-modules.index')
            ->with('success', "Module {$module->code} dupliqué avec succès!");
    }

    public function exportExcel()
    {
        $modules = Module::with(['teacher', 'level.cycle', 'speciality', 'semester'])
            ->orderBy('code')
            ->get();

        return Excel::download(new ModulesExport($modules), 'modules.xlsx');
    }

    public function importExcel(Request $request)
    {
        $request->validate([
            'excel_file' => 'required|mimes:xlsx,xls|max:2048'
        ]);

        try {
            Excel::import(new ModulesImport, $request->file('excel_file'));
            
            return redirect()->route('advanced-modules.index')
                ->with('success', 'Modules importés avec succès!');
        } catch (\Exception $e) {
            return redirect()->route('advanced-modules.index')
                ->with('error', 'Erreur lors de l\'importation: ' . $e->getMessage());
        }
    }

    public function generatePDF(Module $module)
    {
        $module->load(['teacher', 'level.cycle', 'speciality', 'semester', 'prerequisites']);

        $pdf = Pdf::loadView('pdf.module-fiche', compact('module'));
        
        return $pdf->download("fiche-module-{$module->code}.pdf");
    }

    public function checkCodeAvailability(Request $request)
    {
        $code = strtoupper($request->get('code'));
        $exists = Module::where('code', $code)->exists();
        
        return response()->json(['available' => !$exists]);
    }

    private function generateModuleCode($data)
    {
        $prefix = match($data['specialty'] ?? 'common') {
            'ia' => 'IA',
            'gl' => 'GL',
            'res' => 'RES',
            'sic' => 'SIC',
            default => 'COM'
        };

        $level = match($data['level']) {
            'ing1', 'l1' => '1',
            'ing2', 'l2' => '2',
            'ing3', 'l3' => '3',
            'ing4', 'm1' => '4',
            'ing5', 'm2' => '5',
            default => '1'
        };

        $baseCode = $prefix . $level;
        $counter = 1;

        while (Module::where('code', $baseCode . str_pad($counter, 2, '0', STR_PAD_LEFT))->exists()) {
            $counter++;
        }

        return $baseCode . str_pad($counter, 2, '0', STR_PAD_LEFT);
    }
}
