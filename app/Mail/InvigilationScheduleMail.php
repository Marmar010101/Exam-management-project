<?php

namespace App\Mail;

use App\Models\Teacher;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Barryvdh\DomPDF\Facade\Pdf;

class InvigilationScheduleMail extends Mailable
{
    use Queueable, SerializesModels;

    public $teacher;

    /**
     * Create a new message instance.
     */
    public function __construct(Teacher $teacher)
    {
        $this->teacher = $teacher;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Invigilation Schedule - ' . date('F Y'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.invigilation-schedule',
            with: [
                'teacher' => $this->teacher,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        // Generate PDF attachment
        $pdf = Pdf::loadView('pdf.teacher-schedule', [
            'teacher' => $this->teacher
        ]);
        
        return [
            $pdf->output('teacher-schedule.pdf'),
        ];
    }
}