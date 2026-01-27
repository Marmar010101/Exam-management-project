<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModulePrerequisite extends Model
{
    protected $fillable = [
        'module_id',
        'prerequisite_id',
    ];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function prerequisite()
    {
        return $this->belongsTo(Module::class, 'prerequisite_id');
    }
}
