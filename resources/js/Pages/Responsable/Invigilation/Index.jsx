import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ChevronLeft, Users, Calendar, Clock, Home, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function InvigilationIndex({ 
    schedules = [], 
    exams = [], 
    teachers = [], 
    rooms = [],
    auth 
}) {
    // Ensure schedules is an array
    const schedulesArray = Array.isArray(schedules) ? schedules : [];
    
    return (
        <AuthenticatedLayout header="Invigilation Schedule">
            <Head title="Invigilation Schedule" />
            
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <Link
                            href={route('responsable.dashboard')}
                            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Link>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Invigilation Schedule</h1>
                        <p className="text-gray-600 mt-1">Manage exam invigilation assignments</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Calendar className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Total Exams</p>
                                <p className="text-2xl font-bold text-gray-900">{exams.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Users className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Total Teachers</p>
                                <p className="text-2xl font-bold text-gray-900">{teachers.length}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <CheckCircle className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Confirmed</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {schedulesArray.filter(s => s.status === 'confirmed').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <AlertCircle className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm text-gray-500">Pending</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {schedulesArray.filter(s => s.status === 'pending').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Schedule Table */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Invigilation Assignments</h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Exam
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Room
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Teacher
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {schedulesArray.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                                            <p className="text-lg font-medium mb-2">No invigilation schedules found</p>
                                            <p className="text-gray-600">Run the InvigilationScheduleSeeder to create sample data.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    schedulesArray.map((schedule) => (
                                        <tr key={schedule.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {schedule.exam?.module_name || 'Unknown Module'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {schedule.exam?.group || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                                    {schedule.exam_date || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                                    {schedule.start_time || 'N/A'} - {schedule.end_time || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <Home className="h-4 w-4 mr-2 text-gray-400" />
                                                    {schedule.room_name || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {schedule.teacher?.name || 'Unknown Teacher'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    schedule.status === 'confirmed' 
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {schedule.status === 'confirmed' ? (
                                                        <>
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            Confirmed
                                                        </>
                                                    ) : (
                                                        <>
                                                            <AlertCircle className="h-3 w-3 mr-1" />
                                                            Pending
                                                        </>
                                                    )}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
