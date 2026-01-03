<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invigilation Schedule - {{ date('Y-m-d') }}</title>
    <style>
        @page { margin: 20px; }
        body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; }
        .header h1 { margin: 0; color: #4f46e5; font-size: 24px; }
        .header p { margin: 5px 0; color: #666; }
        .header h2 { color: #666; margin: 0; font-size: 16px; }
        .filters { margin-bottom: 15px; padding: 10px; background: #f3f4f6; border-radius: 5px; font-size: 11px; }
        .filter-row { margin-bottom: 5px; }
        .filter-label { font-weight: bold; color: #4f46e5; display: inline-block; width: 100px; }
        .exam-card { border: 1px solid #e5e7eb; margin-bottom: 15px; padding: 15px; border-radius: 5px; page-break-inside: avoid; }
        .exam-header { background: #4f46e5; color: white; padding: 10px; margin: -15px -15px 15px -15px; border-radius: 5px 5px 0 0; }
        .invigilator-list { margin-top: 10px; }
        .invigilator { display: inline-block; background: #dbeafe; padding: 5px 10px; margin: 0 5px 5px 0; border-radius: 3px; font-size: 10px; }
        .main-invigilator { background: #dcfce7; }
        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 10px; border-top: 1px solid #e5e7eb; padding-top: 10px; }
        .no-data { text-align: center; color: #666; padding: 40px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background: #4f46e5; color: white; padding: 8px; text-align: left; font-size: 11px; }
        td { padding: 8px; border: 1px solid #e5e7eb; font-size: 10px; }
        tr:nth-child(even) { background: #f9fafb; }
        .summary-stats { margin: 15px 0; padding: 10px; background: #f0f9ff; border-radius: 5px; display: flex; gap: 20px; font-size: 11px; }
        .stat-item { display: flex; flex-direction: column; }
        .stat-value { font-weight: bold; font-size: 14px; color: #4f46e5; }
        .exam-type { display: inline-block; padding: 2px 6px; border-radius: 3px; font-size: 9px; color: white; }
        .date-section { margin-bottom: 20px; page-break-inside: avoid; }
        .date-header { background: #e0e7ff; padding: 8px; border-radius: 5px; margin-bottom: 10px; }
        .page-break { page-break-before: always; }
        .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 10px 0; }
        .info-item { background: #f9fafb; padding: 6px; border-radius: 3px; }
        .info-label { font-weight: bold; color: #4f46e5; font-size: 9px; }
        .info-value { font-size: 10px; }
        .signature-section { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
        .signature-line { width: 250px; border-top: 1px solid #000; margin: 20px auto 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📋 Invigilation Schedule Report</h1>
        <h2>Teacher Assignment & Examination Details</h2>
        <p>Generated on: {{ date('F j, Y - H:i') }}</p>
    </div>

    <!-- Filters Section -->
    @if(!empty($filters) && count(array_filter($filters)) > 0)
    <div class="filters">
        <h3 style="margin: 0 0 8px 0; color: #4f46e5; font-size: 12px;">Applied Filters:</h3>
        <div class="info-grid">
            @if(!empty($filters['group_id']))
            <div class="info-item">
                <div class="info-label">Group:</div>
                <div class="info-value">{{ \App\Models\Group::find($filters['group_id'])->name ?? 'N/A' }}</div>
            </div>
            @endif
            @if(!empty($filters['teacher_id']))
            <div class="info-item">
                <div class="info-label">Teacher:</div>
                <div class="info-value">{{ \App\Models\Teacher::find($filters['teacher_id'])->first_name ?? 'N/A' }} {{ \App\Models\Teacher::find($filters['teacher_id'])->last_name ?? '' }}</div>
            </div>
            @endif
            @if(!empty($filters['room_id']))
            <div class="info-item">
                <div class="info-label">Room:</div>
                <div class="info-value">{{ \App\Models\Room::find($filters['room_id'])->name ?? 'N/A' }}</div>
            </div>
            @endif
            @if(!empty($filters['exam_type']))
            <div class="info-item">
                <div class="info-label">Exam Type:</div>
                <div class="info-value">{{ $filters['exam_type'] }}</div>
            </div>
            @endif
            @if(!empty($filters['date']))
            <div class="info-item">
                <div class="info-label">Date:</div>
                <div class="info-value">{{ $filters['date'] }}</div>
            </div>
            @endif
            @if(!empty($filters['start_date']) || !empty($filters['end_date']))
            <div class="info-item" style="grid-column: span 2;">
                <div class="info-label">Date Range:</div>
                <div class="info-value">
                    {{ $filters['start_date'] ?? 'Start' }} to {{ $filters['end_date'] ?? 'End' }}
                </div>
            </div>
            @endif
        </div>
    </div>
    @endif

    <!-- Summary Statistics -->
    @if($exams->isNotEmpty())
    <div class="summary-stats">
        <div class="stat-item">
            <span>Total Exams</span>
            <span class="stat-value">{{ $exams->count() }}</span>
        </div>
        <div class="stat-item">
            <span>Total Invigilators</span>
            <span class="stat-value">
                @php
                    $invigilatorCount = 0;
                    foreach ($exams as $exam) {
                        $invigilatorCount += $exam->invigilationSchedules->count();
                    }
                    echo $invigilatorCount;
                @endphp
            </span>
        </div>
        <div class="stat-item">
            <span>Date Range</span>
            <span class="stat-value">
                {{ \Carbon\Carbon::parse($exams->min('exam_date'))->format('M d') }} - 
                {{ \Carbon\Carbon::parse($exams->max('exam_date'))->format('M d, Y') }}
            </span>
        </div>
        <div class="stat-item">
            <span>Unique Teachers</span>
            <span class="stat-value">
                @php
                    $teacherIds = [];
                    foreach ($exams as $exam) {
                        foreach ($exam->invigilationSchedules as $schedule) {
                            $teacherIds[$schedule->teacher_id] = true;
                        }
                    }
                    echo count($teacherIds);
                @endphp
            </span>
        </div>
    </div>
    @endif

    @if($exams->isEmpty())
        <div class="no-data">
            <h3>No invigilation schedules found</h3>
            <p>No exams with assigned invigilators match the selected filters.</p>
        </div>
    @else
        <!-- Summary Table -->
        <h3 style="color: #4f46e5; margin: 20px 0 10px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">
            📊 Invigilation Summary
        </h3>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Module</th>
                    <th>Group</th>
                    <th>Type</th>
                    <th>Room(s)</th>
                    <th>Duration</th>
                    <th>Invigilators</th>
                </tr>
            </thead>
            <tbody>
                @foreach($exams->sortBy('exam_date')->sortBy('exam_time') as $exam)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($exam->exam_date)->format('M d, Y') }}</td>
                    <td>{{ \Carbon\Carbon::parse($exam->exam_time)->format('h:i A') }}</td>
                    <td>{{ $exam->module->module_name ?? 'N/A' }}</td>
                    <td>{{ $exam->group->name ?? 'N/A' }}</td>
                    <td>
                        <span class="exam-type" style="background: {{ 
                            $exam->exam_type === 'Continuous assessment' ? '#10B981' : 
                            ($exam->exam_type === 'Final exam' ? '#3B82F6' : 
                            ($exam->exam_type === 'Make-up exam' ? '#F59E0B' : 
                            ($exam->exam_type === 'Replacement exam' ? '#EF4444' : '#8B5CF6'))) 
                        }};">
                            {{ $exam->exam_type }}
                        </span>
                    </td>
                    <td>
                        @foreach($exam->rooms as $room)
                            {{ $room->name ?? $room->room_name ?? 'N/A' }}@if(!$loop->last), @endif
                        @endforeach
                    </td>
                    <td>{{ $exam->duration }} minutes</td>
                    <td>
                        @if($exam->invigilationSchedules->isNotEmpty())
                            @foreach($exam->invigilationSchedules as $schedule)
                                {{ $schedule->teacher->first_name ?? '' }} {{ $schedule->teacher->last_name ?? '' }}
                                @if(!$loop->last), @endif
                            @endforeach
                        @else
                            <span style="color: #ef4444; font-style: italic;">No invigilators</span>
                        @endif
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Detailed View -->
        <div class="page-break"></div>
        <h3 style="color: #4f46e5; margin: 20px 0 10px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">
            📅 Detailed Invigilation Schedule
        </h3>
        
        @foreach($exams->groupBy('exam_date') as $date => $examsOnDate)
            <div class="date-section">
                <div class="date-header">
                    <h4 style="margin: 0; color: #4f46e5;">
                        📅 {{ \Carbon\Carbon::parse($date)->format('l, F j, Y') }}
                        <span style="font-size: 11px; color: #666; margin-left: 10px;">
                            ({{ $examsOnDate->count() }} exams)
                        </span>
                    </h4>
                </div>
                
                @foreach($examsOnDate->sortBy('exam_time') as $exam)
                <div class="exam-card">
                    <div class="exam-header">
                        <strong>{{ $exam->module->module_name ?? 'N/A' }}</strong>
                        • {{ \Carbon\Carbon::parse($exam->exam_time)->format('h:i A') }}
                        • {{ $exam->duration }} minutes
                        <span style="float: right; font-size: 10px; background: rgba(255,255,255,0.2); padding: 2px 6px; border-radius: 3px;">
                            {{ $exam->exam_type }}
                        </span>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 10px;">
                        <div>
                            <strong>Group:</strong>
                            <div>{{ $exam->group->name ?? 'N/A' }}</div>
                        </div>
                        <div>
                            <strong>Rooms:</strong>
                            <div>
                                @foreach($exam->rooms as $room)
                                    <span style="background: #e5e7eb; padding: 2px 6px; border-radius: 3px; margin-right: 5px; font-size: 9px;">
                                        {{ $room->name ?? $room->room_name ?? 'N/A' }}
                                        @if($room->capacity)
                                            ({{ $room->capacity }} seats)
                                        @endif
                                    </span>
                                @endforeach
                            </div>
                        </div>
                        <div>
                            <strong>Session:</strong>
                            <div>{{ $exam->session_name ?? 'Regular Session' }}</div>
                        </div>
                    </div>
                    
                    @if($exam->invigilationSchedules->isNotEmpty())
                    <div class="invigilator-list">
                        <strong style="display: block; margin-bottom: 5px; color: #4f46e5;">Assigned Invigilators:</strong>
                        @foreach($exam->invigilationSchedules as $schedule)
                            <div class="invigilator {{ $schedule->role === 'main' ? 'main-invigilator' : '' }}" 
                                 style="margin-top: 5px; padding: 5px; border-radius: 3px;">
                                <div style="font-weight: bold; font-size: 11px;">
                                    👤 {{ $schedule->teacher->first_name ?? '' }} {{ $schedule->teacher->last_name ?? '' }}
                                    <span style="font-size: 9px; color: #666; margin-left: 5px;">
                                        ({{ ucfirst($schedule->role) }} Invigilator)
                                    </span>
                                </div>
                                @if($schedule->teacher->grade)
                                    <div style="font-size: 9px; color: #666;">
                                        Grade: {{ $schedule->teacher->grade }}
                                    </div>
                                @endif
                                @if($schedule->notes)
                                    <div style="font-size: 9px; color: #666; margin-top: 2px;">
                                        <strong>Note:</strong> {{ $schedule->notes }}
                                    </div>
                                @endif
                                <div style="font-size: 9px; color: #666; margin-top: 2px;">
                                    <strong>Arrival Time:</strong> 30 minutes before exam starts
                                </div>
                            </div>
                        @endforeach
                    </div>
                    @else
                    <div style="color: #ef4444; font-style: italic; padding: 10px; background: #fef2f2; border-radius: 3px;">
                        ⚠️ No invigilators assigned to this exam
                    </div>
                    @endif
                    
                    <!-- Exam Instructions -->
                    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #e5e7eb;">
                        <strong style="font-size: 10px; color: #4f46e5;">Invigilation Instructions:</strong>
                        <ul style="font-size: 9px; color: #666; margin: 5px 0 0 15px; padding: 0;">
                            <li>Arrive 30 minutes before scheduled start time</li>
                            <li>Verify student identification and seating</li>
                            <li>Monitor examination throughout duration</li>
                            <li>Report any irregularities immediately</li>
                        </ul>
                    </div>
                </div>
                @endforeach
            </div>
        @endforeach

        <!-- Teacher Assignments Summary -->
        <div class="page-break"></div>
        <h3 style="color: #4f46e5; margin: 20px 0 10px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">
            👥 Teacher Assignment Summary
        </h3>
        
        @php
            $teacherAssignments = [];
            foreach ($exams as $exam) {
                foreach ($exam->invigilationSchedules as $schedule) {
                    $teacherId = $schedule->teacher_id;
                    if (!isset($teacherAssignments[$teacherId])) {
                        $teacherAssignments[$teacherId] = [
                            'teacher' => $schedule->teacher,
                            'exams' => [],
                            'count' => 0
                        ];
                    }
                    $teacherAssignments[$teacherId]['exams'][] = $exam;
                    $teacherAssignments[$teacherId]['count']++;
                }
            }
        @endphp
        
        <table>
            <thead>
                <tr>
                    <th>Teacher</th>
                    <th>Grade</th>
                    <th>Total Assignments</th>
                    <th>Exam Dates</th>
                    <th>Modules</th>
                </tr>
            </thead>
            <tbody>
                @foreach($teacherAssignments as $assignment)
                <tr>
                    <td>
                        {{ $assignment['teacher']->first_name ?? '' }} {{ $assignment['teacher']->last_name ?? '' }}
                    </td>
                    <td>{{ $assignment['teacher']->grade ?? 'N/A' }}</td>
                    <td style="text-align: center;">
                        <span style="background: #4f46e5; color: white; padding: 2px 8px; border-radius: 10px; font-weight: bold;">
                            {{ $assignment['count'] }}
                        </span>
                    </td>
                    <td>
                        @php
                            $dates = collect($assignment['exams'])->pluck('exam_date')->unique()->sort()->map(function($date) {
                                return \Carbon\Carbon::parse($date)->format('M d');
                            })->implode(', ');
                        @endphp
                        {{ $dates }}
                    </td>
                    <td>
                        @php
                            $modules = collect($assignment['exams'])->pluck('module.module_name')->filter()->unique()->implode(', ');
                        @endphp
                        {{ $modules ?: 'Various' }}
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Signature Section -->
        <div class="signature-section">
            <p><strong>Instructions for Invigilators:</strong></p>
            <ol style="margin-left: 20px; font-size: 10px; line-height: 1.6;">
                <li>Arrive at the examination room 30 minutes before the scheduled start time</li>
                <li>Verify student identification and seating arrangements according to the seating plan</li>
                <li>Distribute examination papers and materials according to provided instructions</li>
                <li>Monitor the examination throughout its duration, maintaining a quiet and orderly environment</li>
                <li>Collect all examination materials, scripts, and question papers at the end of the examination</li>
                <li>Report any irregularities, incidents, or suspected malpractice immediately to the examination office</li>
                <li>Ensure all mobile phones and unauthorized materials are stored away from students</li>
                <li>Complete and submit the invigilation report form after each examination</li>
            </ol>
            
            <div style="margin-top: 30px;">
                <div class="signature-line"></div>
                <p style="text-align: center; font-size: 11px;">Signature of Head of Examinations</p>
            </div>
            
            <div style="margin-top: 20px;">
                <div class="signature-line"></div>
                <p style="text-align: center; font-size: 11px;">Signature of Department Head</p>
            </div>
        </div>
    @endif

    <div class="footer">
        <p>Invigilation Schedule Report • Generated by Exam Planning System • Page {PAGENO} of {nbpg}</p>
        <p>Confidential Document • Valid until: {{ \Carbon\Carbon::parse($exams->max('exam_date') ?? now())->format('F j, Y') }}</p>
        <p>Generated on: {{ date('F j, Y H:i') }}</p>
    </div>
</body>
</html>