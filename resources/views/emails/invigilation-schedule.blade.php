<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .exam-card { background: white; border: 1px solid #e5e7eb; padding: 15px; margin-bottom: 15px; border-radius: 5px; }
        .exam-time { color: #4f46e5; font-weight: bold; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .button { display: inline-block; background: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 Your Invigilation Schedule</h1>
            <p>{{ date('F Y') }}</p>
        </div>
        
        <div class="content">
            <p>Dear {{ $teacher->first_name }} {{ $teacher->last_name }},</p>
            
            <p>Your invigilation schedule for the upcoming exams has been assigned. Please find your assignments below:</p>
            
            @if($teacher->invigilationSchedules && $teacher->invigilationSchedules->count() > 0)
                <h3>Your Exam Assignments:</h3>
                
                @foreach($teacher->invigilationSchedules->groupBy(function($schedule) {
                    return $schedule->exam->exam_date;
                }) as $date => $schedules)
                    <h4 style="color: #4f46e5; margin-top: 20px;">
                        {{ \Carbon\Carbon::parse($date)->format('l, F j, Y') }}
                    </h4>
                    
                    @foreach($schedules as $schedule)
                    <div class="exam-card">
                        <div class="exam-time">
                            ⏰ {{ \Carbon\Carbon::parse($schedule->exam->exam_time)->format('h:i A') }}
                            ({{ $schedule->exam->duration }} minutes)
                        </div>
                        <div style="margin-top: 10px;">
                            <strong>Module:</strong> {{ $schedule->exam->module->module_name ?? 'N/A' }}<br>
                            <strong>Room(s):</strong> 
                            @foreach($schedule->exam->rooms as $room)
                                {{ $room->room_name }}@if(!$loop->last), @endif
                            @endforeach
                            <br>
                            <strong>Your Role:</strong> 
                            <span
    @if($schedule->role === 'main')
        style="background: #10b981;"
    @else
        style="background: #3b82f6;"
    @endif
    class="role-badge"
>
    {{ ucfirst($schedule->role) }} Invigilator
</span>

                        </div>
                    </div>
                    @endforeach
                @endforeach
            @else
                <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 5px;">
                    <p>You have no invigilation assignments for the upcoming period.</p>
                </div>
            @endif
            
            <div style="margin-top: 30px;">
                <p><strong>Important Instructions:</strong></p>
                <ul>
                    <li>Arrive at the examination room 30 minutes before the scheduled start time</li>
                    <li>Bring your staff identification card</li>
                    <li>Report any issues to the examination office immediately</li>
                </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <a href="{{ url('/invigilation') }}" class="button">
                    View Full Schedule Online
                </a>
            </div>
            
            <div class="footer">
                <p>This email was sent automatically by the Exam Planning System.</p>
                <p>Please do not reply to this email.</p>
            </div>
        </div>
    </div>
</body>
</html>