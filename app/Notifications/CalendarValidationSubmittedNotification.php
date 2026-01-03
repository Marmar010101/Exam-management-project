<?php

namespace App\Notifications;

use App\Models\CalendarValidationRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CalendarValidationSubmittedNotification extends Notification
{
    use Queueable;

    public function __construct(public CalendarValidationRequest $request)
    {
        //
    }

    public function via($notifiable)
    {
        return ['database'];
    }

   // app\Notifications\CalendarValidationSubmittedNotification.php
public function toDatabase($notifiable): array
{
    $group = $this->request->group;
    $data = $this->request->data;
    
    return [
        'request_id' => $this->request->id,
        'group_id' => $group->id,
        'group_name' => $group->name,
        'responsable_name' => $this->request->responsable->name ?? 'Responsable',
        'exam_count' => $data['exam_count'] ?? 0,
        'date_range' => $data['date_range'] ?? 'No dates',
        'total_hours' => $data['total_hours'] ?? 0,
        'message' => sprintf(
            '%s submitted %d exams (%s hours) for %s',
            $this->request->responsable->name ?? 'Responsable',
            $data['exam_count'] ?? 0,
            $data['total_hours'] ?? 0,
            $group->name
        ),
        'type' => 'calendar_validation_submitted',
        'action_url' => route('headdepartment.calendar-validation.show', $this->request->id)
    ];
}
}