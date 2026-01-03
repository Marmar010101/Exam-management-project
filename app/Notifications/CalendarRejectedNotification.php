<?php

namespace App\Notifications;

use App\Models\CalendarValidationRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CalendarRejectedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public CalendarValidationRequest $request,
        public string $reason
    ) {
        //
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable): array
    {
        return [
            'request_id' => $this->request->id,
            'group_name' => $this->request->group->name,
            'message' => 'Your calendar for ' . $this->request->group->name . ' has been rejected',
            'reason' => $this->reason,
            'type' => 'calendar_rejected',
            'action_url' => route('planning.calendar', ['group' => $this->request->group_id])
        ];
    }
}