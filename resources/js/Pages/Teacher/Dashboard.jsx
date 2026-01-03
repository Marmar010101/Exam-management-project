import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    BookOpen, 
    Clock, 
    Users, 
    Calendar, 
    TrendingUp, 
    AlertTriangle,
    Eye,
    Info
} from 'lucide-react';

export default function TeacherDashboard({ 
    stats = {},
    recentAlerts = [],
    upcomingExams = []
}) {
    // Mock data for demonstration
    const mockStats = {
        totalModules: 4,
        totalSurveillances: 6,
        upcomingExams: 3,
        attendanceRate: 87
    };

    const mockRecentAlerts = [
        {
            id: 1,
            type: 'warning',
            title: 'Surveillance demain',
            message: 'Examen de Database Systems - Salle A101 - 08:00',
            time: 'Il y a 2 heures'
        },
        {
            id: 2,
            type: 'info',
            title: 'Changement de salle',
            message: 'Examen Algorithms déplacé vers B201',
            time: 'Il y a 5 heures'
        },
        {
            id: 3,
            type: 'success',
            title: 'Demande approuvée',
            message: 'Votre demande d\'absence a été acceptée',
            time: 'Hier'
        }
    ];

    const mockUpcomingExams = [
        {
            id: 1,
            module: 'Database Systems',
            date: '15 Janvier 2025',
            time: '08:00 - 10:00',
            room: 'A101',
            group: 'CS2A',
            type: 'Final'
        },
        {
            id: 2,
            module: 'Web Development',
            date: '17 Janvier 2025',
            time: '14:00 - 16:00',
            room: 'B201',
            group: 'CS2B',
            type: 'Midterm'
        },
        {
            id: 3,
            module: 'Algorithms',
            date: '20 Janvier 2025',
            time: '10:00 - 12:00',
            room: 'C301',
            group: 'CS2A',
            type: 'Final'
        }
    ];

    const getAlertIcon = (type) => {
        switch (type) {
            case 'warning':
                return <AlertTriangle className="text-yellow-500" size={20} />;
            case 'info':
                return <Info className="text-blue-500" size={20} />;
            case 'success':
                return <TrendingUp className="text-green-500" size={20} />;
            default:
                return <Info className="text-gray-500" size={20} />;
        }
    };

    const getAlertBgColor = (type) => {
        switch (type) {
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            case 'info':
                return 'bg-blue-50 border-blue-200';
            case 'success':
                return 'bg-green-50 border-green-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    return (
        <AuthenticatedLayout header="Tableau de bord">
            <Head title="Tableau de bord Enseignant" />
            
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Statistics Cards - Read Only */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <BookOpen className="text-blue-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">{mockStats.totalModules}</h3>
                                <p className="text-sm text-gray-600">Modules assignés</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Eye className="text-purple-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">{mockStats.totalSurveillances}</h3>
                                <p className="text-sm text-gray-600">Examens à surveiller</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <Calendar className="text-orange-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">{mockStats.upcomingExams}</h3>
                                <p className="text-sm text-gray-600">Examens à venir</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Users className="text-green-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">{mockStats.attendanceRate}%</h3>
                                <p className="text-sm text-gray-600">Taux de présence</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Alerts */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertes récentes</h3>
                        <div className="space-y-3">
                            {mockRecentAlerts.map(alert => (
                                <div 
                                    key={alert.id} 
                                    className={`p-4 rounded-lg border ${getAlertBgColor(alert.type)}`}
                                >
                                    <div className="flex items-start">
                                        <div className="mr-3 mt-1">
                                            {getAlertIcon(alert.type)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">{alert.title}</div>
                                            <div className="text-sm text-gray-600 mt-1">{alert.message}</div>
                                            <div className="text-xs text-gray-500 mt-2">{alert.time}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Exams */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Prochains examens</h3>
                        <div className="space-y-3">
                            {mockUpcomingExams.map(exam => (
                                <div key={exam.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-gray-900">{exam.module}</div>
                                            <div className="text-sm text-gray-600 mt-1">
                                                {exam.date} • {exam.time}
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                Salle {exam.room} • Groupe {exam.group}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                exam.type === 'Final' 
                                                    ? 'bg-red-100 text-red-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {exam.type}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                    <div className="flex items-start">
                        <Info className="text-blue-600 mr-3 mt-1" size={20} />
                        <div>
                            <h4 className="font-medium text-blue-900 mb-2">Espace consultatif</h4>
                            <p className="text-sm text-blue-800">
                                Dans cet espace, vous pouvez consulter toutes les informations relatives à vos modules et surveillances. 
                                Pour toute modification ou demande, utilisez les pages dédiées dans le menu.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}