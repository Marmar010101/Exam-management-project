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

        // Get groups for this faculty and speciality
        $groups = Group::with(['students'])
            ->whereHas('level', function($query) use ($faculty) {
                $query->where('name', $faculty);
            })
            ->whereHas('speciality', function($query) use ($speciality) {
                $query->where('name', $speciality);
            })
            ->get()
            ->map(function ($group) {
                return [
                    'id' => $group->id,
                    'name' => $group->name,
                    'students' => $group->students->map(function ($student) {
                        return [
                            'id' => $student->id,
                            'first_name' => $student->first_name,
                            'last_name' => $student->last_name,
                            'matricule' => $student->matricule,
                        ];
                    }),
                ];
            });

        // Get modules for this faculty and speciality
        $modules = Module::whereHas('level', function($query) use ($faculty) {
                $query->where('name', $faculty);
            })
            ->whereHas('speciality', function($query) use ($speciality) {
                $query->where('name', $speciality);
            })
            ->get()
            ->map(function ($module) {
                return [
                    'id' => $module->id,
                    'module_name' => $module->module_name,
                    'code' => $module->code,
                ];
            });

        // Get teachers with their modules
        $teachers = Teacher::with(['user'])
            ->whereHas('modules', function($query) use ($modules) {
                $moduleIds = $modules->pluck('id')->toArray();
                $query->whereIn('modules.id', $moduleIds);
            })
            ->get()
            ->map(function ($teacher) use ($modules) {
                // Get teacher's modules
                $teacherModules = $teacher->modules()
                    ->whereIn('modules.id', $modules->pluck('id'))
                    ->get()
                    ->map(function ($module) {
                        return [
                            'id' => $module->id,
                            'module_name' => $module->module_name,
                        ];
                    });

                return [
                    'id' => $teacher->id,
                    'first_name' => $teacher->user->first_name,
                    'last_name' => $teacher->user->last_name,
                    'department' => $teacher->department,
                    'speciality' => $teacher->speciality,
                    'grade' => $teacher->grade,
                    'is_responsable' => $teacher->is_responsable,
                    'modules' => $teacherModules,
                ];
            });

        // Build schedule from exam plans
        $schedule = $this->buildSchedule($faculty, $speciality);

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
