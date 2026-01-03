<?php

namespace App\Http\Controllers;

use App\Models\Group;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Return all groups with their relationships
        $groups = Group::with(['cycle', 'level', 'speciality'])->get();
        
        return response()->json([
            'success' => true,
            'data' => $groups
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Add if you need to create groups via API
    }

    /**
     * Display the specified resource.
     */
    public function show(Group $group)
    {
        // Return single group
        return response()->json([
            'success' => true,
            'data' => $group->load(['cycle', 'level', 'speciality'])
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Group $group)
    {
        // Add if you need to update groups
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Group $group)
    {
        // Add if you need to delete groups
    }
}