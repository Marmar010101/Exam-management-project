import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    FileBarChart, 
    Calendar, 
    BookOpen, 
    Clock, 
    User, 
    Download,
    Filter,
    Search,
    TrendingUp,
    Users,
    AlertCircle,
    CheckCircle
} from 'lucide-react';

export default function TeacherReport({ stats = {}, exams = [], modules = [], requests = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    // Mock data if not provided
    const mockStats = {
        total_exams: 12,
        total_modules: 4,
        total_surveillances: 8,
        pending_requests: 2,
        completed_exams: 10,
        upcoming_exams: 2
    };

    const mockExams = [
        {
            id: 1,
            module_name: 'Database Systems',
            exam_type: 'Final',
            date: '2025-01-15',
            time: '08:00',
            room: 'A101',
            group: 'CS2A',
            status: 'completed'
        },
        {
            id: 2,
            module_name: 'Web Development',
            exam_type: 'Midterm',
            date: '2025-01-20',
            time: '10:00',
            room: 'B202',
            group: 'CS2B',
            status: 'upcoming'
        }
    ];

    const mockModules = [
        {
            id: 1,
            module_name: 'Database Systems',
            code: 'DB301',
            group: 'CS2A',
            hours_per_week: 4,
            total_students: 25
        },
        {
            id: 2,
            module_name: 'Web Development',
            code: 'WD302',
            group: 'CS2B',
            hours_per_week: 3,
            total_students: 22
        }
    ];

    const mockRequests = [
        {
            id: 1,
            type: 'room_change',
            title: 'Room change for Database exam',
            status: 'pending',
            created_at: '2025-01-10'
        },
        {
            id: 2,
            type: 'material_request',
            title: 'Projector needed for presentation',
            status: 'approved',
            created_at: '2025-01-08'
        }
    ];

    const currentStats = stats || mockStats;
    const currentExams = exams || mockExams;
    const currentModules = modules || mockModules;
    const currentRequests = requests || mockRequests;

    // Filter data
    const filteredExams = currentExams.filter(exam => {
        const matchesSearch = exam.module_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || exam.status === filterType;
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'upcoming': return 'bg-blue-100 text-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle className="h-4 w-4" />;
            case 'upcoming': return <Calendar className="h-4 w-4" />;
            case 'cancelled': return <AlertCircle className="h-4 w-4" />;
            default: return <Clock className="h-4 w-4" />;
        }
    };

    return (
        <AuthenticatedLayout header="Teacher Reports">
            <Head title="Teacher Reports" />
            
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FileBarChart className="h-8 w-8 text-blue-600" />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Teacher Reports</h1>
                                <p className="mt-1 text-gray-600">Your teaching activities and performance overview</p>
                            </div>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center">
                            <Download className="h-4 w-4 mr-2" />
                            Export Report
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                                <Calendar className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Exams</p>
                                <p className="text-2xl font-bold text-gray-900">{currentStats.total_exams}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                                <BookOpen className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Modules</p>
                                <p className="text-2xl font-bold text-gray-900">{currentStats.total_modules}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                                <Clock className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Surveillances</p>
                                <p className="text-2xl font-bold text-gray-900">{currentStats.total_surveillances}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
                                <AlertCircle className="h-8 w-8 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                                <p className="text-2xl font-bold text-gray-900">{currentStats.pending_requests}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search exams..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="completed">Completed</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Exams Table */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">Exam Schedule</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Module
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Room
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Group
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredExams.map((exam) => (
                                    <tr key={exam.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {exam.module_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {exam.exam_type}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {exam.date} at {exam.time}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {exam.room}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {exam.group}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                                                {getStatusIcon(exam.status)}
                                                <span className="ml-1">{exam.status}</span>
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modules and Requests */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Modules */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">My Modules</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {currentModules.map((module) => (
                                    <div key={module.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <h3 className="font-medium text-gray-900">{module.module_name}</h3>
                                            <p className="text-sm text-gray-500">{module.code} • {module.group}</p>
                                            <p className="text-xs text-gray-400 mt-1">{module.hours_per_week}h/week • {module.total_students} students</p>
                                        </div>
                                        <BookOpen className="h-8 w-8 text-blue-600" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Requests */}
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Recent Requests</h2>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {currentRequests.map((request) => (
                                    <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div>
                                            <h3 className="font-medium text-gray-900">{request.title}</h3>
                                            <p className="text-sm text-gray-500 capitalize">{request.type.replace('_', ' ')}</p>
                                            <p className="text-xs text-gray-400 mt-1">{request.created_at}</p>
                                        </div>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            request.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {request.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
