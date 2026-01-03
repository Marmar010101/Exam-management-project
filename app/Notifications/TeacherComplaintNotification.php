<?php

namespace App\Notifications;

use App\Models\Teacher;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class TeacherComplaintNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Teacher $teacher,
        public string $complaint,
        public string $subject = 'Complaint from Teacher'
    ) {
    }

    public function via($notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toDatabase($notifiable): array
    {
        return [
            'teacher_id' => $this->teacher->id,
            'teacher_name' => $this->teacher->full_name,
            'title' => 'Teacher Complaint',
            'message' => "Complaint from {$this->teacher->full_name}: " . substr($this->complaint, 0, 100) . '...',
            'type' => 'teacher_complaint',
            'action_url' => route('responsable.teacher-complaints.show', $this->teacher->id)
        ];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Teacher Complaint: {$this->subject}")
            ->greeting("Dear Responsable,")
            ->line("You have received a complaint from {$this->teacher->full_name}.")
            ->line("**Complaint:**")
            ->line($this->complaint)
            ->action('View Complaint Details', route('responsable.teacher-complaints.show', $this->teacher->id))
            ->salutation('Best regards, Exam Management System');
    }
}