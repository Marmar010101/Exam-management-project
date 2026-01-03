<?php

namespace App\Http\Controllers;

use App\Models\Module;
use App\Models\Group;
use App\Models\Teacher;
use App\Models\Cycle;
use App\Models\Level;
use App\Models\Semester;
use App\Models\Speciality;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class ModuleController extends Controller
{
    public function index()
{
    try {
        // Get all modules with their relationships
        $modules = Module::with([
            'teacher', 
            'group.cycle', 
            'group.level', 
            'group.semester', 
            'group.speciality'
        ])->get();
        
        // Transform data for display
        $formattedModules = $modules->map(function ($module) {
            return [
                'id' => $module->id,
                'module_name' => $module->module_name,
                'system' => $module->group->cycle->cycle_type ?? ($module->group->cycle_id ?? 'N/A'),
                'level' => $module->group->level->name ?? ($module->group->level_id ?? 'N/A'),
                'speciality' => $module->group->speciality->name ?? ($module->group->speciality_id ?? 'commun'),
                'semester' => $module->group->semester->name ?? ($module->group->semester_id ?? 'N/A'),
                'responsable' => $module->teacher ? 
                    $module->teacher->first_name . ' ' . $module->teacher->last_name : 
                    'N/A',
            ];
        });

        // Check if modules are empty - show error message instead of sample data
        if ($formattedModules->isEmpty()) {
            return Inertia::render('Responsable/Modules/Modules', [
                'modules' => [],
                'totalModules' => 0,
                'showAll' => false,
                'hasMoreModules' => false,
                'error' => 'No modules found in the database. Please add modules first.',
            ]);
        }

        // Check if "See all" was requested
        $showAll = request()->has('show_all') || $formattedModules->count() <= 4;
        
        // If showAll is true, show all modules, otherwise show only first 4
        $displayModules = $showAll ? $formattedModules : $formattedModules->take(4);

        return Inertia::render('Responsable/Modules/Modules', [
            'modules' => $displayModules,
            'totalModules' => $formattedModules->count(),
            'showAll' => $showAll,
            'hasMoreModules' => $formattedModules->count() > 4,
        ]);

    } catch (\Exception $e) {
        Log::error('ModuleController error: ' . $e->getMessage());
        
        return Inertia::render('Responsable/Modules/Modules', [
            'modules' => [],
            'totalModules' => 0,
            'showAll' => false,
            'hasMoreModules' => false,
            'error' => 'Error loading modules: ' . $e->getMessage(),
        ]);
    }
}

    public function create()
    {
        try {
        // Get all data needed for the form
        $teachers = Teacher::select('id', 'first_name', 'last_name')->get();
        $groups = Group::with(['cycle', 'level', 'semester', 'speciality'])->get();
        $cycles = Cycle::all();
        $levels = Level::all();
        $semesters = Semester::all();
        $specialities = Speciality::all();
        
        return Inertia::render('Responsable/Modules/Create', [
            'teachers' => $teachers,
            'groups' => $groups,
            'cycles' => $cycles,
            'levels' => $levels,
            'semesters' => $semesters,
            'specialities' => $specialities,
        ]);
    } catch (\Exception $e) {
        Log::error('ModuleController create error: ' . $e->getMessage());
        
        return redirect()->route('modules.index')
            ->with('error', 'Error loading form: ' . $e->getMessage());
    }
    }

   
    public function store(Request $request)
{
    try {
        Log::info('Store request received:', $request->all());
        
        $validated = $request->validate([
            'module_name' => 'required|string|max:255',
            'teacher_id' => 'nullable|exists:teachers,id',
            'system' => 'required|string|max:50',
            'level' => 'required|string|max:50',
            'speciality' => 'required|string|max:100',
            'semester' => 'required|string|max:50',
        ]);

        Log::info('Validated data:', $validated);

        // Find or create the cycle
        $cycle = Cycle::firstOrCreate(
            ['cycle_type' => $validated['system']],
            ['cycle_name' => $validated['system']]
        );
        Log::info('Cycle found/created:', ['id' => $cycle->id, 'name' => $cycle->cycle_name]);

        // Find or create the level
        $level = Level::firstOrCreate(
            ['name' => $validated['level']],
            ['name' => $validated['level']]
        );
        Log::info('Level found/created:', ['id' => $level->id, 'name' => $level->name]);

        // Find or create the semester
        $semester = Semester::firstOrCreate(
            ['name' => $validated['semester']],
            ['name' => $validated['semester']]
        );
        Log::info('Semester found/created:', ['id' => $semester->id, 'name' => $semester->name]);

        // Find or create the speciality
        $speciality = Speciality::firstOrCreate(
            ['name' => $validated['speciality']],
            ['name' => $validated['speciality']]
        );
        Log::info('Speciality found/created:', ['id' => $speciality->id, 'name' => $speciality->name]);

        // Find or create the group
        $group = Group::firstOrCreate(
            [
                'cycle_id' => $cycle->id,
                'level_id' => $level->id,
                'semester_id' => $semester->id,
                'speciality_id' => $speciality->id,
            ],
            [
                'name' => $validated['level'] . '-' . $validated['speciality'],
            ]
        );
        Log::info('Group found/created:', ['id' => $group->id, 'name' => $group->name]);

        // Create the module
        $module = Module::create([
            'module_name' => $validated['module_name'],
            'teacher_id' => $validated['teacher_id'] ?: null,
            'group_id' => $group->id,
        ]);

        Log::info('Module created successfully:', ['id' => $module->id, 'name' => $module->module_name]);

        return redirect()->route('modules.index')
            ->with('success', 'Module "' . $validated['module_name'] . '" created successfully!');
            
    } catch (\Exception $e) {
        Log::error('ModuleController store error: ' . $e->getMessage());
        Log::error('Stack trace: ' . $e->getTraceAsString());
        
        return back()->withInput()
            ->with('error', 'Error creating module: ' . $e->getMessage());
    }
}
    
    
    public function destroy(Module $module)
{
    try {
        // Store module name for success message
        $moduleName = $module->module_name;
        
        // Delete the module
        $module->delete();

        return redirect()->route('modules.index')
            ->with('success', 'Module "' . $moduleName . '" has been deleted successfully!');
            
    } catch (\Exception $e) {
        Log::error('ModuleController destroy error: ' . $e->getMessage());
        
        return redirect()->route('modules.index')
            ->with('error', 'Error deleting module: ' . $e->getMessage());
    }
}
public function edit(Module $module)
{
    try {
        // Load module with all relationships
        $module->load(['teacher', 'group.cycle', 'group.level', 'group.semester', 'group.speciality']);
        
        // Get all data needed for the form
        $teachers = Teacher::select('id', 'first_name', 'last_name')->get();
        $cycles = Cycle::all();
        $levels = Level::all();
        $semesters = Semester::all();
        $specialities = Speciality::all();
        
        // Prepare module data for the form
        $moduleData = [
            'id' => $module->id,
            'module_name' => $module->module_name,
            'teacher_id' => $module->teacher_id,
            'system' => $module->group->cycle->cycle_type ?? '',
            'level' => $module->group->level->name ?? '',
            'speciality' => $module->group->speciality->name ?? '',
            'semester' => $module->group->semester->name ?? '',
        ];

        return Inertia::render('Responsable/Modules/Edit', [
            'module' => $moduleData,
            'teachers' => $teachers,
            'cycles' => $cycles,
            'levels' => $levels,
            'semesters' => $semesters,
            'specialities' => $specialities,
        ]);
    } catch (\Exception $e) {
        Log::error('ModuleController edit error: ' . $e->getMessage());
        
        return redirect()->route('modules.index')
            ->with('error', 'Error loading module for editing: ' . $e->getMessage());
    }
}

  public function update(Request $request, Module $module)
{
    try {
        Log::info('=== UPDATE REQUEST START ===');
        Log::info('Module ID: ' . $module->id);
        Log::info('Request ALL data:', $request->all());
        Log::info('Request method: ' . $request->method());
        
        // Check if _method is being sent
        if ($request->has('_method')) {
            Log::info('_method parameter: ' . $request->input('_method'));
        }
        
        $validated = $request->validate([
            'module_name' => 'required|string|max:255',
            'teacher_id' => 'nullable|exists:teachers,id',
            'system' => 'required|string|max:50',
            'level' => 'required|string|max:50',
            'speciality' => 'required|string|max:100',
            'semester' => 'required|string|max:50',
        ]);

        Log::info('Validated data:', $validated);

        // REST OF YOUR UPDATE CODE...
        
        Log::info('=== UPDATE REQUEST END - SUCCESS ===');
        
        // This redirects to modules page after update
        return redirect()->route('modules.index')
            ->with('success', 'Module "' . $validated['module_name'] . '" updated successfully!');
            
    } catch (\Exception $e) {
        Log::error('ModuleController update error: ' . $e->getMessage());
        Log::error('Stack trace: ' . $e->getTraceAsString());
        
        return back()->withInput()
            ->with('error', 'Error updating module: ' . $e->getMessage());
    }
}
}
