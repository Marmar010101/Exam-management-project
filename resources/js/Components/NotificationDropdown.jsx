import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';

const NotificationDropdown = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchNotifications();
        // Refresh every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await axios.get(route('notifications.recent'));
            setNotifications(response.data.notifications || []);
            setUnreadCount(response.data.unread_count || 0);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
        if (!showDropdown) {
            fetchNotifications();
        }
    };

    const handleNotificationClick = async (notification) => {
        if (notification.is_unread) {
            await markAsRead(notification.id);
        }
        
        if (notification.data?.action_url) {
            router.visit(notification.data.action_url);
        }
        
        setShowDropdown(false);
    };

    const markAsRead = async (id) => {
        try {
            await axios.post(`/notifications/${id}/mark-as-read`);
            // Update local state
            setNotifications(prev => prev.map(n => 
                n.id === id ? { ...n, is_unread: false } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post('/notifications/mark-all-read');
            setNotifications(prev => prev.map(n => ({ ...n, is_unread: false })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.notification-dropdown')) {
                setShowDropdown(false);
            }
        };
        
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <div className="relative notification-dropdown">
            <button
                onClick={toggleDropdown}
                className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                    <div className="p-4 border-b">
                        <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-4 text-center">
                                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                No notifications
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                                        notification.is_unread ? 'bg-blue-50' : ''
                                    }`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                {notification.data?.message || 'Notification'}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {notification.created_at_human}
                                            </p>
                                        </div>
                                        {notification.is_unread && (
                                            <span className="h-2 w-2 bg-blue-500 rounded-full self-start mt-1"></span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    <div className="p-3 border-t bg-gray-50">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="w-full text-center text-sm text-blue-500 hover:text-blue-700 mb-2"
                            >
                                Mark all as read
                            </button>
                        )}
                        <Link
                            href={route('notifications.index')}
                            className="block w-full text-center text-sm text-gray-600 hover:text-gray-800"
                            onClick={() => setShowDropdown(false)}
                        >
                            View all notifications
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;