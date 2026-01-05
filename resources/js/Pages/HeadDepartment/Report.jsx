import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FileBarChart, Users, Calendar, BookOpen, Building, GraduationCap } from 'lucide-react';

export default function Report({ stats, usersByRole, examsByMonth, modulesBySpeciality }) {
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
                        Comprehensive overview of the examination system
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
                                <p className="text-sm font-medium text-gray-600">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total_users}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <GraduationCap className="h-8 w-8 text-green-600" />
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
                                <Building className="h-8 w-8 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Rooms</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total_rooms}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Users by Role */}
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Users by Role</h2>
                        <div className="space-y-3">
                            {Object.entries(usersByRole).map(([role, count]) => (
                                <div key={role} className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-600 capitalize">
                                        {role.replace('_', ' ')}
                                    </span>
                                    <span className="text-sm font-bold text-gray-900">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Exams by Month */}
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Exams by Month</h2>
                        <div className="space-y-3">
                            {Object.entries(examsByMonth).map(([month, count]) => (
                                <div key={month} className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-gray-600">{month}</span>
                                    <span className="text-sm font-bold text-gray-900">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Modules by Speciality */}
                <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Modules by Speciality</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(modulesBySpeciality).map(([speciality, count]) => (
                            <div key={speciality} className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-900">{speciality || 'No Speciality'}</h3>
                                <p className="text-2xl font-bold text-blue-600 mt-1">{count}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
