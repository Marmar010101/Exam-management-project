import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { Bell, X, Check, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export default function Notifications() {
    const { auth } = usePage().props;
    const [showDropdown, setShowDropdown] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNotifications();
        // Fetch notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await fetch('/notifications/recent');
            const data = await response.json();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unread_count || 0);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await fetch(`/notifications/${id}/read`, { method: 'PUT' });
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch('/notifications/read-all', { method: 'PUT' });
            fetchNotifications();
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'exam_created':
                return <Clock className="text-blue-500" size={16} />;
            case 'exam_updated':
                return <AlertCircle className="text-yellow-500" size={16} />;
            case 'exam_deleted':
                return <XCircle className="text-red-500" size={16} />;
            case 'exam_validated':
                return <CheckCircle className="text-green-500" size={16} />;
            case 'exam_rejected':
                return <XCircle className="text-red-500" size={16} />;
            default:
                return <Bell className="text-gray-500" size={16} />;
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'exam_created':
                return 'border-blue-200 bg-blue-50';
            case 'exam_updated':
                return 'border-yellow-200 bg-yellow-50';
            case 'exam_deleted':
                return 'border-red-200 bg-red-50';
            case 'exam_validated':
                return 'border-green-200 bg-green-50';
            case 'exam_rejected':
                return 'border-red-200 bg-red-50';
            default:
                return 'border-gray-200 bg-gray-50';
        }
    };

    return (
        <div className="relative">
            {/* Notification Bell */}
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {showDropdown && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                        <div className="flex items-center space-x-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-blue-600 hover:text-blue-800"
                                >
                                    Mark all as read
                                </button>
                            )}
                            <button
                                onClick={() => setShowDropdown(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center text-sm text-gray-500">
                                Loading notifications...
                            </div>
                        ) : notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                        notification.is_unread ? 'bg-blue-50' : ''
                                    }`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="flex-shrink-0 mt-1">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-900">
                                                {notification.message}
                                            </p>
                                            <div className="mt-1 text-xs text-gray-500">
                                                {notification.data.module_name && (
                                                    <span className="font-medium">{notification.data.module_name}</span>
                                                )}
                                                {notification.data.exam_date && (
                                                    <span> • {notification.data.exam_date}</span>
                                                )}
                                                {notification.data.exam_time && (
                                                    <span> • {notification.data.exam_time}</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {notification.created_at_human}
                                            </p>
                                        </div>
                                        {notification.is_unread && (
                                            <div className="flex-shrink-0">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-sm text-gray-500">
                                <Bell className="mx-auto mb-2 text-gray-300" size={24} />
                                No notifications yet
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-200">
                            <a
                                href="/notifications"
                                className="block text-center text-sm text-blue-600 hover:text-blue-800"
                                onClick={() => setShowDropdown(false)}
                            >
                                View all notifications
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
