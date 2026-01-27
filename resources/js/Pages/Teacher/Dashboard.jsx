import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
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
    const { auth } = usePage().props;
    const user = auth.user;
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
            title: 'Surveillance tomorrow',
            message: 'Database Systems exam - Room A101 - 08:00',
            time: '2 hours ago'
        },
        {
            id: 2,
            type: 'info',
            title: 'Room change',
            message: 'Algorithms exam moved to B201',
            time: '5 hours ago'
        },
        {
            id: 3,
            type: 'success',
            title: 'Request approved',
            message: 'Your absence request has been accepted',
            time: 'Yesterday'
        }
    ];

    const mockUpcomingExams = [
        {
            id: 1,
            module: 'Database Systems',
            date: 'January 15, 2025',
            time: '08:00 - 10:00',
            room: 'A101',
            group: 'CS2A',
            type: 'Final'
        },
        {
            id: 2,
            module: 'Web Development',
            date: 'January 17, 2025',
            time: '14:00 - 16:00',
            room: 'B201',
            group: 'CS2B',
            type: 'Midterm'
        },
        {
            id: 3,
            module: 'Algorithms',
            date: 'January 20, 2025',
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
        <AuthenticatedLayout header="Teacher Dashboard">
            <Head title="Teacher Dashboard" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome message */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 mb-8 text-white">
                        <h1 className="text-2xl font-bold mb-2">
                            Welcome, {user?.first_name || 'Teacher'}!
                        </h1>
                        <p className="text-orange-100">
                            Here's your teaching dashboard with modules, exams, and notifications
                        </p>
                    </div>

                    {/* Statistics Cards - Read Only */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                <BookOpen className="text-blue-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{mockStats.totalModules}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Assigned Modules</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                <Eye className="text-purple-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{mockStats.totalSurveillances}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Exams to Monitor</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                                <Calendar className="text-orange-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{mockStats.upcomingExams}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming Exams</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                <Users className="text-green-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{mockStats.attendanceRate}%</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Attendance Rate</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Alerts */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Alerts</h3>
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
                                            <div className="font-medium text-gray-900 dark:text-white">{alert.title}</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{alert.message}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">{alert.time}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Exams */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Exams</h3>
                        <div className="space-y-3">
                            {mockUpcomingExams.map(exam => (
                                <div key={exam.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">{exam.module}</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {exam.date} • {exam.time}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                Room {exam.room} • Group {exam.group}
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
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
                    <div className="flex items-start">
                        <Info className="text-blue-600 mr-3 mt-1" size={20} />
                        <div>
                            <h4 className="font-medium text-blue-900 dark:text-white mb-2">Consultation Space</h4>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                In this space, you can view all information related to your modules and supervisions. 
                                For any modifications or requests, use the dedicated pages in the menu.
                            </p>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
