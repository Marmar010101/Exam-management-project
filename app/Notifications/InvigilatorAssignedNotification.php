<?php

namespace App\Notifications;

use App\Models\Exam;
use App\Models\Teacher;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class InvigilatorAssignedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Exam $exam,
        public Teacher $teacher,
        public string $role = 'assistant'
    ) {
    }

    public function via($notifiable): array
    {
        return ['database', 'mail'];
    }

    public function toDatabase($notifiable): array
    {
        return [
            'exam_id' => $this->exam->id,
            'teacher_id' => $this->teacher->id,
            'title' => 'New Invigilation Assignment',
            'message' => "You have been assigned as {$this->role} invigilator for {$this->exam->module->module_name}",
            'type' => 'invigilator_assigned',
            'action_url' => route('teacher.exams.show', $this->exam->id)
        ];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Invigilation Assignment: {$this->exam->module->module_name}")
            ->greeting("Dear {$this->teacher->first_name},")
            ->line("You have been assigned as an invigilator for an upcoming exam.")
            ->line("**Exam Details:**")
            ->line("- Module: {$this->exam->module->module_name}")
            ->line("- Date: {$this->exam->exam_date->format('F j, Y')}")
            ->line("- Time: {$this->exam->exam_time} (Duration: {$this->exam->duration} minutes)")
            ->line("- Role: {$this->role}")
            ->line("- Group: {$this->exam->group->name}")
            ->action('View Exam Details', route('teacher.exams.show', $this->exam->id))
            ->line('Please ensure your availability and contact the exam coordinator if you have any conflicts.')
            ->salutation('Best regards, Exam Management System');
    }
}