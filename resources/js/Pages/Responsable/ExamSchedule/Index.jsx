import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Calendar,
    Plus,
    Filter,
    Download,
    Eye,
    Edit,
    Trash2,
    Search,
    ChevronLeft,
    ChevronRight,
    Clock,
    Users,
    BookOpen
} from 'lucide-react';

export default function ExamScheduleIndex() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({
        category: '',
        status: '',
        dateRange: ''
    });

    // Données simulées pour l'exemple
    useEffect(() => {
        // Simuler le chargement des données
        setTimeout(() => {
            setSchedules([
                {
                    id: 1,
                    name: 'Exam Session January 2024',
                    category: 'Examen',
                    subType: 'Normal',
                    start_date: '2024-01-15',
                    end_date: '2024-01-25',
                    total_exams: 45,
                    total_days: 8,
                    status: 'validated',
                    created_at: '2024-01-10T10:00:00Z',
                    generated_by: 'Dr. Omar'
                },
                {
                    id: 2,
                    name: 'Test TP Session February 2024',
                    category: 'Test_TP',
                    subType: 'Normal',
                    start_date: '2024-02-05',
                    end_date: '2024-02-10',
                    total_exams: 12,
                    total_days: 4,
                    status: 'draft',
                    created_at: '2024-02-01T14:30:00Z',
                    generated_by: 'Dr. Leila'
                },
                {
                    id: 3,
                    name: 'Control Session March 2024',
                    category: 'Contrôle',
                    subType: 'Rattrapage',
                    start_date: '2024-03-10',
                    end_date: '2024-03-15',
                    total_exams: 8,
                    total_days: 3,
                    status: 'validated',
                    created_at: '2024-03-05T09:15:00Z',
                    generated_by: 'M. Karim'
                }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const filteredSchedules = schedules.filter(schedule => {
        const matchesSearch = schedule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            schedule.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            schedule.generated_by.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = !filters.category || schedule.category === filters.category;
        const matchesStatus = !filters.status || schedule.status === filters.status;
        
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'validated':
                return 'bg-green-100 text-green-800';
            case 'draft':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Examen':
                return <BookOpen className="h-4 w-4" />;
            case 'Test_TP':
                return <Calendar className="h-4 w-4" />;
            case 'Contrôle':
                return <Clock className="h-4 w-4" />;
            default:
                return <Calendar className="h-4 w-4" />;
        }
    };

    if (loading) {
        return (
            <AuthenticatedLayout header="Exam Schedules">
                <Head title="Exam Schedules" />
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout header="Exam Schedules">
            <Head title="Exam Schedules" />
            
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Exam Schedules</h1>
                            <p className="text-gray-600 mt-1">Manage automatically generated exam schedules</p>
                        </div>
                        <Link
                            href={route('responsable.exam-schedule.create')}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Plus size={20} />
                            <span>Generate New Schedule</span>
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                                <Calendar className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <div className="text-2xl font-bold text-gray-900">{schedules.length}</div>
                                <div className="text-sm text-gray-500">Total Schedules</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                                <BookOpen className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <div className="text-2xl font-bold text-gray-900">
                                    {schedules.reduce((sum, s) => sum + s.total_exams, 0)}
                                </div>
                                <div className="text-sm text-gray-500">Total Exams</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                                <Users className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <div className="text-2xl font-bold text-gray-900">
                                    {schedules.filter(s => s.status === 'validated').length}
                                </div>
                                <div className="text-sm text-gray-500">Validated</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
                                <Clock className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <div className="text-2xl font-bold text-gray-900">
                                    {schedules.reduce((sum, s) => sum + s.total_days, 0)}
                                </div>
                                <div className="text-sm text-gray-500">Total Days</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow mb-6 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search schedules..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <select
                                value={filters.category}
                                onChange={(e) => setFilters({...filters, category: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Categories</option>
                                <option value="Examen">Examen</option>
                                <option value="Test_TP">Test TP</option>
                                <option value="Contrôle">Contrôle</option>
                            </select>
                        </div>
                        
                        <div>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({...filters, status: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Status</option>
                                <option value="draft">Draft</option>
                                <option value="validated">Validated</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Schedules Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Schedule Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Period
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Exams / Days
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Generated By
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredSchedules.length > 0 ? (
                                    filteredSchedules.map((schedule) => (
                                        <tr key={schedule.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {schedule.name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Created {new Date(schedule.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    {getCategoryIcon(schedule.category)}
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {schedule.category}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {schedule.subType}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {new Date(schedule.start_date).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    to {new Date(schedule.end_date).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {schedule.total_exams} exams
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {schedule.total_days} days
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(schedule.status)}`}>
                                                    {schedule.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {schedule.generated_by}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        href={route('responsable.exam-schedule.show', schedule.id)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="View"
                                                    >
                                                        <Eye size={16} />
                                                    </Link>
                                                    <button
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Download"
                                                    >
                                                        <Download size={16} />
                                                    </button>
                                                    {schedule.status === 'draft' && (
                                                        <>
                                                            <Link
                                                                href={route('responsable.exam-schedule.edit', schedule.id)}
                                                                className="text-yellow-600 hover:text-yellow-900"
                                                                title="Edit"
                                                            >
                                                                <Edit size={16} />
                                                            </Link>
                                                            <button
                                                                className="text-red-600 hover:text-red-900"
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center">
                                            <div className="text-gray-500">
                                                <Calendar className="mx-auto mb-2" size={48} />
                                                <p className="text-sm font-medium">
                                                    {searchTerm || filters.category || filters.status ? 
                                                        'No schedules found matching your criteria' : 
                                                        'No schedules found'
                                                    }
                                                </p>
                                                <p className="text-xs mt-1">
                                                    {searchTerm || filters.category || filters.status ? 
                                                        'Try adjusting your filters' : 
                                                        'Start by generating your first schedule'
                                                    }
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {filteredSchedules.length > 0 && (
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing {filteredSchedules.length} of {schedules.length} schedules
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="px-3 py-1 text-sm">
                                Page {currentPage}
                            </span>
                            <button
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage * 10 >= filteredSchedules.length}
                                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
