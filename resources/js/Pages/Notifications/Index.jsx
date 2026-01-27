import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Bell, Check, CheckCheck, Clock, AlertCircle, Calendar, User, BookOpen, Users } from 'lucide-react';

export default function NotificationsIndex({ auth, notifications = [], unreadCount = 0 }) {
    const [filter, setFilter] = useState('all');
    const [localNotifications, setLocalNotifications] = useState(notifications);
    const [localUnreadCount, setLocalUnreadCount] = useState(unreadCount);

    useEffect(() => {
        // Fetch notifications periodically
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
        const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
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
            case 'exam_created':
            case 'exam_validated':
                return <Calendar className="w-5 h-5 text-red-500" />;
            case 'user':
                return <User className="w-5 h-5 text-green-500" />;
            case 'module':
                return <BookOpen className="w-5 h-5 text-purple-500" />;
            case 'system':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'responsibility':
            case 'management':
                return <Users className="w-5 h-5 text-orange-500" />;
            default:
                return <Bell className="w-5 h-5 text-gray-500" />;
        }
    };

    const filteredNotifications = localNotifications.filter(notif => {
        if (filter === 'unread') return !notif.read_at && !notif.read;
        if (filter === 'read') return notif.read_at || notif.read;
        return true;
    });

    const getRoleSpecificContent = () => {
        const role = auth.user.role;
        
        switch (role) {
            case 'student':
                return {
                    title: 'Notifications Étudiant',
                    description: 'Vos examens, emplois du temps et informations académiques',
                    emptyMessage: 'Aucune notification académique pour le moment'
                };
            case 'teacher':
                return {
                    title: 'Notifications Enseignant',
                    description: 'Surveillance d\'examens, modifications d\'emploi du temps et informations pédagogiques',
                    emptyMessage: 'Aucune notification pédagogique pour le moment'
                };
            case 'responsable':
                return {
                    title: 'Notifications Responsable',
                    description: 'Gestion des examens, demandes des enseignants et planning',
                    emptyMessage: 'Aucune notification de gestion pour le moment'
                };
            case 'head department':
                return {
                    title: 'Notifications Chef de Département',
                    description: 'Administration générale, rapports et décisions importantes',
                    emptyMessage: 'Aucune notification administrative pour le moment'
                };
            default:
                return {
                    title: 'Notifications',
                    description: 'Toutes vos notifications',
                    emptyMessage: 'Aucune notification pour le moment'
                };
        }
    };

    const roleContent = getRoleSpecificContent();

    return (
        <AuthenticatedLayout header={roleContent.title}>
            <Head title={roleContent.title} />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                        {roleContent.title}
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        {roleContent.description}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    {localUnreadCount > 0 && (
                                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                            {localUnreadCount} non lue{localUnreadCount > 1 ? 's' : ''}
                                        </span>
                                    )}
                                    {localUnreadCount > 0 && (
                                        <button
                                            onClick={markAllAsRead}
                                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            <CheckCheck className="w-4 h-4" />
                                            <span>Tout marquer comme lu</span>
                                        </button>
                                    )}
                                </div>
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
                                        {roleContent.emptyMessage}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredNotifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                                                (!notification.read_at && !notification.read)
                                                    ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800'
                                                    : 'border-gray-200 dark:border-gray-700'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-3 flex-1">
                                                    {getNotificationIcon(notification.type)}
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <h3 className={`font-medium ${
                                                                (!notification.read_at && !notification.read)
                                                                    ? 'text-gray-900 dark:text-white'
                                                                    : 'text-gray-700 dark:text-gray-300'
                                                            }`}>
                                                                {notification.data?.title || notification.type}
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
                                                        {notification.data?.action_url && (
                                                            <div className="mt-2">
                                                                <Link
                                                                    href={notification.data.action_url}
                                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center space-x-1"
                                                                >
                                                                    <span>Voir les détails</span>
                                                                </Link>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                {(!notification.read_at && !notification.read) && (
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
