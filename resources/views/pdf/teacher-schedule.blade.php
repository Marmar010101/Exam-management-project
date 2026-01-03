<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $teacher->first_name }} {{ $teacher->last_name }} - Invigilation Schedule</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; }
        .teacher-info { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background: #4f46e5; color: white; padding: 8px; text-align: left; }
        td { padding: 8px; border: 1px solid #ddd; }
        tr:nth-child(even) { background: #f9fafb; }
        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Invigilation Schedule</h1>
        <h2>{{ $teacher->first_name }} {{ $teacher->last_name }}</h2>
        <p>Generated on: {{ date('F j, Y') }}</p>
    </div>
    
    <div class="teacher-info">
        <p><strong>Grade:</strong> {{ $teacher->grade }}</p>
        <p><strong>Email:</strong> {{ $teacher->user->email ?? 'N/A' }}</p>
    </div>
    
    @if($teacher->invigilationSchedules && $teacher->invigilationSchedules->count() > 0)
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Module</th>
                    <th>Room</th>
                    <th>Duration</th>
                    <th>Role</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody>
                @foreach($teacher->invigilationSchedules->sortBy('exam.exam_date')->sortBy('exam.exam_time') as $schedule)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($schedule->exam->exam_date)->format('M d, Y') }}</td>
                    <td>{{ \Carbon\Carbon::parse($schedule->exam->exam_time)->format('h:i A') }}</td>
                    <td>{{ $schedule->exam->module->module_name ?? 'N/A' }}</td>
                    <td>
                        @foreach($schedule->exam->rooms as $room)
                            {{ $room->room_name }}@if(!$loop->last)<br>@endif
                        @endforeach
                    </td>
                    <td>{{ $schedule->exam->duration }} min</td>
                    <td>{{ ucfirst($schedule->role) }}</td>
                    <td>{{ $schedule->notes ?? '-' }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <div style="text-align: center; padding: 40px; color: #666;">
            <h3>No invigilation assignments</h3>
            <p>You have no exams assigned for invigilation.</p>
        </div>
    @endif
    
    <div class="footer">
        <p>Exam Planning System • Confidential</p>
        <p>Page {PAGENO} of {nbpg}</p>
    </div>
</body>
</html>