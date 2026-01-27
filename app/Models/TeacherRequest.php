<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeacherRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'module_id',
        'type',
        'title',
        'description',
        'date',
        'time',
        'room',
        'new_date',
        'new_duration',
        'urgency',
        'status',
        'admin_notes',
        'response_date',
        'justification_file',
        'processed_at',
        'created_at'
    ];

    protected $casts = [
        'date' => 'date',
        'response_date' => 'datetime',
    ];

    /**
     * Get the user that owns the request.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the exam associated with the request.
     */
    public function exam(): BelongsTo
    {
        return $this->belongsTo(Exam::class);
    }

    /**
     * Get the module associated with the request (through exam).
     */
    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class, 'exam_id', 'id_module');
    }

    /**
     * Get status color for UI.
     */
    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'pending' => 'yellow',
            'approved' => 'green',
            'rejected' => 'red',
            default => 'gray',
        };
    }

    /**
     * Get status badge class for UI.
     */
    public function getStatusBadgeClassAttribute(): string
    {
        return match($this->status) {
            'pending' => 'bg-yellow-100 text-yellow-800',
            'approved' => 'bg-green-100 text-green-800',
            'rejected' => 'bg-red-100 text-red-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    /**
     * Get type label for UI.
     */
    public function getTypeLabelAttribute(): string
    {
        return match($this->type) {
            'absence' => 'Absence',
            'room_change' => 'Room Change',
            'time_change' => 'Time Change',
            'exam_change' => 'Exam Change',
            default => ucfirst($this->type),
        };
    }
}