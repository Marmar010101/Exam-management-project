import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DesignSystemButton from '@/Components/DesignSystemButton';
import DesignSystemCard from '@/Components/DesignSystemCard';
import { Users, BookOpen, DoorOpen, FileText, ArrowRight, Calendar, Clock, MapPin, TrendingUp, Building } from 'lucide-react';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth.user;
    
    const stats = [
        {
            label: "Users",
            value: "247",
            icon: Users,
            href: "/HeadDepartment/AccountManagement/Management",
            color: "bg-blue-100 text-blue-600",
        },
        {
            label: "Modules",
            value: "32",
            icon: BookOpen,
            href: "/HeadDepartment/Modules",
            color: "bg-green-100 text-green-600",
        },
        {
            label: "Classrooms",
            value: "18",
            icon: DoorOpen,
            href: "/HeadDepartment/Salles",
            color: "bg-orange-100 text-orange-600",
        },
        {
            label: "Scheduled Exams",
            value: "56",
            icon: FileText,
            href: "/HeadDepartment/Exams",
            color: "bg-purple-100 text-purple-600",
        },
    ];

    const quickActions = [
        { key: 'management', label: 'Accounts', href: '/HeadDepartment/AccountManagement/Management', icon: <Users size={18} /> },
        { key: 'exams', label: 'Exams', href: '/HeadDepartment/Exams', icon: <FileText size={18} /> },
        { key: 'modules', label: 'Modules', href: '/HeadDepartment/Modules', icon: <BookOpen size={18} /> },
        { key: 'salles', label: 'Classrooms', href: '/HeadDepartment/Salles', icon: <Building size={18} /> },
    ];

    const recentExams = [
        { module: "Algorithms & Data Structures", date: "15/01/2024", time: "09:00", room: "Room A101", type: "Normal" },
        { module: "Database Systems", date: "18/01/2024", time: "14:00", room: "Room B205", type: "Normal" },
        { module: "Computer Networks", date: "22/01/2024", time: "10:00", room: "Room C301", type: "Makeup" },
    ];

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard - Head Department" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome message */}
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 mb-8 text-white">
                        <h1 className="text-2xl font-bold mb-2">
                            Welcome, {user?.first_name || 'Head Department'}!
                        </h1>
                        <p className="text-purple-100">
                            Here's a comprehensive overview of your department management system
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <a
                                key={stat.label}
                                href={stat.href}
                                className="group rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md hover:border-blue-200"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                                        <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                                    </div>
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                                        <stat.icon className="h-6 w-6" />
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {/* Quick Actions */}
                        <div className="lg:col-span-2">
                            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
                                <div className="grid gap-3 sm:grid-cols-2">
                                    {quickActions.map((action) => (
                                        <DesignSystemButton
                                            key={action.key}
                                            href={action.href}
                                            variant="outline"
                                            className="justify-start"
                                            icon={action.icon}
                                            iconPosition="left"
                                        >
                                            {action.label}
                                        </DesignSystemButton>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Exams */}
                            <div className="mt-6 rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Exams</h2>
                                    <a href="/HeadDepartment/Exams" className="text-sm text-blue-600 hover:text-blue-700">
                                        View All
                                    </a>
                                </div>
                                <div className="space-y-4">
                                    {recentExams.map((exam, index) => (
                                        <div key={index} className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-900/20">
                                                    <FileText className="h-5 w-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{exam.module}</p>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {exam.date}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {exam.time}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="h-3 w-3" />
                                                            {exam.room}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                exam.type === 'Normal' 
                                                    ? 'bg-blue-100 text-blue-800' 
                                                    : 'bg-orange-100 text-orange-800'
                                            }`}>
                                                {exam.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* System Info */}
                        <div className="lg:col-span-1">
                            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">System</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Version</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">v1.0.0</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Last Update</span>
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">30/12/2024</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 p-6 border border-blue-200 dark:border-blue-800">
                                <div className="flex items-center gap-3 mb-3">
                                    <TrendingUp className="h-6 w-6 text-blue-600" />
                                    <h3 className="font-semibold text-blue-900 dark:text-white">Performance</h3>
                                </div>
                                <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                                    <p>• 98% uptime</p>
                                    <p>• 1.2s average response time</p>
                                    <p>• 247 active users</p>
                                </div>
                            </div>

                            <div className="mt-6 rounded-xl bg-gray-50 dark:bg-gray-800/50 p-6 border border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">About</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    ExamPlanner is a comprehensive university exam management system. 
                                    It allows managing user accounts, academic modules, 
                                    exam rooms and exam scheduling.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
