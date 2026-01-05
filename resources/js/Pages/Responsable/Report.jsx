import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    FileBarChart, 
    Users, 
    Calendar, 
    BookOpen, 
    Building, 
    Clock,
    TrendingUp
} from 'lucide-react';

export default function Report({ stats, groups, upcomingExams }) {
    return (
        <AuthenticatedLayout title="Reports">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <FileBarChart className="h-8 w-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900">Department Reports</h1>
                    </div>
                    <p className="mt-2 text-gray-600">
                        Overview of academic activities and performance
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Users className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Students</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total_students}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Calendar className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Groups</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total_groups}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <BookOpen className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Exams</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total_exams}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <TrendingUp className="h-8 w-8 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Modules</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total_modules}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Groups Overview */}
                <div className="bg-white rounded-lg shadow mb-8 border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Groups Overview</h2>
                    </div>
                    <div className="p-6">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Group Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Level
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Speciality
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Students
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Modules
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Exams
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {groups.map((group, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {group.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {group.level || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {group.speciality || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {group.students_count}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {group.modules_count}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {group.exams_count}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Upcoming Exams */}
                <div className="bg-white rounded-lg shadow border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-blue-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Upcoming Exams</h2>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {upcomingExams.length > 0 ? (
                                upcomingExams.map((exam, index) => (
                                    <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900">{exam.module}</h4>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Group: {exam.group} • Teacher: {exam.teacher}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-medium text-gray-900">{exam.date}</p>
                                                <p className="text-sm text-gray-600">{exam.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No upcoming exams scheduled</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
