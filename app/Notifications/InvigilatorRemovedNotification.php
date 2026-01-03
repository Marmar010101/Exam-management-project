<?php

namespace App\Notifications;

use App\Models\Exam;
use App\Models\Teacher;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;

class InvigilatorRemovedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Exam $exam,
        public Teacher $teacher
    ) {
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable): array
    {
        return [
            'exam_id' => $this->exam->id,
            'teacher_id' => $this->teacher->id,
            'title' => 'Invigilation Assignment Removed',
            'message' => "You have been removed as invigilator for {$this->exam->module->module_name}",
            'type' => 'invigilator_removed',
            'action_url' => route('teacher.exams.index')
        ];
    }
}