<?php

namespace App\Http\Controllers\Responsable;

use App\Http\Controllers\Controller;
use App\Models\ExamPlan;
use App\Models\Exam;
use App\Models\Group;
use App\Models\Module;
use App\Models\Teacher;
use App\Models\Room;
use App\Services\ExamPlanValidationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class ExamPlanController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (auth()->check() && auth()->user()->role !== 'responsable') {
                abort(403); 
            }
            return $next($request); 
        });
    }

    /**
     * Display a listing of exam plans.
     */
    public function index()
    {
        try {
            // Simple debug
            error_log("ExamPlan index: Starting");
            
            $examPlans = ExamPlan::with(['group', 'module', 'teacher', 'room', 'creator', 'validator'])
                ->orderBy('start_date', 'asc')
                ->orderBy('start_time', 'asc')
                ->get();
                
            error_log("ExamPlan index: Fetched " . $examPlans->count() . " exam plans");
            
            // Récupérer aussi TOUS les examens individuels pour affichage complet
            $allExams = Exam::with(['module.level', 'module.speciality', 'module.semester', 'teacher', 'room'])
                ->orderBy('exam_date_old', 'asc')
                ->orderBy('exam_time_old', 'asc')
                ->get();
                
            error_log("ExamPlan index: Fetched " . $allExams->count() . " individual exams");
            
            $mappedExamPlans = $examPlans->map(function ($plan) {
                return [
                    'id' => $plan->id,
                    'group_name' => $plan->group ? $plan->group->name : 'Unknown',
                    'module_name' => $plan->module ? $plan->module->module_name : 'Unknown',
                    'teacher_name' => $plan->teacher ? $plan->teacher->first_name . ' ' . $plan->teacher->last_name : 'Not Assigned',
                    'room_name' => $plan->room ? ($plan->room->room_name ?? $plan->room->name) : 'Not Assigned',
                    'exam_type' => $plan->exam_type,
                    'exam_subtype' => $plan->exam_subtype,
                    'exam_date' => $plan->exam_date,
                    'start_date' => $plan->start_date,
                    'end_date' => $plan->end_date,
                    'formatted_date' => $plan->getFormattedDate(),
                    'formatted_date_range' => $plan->getFormattedDateRange(),
                    'start_time' => $plan->start_time,
                    'end_time' => $plan->end_time,
                    'formatted_time' => $plan->getFormattedTime(),
                    'status' => $plan->status,
                    'status_label' => $plan->getStatusLabel(),
                    'status_color' => $plan->getStatusColor(),
                    'description' => $plan->description,
                    'created_by' => $plan->creator ? $plan->creator->first_name . ' ' . $plan->creator->last_name : 'Unknown',
                    'validated_by' => $plan->validator ? $plan->validator->first_name . ' ' . $plan->validator->last_name : null,
                    'validated_at' => $plan->validated_at,
                    'teachers' => $plan->teachers ?? [],
                    'rooms' => $plan->rooms ?? []
                ];
            });

            // Mapper aussi les examens individuels
            $mappedAllExams = $allExams->map(function ($exam) {
                return [
                    'id' => $exam->id,
                    'group_name' => $exam->group ? $exam->group->name : 'No Group',
                    'module_name' => $exam->module ? $exam->module->module_name : 'Unknown',
                    'teacher_name' => $exam->teacher ? $exam->teacher->first_name . ' ' . $exam->teacher->last_name : 'Not Assigned',
                    'room_name' => $exam->room ? ($exam->room->room_name ?? $exam->room->name) : 'Not Assigned',
                    'exam_type' => $exam->exam_type,
                    'exam_subtype' => $exam->exam_subtype ?? '',
                    'exam_date' => $exam->exam_date_old,
                    'exam_time' => $exam->exam_time_old,
                    'formatted_date' => $exam->exam_date_old ? \Carbon\Carbon::parse($exam->exam_date_old)->format('M d, Y') : 'N/A',
                    'formatted_time' => $exam->exam_time_old ? \Carbon\Carbon::parse($exam->exam_time_old)->format('H:i') : 'N/A',
                    'status' => $exam->status ?? 'pending',
                    'status_label' => ucfirst($exam->status ?? 'pending'),
                    'description' => $exam->description ?? '',
                    'duration' => $exam->duration ?? 120,
                    'is_individual_exam' => true,
                ];
            });

            error_log("ExamPlan index: Mapped successfully");

            return Inertia::render('Responsable/ExamPlans/Index', [
                'examPlans' => $mappedExamPlans,
                'allExams' => $mappedAllExams,
                'totalExamPlans' => $examPlans->count(),
                'totalIndividualExams' => $allExams->count(),
            ]);
            
        } catch (\Exception $e) {
            error_log("ExamPlan index ERROR: " . $e->getMessage());
            error_log("ExamPlan index TRACE: " . $e->getTraceAsString());
            
            // Return empty data on error to prevent page crash
            return Inertia::render('Responsable/ExamPlans/Index', [
                'examPlans' => [],
                'allExams' => [],
                'totalExamPlans' => 0,
                'totalIndividualExams' => 0,
            ]);
        }
    }

    /**
     * Show the form for creating a new exam plan.
     */
    public function create()
    {
        error_log("ExamPlan create: Starting");
        
        $groups = Group::with(['level', 'speciality'])
            ->orderByRaw("CASE 
                WHEN name LIKE '1ère Année Ingénieur Informatique (SI)' THEN 1
                WHEN name LIKE '2ème Année Ingénieur Informatique%' THEN 2
                WHEN name LIKE '3ème Année Ingénieur Informatique – Génie Logiciel (GL)' THEN 3
                WHEN name LIKE '3ème Année Ingénieur Informatique – Intelligence Artificielle (IA)' THEN 4
                WHEN name LIKE '3ème Année Ingénieur Informatique – Réseaux' THEN 5
                WHEN name LIKE '4ème Année Ingénieur Informatique – Génie Logiciel (GL)' THEN 6
                WHEN name LIKE '4ème Année Ingénieur Informatique – Intelligence Artificielle (IA)' THEN 7
                WHEN name LIKE '1ère Année Licence Informatique' THEN 8
                WHEN name LIKE '2ème Année Licence Informatique' THEN 9
                WHEN name LIKE '3ème Année Licence Informatique' THEN 10
                WHEN name LIKE '1ère Année Master Génie Logiciel (GL)' THEN 11
                WHEN name LIKE '1ère Année Master Intelligence Artificielle (IA)' THEN 12
                WHEN name LIKE '1ère Année Master Réseaux et Systèmes Distribués (RSD)' THEN 13
                WHEN name LIKE '1ère Année Master Systèmes d\'Information et Connaissances (SIC)' THEN 14
                WHEN name LIKE '2ème Année Master Génie Logiciel (GL)' THEN 15
                WHEN name LIKE '2ème Année Master Intelligence Artificielle (IA)' THEN 16
                WHEN name LIKE '2ème Année Master Réseaux et Systèmes Distribués (RSD)' THEN 17
                WHEN name LIKE '2ème Année Master Systèmes d\'Information et Connaissances (SIC)' THEN 18
                ELSE 19
            END")
            ->get();
        $modules = Module::with(['teacher', 'semester'])->orderBy('module_name')->get(['id', 'module_name', 'code', 'exam_types', 'teacher_id', 'level_id', 'speciality_id', 'semester', 'semester_id']);
        $teachers = Teacher::with(['user'])->orderBy('first_name')->get();
        
        error_log("ExamPlan create: Fetched " . $groups->count() . " groups");
        error_log("ExamPlan create: Fetched " . $modules->count() . " modules");
        error_log("ExamPlan create: Fetched " . $teachers->count() . " teachers");
        
        // Log sample group data for debugging
        if ($groups->count() > 0) {
            $firstGroup = $groups->first();
            error_log("ExamPlan create: Sample group - ID: " . $firstGroup->id . ", Name: " . $firstGroup->name . ", Level: " . ($firstGroup->level ? $firstGroup->level->name ?? 'NO NAME' : 'NO LEVEL'));
            error_log("ExamPlan create: Sample group speciality: " . ($firstGroup->speciality ? $firstGroup->speciality->name ?? 'NO NAME' : 'NO SPECIALITY'));
        }
        
        // Log sample module data for debugging
        if ($modules->count() > 0) {
            $firstModule = $modules->first();
            error_log("ExamPlan create: Sample module - ID: " . $firstModule->id . ", Name: " . $firstModule->module_name . ", Semester: " . ($firstModule->semester ?? 'NULL'));
            error_log("ExamPlan create: Sample module semester relation: " . ($firstModule->semester ? $firstModule->semester->name ?? 'NO NAME' : 'NO RELATION'));
        }
        
        // Récupérer toutes les salles disponibles
        $rooms = Room::orderBy('room_name')->get();
        
        // Récupérer TOUS les examens existants pour le formulaire
        $existingExamPlans = Exam::with(['module.level', 'module.speciality', 'module.semester'])
            ->orderBy('exam_date_old', 'asc')
            ->orderBy('exam_time_old', 'asc')
            ->get();
            
        error_log("ExamPlan create: Total exams found: " . $existingExamPlans->count());
        
        if ($existingExamPlans->count() > 0) {
            error_log("ExamPlan create: First exam - ID: " . $existingExamPlans->first()->id . ", Type: " . $existingExamPlans->first()->exam_type);
        }
        
        $existingExamPlans = $existingExamPlans->groupBy('module_id')
            ->map(function ($group) {
                $firstExam = $group->first();
                $module = $firstExam ? $firstExam->module : null;
                
                return [
                    'module_id' => $firstExam->module_id,
                    'module_name' => $module ? $module->module_name : 'Unknown Module',
                    'module_code' => $module ? $module->code : '',
                    'semester_id' => $module ? $module->semester_id : null,
                    'level_id' => $module ? $module->level_id : null,
                    'speciality_id' => $module ? $module->speciality_id : null,
                    'exam_type' => $group->pluck('exam_type')->unique()->values(),
                    'exam_subtype' => $group->pluck('exam_subtype')->unique()->values(),
                    'groups' => [], // Les examens ont group_id = null pour le moment
                    'exam_count' => $group->count(),
                    'exam_dates' => $group->pluck('exam_date_old')->unique()->values()->sort(),
                    'exam_times' => $group->pluck('exam_time_old')->unique()->values()->map(function($time) {
                        // Formater l'heure pour affichage HH:MM
                        return $time ? \Carbon\Carbon::parse($time)->format('H:i') : 'N/A';
                    })->sort(),
                    // Ajouter les informations de niveau et spécialité pour le filtrage
                    'level_name' => $module && $module->level ? $module->level->name : null,
                    'speciality_name' => $module && $module->speciality ? $module->speciality->name : null,
                    'semester_name' => $module && $module->semester ? $module->semester->name : null,
                ];
            })->values();
        
        // Si pas d'examens existants, créer des données de test à partir des modules
        if ($existingExamPlans->isEmpty()) {
            // Limiter à 50 modules pour de meilleures performances
            $limitedModules = $modules->take(50);
            
            $existingExamPlans = $limitedModules->map(function ($module) use ($groups) {
                // Créer des examens de test pour chaque module avec tous les types
                $testExamTypes = ['Normal', 'Rattrapage', 'Test_TP', 'Remplacement'];
                
                return [
                    'module_id' => $module->id,
                    'module_name' => $module->module_name,
                    'exam_type' => $testExamTypes,
                    'groups' => $groups->filter(function ($group) use ($module) {
                        return $group->level_id === $module->level_id && 
                               $group->speciality_id === $module->speciality_id;
                    })->take(10)->map(function ($group) { // Limiter à 10 groupes par module
                        return [
                            'id' => $group->id,
                            'name' => $group->name,
                            'level' => $group->level ? $group->level->name : 'Unknown Level',
                            'speciality' => $group->speciality ? $group->speciality->name : 'Unknown Speciality',
                        ];
                    })->unique('id')->values(),
                ];
            });
        }
        
        $examTypes = ['Normal', 'Rattrapage', 'Test_TP'];

        return Inertia::render('Responsable/ExamPlans/Create', [
            'groups' => $groups,
            'modules' => $modules,
            'teachers' => $teachers,
            'rooms' => $rooms,
            'examTypes' => $examTypes,
            'existingExamPlans' => $existingExamPlans,
        ]);
    }

    /**
     * Store a newly created exam plan in storage.
     */
    public function store(Request $request)
{
    try {
        // Debug
        \Log::info('ExamPlan store: Starting', $request->all());

        // Validation simplifiée
        $validated = $request->validate([
            'groups' => 'required|array|min:1',
            'groups.*' => 'integer|exists:groups,id',
            'modules' => 'required|array|min:1',
            'modules.*' => 'integer|exists:modules,id',
            'teachers' => 'nullable|array',
            'teachers.*' => 'nullable|integer|exists:teachers,id',
            'rooms' => 'nullable|array',
            'rooms.*' => 'nullable|integer|exists:rooms,id',
            'exam_type' => 'required|string|in:Exam,Control,Test_TP',
            'exam_subtype' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'description' => 'nullable|string|max:1000',
        ]);

        \Log::info('ExamPlan store: Validation passed', $validated);

        // S'assurer que les tableaux ne sont pas null
        $teachers = $validated['teachers'] ?? [null];
        $rooms = $validated['rooms'] ?? [null];

        // Si les tableaux sont vides, ajouter null
        if (empty($teachers)) $teachers = [null];
        if (empty($rooms)) $rooms = [null];

        // Créer UN examen par groupe avec TOUS ses modules
        $examPlans = [];
        
        foreach ($validated['groups'] as $groupId) {
            // Pour chaque groupe, créer UN examen qui contient tous les modules
            $modulesList = implode(', ', array_map(function($moduleId) use ($validated) {
                // Récupérer le nom du module
                $module = \App\Models\Module::find($moduleId);
                return $module ? $module->module_name : 'Module ' . $moduleId;
            }, $validated['modules']));
            
            // Calculer la durée en minutes
            $startTime = \Carbon\Carbon::createFromFormat('H:i', $validated['start_time']);
            $endTime = \Carbon\Carbon::createFromFormat('H:i', $validated['end_time']);
            $durationMinutes = $startTime->diffInMinutes($endTime);
            
            $examPlans[] = [
                'group_id' => $groupId,
                'module_id' => $validated['modules'][0], // Premier module comme référence
                'teacher_id' => $teachers[0], // Premier enseignant ou null
                'room_id' => $rooms[0], // Première salle ou null
                'exam_type' => $validated['exam_type'],
                'exam_subtype' => $validated['exam_subtype'],
                'exam_date' => $validated['start_date'], // Pour compatibilité
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'start_time' => $validated['start_time'],
                'end_time' => $validated['end_time'],
                'duration_minutes' => $durationMinutes, // Ajouter la durée calculée
                'description' => ($validated['description'] ?? '') . ' | Modules: ' . $modulesList,
                'status' => 'pending',
                'created_by' => auth()->id(),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        \Log::info('ExamPlan store: Creating ' . count($examPlans) . ' exams (one per group with all modules)');

        // Utiliser insert pour créer tous les examens en une seule fois
        if (!empty($examPlans)) {
            ExamPlan::insert($examPlans);
        }

        \Log::info('ExamPlan store: Success - Created ' . count($examPlans) . ' exams');

        return redirect()->route('responsable.exam-plans.index')
            ->with('success', count($examPlans) . ' exams created successfully (one per group with all modules).');

    } catch (\Illuminate\Validation\ValidationException $e) {
        \Log::error('ExamPlan store: Validation error', $e->errors());
        throw $e;
    } catch (\Exception $e) {
        \Log::error('ExamPlan store: Error - ' . $e->getMessage(), [
            'trace' => $e->getTraceAsString()
        ]);
        
        return redirect()->back()
            ->withInput()
            ->withErrors(['error' => 'Failed to create exams: ' . $e->getMessage()]);
    }
}

    /**
     * Send exam plan to Head Department.
     */
    public function sendToHeadDepartment($id)
    {
        $examPlan = ExamPlan::findOrFail($id);
        
        if ($examPlan->status !== 'pending') {
            return redirect()->back()
                ->withErrors(['error' => 'Only pending exam plans can be sent to Head Department.']);
        }
        
        $examPlan->status = 'sent_to_head';
        $examPlan->sent_to_head_at = now();
        $examPlan->save();
        
        return redirect()->route('responsable.exam-plans.index')
            ->with('success', 'Exam plan sent to Head Department for validation.');
    }

    /**
     * Send all pending exam plans to Head Department.
     */
    public function sendAllToHeadDepartment()
    {
        $pendingPlans = ExamPlan::where('status', 'pending')->get();
        
        if ($pendingPlans->isEmpty()) {
            return redirect()->back()
                ->withErrors(['error' => 'No pending exam plans to send.']);
        }
        
        $count = $pendingPlans->count();
        ExamPlan::where('status', 'pending')->update([
            'status' => 'sent_to_head',
            'sent_to_head_at' => now()
        ]);
        
        return redirect()->route('responsable.exam-plans.index')
            ->with('success', $count . ' exam plans sent to Head Department for validation.');
    }

    /**
     * Display the exam plans schedule.
     */
    public function schedule()
    {
        $examPlans = ExamPlan::with(['group.level', 'group.speciality', 'module', 'teacher', 'room'])
            ->orderBy('start_date')
            ->orderBy('start_time')
            ->get();

        $groups = Group::with(['level', 'speciality'])->get();
        $modules = Module::all();
        $teachers = Teacher::all();
        $rooms = Room::all();

        return Inertia::render('Responsable/ExamPlans/Schedule', [
            'examPlans' => $examPlans->map(function ($plan) {
                return [
                    'id' => $plan->id,
                    'group_name' => $plan->group->name ?? 'Unknown Group',
                    'group' => [
                        'level' => $plan->group->level,
                        'speciality' => $plan->group->speciality
                    ],
                    'module' => [
                        'module_name' => $plan->module->module_name ?? $plan->module->name ?? 'Unknown Module'
                    ],
                    'teacher' => $plan->teacher,
                    'teacher_name' => $plan->teacher ? 
                        ($plan->teacher->first_name . ' ' . $plan->teacher->last_name) : 
                        'Not Assigned',
                    'room' => $plan->room,
                    'room_name' => $plan->room ? 
                        ($plan->room->room_name ?? $plan->room->name) : 
                        'Not Assigned',
                    'exam_type' => $plan->exam_type,
                    'exam_subtype' => $plan->exam_subtype,
                    'start_date' => $plan->start_date->format('Y-m-d'),
                    'end_date' => $plan->end_date->format('Y-m-d'),
                    'start_time' => $plan->start_time->format('H:i'),
                    'end_time' => $plan->end_time->format('H:i'),
                    'description' => $plan->description,
                    'status' => $plan->status,
                    'status_label' => $plan->getStatusLabel(),
                    'status_color' => $plan->getStatusColor(),
                    'created_at' => $plan->created_at->format('Y-m-d H:i:s'),
                ];
            }),
            'groups' => $groups,
            'modules' => $modules,
            'teachers' => $teachers,
            'rooms' => $rooms,
        ]);
    }

    /**
     * Display the specified exam plan.
     */
    public function show($id)
    {
        $examPlan = ExamPlan::with(['group', 'module', 'teacher', 'room', 'creator', 'validator'])
            ->findOrFail($id);

        // Get all exam plans to show complete planning
        $allExamPlans = ExamPlan::with(['group', 'module', 'teacher', 'room'])
            ->orderBy('group_id')
            ->orderBy('module_id')
            ->get();

        // Group by department/level
        $groupedPlans = $allExamPlans->groupBy(function ($plan) {
            return $plan->group ? $plan->group->name : 'Unknown Group';
        });

        // Format the grouped plans for the frontend
        $formattedPlans = $groupedPlans->map(function ($plans, $groupName) {
            return [
                'group_name' => $groupName,
                'plans' => $plans->map(function ($plan) {
                    // Extract modules from description
                    $modules = [];
                    if ($plan->description) {
                        // Parse description to extract module names
                        $lines = explode("\n", $plan->description);
                        foreach ($lines as $line) {
                            if (trim($line)) {
                                $modules[] = trim($line);
                            }
                        }
                    }
                    
                    // If no modules found, use module name
                    if (empty($modules) && $plan->module) {
                        $modules[] = $plan->module->module_name;
                    }
                    
                    return [
                        'id' => $plan->id,
                        'modules' => $modules,
                        'teacher' => $plan->teacher ? ($plan->teacher->first_name . ' ' . $plan->teacher->last_name) : 'Not Assigned',
                        'room' => $plan->room ? ($plan->room->room_name ?? $plan->room->name ?? 'Room ' . $plan->room->id) : 'Not Assigned',
                    ];
                }),
            ];
        })->values();

        return Inertia::render('Responsable/ExamPlans/Show', [
            'examPlan' => [
                'id' => $examPlan->id,
                'group' => $examPlan->group,
                'module' => $examPlan->module,
                'teacher' => $examPlan->teacher,
                'room' => $examPlan->room,
                'exam_type' => $examPlan->exam_type,
                'exam_type_label' => $examPlan->getExamTypeLabel(),
                'exam_date' => $examPlan->exam_date,
                'formatted_date' => $examPlan->getFormattedDate(),
                'start_time' => $examPlan->start_time,
                'end_time' => $examPlan->end_time,
                'formatted_time' => $examPlan->getFormattedTime(),
                'duration_minutes' => $examPlan->duration_minutes,
                'description' => $examPlan->description,
                'status' => $examPlan->status,
                'status_label' => $examPlan->getStatusLabel(),
                'status_color' => $examPlan->getStatusColor(),
                'created_by' => $examPlan->creator,
                'validated_by' => $examPlan->validator,
                'validated_at' => $examPlan->validated_at,
                'validation_notes' => $examPlan->validation_notes,
                'created_at' => $examPlan->created_at,
                'updated_at' => $examPlan->updated_at,
            ],
            'allExamPlans' => $formattedPlans,
        ]);
    }

    /**
     * Show the form for editing the specified exam plan.
     */
    public function edit($id)
    {
        $examPlan = ExamPlan::findOrFail($id);
        
        // Only allow editing if status is pending or rejected
        if (!in_array($examPlan->status, ['pending', 'rejected'])) {
            return redirect()->route('responsable.exam-plans.show', $id)
                ->with('error', 'Cannot edit exam plan that has been validated or scheduled.');
        }

        $groups = Group::with(['level', 'speciality'])->orderBy('name')->get();
        $modules = Module::with(['teacher'])->orderBy('module_name')->get();
        $teachers = Teacher::with(['user'])->orderBy('first_name')->get();
        $rooms = Room::where('availability', true)->orderBy('room_name')->get();
        $examTypes = ['Final', 'Midterm', 'Quiz', 'Practical', 'Oral'];

        return Inertia::render('Responsable/ExamPlans/Edit', [
            'examPlan' => $examPlan,
            'groups' => $groups,
            'modules' => $modules,
            'teachers' => $teachers,
            'rooms' => $rooms,
            'examTypes' => $examTypes,
        ]);
    }

    /**
     * Update the specified exam plan in storage.
     */
    public function update(Request $request, $id)
    {
        $examPlan = ExamPlan::findOrFail($id);
        
        // Only allow updating if status is pending or rejected
        if (!in_array($examPlan->status, ['pending', 'rejected'])) {
            return redirect()->route('responsable.exam-plans.show', $id)
                ->with('error', 'Cannot update exam plan that has been validated or scheduled.');
        }

        $validated = $request->validate([
            'group_id' => 'required|exists:groups,id',
            'module_id' => 'required|exists:modules,id',
            'teacher_id' => 'nullable|exists:teachers,id',
            'room_id' => 'nullable|exists:rooms,id',
            'exam_type' => 'required|string|in:Final,Midterm,Quiz,Practical,Oral',
            'exam_date' => 'required|date|after:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'duration_minutes' => 'required|integer|min:30|max:240',
            'description' => 'nullable|string|max:1000',
        ]);

        $examPlan->update($validated);

        return redirect()->route('responsable.exam-plans.show', $id)
            ->with('success', 'Exam plan updated successfully.');
    }

    /**
     * Remove the specified exam plan from storage.
     */
    public function destroy($id)
    {
        $examPlan = ExamPlan::findOrFail($id);
        
        // Only allow deleting if status is pending or rejected
        if (!in_array($examPlan->status, ['pending', 'rejected'])) {
            return redirect()->route('responsable.exam-plans.show', $id)
                ->with('error', 'Cannot delete exam plan that has been validated or scheduled.');
        }

        $examPlan->delete();

        return redirect()->route('responsable.exam-plans.index')
            ->with('success', 'Exam plan deleted successfully.');
    }

    /**
     * Store multiple exam plans together (batch store).
     */
    public function batchStore(Request $request)
    {
        $request->validate([
            'examPlans' => 'required|array',
            'examPlans.*.group_id' => 'required|exists:groups,id',
            'examPlans.*.module_id' => 'required|exists:modules,id',
            'examPlans.*.teacher_id' => 'required|exists:teachers,id',
            'examPlans.*.room_id' => 'required|exists:rooms,id',
            'examPlans.*.exam_type' => 'required|string',
            'examPlans.*.start_date' => 'required|date',
            'examPlans.*.end_date' => 'required|date|after_or_equal:start_date',
            'examPlans.*.start_time' => 'required',
            'examPlans.*.end_time' => 'required',
            'consolidatedPlanning' => 'required|array'
        ]);

        $batchId = $request->examPlans[0]['batch_id'] ?? time();
        $createdPlans = [];

        foreach ($request->examPlans as $planData) {
            $examPlan = ExamPlan::create([
                'group_id' => $planData['group_id'],
                'module_id' => $planData['module_id'],
                'teacher_id' => $planData['teacher_id'],
                'room_id' => $planData['room_id'],
                'exam_type' => $planData['exam_type'],
                'exam_subtype' => $planData['exam_subtype'] ?? null,
                'start_date' => $planData['start_date'],
                'end_date' => $planData['end_date'],
                'start_time' => $planData['start_time'],
                'end_time' => $planData['end_time'],
                'description' => $planData['description'],
                'status' => $planData['status'],
                'is_planning_generated' => $planData['is_planning_generated'] ?? false,
                'planning_type' => $planData['planning_type'] ?? 'individual',
                'planning_data' => $planData['planning_data'] ?? null,
                'batch_id' => $batchId,
                'group_index' => $planData['group_index'] ?? 0
            ]);

            $createdPlans[] = $examPlan;
        }

        return redirect()->route('responsable.exam-plans.index')
            ->with('success', count($createdPlans) . ' exam plans created successfully!');
    }

    /**
     * Delete multiple exam plans together.
     */
    public function batchDelete(Request $request)
    {
        $request->validate([
            'batch_id' => 'required|integer'
        ]);

        $deletedCount = ExamPlan::where('batch_id', $request->batch_id)->delete();

        return redirect()->route('responsable.exam-plans.index')
            ->with('success', $deletedCount . ' exam plans deleted successfully!');
    }

    /**
     * Send multiple exam plans to Head Department together.
     */
    public function batchSendToHeadDepartment(Request $request)
    {
        $request->validate([
            'batch_id' => 'required|integer'
        ]);

        $updatedCount = ExamPlan::where('batch_id', $request->batch_id)
            ->where('status', 'pending')
            ->update([
                'status' => 'sent_to_head',
                'sent_to_head_at' => now()
            ]);

        return redirect()->route('responsable.exam-plans.index')
            ->with('success', $updatedCount . ' exam plans sent to Head Department successfully!');
    }
}
