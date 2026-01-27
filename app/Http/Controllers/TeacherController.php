<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function __construct()
    {
        // Temporarily remove strict role checking for debugging
        $this->middleware(function ($request, $next) {
            // Allow access if user is authenticated
            if (auth()->check()) {
                return $next($request);
            }
            // If not authenticated, let Laravel handle it
            return $next($request);
        });
    }

    public function index()
    {
        try {
            $user = auth()->user();
            return Inertia::render('Teacher/Dashboard', [
                'auth' => [
                    'user' => $user
                ],
                'stats' => [
                    'totalModules' => 4,
                    'totalSurveillances' => 6,
                    'upcomingExams' => 3,
                    'attendanceRate' => 87
                ],
                'recentAlerts' => [],
                'upcomingExams' => []
            ]);
        } catch (\Exception $e) {
            \Log::error('Teacher Dashboard Error: ' . $e->getMessage());
            return Inertia::render('Teacher/Dashboard', [
                'auth' => [
                    'user' => auth()->user()
                ],
                'stats' => [],
                'recentAlerts' => [],
                'upcomingExams' => []
            ]);
        }
    }

    public function supervision()
    {
        return Inertia::render('Teacher/ExamSupervision', [
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function modules()
    {
        $user = auth()->user();
        \Log::info('Teacher modules - User:', ['user_id' => $user->id, 'role' => $user->role]);
        
        $teacher = $user->teacher;
        \Log::info('Teacher modules - Teacher relationship:', ['teacher_exists' => $teacher ? 'Yes' : 'No']);
        
        // Check if user has teacher relationship
        if (!$teacher) {
            \Log::warning('Teacher modules - No teacher relationship found for user:', ['user_id' => $user->id]);
            return Inertia::render('Teacher/modules', [
                'auth' => [
                    'user' => $user
                ],
                'modules' => collect([]),
                'exams' => collect([])
            ]);
        }
        
        \Log::info('Teacher modules - Teacher ID:', ['teacher_id' => $teacher->id]);
        
        // Get modules assigned to this teacher
        $modules = \App\Models\Module::whereHas('teachers', function($query) use ($teacher) {
            $query->where('teachers.id', $teacher->id);
        })->with(['specialty', 'level'])->get();
        
        \Log::info('Teacher modules - Modules found:', ['count' => $modules->count()]);
        
        // Get exams for this teacher's modules
        $exams = \App\Models\Exam::whereHas('module', function($query) use ($teacher) {
            $query->whereHas('teachers', function($subQuery) use ($teacher) {
                $subQuery->where('teachers.id', $teacher->id);
            });
        })->with(['module', 'group', 'room'])->get();
        
        \Log::info('Teacher modules - Exams found:', ['count' => $exams->count()]);
        
        return Inertia::render('Teacher/modules', [
            'auth' => [
                'user' => $user
            ],
            'modules' => $modules,
            'exams' => $exams
        ]);
    }

    /**
     * Store a new teacher request.
     */
    public function storeRequest(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:delay_exam,delay_test,absence,cancel_exam,cancel_test',
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            'urgency' => 'required|in:low,normal,high',
            'new_date' => 'nullable|date',
            'justification_file' => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:5120'
        ]);

        // Handle file upload
        $filePath = null;
        if ($request->hasFile('justification_file')) {
            $file = $request->file('justification_file');
            $filePath = $file->store('justifications', 'public');
        }

        // Save request to database
        $userId = auth()->user() ? auth()->user()->id : 7; // ID de kamel.amrani@usto.dz
        
        $teacherRequest = \App\Models\TeacherRequest::create([
            'user_id' => $userId,
            'type' => $validated['type'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'urgency' => $validated['urgency'],
            'new_date' => $validated['new_date'],
            'justification_file' => $filePath,
            'status' => 'pending',
            'created_at' => now()
        ]);

        // Get responsable users to notify
        $responsableUsers = \App\Models\User::where('role', 'responsable')->get();
        
        // Create notification for each responsable
        foreach ($responsableUsers as $responsable) {
            \App\Models\Notification::create([
                'user_id' => $responsable->id,
                'title' => 'New Teacher Request',
                'message' => 'A new teacher request is waiting for your approval: ' . $validated['title'],
                'type' => 'teacher_request',
                'data' => json_encode([
                    'request_id' => $teacherRequest->id,
                    'request_type' => $validated['type'],
                    'teacher_name' => auth()->user()->first_name . ' ' . auth()->user()->last_name,
                    'urgency' => $validated['urgency']
                ]),
                'read' => false,
                'created_at' => now()
            ]);
        }
        
        \Log::info('New teacher request saved', [
            'request_id' => $teacherRequest->id,
            'type' => $validated['type'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'urgency' => $validated['urgency'],
            'new_date' => $validated['new_date'],
            'justification_file' => $filePath,
            'user_id' => auth()->id(),
            'notifications_sent' => $responsableUsers->count(),
            'created_at' => now()
        ]);

        return redirect()->back()
            ->with('success', 'Request submitted successfully. It will be reviewed by the responsible administrator.');
    }

    public function requestsAlerts()
    {
        // Get teacher's data
        $teacher = auth()->user();
        
        // Debug: Forcer l'ID de l'utilisateur connecté
        $userId = auth()->user() ? auth()->user()->id : 7; // ID de kamel.amrani@usto.dz
        
        // Get real requests from database (or create if none exist)
        $requests = \App\Models\TeacherRequest::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($request) {
                return [
                    'id' => $request->id,
                    'type' => $request->type,
                    'title' => $request->title,
                    'description' => $request->description,
                    'status' => $request->status,
                    'urgency' => $request->urgency,
                    'date' => $request->created_at->format('Y-m-d'),
                    'response_date' => $request->processed_at ? $request->processed_at->format('Y-m-d') : null
                ];
            });
        
        // If no requests exist, create sample data for testing
        if ($requests->isEmpty()) {
            $requests = [
                [
                    'id' => 1,
                    'type' => 'delay_exam',
                    'title' => 'Delay Math Exam',
                    'description' => 'Need to delay due to illness',
                    'status' => 'pending',
                    'urgency' => 'high',
                    'date' => now()->format('Y-m-d'),
                    'response_date' => null
                ]
            ];
        }
        
        // Mock data for modules
        $modules = [
            [
                'id' => 1,
                'name' => 'Mathematics',
                'code' => 'MATH101',
                'speciality' => 'Computer Science'
            ]
        ];
        
        // Mock data for exams
        $exams = [
            [
                'id' => 1,
                'module' => 'Mathematics',
                'type' => 'normal',
                'date' => now()->addDays(7)->format('Y-m-d'),
                'duration' => '2 hours',
                'group' => 'L1-SI'
            ]
        ];
        
        // Mock data for surveillances
        $surveillances = [
            [
                'id' => 1,
                'module' => 'Physics',
                'module_id' => 2,
                'group' => 'L2-SI',
                'date' => now()->addDays(3)->format('Y-m-d'),
                'time' => '09:00',
                'room' => 'A101',
                'urgency' => 'normal'
            ]
        ];
        
        // Mock data for alerts
        $alerts = [
            [
                'id' => 1,
                'type' => 'info',
                'title' => 'Exam Schedule Updated',
                'message' => 'Please check the updated exam schedule for next week.',
                'created_at' => now()->format('Y-m-d H:i:s')
            ]
        ];

        return Inertia::render('Teacher/requests_alerts', [
            'requests' => $requests,
            'modules' => $modules,
            'exams' => $exams,
            'surveillances' => $surveillances,
            'alerts' => $alerts,
            'user' => auth()->user(),
            'csrf_token' => csrf_token(),
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }
}
