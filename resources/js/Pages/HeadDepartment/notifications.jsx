import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Bell, Check, CheckCheck, Clock, Calendar, Users, AlertCircle, FileText, Settings, Shield } from 'lucide-react';

export default function HeadDepartmentNotifications({ auth, notifications = [], unreadCount = 0 }) {
    const [filter, setFilter] = useState('all');
    const [localNotifications, setLocalNotifications] = useState(notifications);
    const [localUnreadCount, setLocalUnreadCount] = useState(unreadCount);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('/notifications/recent');
                const data = await response.json();
                setLocalNotifications(data.notifications || []);
                setLocalUnreadCount(data.unreadCount || 0);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (notificationId) => {
        try {
            await fetch(`/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });
            
            setLocalNotifications(prev => 
                prev.map(notif => 
                    notif.id === notificationId 
                        ? { ...notif, read_at: new Date().toISOString() }
                        : notif
                )
            );
            setLocalUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch('/notifications/read-all', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });
            
            setLocalNotifications(prev => 
                prev.map(notif => ({ ...notif, read_at: new Date().toISOString() }))
            );
            setLocalUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'exam':
                return <Calendar className="w-5 h-5 text-red-500" />;
            case 'user':
                return <Users className="w-5 h-5 text-green-500" />;
            case 'module':
                return <FileText className="w-5 h-5 text-blue-500" />;
            case 'system':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'admin':
                return <Shield className="w-5 h-5 text-purple-500" />;
            default:
                return <Bell className="w-5 h-5 text-gray-500" />;
        }
    };

    const filteredNotifications = localNotifications.filter(notif => {
        if (filter === 'unread') return !notif.read_at;
        if (filter === 'read') return notif.read_at;
        return true;
    });

    return (
        <AuthenticatedLayout header="Notifications Chef de Département">
            <Head title="Notifications Chef de Département" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                        Notifications Administratives
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        Administration générale, rapports et décisions importantes
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    {localUnreadCount > 0 && (
                                        <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                            {localUnreadCount} non lue{localUnreadCount > 1 ? 's' : ''}
                                        </span>
                                    )}
                                    {localUnreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            <CheckCheck className="w-4 h-4" />
                                            <span>Tout lire</span>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                <Link href="/HeadDepartment/Dashboard" className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                                    <Shield className="w-6 h-6 text-purple-600" />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Tableau de bord</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Vue d'ensemble</p>
                                    </div>
                                </Link>
                                <Link href="/HeadDepartment/AccountManagement/Management" className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                                    <Users className="w-6 h-6 text-green-600" />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Gestion comptes</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Utilisateurs</p>
                                    </div>
                                </Link>
                                <Link href="/HeadDepartment/Modules" className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Modules</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Gestion</p>
                                    </div>
                                </Link>
                                <Link href="/HeadDepartment/Exams" className="flex items-center space-x-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                                    <Calendar className="w-6 h-6 text-red-600" />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Examens</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Planning</p>
                                    </div>
                                </Link>
                            </div>

                            {/* Filters */}
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setFilter('all')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        filter === 'all'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    Toutes
                                </button>
                                <button
                                    onClick={() => setFilter('unread')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        filter === 'unread'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    Non lues
                                </button>
                                <button
                                    onClick={() => setFilter('read')}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                        filter === 'read'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
                                    }`}
                                >
                                    Lues
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {filteredNotifications.length === 0 ? (
                                <div className="text-center py-12">
                                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Aucune notification administrative pour le moment
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredNotifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                                                !notification.read_at
                                                    ? 'border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800'
                                                    : 'border-gray-200 dark:border-gray-700'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-3 flex-1">
                                                    {getNotificationIcon(notification.type)}
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <h3 className={`font-medium ${
                                                                !notification.read_at
                                                                    ? 'text-gray-900 dark:text-white'
                                                                    : 'text-gray-700 dark:text-gray-300'
                                                            }`}>
                                                                {notification.title}
                                                            </h3>
                                                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                                <Clock className="w-4 h-4" />
                                                                <span>
                                                                    {new Date(notification.created_at).toLocaleString('fr-FR', {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                            {notification.message}
                                                        </p>
                                                        {notification.action_url && (
                                                            <div className="mt-2">
                                                                <Link
                                                                    href={notification.action_url}
                                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center space-x-1"
                                                                >
                                                                    <span>Voir les détails</span>
                                                                </Link>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {!notification.read_at && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                                                        title="Marquer comme lu"
                                                    >
                                                        <Check className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
