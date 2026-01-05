<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\TeacherRequest;
use App\Models\Module;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RequestController extends Controller
{
    public function __construct()
    {
        $this->middleware(function ($request, $next) {
            if (auth()->check() && auth()->user()->role !== 'teacher') {
                abort(403); 
            }
            return $next($request); 
        });
    }

    /**
     * Display teacher's requests.
     */
    public function index()
    {
        $teacher = auth()->user()->teacher;
        
        $requests = TeacherRequest::with(['module'])
            ->where('teacher_id', $teacher->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'type' => $request->type,
                    'title' => $request->title,
                    'description' => $request->description,
                    'date' => $request->date,
                    'time' => $request->time,
                    'room' => $request->room,
                    'urgency' => $request->urgency,
                    'status' => $request->status,
                    'admin_notes' => $request->admin_notes,
                    'processed_at' => $request->processed_at ? $request->processed_at->format('Y-m-d H:i:s') : null,
                    'created_at' => $request->created_at->format('Y-m-d H:i:s'),
                    'module_name' => $request->module ? $request->module->module_name : 'N/A',
                ];
            });

        return Inertia::render('Teacher/Requests/Index', [
            'requests' => $requests,
        ]);
    }

    /**
     * Show the form for creating a new request.
     */
    public function create()
    {
        $teacher = auth()->user()->teacher;
        
        // Get modules assigned to this teacher
        $modules = Module::where('teacher_id', $teacher->id)
            ->orderBy('module_name')
            ->get();

        return Inertia::render('Teacher/Requests/Create', [
            'modules' => $modules,
        ]);
    }

    /**
     * Store a newly created request in storage.
     */
    public function store(Request $request)
    {
        $teacher = auth()->user()->teacher;

        $validated = $request->validate([
            'type' => 'required|string|in:absence,room_change,time_change,exam_change,material_request,other',
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'date' => 'nullable|date',
            'time' => 'nullable|date_format:H:i',
            'room' => 'nullable|string|max:100',
            'urgency' => 'required|string|in:low,normal,high',
            'module_id' => 'nullable|exists:modules,id',
        ]);

        TeacherRequest::create([
            'teacher_id' => $teacher->id,
            'type' => $validated['type'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'date' => $validated['date'],
            'time' => $validated['time'],
            'room' => $validated['room'],
            'urgency' => $validated['urgency'],
            'module_id' => $validated['module_id'],
            'status' => 'pending',
        ]);

        return redirect()->route('teacher.requests.index')
            ->with('success', 'Request submitted successfully. The administration will review it.');
    }

    /**
     * Display the specified request.
     */
    public function show($id)
    {
        $teacher = auth()->user()->teacher;
        
        $request = TeacherRequest::with(['module', 'teacher.user'])
            ->where('teacher_id', $teacher->id)
            ->findOrFail($id);

        return Inertia::render('Teacher/Requests/Show', [
            'request' => [
                'id' => $request->id,
                'type' => $request->type,
                'title' => $request->title,
                'description' => $request->description,
                'date' => $request->date,
                'time' => $request->time,
                'room' => $request->room,
                'urgency' => $request->urgency,
                'status' => $request->status,
                'admin_notes' => $request->admin_notes,
                'processed_at' => $request->processed_at ? $request->processed_at->format('Y-m-d H:i:s') : null,
                'created_at' => $request->created_at->format('Y-m-d H:i:s'),
                'module' => $request->module,
                'teacher' => $request->teacher,
            ],
        ]);
    }
}
