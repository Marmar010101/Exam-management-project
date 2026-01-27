<?php

namespace App\Services;

use App\Models\ExamPlan;
use App\Models\Module;
use App\Models\Group;
use App\Models\Teacher;
use App\Models\Room;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class ExamScheduleGeneratorService
{
    protected $examCategory;
    protected $examSubType;
    protected $startDate;
    protected $endDate;
    protected $dayStartTime;
    protected $dayEndTime;
    protected $generatedSchedule = [];
    protected $calendar = [];
    protected $mainModuleKeywords = ['Algorithmique', 'Bases de Données', 'Systèmes d\'Exploitation', 'Algèbre', 'Analyse', 'Mathématiques', 'Programmation'];

    public function generateSchedule($params)
    {
        $this->examCategory = $params['examCategory'];
        $this->examSubType = $params['examSubType'] ?? null;
        $this->startDate = Carbon::parse($params['startDate']);
        $this->endDate = Carbon::parse($params['endDate']);
        $this->dayStartTime = $params['dayStartTime'] ?? '08:00';
        $this->dayEndTime = $params['dayEndTime'] ?? '18:00';
        $this->excludedExamIds = $params['excludedExamIds'] ?? []; // Nouveau paramètre

        // Étape 1: Initialiser le calendrier
        $this->initializeCalendar();

        // Étape 2: Charger les examens/modules concernés
        $examsToSchedule = $this->loadExamsToSchedule();

        // Étape 3: Générer le planning pour chaque examen
        foreach ($examsToSchedule as $examData) {
            $this->scheduleExam($examData);
        }

        // Étape 4: Enregistrer le planning en base
        $this->saveScheduleToDatabase();

        return $this->generatedSchedule;
    }

    public function getAutomaticSelection($examCategory, $examSubType = null)
    {
        $this->examCategory = $examCategory;
        $this->examSubType = $examSubType;

        return $this->loadExamsToSchedule();
    }

    protected function initializeCalendar()
    {
        $period = CarbonPeriod::create($this->startDate, $this->endDate);
        
        foreach ($period as $date) {
            // Exclure les weekends
            if ($date->isWeekend()) {
                continue;
            }

            $this->calendar[$date->format('Y-m-d')] = [
                'date' => $date->format('Y-m-d'),
                'exams' => [],
                'mainModulesScheduled' => [],
                'groupsScheduled' => [],
                'teachersScheduled' => [],
                'roomsScheduled' => [],
                'timeSlots' => $this->generateTimeSlots($date)
            ];
        }
    }

    protected function generateTimeSlots($date)
    {
        $slots = [];
        $currentTime = Carbon::parse($date->format('Y-m-d') . ' ' . $this->dayStartTime);
        $endTime = Carbon::parse($date->format('Y-m-d') . ' ' . $this->dayEndTime);

        while ($currentTime < $endTime) {
            $slotEnd = $currentTime->copy()->addMinutes(90); // Durée maximale
            if ($slotEnd > $endTime) {
                $slotEnd = $endTime;
            }

            $slots[] = [
                'start' => $currentTime->format('H:i'),
                'end' => $slotEnd->format('H:i'),
                'available' => true
            ];

            $currentTime = $slotEnd->copy()->addMinutes(30); // Pause de 30 minutes
        }

        return $slots;
    }

    protected function loadExamsToSchedule()
    {
        if ($this->examCategory === 'Examen') {
            return $this->loadExamsBySubType();
        } else {
            return $this->loadModulesByType();
        }
    }

    protected function loadExamsBySubType()
    {
        $query = ExamPlan::with(['module', 'groups', 'teachers', 'rooms'])
            ->where('exam_type', $this->examSubType);

        // Exclure les examens spécifiés
        if (!empty($this->excludedExamIds)) {
            $query->whereNotIn('id', $this->excludedExamIds);
        }

        $existingExams = $query->get();

        $examsToSchedule = [];

        foreach ($existingExams as $exam) {
            $examsToSchedule[] = [
                'id' => $exam->id, // Ajouter l'ID original pour la tracking
                'module' => $exam->module,
                'groups' => $exam->groups,
                'exam_type' => $this->examSubType,
                'category' => $this->examCategory,
                'duration' => 60, // Durée par défaut
                'existing_exam_id' => $exam->id
            ];
        }

        return $examsToSchedule;
    }

    protected function loadModulesByType()
    {
        $modules = Module::where('exam_category', $this->examCategory)
            ->with('groups')
            ->get();

        $examsToSchedule = [];

        foreach ($modules as $module) {
            $examsToSchedule[] = [
                'module' => $module,
                'groups' => $module->groups,
                'exam_type' => 'Normal',
                'category' => $this->examCategory,
                'duration' => 60
            ];
        }

        return $examsToSchedule;
    }

    protected function scheduleExam($examData)
    {
        $module = $examData['module'];
        $groups = $examData['groups'];
        $isMainModule = $this->isMainModule($module->module_name);

        // Rechercher un jour valide
        $scheduledDate = $this->findValidDate($groups, $isMainModule);

        if (!$scheduledDate) {
            throw new \Exception("Impossible de trouver une date valide pour le module: {$module->module_name}");
        }

        // Calculer l'heure de l'examen
        $timeSlot = $this->findAvailableTimeSlot($scheduledDate, $examData['duration']);

        if (!$timeSlot) {
            throw new \Exception("Impossible de trouver un créneau horaire pour le module: {$module->module_name}");
        }

        // Sélectionner les enseignants
        $teachers = $this->selectTeachers($module);

        // Sélectionner les salles
        $rooms = $this->selectRooms($examData['category'], $groups);

        // Créer l'entrée de planning
        $scheduleEntry = [
            'module_id' => $module->id,
            'module_name' => $module->module_name,
            'groups' => $groups->pluck('id')->toArray(),
            'exam_type' => $examData['exam_type'],
            'exam_category' => $examData['category'],
            'exam_date' => $scheduledDate,
            'start_time' => $timeSlot['start'],
            'end_time' => $timeSlot['end'],
            'duration_minutes' => $examData['duration'],
            'teachers' => $teachers->pluck('id')->toArray(),
            'rooms' => $rooms->pluck('id')->toArray(),
            'is_main_module' => $isMainModule
        ];

        $this->generatedSchedule[] = $scheduleEntry;
        $this->updateCalendar($scheduleEntry);
    }

    protected function findValidDate($groups, $isMainModule)
    {
        foreach ($this->calendar as $date => $dayData) {
            // Vérifier le nombre maximum d'examens par jour
            if (count($dayData['exams']) >= 3) {
                continue;
            }

            // Vérifier les contraintes de groupes
            if (!$this->validateGroupConstraints($date, $groups)) {
                continue;
            }

            // Vérifier les contraintes de modules principaux
            if ($isMainModule && !$this->validateMainModuleConstraint($date)) {
                continue;
            }

            return $date;
        }

        return null;
    }

    protected function validateGroupConstraints($date, $groups)
    {
        $dayData = $this->calendar[$date];
        $groupIds = $groups->pluck('id')->toArray();

        foreach ($dayData['groupsScheduled'] as $scheduledGroupId) {
            if (in_array($scheduledGroupId, $groupIds)) {
                // Vérifier l'intervalle de 2 jours
                if (!$this->hasMinimumInterval($date, $scheduledGroupId)) {
                    return false;
                }
            }
        }

        return true;
    }

    protected function hasMinimumInterval($currentDate, $groupId)
    {
        $current = Carbon::parse($currentDate);
        
        // Vérifier les 2 jours précédents
        for ($i = 1; $i <= 2; $i++) {
            $checkDate = $current->copy()->subDays($i)->format('Y-m-d');
            
            if (isset($this->calendar[$checkDate])) {
                if (in_array($groupId, $this->calendar[$checkDate]['groupsScheduled'])) {
                    return false;
                }
            }
        }

        return true;
    }

    protected function validateMainModuleConstraint($date)
    {
        return !in_array(true, $this->calendar[$date]['mainModulesScheduled']);
    }

    protected function findAvailableTimeSlot($date, $duration)
    {
        $dayData = $this->calendar[$date];
        
        foreach ($dayData['timeSlots'] as &$slot) {
            if ($slot['available']) {
                $slotStart = Carbon::parse($date . ' ' . $slot['start']);
                $slotEnd = Carbon::parse($date . ' ' . $slot['end']);
                $slotDuration = $slotEnd->diffInMinutes($slotStart);

                if ($slotDuration >= $duration) {
                    $slot['available'] = false;
                    return [
                        'start' => $slot['start'],
                        'end' => $slotStart->copy()->addMinutes($duration)->format('H:i')
                    ];
                }
            }
        }

        return null;
    }

    protected function selectTeachers($module)
    {
        $query = Teacher::whereDoesntHave('absences', function ($query) {
            $query->where('status', 'approved');
        });

        // Exclure le responsable du module sauf pour les remplacements
        if ($this->examSubType !== 'Remplacement') {
            $query->where('id', '!=', $module->teacher_id);
        }

        return $query->take(2)->get(); // 2 enseignants par examen
    }

    protected function selectRooms($category, $groups)
    {
        $query = Room::where('availability', true);

        if ($category === 'Test_TP') {
            $query->where('is_lab', true);
        }

        // Calculer la capacité totale nécessaire
        $totalStudents = $groups->sum(function ($group) {
            return $group->students_count ?? 30; // Valeur par défaut
        });

        $rooms = $query->get();
        $selectedRooms = [];
        $currentCapacity = 0;

        foreach ($rooms as $room) {
            $selectedRooms[] = $room;
            $currentCapacity += $room->capacity;

            if ($currentCapacity >= $totalStudents) {
                break;
            }
        }

        return collect($selectedRooms);
    }

    protected function isMainModule($moduleName)
    {
        foreach ($this->mainModuleKeywords as $keyword) {
            if (stripos($moduleName, $keyword) !== false) {
                return true;
            }
        }
        return false;
    }

    protected function updateCalendar($scheduleEntry)
    {
        $date = $scheduleEntry['exam_date'];
        
        $this->calendar[$date]['exams'][] = $scheduleEntry;
        $this->calendar[$date]['mainModulesScheduled'][] = $scheduleEntry['is_main_module'];
        $this->calendar[$date]['groupsScheduled'] = array_merge(
            $this->calendar[$date]['groupsScheduled'],
            $scheduleEntry['groups']
        );
        $this->calendar[$date]['teachersScheduled'] = array_merge(
            $this->calendar[$date]['teachersScheduled'],
            $scheduleEntry['teachers']
        );
        $this->calendar[$date]['roomsScheduled'] = array_merge(
            $this->calendar[$date]['roomsScheduled'],
            $scheduleEntry['rooms']
        );
    }

    protected function saveScheduleToDatabase()
    {
        foreach ($this->generatedSchedule as $scheduleEntry) {
            $examPlan = ExamPlan::create([
                'module_id' => $scheduleEntry['module_id'],
                'exam_type' => $scheduleEntry['exam_type'],
                'exam_category' => $scheduleEntry['exam_category'],
                'exam_date' => $scheduleEntry['exam_date'],
                'start_time' => $scheduleEntry['start_time'],
                'end_time' => $scheduleEntry['end_time'],
                'duration_minutes' => $scheduleEntry['duration_minutes'],
                'description' => 'Généré automatiquement par le système',
                'status' => 'scheduled'
            ]);

            // Associer les groupes
            $examPlan->groups()->attach($scheduleEntry['groups']);

            // Associer les enseignants
            $examPlan->teachers()->attach($scheduleEntry['teachers']);

            // Associer les salles
            $examPlan->rooms()->attach($scheduleEntry['rooms']);
        }
    }

    public function getGeneratedSchedule()
    {
        return $this->generatedSchedule;
    }

    public function getCalendar()
    {
        return $this->calendar;
    }
}
