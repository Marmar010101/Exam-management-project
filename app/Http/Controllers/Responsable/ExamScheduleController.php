<?php

namespace App\Http\Controllers\Responsable;

use App\Http\Controllers\Controller;
use App\Services\ExamScheduleGeneratorService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamScheduleController extends Controller
{
    protected $scheduleGenerator;

    public function __construct(ExamScheduleGeneratorService $scheduleGenerator)
    {
        $this->scheduleGenerator = $scheduleGenerator;
    }

    /**
     * Récupérer la sélection automatique des examens
     */
    public function getAutomaticSelection(Request $request)
    {
        try {
            $request->validate([
                'examCategory' => 'required|in:Examen,Contrôle,Test_TP',
                'examSubType' => 'required_if:examCategory,Examen'
            ]);

            $automaticSelection = $this->scheduleGenerator->getAutomaticSelection(
                $request->examCategory,
                $request->examSubType
            );

            return response()->json([
                'success' => true,
                'automaticSelection' => $automaticSelection
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher le formulaire de génération automatique
     */
    public function create()
    {
        return Inertia::render('Responsable/ExamSchedule/Create', [
            'examCategories' => [
                'Examen' => ['Normal', 'Rattrapage', 'Remplacement'],
                'Contrôle' => ['Normal', 'Rattrapage'],
                'Test_TP' => ['Normal', 'Rattrapage']
            ]
        ]);
    }

    /**
     * Générer automatiquement le planning
     */
    public function generate(Request $request)
    {
        try {
            $request->validate([
                'examCategory' => 'required|in:Examen,Contrôle,Test_TP',
                'examSubType' => 'required_if:examCategory,Examen',
                'startDate' => 'required|date|after_or_equal:today',
                'endDate' => 'required|date|after:startDate',
                'dayStartTime' => 'required|date_format:H:i',
                'dayEndTime' => 'required|date_format:H:i|after:dayStartTime',
                'excludedExamIds' => 'array',
                'excludedExamIds.*' => 'integer'
            ]);

            $params = [
                'examCategory' => $request->examCategory,
                'examSubType' => $request->examSubType,
                'startDate' => $request->startDate,
                'endDate' => $request->endDate,
                'dayStartTime' => $request->dayStartTime,
                'dayEndTime' => $request->dayEndTime,
                'excludedExamIds' => $request->excludedExamIds ?? []
            ];

            $schedule = $this->scheduleGenerator->generateSchedule($params);

            return response()->json([
                'success' => true,
                'message' => 'Planning généré avec succès',
                'schedule' => $schedule,
                'calendar' => $this->scheduleGenerator->getCalendar(),
                'summary' => $this->generateSummary($schedule)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la génération du planning: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher le planning généré
     */
    public function show($scheduleId)
    {
        // Cette méthode pourrait afficher un planning spécifique
        // Pour l'instant, nous redirigeons vers l'index
        return redirect()->route('responsable.exam-schedule.index');
    }

    /**
     * Lister tous les plannings générés
     */
    public function index()
    {
        return Inertia::render('Responsable/ExamSchedule/Index', [
            // À implémenter selon les besoins
        ]);
    }

    /**
     * Valider et sauvegarder le planning généré
     */
    public function validateSchedule(Request $request)
    {
        try {
            $schedule = $request->input('schedule');
            
            // Le planning est déjà sauvegardé dans la base par le service
            // Cette méthode pourrait servir à marquer le planning comme validé
            
            return response()->json([
                'success' => true,
                'message' => 'Planning validé et sauvegardé avec succès'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la validation: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Générer un résumé du planning
     */
    protected function generateSummary($schedule)
    {
        $summary = [
            'totalExams' => count($schedule),
            'totalDays' => 0,
            'examsByType' => [],
            'examsByCategory' => [],
            'examsByDate' => [],
            'totalGroups' => 0,
            'totalTeachers' => 0,
            'totalRooms' => 0
        ];

        $dates = [];
        $allGroups = [];
        $allTeachers = [];
        $allRooms = [];

        foreach ($schedule as $exam) {
            // Compter par type
            $type = $exam['exam_type'];
            $summary['examsByType'][$type] = ($summary['examsByType'][$type] ?? 0) + 1;

            // Compter par catégorie
            $category = $exam['exam_category'];
            $summary['examsByCategory'][$category] = ($summary['examsByCategory'][$category] ?? 0) + 1;

            // Compter par date
            $date = $exam['exam_date'];
            if (!isset($summary['examsByDate'][$date])) {
                $summary['examsByDate'][$date] = 0;
                $dates[] = $date;
            }
            $summary['examsByDate'][$date]++;

            // Compter les groupes, enseignants et salles uniques
            $allGroups = array_merge($allGroups, $exam['groups']);
            $allTeachers = array_merge($allTeachers, $exam['teachers']);
            $allRooms = array_merge($allRooms, $exam['rooms']);
        }

        $summary['totalDays'] = count($dates);
        $summary['totalGroups'] = count(array_unique($allGroups));
        $summary['totalTeachers'] = count(array_unique($allTeachers));
        $summary['totalRooms'] = count(array_unique($allRooms));

        return $summary;
    }
}
