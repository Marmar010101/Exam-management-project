import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Bell, Clock, CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Notifications() {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'info',
            title: 'Nouvel examen programmé',
            message: 'Un examen de "Mathématiques" a été programmé pour le 15 janvier 2026.',
            time: 'Il y a 2 heures',
            read: false
        },
        {
            id: 2,
            type: 'success',
            title: 'Salle confirmée',
            message: 'La salle A101 a été confirmée pour l\'examen d\'informatique.',
            time: 'Il y a 5 heures',
            read: false
        },
        {
            id: 3,
            type: 'warning',
            title: 'Surveillance manquante',
            message: 'L\'examen de physique nécessite un surveillant supplémentaire.',
            time: 'Hier',
            read: true
        }
    ]);

    const markAsRead = (id) => {
        setNotifications(notifications.map(notif => 
            notif.id === id ? { ...notif, read: true } : notif
        ));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(notif => notif.id !== id));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            case 'error':
                return <X className="w-5 h-5 text-red-500" />;
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getTypeBgColor = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            default:
                return 'bg-blue-50 border-blue-200';
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <AuthenticatedLayout>
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Bell className="w-6 h-6 text-blue-500 mr-3" />
                                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                                    {unreadCount > 0 && (
                                        <span className="ml-3 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                                            {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        Tout marquer comme lu
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="p-6">
                            {notifications.length === 0 ? (
                                <div className="text-center py-12">
                                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
                                    <p className="text-gray-500">Vous n'avez aucune notification pour le moment.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 rounded-lg border transition-all ${
                                                !notification.read 
                                                    ? getTypeBgColor(notification.type) + ' shadow-sm' 
                                                    : 'bg-gray-50 border-gray-200'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-3 flex-1">
                                                    {getTypeIcon(notification.type)}
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <h3 className={`text-sm font-medium ${
                                                                !notification.read ? 'text-gray-900' : 'text-gray-600'
                                                            }`}>
                                                                {notification.title}
                                                            </h3>
                                                            <span className="text-xs text-gray-500 flex items-center">
                                                                <Clock className="w-3 h-3 mr-1" />
                                                                {notification.time}
                                                            </span>
                                                        </div>
                                                        <p className={`text-sm ${
                                                            !notification.read ? 'text-gray-700' : 'text-gray-500'
                                                        }`}>
                                                            {notification.message}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2 ml-4">
                                                    {!notification.read && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                                            title="Marquer comme lu"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                                        title="Supprimer"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
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
