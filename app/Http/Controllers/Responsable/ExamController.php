<?php

namespace App\Http\Controllers\Responsable;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Exam;
use App\Models\Group;
use App\Models\Module;
use App\Models\Room;
use App\Models\Teacher;

class ExamController extends Controller
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

    public function index()
    {
        $exams = Exam::with(['module', 'group', 'teacher'])
            ->orderBy('exame_date', 'desc')
            ->orderBy('exame_time', 'desc')
            ->get()
            ->map(function ($exam) {
                return [
                    'id' => $exam->id,
                    'module_name' => $exam->module->name ?? 'Unknown',
                    'group_name' => $exam->group->name ?? 'Unknown',
                    'teacher_name' => $exam->teacher->first_name . ' ' . $exam->teacher->last_name ?? 'Unknown',
                    'exam_date' => $exam->exame_date,
                    'exam_time' => $exam->exame_time,
                    'exam_type' => $exam->exam_type,
                    'is_upcoming' => $exam->exame_date >= now(),
                    'is_past' => $exam->exame_date < now(),
                    'is_today' => $exam->exame_date->format('Y-m-d') === now()->format('Y-m-d'),
                ];
            });

        $stats = [
            'total' => $exams->count(),
            'upcoming' => $exams->where('is_upcoming', true)->count(),
            'past' => $exams->where('is_past', true)->count(),
            'today' => $exams->where('is_today', true)->count(),
        ];

        return Inertia::render('Responsable/Exams/Index', [
            'exams' => $exams,
            'stats' => $stats,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function create()
    {
        $groups = Group::with(['level', 'speciality'])->get();
        $modules = Module::all();
        $rooms = Room::all();
        $teachers = Teacher::all();

        return Inertia::render('Responsable/Exams/Create', [
            'groups' => $groups,
            'modules' => $modules,
            'rooms' => $rooms,
            'teachers' => $teachers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'module_id' => 'required|exists:modules,id',
            'group_id' => 'required|exists:groups,id',
            'teacher_id' => 'required|exists:teachers,id',
            'room_id' => 'required|exists:rooms,id',
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'type' => 'required|in:normal,rattrapage',
            'description' => 'nullable|string',
        ]);

        $validated['duration'] = \Carbon\Carbon::parse($validated['start_time'])
            ->diffInMinutes(\Carbon\Carbon::parse($validated['end_time']));
        $validated['status'] = 'scheduled';

        Exam::create($validated);

        return redirect()->route('responsable.exams')
            ->with('success', 'Exam scheduled successfully!');
    }

    public function show(Exam $exam)
    {
        $exam->load(['module', 'group', 'teacher', 'room', 'students']);

        return Inertia::render('Responsable/Exams/Show', [
            'exam' => $exam,
        ]);
    }

    public function edit(Exam $exam)
    {
        $exam->load(['module', 'group', 'teacher', 'room']);
        
        $groups = Group::with(['level', 'speciality'])->get();
        $modules = Module::all();
        $rooms = Room::all();
        $teachers = Teacher::all();

        return Inertia::render('Responsable/Exams/Edit', [
            'exam' => $exam,
            'groups' => $groups,
            'modules' => $modules,
            'rooms' => $rooms,
            'teachers' => $teachers,
        ]);
    }

    public function update(Request $request, Exam $exam)
    {
        $validated = $request->validate([
            'module_id' => 'required|exists:modules,id',
            'group_id' => 'required|exists:groups,id',
            'teacher_id' => 'required|exists:teachers,id',
            'room_id' => 'required|exists:rooms,id',
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'type' => 'required|in:normal,rattrapage',
            'description' => 'nullable|string',
        ]);

        $validated['duration'] = \Carbon\Carbon::parse($validated['start_time'])
            ->diffInMinutes(\Carbon\Carbon::parse($validated['end_time']));

        $exam->update($validated);

        return redirect()->route('responsable.exams')
            ->with('success', 'Exam updated successfully!');
    }

    public function destroy(Exam $exam)
    {
        $exam->delete();

        return redirect()->route('responsable.exams')
            ->with('success', 'Exam deleted successfully!');
    }
}
