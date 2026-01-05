import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FileBarChart, Calendar, BookOpen, Clock, User, GraduationCap } from 'lucide-react';

export default function Report({ stats, studentInfo, exams, modules }) {
    return (
        <AuthenticatedLayout title="Reports">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <FileBarChart className="h-8 w-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900">Student Reports</h1>
                    </div>
                    <p className="mt-2 text-gray-600">
                        Your academic progress and exam schedule
                    </p>
                </div>

                {/* Student Info Card */}
                <div className="bg-white rounded-lg shadow p-6 mb-8 border border-gray-200">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            <User className="h-12 w-12 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                {studentInfo?.first_name} {studentInfo?.last_name}
                            </h2>
                            <p className="text-sm text-gray-600">
                                Group: {studentInfo?.group?.name} • 
                                Level: {studentInfo?.group?.level?.name} • 
                                {studentInfo?.group?.speciality?.name && ` Speciality: ${studentInfo.group.speciality.name}`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Calendar className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Exams</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total_exams}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <BookOpen className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Modules</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total_modules}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Clock className="h-8 w-8 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.upcoming_exams}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <GraduationCap className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Completed</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.completed_exams}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modules */}
                <div className="bg-white rounded-lg shadow mb-8 border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Your Modules</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {modules.map((module, index) => (
                                <div key={index} className="bg-blue-50 rounded-lg p-4 hover:bg-blue-100 transition-colors">
                                    <BookOpen className="h-6 w-6 text-blue-600 mb-2" />
                                    <h3 className="text-sm font-medium text-gray-900">{module.module_name}</h3>
                                    <p className="text-xs text-gray-600 mt-1">Code: {module.code}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Exam Schedule */}
                <div className="bg-white rounded-lg shadow border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Exam Schedule</h2>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {exams.length > 0 ? (
                                exams.map((exam, index) => (
                                    <div key={index} className={`rounded-lg p-4 transition-colors ${
                                        new Date(exam.date) >= new Date() 
                                            ? 'bg-yellow-50 hover:bg-yellow-100 border border-yellow-200' 
                                            : 'bg-green-50 hover:bg-green-100 border border-green-200'
                                    }`}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900">{exam.module}</h4>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Teacher: {exam.teacher} • Type: {exam.type}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    {new Date(exam.date) >= new Date() ? 'Upcoming' : 'Completed'}
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
                                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No exams scheduled</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
