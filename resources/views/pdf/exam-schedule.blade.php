<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $title ?? 'Exam Schedule Report' }}</title>
    <style>
        @page { margin: 20px; }
        body { 
            font-family: 'DejaVu Sans', Arial, sans-serif; 
            font-size: 11px; 
            line-height: 1.3; 
        }
        .header { 
            text-align: center; 
            margin-bottom: 20px; 
            border-bottom: 2px solid #4f46e5; 
            padding-bottom: 10px; 
        }
        .header h1 { 
            color: #4f46e5; 
            margin: 0 0 5px 0; 
            font-size: 18px; 
        }
        .header h2 { 
            color: #666; 
            margin: 0; 
            font-size: 14px; 
        }
        .summary-stats { 
            margin: 15px 0; 
            padding: 10px; 
            background: #f0f9ff; 
            border-radius: 5px; 
            display: flex; 
            gap: 20px; 
            font-size: 10px; 
        }
        .stat-item { 
            display: flex; 
            flex-direction: column; 
        }
        .stat-value { 
            font-weight: bold; 
            font-size: 13px; 
            color: #4f46e5; 
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 10px; 
        }
        th { 
            background: #4f46e5; 
            color: white; 
            padding: 6px; 
            text-align: left; 
            font-size: 10px; 
            border: 1px solid #4f46e5;
        }
        td { 
            padding: 6px; 
            border: 1px solid #e5e7eb; 
            font-size: 9px; 
        }
        tr:nth-child(even) { 
            background: #f9fafb; 
        }
        .exam-type { 
            display: inline-block; 
            padding: 2px 5px; 
            border-radius: 3px; 
            font-size: 8px; 
            color: white; 
        }
        .footer { 
            margin-top: 30px; 
            text-align: center; 
            color: #666; 
            font-size: 9px; 
            border-top: 1px solid #e5e7eb; 
            padding-top: 10px; 
        }
        .no-data { 
            text-align: center; 
            padding: 40px; 
            color: #666; 
        }
        .color-legend { 
            margin: 10px 0; 
            padding: 8px; 
            background: #f9fafb; 
            border-radius: 5px; 
            font-size: 9px; 
        }
        .legend-item { 
            display: inline-block; 
            margin-right: 15px; 
        }
        .color-box { 
            display: inline-block; 
            width: 8px; 
            height: 8px; 
            margin-right: 3px; 
            border-radius: 1px; 
        }
        .page-break { 
            page-break-before: always; 
        }
        .info-grid { 
            display: grid; 
            grid-template-columns: repeat(4, 1fr); 
            gap: 8px; 
            margin: 10px 0; 
        }
        .info-item { 
            background: #f9fafb; 
            padding: 6px; 
            border-radius: 3px; 
        }
        .info-label { 
            font-weight: bold; 
            color: #4f46e5; 
            font-size: 8px; 
        }
        .info-value { 
            font-size: 9px; 
        }
        .section-title {
            color: #4f46e5; 
            margin: 20px 0 10px 0; 
            border-bottom: 1px solid #e5e7eb; 
            padding-bottom: 5px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📅 Exam Schedule Report</h1>
        <h2>{{ $title ?? 'Comprehensive Examination Schedule' }}</h2>
        <p>Generated on: {{ date('F j, Y - H:i') }}</p>
    </div>

    <!-- Filters Section -->
    @if(isset($group))
    <div class="info-grid">
        <div class="info-item">
            <div class="info-label">Group:</div>
            <div class="info-value">{{ $group->name }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Total Exams:</div>
            <div class="info-value">{{ $exams->count() }}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Date Range:</div>
            <div class="info-value">
                @if($exams->isNotEmpty())
                    {{ \Carbon\Carbon::parse($exams->min('exam_date'))->format('M d') }} - 
                    {{ \Carbon\Carbon::parse($exams->max('exam_date'))->format('M d, Y') }}
                @else
                    No exams
                @endif
            </div>
        </div>
        <div class="info-item">
            <div class="info-label">Days:</div>
            <div class="info-value">{{ $exams->pluck('exam_date')->unique()->count() }}</div>
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
            <span>Groups</span>
            <span class="stat-value">{{ $exams->pluck('group_id')->unique()->count() }}</span>
        </div>
        <div class="stat-item">
            <span>Exam Types</span>
            <span class="stat-value">{{ $exams->pluck('exam_type')->unique()->count() }}</span>
        </div>
        <div class="stat-item">
            <span>Rooms Used</span>
            @php
                $roomCount = 0;
                foreach ($exams as $exam) {
                    $roomCount += $exam->rooms->count();
                }
            @endphp
            <span class="stat-value">{{ $roomCount }}</span>
        </div>
    </div>
    @endif

    <!-- Color Legend -->
    <div class="color-legend">
        <strong style="color: #4f46e5;">Exam Type Legend:</strong>
        <span class="legend-item"><span class="color-box" style="background: #10B981;"></span>Continuous Assessment</span>
        <span class="legend-item"><span class="color-box" style="background: #3B82F6;"></span>Final Exam</span>
        <span class="legend-item"><span class="color-box" style="background: #F59E0B;"></span>Make-up Exam</span>
        <span class="legend-item"><span class="color-box" style="background: #EF4444;"></span>Replacement Exam</span>
        <span class="legend-item"><span class="color-box" style="background: #8B5CF6;"></span>Practical Test</span>
    </div>

    @if($exams->isEmpty())
        <div class="no-data">
            <h3>No exams found</h3>
            <p>No exams match the selected criteria.</p>
        </div>
    @else
        <!-- Table View -->
        <div class="section-title">📋 Exam Schedule Table</div>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Module</th>
                    <th>Group</th>
                    <th>Type</th>
                    <th>Room</th>
                    <th>Duration</th>
                    <th>Invigilators</th>
                </tr>
            </thead>
            <tbody>
                @foreach($exams->sortBy('exam_date')->sortBy('exam_time') as $exam)
                    @php
                        $bgColor = match($exam->exam_type) {
                            'Continuous assessment' => '#10B981',
                            'Final exam' => '#3B82F6',
                            'Make-up exam' => '#F59E0B',
                            'Replacement exam' => '#EF4444',
                            default => '#8B5CF6',
                        };
                    @endphp
                    <tr>
                        <td>{{ \Carbon\Carbon::parse($exam->exam_date)->format('M d, Y') }}</td>
                        <td>{{ \Carbon\Carbon::parse($exam->exam_time)->format('h:i A') }}</td>
                        <td>{{ $exam->module->module_name ?? 'N/A' }}</td>
                        <td>{{ $exam->group->name ?? 'N/A' }}</td>
                        <td>
                            <span class="exam-type" style="background: {{ $bgColor }};">
                                {{ $exam->exam_type }}
                            </span>
                        </td>
                        <td>
                            @if($exam->rooms->isNotEmpty())
                                @foreach($exam->rooms as $room)
                                    {{ $room->room_name }}@if(!$loop->last), @endif
                                @endforeach
                            @else
                                -
                            @endif
                        </td>
                        <td>{{ $exam->duration ?? 0 }} min</td>
                        <td>
                            @if($exam->invigilationSchedules->isNotEmpty())
                                @foreach($exam->invigilationSchedules as $schedule)
                                    {{ $schedule->teacher->first_name ?? '' }} {{ $schedule->teacher->last_name ?? '' }}
                                    @if(!$loop->last), @endif
                                @endforeach
                            @else
                                -
                            @endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Summary by Exam Type -->
        <div class="page-break"></div>
        <div class="section-title">📊 Exam Distribution by Type</div>
        <table>
            <thead>
                <tr>
                    <th>Exam Type</th>
                    <th>Count</th>
                    <th>Percentage</th>
                </tr>
            </thead>
            <tbody>
                @php
                    $typeCounts = $exams->groupBy('exam_type')->map->count();
                    $total = $exams->count();
                @endphp
                @foreach($typeCounts as $type => $count)
                <tr>
                    <td>{{ $type }}</td>
                    <td>{{ $count }}</td>
                    <td>{{ round(($count / $total) * 100, 1) }}%</td>
                </tr>
                @endforeach
                <tr style="font-weight: bold;">
                    <td>Total</td>
                    <td>{{ $total }}</td>
                    <td>100%</td>
                </tr>
            </tbody>
        </table>
    @endif

    <div class="footer">
        <p>Exam Planning System • Generated: {{ date('F j, Y H:i') }} • Page {PAGENO} of {nbpg}</p>
        <p>This document contains confidential information. Do not distribute.</p>
    </div>
</body>
</html>