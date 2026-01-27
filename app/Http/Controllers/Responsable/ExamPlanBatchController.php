<?php

namespace App\Http\Controllers\Responsable;

use App\Http\Controllers\Controller;
use App\Models\ExamPlan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ExamPlanBatchController extends Controller
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

    public function create()
    {
        return Inertia::render('Responsable/ExamPlans/BatchCreate', []);
    }

    public function store(Request $request)
    {
        try {
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
                'batch_size' => 'nullable|integer|min:10|max:1000',
            ]);

            // Configuration du traitement par lots
            $batchSize = $validated['batch_size'] ?? 100;
            $teachers = $validated['teachers'] ?? [null];
            $rooms = $validated['rooms'] ?? [null];
            
            if (empty($teachers)) $teachers = [null];
            if (empty($rooms)) $rooms = [null];

            // Calculer toutes les combinaisons
            $totalCombinations = count($validated['groups']) * count($validated['modules']) * count($teachers) * count($rooms);
            
            // Créer une session pour stocker les données du lot
            $batchData = [
                'validated' => $validated,
                'batch_size' => $batchSize,
                'total_combinations' => $totalCombinations,
                'processed' => 0,
                'created' => 0,
                'status' => 'processing',
                'created_at' => now(),
            ];
            
            session(['exam_plan_batch' => $batchData]);

            return response()->json([
                'success' => true,
                'total_combinations' => $totalCombinations,
                'batch_size' => $batchSize,
                'message' => 'Batch processing started'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function processBatch()
    {
        try {
            $batchData = session('exam_plan_batch');
            
            if (!$batchData || $batchData['status'] !== 'processing') {
                return response()->json([
                    'success' => false,
                    'error' => 'No active batch processing'
                ], 400);
            }

            $validated = $batchData['validated'];
            $batchSize = $batchData['batch_size'];
            $teachers = $validated['teachers'] ?? [null];
            $rooms = $validated['rooms'] ?? [null];
            
            if (empty($teachers)) $teachers = [null];
            if (empty($rooms)) $rooms = [null];

            // Préparer les combinaisons à traiter
            $allCombinations = [];
            foreach ($validated['groups'] as $groupId) {
                foreach ($validated['modules'] as $moduleId) {
                    foreach ($teachers as $teacherId) {
                        foreach ($rooms as $roomId) {
                            $allCombinations[] = [
                                'group_id' => $groupId,
                                'module_id' => $moduleId,
                                'teacher_id' => $teacherId,
                                'room_id' => $roomId,
                            ];
                        }
                    }
                }
            }

            // Extraire le lot actuel
            $offset = $batchData['processed'];
            $currentBatch = array_slice($allCombinations, $offset, $batchSize);

            if (empty($currentBatch)) {
                // Fin du traitement
                $batchData['status'] = 'completed';
                session(['exam_plan_batch' => $batchData]);
                
                return response()->json([
                    'success' => true,
                    'completed' => true,
                    'total_created' => $batchData['created'],
                    'message' => 'Batch processing completed'
                ]);
            }

            // Préparer les données pour l'insertion
            $examPlans = [];
            foreach ($currentBatch as $combination) {
                $examPlans[] = [
                    'group_id' => $combination['group_id'],
                    'module_id' => $combination['module_id'],
                    'teacher_id' => $combination['teacher_id'],
                    'room_id' => $combination['room_id'],
                    'exam_type' => $validated['exam_type'],
                    'exam_subtype' => $validated['exam_subtype'],
                    'exam_date' => $validated['start_date'],
                    'start_date' => $validated['start_date'],
                    'end_date' => $validated['end_date'],
                    'start_time' => $validated['start_time'],
                    'end_time' => $validated['end_time'],
                    'description' => $validated['description'] ?? null,
                    'status' => 'pending',
                    'created_by' => auth()->id(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            // Insérer le lot
            DB::transaction(function () use ($examPlans) {
                ExamPlan::insert($examPlans);
            });

            // Mettre à jour les statistiques
            $batchData['processed'] += count($currentBatch);
            $batchData['created'] += count($examPlans);
            session(['exam_plan_batch' => $batchData]);

            $progress = ($batchData['processed'] / $batchData['total_combinations']) * 100;

            return response()->json([
                'success' => true,
                'processed' => $batchData['processed'],
                'created' => $batchData['created'],
                'total_combinations' => $batchData['total_combinations'],
                'progress' => round($progress, 2),
                'batch_size' => count($currentBatch),
                'completed' => false
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getStatus()
    {
        $batchData = session('exam_plan_batch');
        
        if (!$batchData) {
            return response()->json([
                'active' => false
            ]);
        }

        return response()->json([
            'active' => true,
            'status' => $batchData['status'],
            'processed' => $batchData['processed'],
            'created' => $batchData['created'],
            'total_combinations' => $batchData['total_combinations'],
            'progress' => $batchData['total_combinations'] > 0 
                ? round(($batchData['processed'] / $batchData['total_combinations']) * 100, 2)
                : 0
        ]);
    }

    public function reset()
    {
        session()->forget('exam_plan_batch');
        return response()->json(['success' => true]);
    }
}
