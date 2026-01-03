<?php

namespace App\Notifications;

use App\Models\Exam;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ExamPublishedNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(public Exam $exam)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */

    
    public function via($notifiable)
    {
        return ['database','mail'];
    }
     

    public function toDatabase($notifiable): array
    {
        return [
            'exam_id' => $this->exam->id,
            'title' => $this->exam->module->name ?? 'Exam',
            'message' => 'New exam published: ' . ($this->exam->module->name ?? 'Exam'),
            'type' => 'exam_published',
            'action_url' => route('student.exams.show', $this->exam->id) // You'll need to create this route
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
            ->subject('New Exam Published')
            ->line('A new exam has been published:')
            ->line('Module: ' . ($this->exam->module->name ?? 'N/A'))
            ->line('Date: ' . $this->exam->exam_date->format('Y-m-d'))
            ->line('Time: ' . $this->exam->exam_time)
            ->action('View Exam Details', route('student.exams.show', $this->exam->id))
            ->line('Please prepare accordingly.');
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
            //
        ];
    }
}
