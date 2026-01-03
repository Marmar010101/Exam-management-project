<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $group->name }} - Exam Schedule</title>
    <style>
        @page { margin: 20px; }
        body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; }
        .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; }
        .header h1 { color: #4f46e5; margin: 0 0 5px 0; }
        .group-info { margin-bottom: 15px; padding: 10px; background: #e0e7ff; border-radius: 5px; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th { background: #4f46e5; color: white; padding: 8px; text-align: left; font-size: 11px; }
        td { padding: 8px; border: 1px solid #e5e7eb; font-size: 10px; }
        tr:nth-child(even) { background: #f9fafb; }
        .exam-type { display: inline-block; padding: 2px 6px; border-radius: 3px; font-size: 9px; color: white; }
        .day-section { margin-bottom: 20px; page-break-inside: avoid; }
        .day-header { background: #dbeafe; padding: 8px; border-radius: 5px; margin-bottom: 10px; }
        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 10px; border-top: 1px solid #e5e7eb; padding-top: 10px; }
        .summary { margin: 15px 0; padding: 10px; background: #f0f9ff; border-radius: 5px; }
        .color-legend { margin: 15px 0; font-size: 10px; }
        .legend-item { display: inline-block; margin-right: 10px; }
        .color-box { display: inline-block; width: 10px; height: 10px; margin-right: 5px; border-radius: 2px; }
        .exam-card { border: 1px solid #e5e7eb; margin-bottom: 10px; padding: 10px; border-radius: 5px; }
        .exam-card-header { background: #4f46e5; color: white; padding: 8px; margin: -10px -10px 8px -10px; border-radius: 5px 5px 0 0; }
         
    </style>
</head>
<body>
    <div class="header">
        <h1>📅 {{ $group->name }} - Exam Schedule</h1>
        <p>Generated on: {{ date('F j, Y') }}</p>
    </div>

    <div class="group-info">
        <h3 style="margin: 0 0 8px 0; color: #4f46e5;">Group Information</h3>
        <div style="display: flex; gap: 20px;">
            <div><strong>Group:</strong> {{ $group->name }}</div>
            <div><strong>Total Exams:</strong> {{ $exams->count() }}</div>
            <div><strong>Date Range:</strong> 
                @if($exams->isNotEmpty())
                    {{ \Carbon\Carbon::parse($exams->min('exam_date'))->format('M d') }} - 
                    {{ \Carbon\Carbon::parse($exams->max('exam_date'))->format('M d, Y') }}
                @else
                    No exams
                @endif
            </div>
        </div>
    </div>

    <!-- Color Legend -->
    <div class="color-legend">
        <strong>Exam Type Legend:</strong>
        <span class="legend-item"><span class="color-box" style="background: #10B981;"></span>Continuous Assessment</span>
        <span class="legend-item"><span class="color-box" style="background: #3B82F6;"></span>Final Exam</span>
        <span class="legend-item"><span class="color-box" style="background: #F59E0B;"></span>Make-up Exam</span>
        <span class="legend-item"><span class="color-box" style="background: #EF4444;"></span>Replacement Exam</span>
        <span class="legend-item"><span class="color-box" style="background: #8B5CF6;"></span>Practical Test</span>
    </div>

    @if($exams->isEmpty())
        <div style="text-align: center; padding: 40px; color: #666;">
            <h3>No exams scheduled</h3>
            <p>This group has no scheduled exams.</p>
        </div>
    @else
        <!-- Summary Statistics -->
        <div class="summary">
            <h4 style="margin: 0 0 8px 0; color: #0369a1;">Exam Distribution</h4>
            <div style="display: flex; gap: 20px;">
                @php
                    $typeCounts = $exams->groupBy('exam_type')->map->count();
                @endphp
                @foreach($typeCounts as $type => $count)
                    <div><strong>{{ $type }}:</strong> {{ $count }}</div>
                @endforeach
            </div>
        </div>

        <!-- Table View -->
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Module</th>
                    <th>Type</th>
                    <th>Room</th>
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
                            {{ $room->name }}@if(!$loop->last), @endif
                        @endforeach
                    </td>
                    <td>{{ $exam->duration }} min</td>
                    <td>
                        @if($exam->invigilationSchedules->isNotEmpty())
                            @foreach($exam->invigilationSchedules as $schedule)
                                {{ $schedule->teacher->first_name }} {{ $schedule->teacher->last_name }}
                                @if(!$loop->last), @endif
                            @endforeach
                        @else
                            No invigilators
                        @endif
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Detailed View by Date -->
        <div style="page-break-before: always; margin-top: 30px;">
            <h3 style="color: #4f46e5; margin: 20px 0 10px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">
                📅 Detailed Schedule by Date
            </h3>
            
            @foreach($exams->groupBy('exam_date') as $date => $examsOnDate)
            <div class="day-section">
                <div class="day-header">
                    <h4 style="margin: 0; color: #4f46e5;">
                        📅 {{ \Carbon\Carbon::parse($date)->format('l, F j, Y') }}
                        <span style="font-size: 11px; color: #666; margin-left: 10px;">
                            ({{ $examsOnDate->count() }} exams)
                        </span>
                    </h4>
                </div>
                
                @foreach($examsOnDate->sortBy('exam_time') as $exam)
                <div class="exam-card">
                    <div class="exam-card-header">
                        <strong>{{ $exam->module->module_name ?? 'N/A' }}</strong>
                        • {{ \Carbon\Carbon::parse($exam->exam_time)->format('h:i A') }}
                        • {{ $exam->duration }} minutes
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 8px;">
                        <div>
                            <strong>Type:</strong>
                            <span class="exam-type" style="background: {{ 
                                $exam->exam_type === 'Continuous assessment' ? '#10B981' : 
                                ($exam->exam_type === 'Final exam' ? '#3B82F6' : 
                                ($exam->exam_type === 'Make-up exam' ? '#F59E0B' : 
                                ($exam->exam_type === 'Replacement exam' ? '#EF4444' : '#8B5CF6'))) 
                            }}; font-size: 9px;">
                                {{ $exam->exam_type }}
                            </span>
                        </div>
                        <div>
                            <strong>Room(s):</strong>
                            @foreach($exam->rooms as $room)
                                <span style="background: #e5e7eb; padding: 2px 6px; border-radius: 3px; margin-right: 5px; font-size: 9px;">
                                    {{ $room->name }}
                                </span>
                            @endforeach
                        </div>
                    </div>
                    
                    @if($exam->invigilationSchedules->isNotEmpty())
                    <div>
                        <strong>Invigilators:</strong>
                        @foreach($exam->invigilationSchedules as $schedule)
                            <div style="background: #dbeafe; padding: 4px 8px; margin: 4px 0; border-radius: 3px; font-size: 9px;">
                                {{ $schedule->teacher->first_name }} {{ $schedule->teacher->last_name }}
                                <span style="font-size: 8px; color: #666; margin-left: 3px;">
                                    ({{ ucfirst($schedule->role) }})
                                </span>
                            </div>
                        @endforeach
                    </div>
                    @endif
                </div>
                @endforeach
            </div>
            @endforeach
        </div>
    @endif

    <div class="footer">
        <p>Exam Planning System • {{ $group->name }} • Page {PAGENO} of {nbpg}</p>
        <p>Generated on {{ date('F j, Y H:i') }}</p>
    </div>
</body>
</html>