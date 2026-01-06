<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Group;
use App\Models\Module;
use App\Models\Teacher;
use App\Models\User;
use App\Models\ExamPlan;

class FacultyScheduleController extends Controller
{
    /**
     * Display the faculty schedule page.
     */
    public function index(Request $request): Response
    {
        $faculty = $request->get('faculty', 'L1');
        $speciality = $request->get('speciality', 'Informatique');

        // Mock data for testing - replace with real queries later
        $groups = [
            [
                'id' => 1,
                'name' => 'Groupe 1',
                'students' => [
                    ['id' => 1, 'first_name' => 'Ahmed', 'last_name' => 'Mohamed', 'matricule' => 'STU001'],
                    ['id' => 2, 'first_name' => 'Fatima', 'last_name' => 'Zahra', 'matricule' => 'STU002'],
                    ['id' => 3, 'first_name' => 'Mohamed', 'last_name' => 'Ali', 'matricule' => 'STU003'],
                ]
            ],
            [
                'id' => 2,
                'name' => 'Groupe 2',
                'students' => [
                    ['id' => 4, 'first_name' => 'Sara', 'last_name' => 'Ahmed', 'matricule' => 'STU004'],
                    ['id' => 5, 'first_name' => 'Omar', 'last_name' => 'Hassan', 'matricule' => 'STU005'],
                ]
            ],
            [
                'id' => 3,
                'name' => 'Groupe 3',
                'students' => [
                    ['id' => 6, 'first_name' => 'Leila', 'last_name' => 'Khaled', 'matricule' => 'STU006'],
                    ['id' => 7, 'first_name' => 'Youssef', 'last_name' => 'Mansour', 'matricule' => 'STU007'],
                ]
            ]
        ];

        $modules = [
            ['id' => 1, 'module_name' => 'Algorithmique', 'code' => 'ALG101'],
            ['id' => 2, 'module_name' => 'Bases de Données', 'code' => 'BD101'],
            ['id' => 3, 'module_name' => 'Réseaux', 'code' => 'RES101'],
            ['id' => 4, 'module_name' => 'Programmation Web', 'code' => 'WEB101'],
            ['id' => 5, 'module_name' => 'Intelligence Artificielle', 'code' => 'IA101'],
            ['id' => 6, 'module_name' => 'Systèmes d\'Exploitation', 'code' => 'SE101'],
        ];

        $teachers = [
            [
                'id' => 1,
                'first_name' => 'Dr. Omar',
                'last_name' => 'Hassan',
                'department' => 'Informatique',
                'speciality' => 'IA',
                'grade' => 'Professeur',
                'is_responsable' => true,
                'modules' => [['id' => 1, 'module_name' => 'Algorithmique'], ['id' => 2, 'module_name' => 'Bases de Données']]
            ],
            [
                'id' => 2,
                'first_name' => 'Dr. Fatima',
                'last_name' => 'Zahra',
                'department' => 'Informatique',
                'speciality' => 'Réseaux',
                'grade' => 'Professeur',
                'is_responsable' => false,
                'modules' => [['id' => 3, 'module_name' => 'Réseaux']]
            ],
            [
                'id' => 3,
                'first_name' => 'Dr. Mohamed',
                'last_name' => 'Ali',
                'department' => 'Informatique',
                'speciality' => 'Web',
                'grade' => 'Maître Assistant',
                'is_responsable' => false,
                'modules' => [['id' => 4, 'module_name' => 'Programmation Web']]
            ]
        ];

        // Mock schedule data
        $schedule = [
            'Lundi' => [
                '08:00-09:30' => [
                    1 => [
                        'id' => 1,
                        'exam_type' => 'Final',
                        'module_name' => 'Algorithmique',
                        'teacher_name' => 'Dr. Omar Hassan',
                        'room_name' => 'Salle A101'
                    ]
                ],
                '09:30-11:00' => [
                    3 => [
                        'id' => 2,
                        'exam_type' => 'Midterm',
                        'module_name' => 'Réseaux',
                        'teacher_name' => 'Dr. Fatima Zahra',
                        'room_name' => 'Salle B201'
                    ]
                ]
            ],
            'Mardi' => [
                '14:00-15:30' => [
                    2 => [
                        'id' => 3,
                        'exam_type' => 'Final',
                        'module_name' => 'Bases de Données',
                        'teacher_name' => 'Dr. Omar Hassan',
                        'room_name' => 'Salle C301'
                    ]
                ]
            ],
            'Mercredi' => [
                '10:00-11:30' => [
                    4 => [
                        'id' => 4,
                        'exam_type' => 'Quiz',
                        'module_name' => 'Programmation Web',
                        'teacher_name' => 'Dr. Mohamed Ali',
                        'room_name' => 'Salle D101'
                    ]
                ]
            ],
            'Jeudi' => [
                '15:30-17:00' => [
                    5 => [
                        'id' => 5,
                        'exam_type' => 'Practical',
                        'module_name' => 'Intelligence Artificielle',
                        'teacher_name' => 'Dr. Omar Hassan',
                        'room_name' => 'Salle A102'
                    ]
                ]
            ],
            'Vendredi' => [
                '11:00-12:30' => [
                    6 => [
                        'id' => 6,
                        'exam_type' => 'Oral',
                        'module_name' => 'Systèmes d\'Exploitation',
                        'teacher_name' => 'Dr. Fatima Zahra',
                        'room_name' => 'Salle B202'
                    ]
                ]
            ],
            'Samedi' => []
        ];

        return Inertia::render('HeadDepartment/FacultySchedule', [
            'faculty' => $faculty,
            'speciality' => $speciality,
            'schedule' => $schedule,
            'groups' => $groups,
            'modules' => $modules,
            'teachers' => $teachers,
        ]);
    }

    /**
     * Build schedule data from exam plans.
     */
    private function buildSchedule($faculty, $speciality): array
    {
        $days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        $timeSlots = [
            '08:00-09:30',
            '09:30-11:00',
            '11:00-12:30',
            '12:30-14:00',
            '14:00-15:30',
            '15:30-17:00',
            '17:00-18:30'
        ];

        $schedule = [];

        // Get exam plans for this faculty and speciality
        $examPlans = ExamPlan::with(['group', 'module', 'teacher', 'room'])
            ->whereHas('group', function($query) use ($faculty, $speciality) {
                $query->whereHas('level', function($q) use ($faculty) {
                    $q->where('name', $faculty);
                })->whereHas('speciality', function($q) use ($speciality) {
                    $q->where('name', $speciality);
                });
            })
            ->where('status', 'scheduled')
            ->get();

        foreach ($days as $day) {
            $schedule[$day] = [];
            
            foreach ($timeSlots as $timeSlot) {
                $schedule[$day][$timeSlot] = [];
                
                // Find exams for this day and time slot
                $dayExams = $examPlans->filter(function ($examPlan) use ($day, $timeSlot) {
                    $examDay = $examPlan->exam_date->format('l');
                    $startTime = $examPlan->start_time->format('H:i');
                    
                    // Check if exam falls within this time slot
                    if ($examDay !== $day) return false;
                    
                    // Simple time slot matching (can be improved)
                    if ($timeSlot === '08:00-09:30' && $startTime >= '08:00' && $startTime < '09:30') return true;
                    if ($timeSlot === '09:30-11:00' && $startTime >= '09:30' && $startTime < '11:00') return true;
                    if ($timeSlot === '11:00-12:30' && $startTime >= '11:00' && $startTime < '12:30') return true;
                    if ($timeSlot === '12:30-14:00' && $startTime >= '12:30' && $startTime < '14:00') return true;
                    if ($timeSlot === '14:00-15:30' && $startTime >= '14:00' && $startTime < '15:30') return true;
                    if ($timeSlot === '15:30-17:00' && $startTime >= '15:30' && $startTime < '17:00') return true;
                    if ($timeSlot === '17:00-18:30' && $startTime >= '17:00' && $startTime < '18:30') return true;
                    
                    return false;
                });

                // Add exams to the schedule
                foreach ($dayExams as $exam) {
                    $schedule[$day][$timeSlot][$exam->module_id] = [
                        'id' => $exam->id,
                        'exam_type' => $exam->exam_type,
                        'module_name' => $exam->module->module_name,
                        'teacher_name' => $exam->teacher ? $exam->teacher->first_name . ' ' . $exam->teacher->last_name : 'Not Assigned',
                        'room_name' => $exam->room ? $exam->room->name : 'Not Assigned',
                    ];
                }
            }
        }

        return $schedule;
    }
}
