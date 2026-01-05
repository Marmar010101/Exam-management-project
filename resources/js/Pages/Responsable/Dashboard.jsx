import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Users,
    GraduationCap,
    FileText,
    LayoutDashboard,
    PlusCircle,
    Calendar,
    BookOpen,
    ChevronRight,
    Clock,
    Building,
    UserCircle,
    CalendarDays
} from 'lucide-react';

export default function Dashboard({
    studentsCount = 0,
    teachersCount = 0,
    examsCount = 0,
    activePercentage = 0,
    groups = [],
    upcomingExams = []
}) {
    const displayedGroups = groups.slice(0, 6);

    return (
        <AuthenticatedLayout header="Dashboard - Responsible">
            <Head title="Dashboard - Responsible" />
            
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Stats Overview */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                    <p className="text-gray-600">Overview of academic activities and performance</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                                <Users className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Students</p>
                                <p className="text-2xl font-bold text-gray-900">{studentsCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                                <GraduationCap className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Teachers</p>
                                <p className="text-2xl font-bold text-gray-900">{teachersCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                                <FileText className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Scheduled Exams</p>
                                <p className="text-2xl font-bold text-gray-900">{examsCount}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-amber-100 rounded-lg p-3">
                                <UserCircle className="h-8 w-8 text-amber-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Accounts</p>
                                <p className="text-2xl font-bold text-gray-900">{activePercentage}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Groups */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Groups</h2>
                                        <p className="text-blue-100 text-sm">Manage academic groups</p>
                                    </div>
                                    <ChevronRight className="h-6 w-6 text-blue-200" />
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {displayedGroups.map((group, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center">
                                                <Building className="h-5 w-5 text-gray-400 mr-3" />
                                                <div>
                                                    <p className="font-medium text-gray-900">{group.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {group.level?.name || 'General'} • {group.speciality?.name || 'No Speciality'}
                                                    </p>
                                                </div>
                                            </div>
                                            <Link
                                                href={route('responsable.groups.index')}
                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                                            >
                                                View Details
                                                <ChevronRight className="h-4 w-4 ml-1" />
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                                <div className="text-center mt-4">
                                    <Link
                                        href={route('responsable.groups.index')}
                                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        View All Groups
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Link
                                href={route('responsable.exams.create')}
                                className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow group"
                            >
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3 group-hover:bg-blue-200 transition-colors">
                                        <Calendar className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Schedule New Exam</h3>
                                        <p className="text-sm text-gray-600">Create and manage exam schedules</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                            </Link>

                            <Link
                                href={route('responsable.calendars')}
                                className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow group"
                            >
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-green-100 rounded-lg p-3 group-hover:bg-green-200 transition-colors">
                                        <CalendarDays className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">View Calendar</h3>
                                        <p className="text-sm text-gray-600">Check exam schedules and availability</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                            </Link>

                            <Link
                                href={route('responsable.invigilation')}
                                className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow group"
                            >
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3 group-hover:bg-purple-200 transition-colors">
                                        <Users className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Manage Invigilation</h3>
                                        <p className="text-sm text-gray-600">Assign teachers to exam supervision</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                            </Link>

                            <Link
                                href={route('responsable.report')}
                                className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow group"
                            >
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 bg-amber-100 rounded-lg p-3 group-hover:bg-amber-200 transition-colors">
                                        <FileText className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">View Reports</h3>
                                        <p className="text-sm text-gray-600">Generate detailed reports and analytics</p>
                                    </div>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
                            </Link>
                        </div>
                    </div>

                    {/* Upcoming Exams */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center">
                                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                                <h2 className="text-xl font-bold text-gray-900">Upcoming Exams</h2>
                            </div>
                        </div>
                        <div className="p-6">
                            {upcomingExams.length > 0 ? (
                                <div className="space-y-4">
                                    {upcomingExams.map((exam, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 bg-blue-100 rounded-lg p-2">
                                                    <FileText className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div className="ml-4">
                                                    <h4 className="font-medium text-gray-900">{exam.module}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        {exam.group} • {exam.date} at {exam.time}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    exam.type === 'Exam' ? 'bg-blue-100 text-blue-800' :
                                                    exam.type === 'Rattrapage' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {exam.type}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg font-medium">No upcoming exams scheduled</p>
                                    <p className="text-gray-400 text-sm mt-2">All exams are up to date</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
