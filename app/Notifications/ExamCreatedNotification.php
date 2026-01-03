<?php

namespace App\Notifications;

use App\Models\Exam;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ExamCreatedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @param \App\Models\Exam $exam
     * @return void
     */
    public function __construct(public Exam $exam)
    {
        // Constructor now receives the Exam object
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database', 'mail'];
    }
    
    /**
     * Get the database representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toDatabase($notifiable): array
    {
        return [
            'exam_id' => $this->exam->id,
            'title' => $this->exam->module->module_name ?? ($this->exam->module->name ?? 'New Exam'),
            'message' => 'New exam created by ' . ($this->exam->creator->matricule ?? 'Responsable'),
            'type' => 'exam_created',
            'action_url' => route('headdepartment.exams.review', $this->exam->id)
        ];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Exam Created - Approval Required')
            ->line('A new exam has been created and requires your approval.')
            ->line('Module: ' . ($this->exam->module->module_name ?? ($this->exam->module->name ?? 'N/A')))
            ->line('Group: ' . ($this->exam->group->name ?? 'N/A'))
            ->line('Date: ' . $this->exam->exam_date->format('Y-m-d'))
            ->line('Time: ' . $this->exam->exam_time)
            ->action('Review Exam', route('headdepartment.exams.review', $this->exam->id))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'exam_id' => $this->exam->id,
            'message' => 'New exam created',
        ];
    }
}