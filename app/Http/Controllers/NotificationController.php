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
        $total = DB::table('notifications')
            ->where('notifiable_id', $user->id)
            ->where('notifiable_type', 'App\Models\User')
            ->count();
        
        // Get paginated data
        $notifications = DB::table('notifications')
            ->where('notifiable_id', $user->id)
            ->where('notifiable_type', 'App\Models\User')
            ->orderBy('created_at', 'desc')
            ->skip(($currentPage - 1) * $perPage)
            ->take($perPage)
            ->get();
        
        // Transform the data
        $formattedNotifications = [];
        foreach ($notifications as $notification) {
            $data = json_decode($notification->data, true);
            
            $formattedNotifications[] = [
                'id' => $notification->id,
                'type' => $notification->type,
                'data' => $data,
                'read_at' => $notification->read_at,
                'created_at' => $notification->created_at,
                'created_at_human' => \Carbon\Carbon::parse($notification->created_at)->diffForHumans(),
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
        
        DB::table('notifications')
            ->where('id', $id)
            ->where('notifiable_id', $user->id)
            ->where('notifiable_type', 'App\Models\User')
            ->update(['read_at' => now()]);
        
        return response()->json(['success' => true]);
    }

    public function markAllAsRead()
    {
        $user = Auth::user();
        
        DB::table('notifications')
            ->where('notifiable_id', $user->id)
            ->where('notifiable_type', 'App\Models\User')
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
        
        return response()->json(['success' => true]);
    }
    
    public function getUnreadCount()
    {
        $user = Auth::user();
        
        $count = DB::table('notifications')
            ->where('notifiable_id', $user->id)
            ->where('notifiable_type', 'App\Models\User')
            ->whereNull('read_at')
            ->count();
        
        return response()->json(['count' => $count]);
    }
    
    public function getRecent()
    {
        $user = Auth::user();
        
        $notifications = DB::table('notifications')
            ->where('notifiable_id', $user->id)
            ->where('notifiable_type', 'App\Models\User')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
        
        $formatted = [];
        foreach ($notifications as $notification) {
            $data = json_decode($notification->data, true);
            
            $formatted[] = [
                'id' => $notification->id,
                'type' => $notification->type,
                'data' => $data,
                'read_at' => $notification->read_at,
                'created_at' => $notification->created_at,
                'created_at_human' => \Carbon\Carbon::parse($notification->created_at)->diffForHumans(),
                'is_unread' => is_null($notification->read_at),
            ];
        }
        
        return response()->json([
            'notifications' => $formatted,
            'unread_count' => DB::table('notifications')
                ->where('notifiable_id', $user->id)
                ->where('notifiable_type', 'App\Models\User')
                ->whereNull('read_at')
                ->count()
        ]);
    }
}