<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $perPage = $request->input('per_page', 20);
        $currentPage = $request->input('page', 1);

        // Get total count
        $total = \App\Models\Notification::where('user_id', $user->id)->count();

        // Get paginated data
        $notifications = \App\Models\Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->skip(($currentPage - 1) * $perPage)
            ->take($perPage)
            ->get();

        // Transform data
        $formattedNotifications = [];
        foreach ($notifications as $notification) {
            $data = is_string($notification->data) ? json_decode($notification->data, true) : $notification->data;
            
            $formattedNotifications[] = [
                'id' => $notification->id,
                'type' => $notification->type,
                'data' => $data,
                'read_at' => $notification->read ? now() : null, // Convert 'read' to 'read_at' format
                'created_at' => $notification->created_at,
                'created_at_human' => \Carbon\Carbon::parse($notification->created_at)->diffForHumans(),
                'is_unread' => !$notification->read, // Use 'read' field
            ];
        }

        // Create paginator manually
        $paginator = new LengthAwarePaginator(
            $formattedNotifications,
            $total,
            $perPage,
            $currentPage,
            [
                'path' => Paginator::resolveCurrentPath(),
                'pageName' => 'page',
            ]
        );

        return Inertia::render('Notifications/Index', [
            'notifications' => $paginator->items(),
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
                'links' => $paginator->linkCollection()->toArray(),
            ]
        ]);
    }

    public function markAsRead($id)
    {
        $user = Auth::user();

        \App\Models\Notification::where('id', $id)
            ->where('user_id', $user->id)
            ->update(['read' => true]); // Use 'read' field
            
        return response()->json(['success' => true]);
    }

    public function markAllAsRead()
    {
        $user = Auth::user();

        \App\Models\Notification::where('user_id', $user->id)
            ->where('read', false) // Use 'read' field
            ->update(['read' => true]);
            
        return response()->json(['success' => true]);
    }

    public function getUnreadCount()
    {
        $user = Auth::user();

        $count = \App\Models\Notification::where('user_id', $user->id)
            ->where('read', false) // Use 'read' field
            ->count();

        return response()->json(['count' => $count]);
    }

    public function getRecent()
    {
        $user = Auth::user();

        $notifications = \App\Models\Notification::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $formatted = [];
        foreach ($notifications as $notification) {
            $data = is_string($notification->data) ? json_decode($notification->data, true) : $notification->data;
            
            $formatted[] = [
                'id' => $notification->id,
                'type' => $notification->type,
                'data' => $data,
                'read_at' => $notification->read ? now() : null, // Convert 'read' to 'read_at' format
                'created_at' => $notification->created_at,
                'created_at_human' => \Carbon\Carbon::parse($notification->created_at)->diffForHumans(),
                'is_unread' => !$notification->read, // Use 'read' field
            ];
        }

        return response()->json([
            'notifications' => $formatted,
            'unread_count' => \App\Models\Notification::where('user_id', $user->id)
                ->where('read', false) // Use 'read' field
                ->count()
        ]);
    }
}
