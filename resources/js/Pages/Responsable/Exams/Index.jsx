import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Calendar, Clock, Users, MapPin, Edit, Trash2, Plus, Filter, Search } from 'lucide-react';

export default function ExamIndex({ exams }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterSubtype, setFilterSubtype] = useState('');

    const filteredExams = exams.filter(exam => {
        const matchesSearch = exam.module?.module_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            exam.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            exam.group?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            exam.teacher?.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            exam.teacher?.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            exam.exam_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            exam.exam_subtype?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = !filterType || exam.exam_type === filterType;
        const matchesSubtype = !filterSubtype || exam.exam_subtype === filterSubtype;

        return matchesSearch && matchesType && matchesSubtype;
    });

    const getExamTypeColor = (type) => {
        switch (type) {
            case 'Exam': return 'bg-blue-100 text-blue-800';
            case 'Control': return 'bg-green-100 text-green-800';
            case 'Test_TP': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getSubtypeColor = (subtype) => {
        switch (subtype) {
            case 'Normal': return 'bg-gray-100 text-gray-800';
            case 'Remplacement': return 'bg-yellow-100 text-yellow-800';
            case 'Rattrapage': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Exams" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Exam Management</h1>
                            <p className="text-gray-600 mt-1">List of all created exams</p>
                        </div>
                       <Link
    href="/Responsable/Exams/Create"
    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
>
    <Plus className="h-4 w-4 mr-2" />
    Create Exam
</Link>
                    </div>

                    {/* Search Bar - Above Filters */}
                    <div className="bg-white rounded-lg shadow p-4 mb-6">
                        <div className="relative">
                            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by module, title, section, teacher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Types</option>
                                <option value="Exam">Exam</option>
                                <option value="Control">Control</option>
                                <option value="Test_TP">Test TP</option>
                            </select>

                            <select
                                value={filterSubtype}
                                onChange={(e) => setFilterSubtype(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Subtypes</option>
                                <option value="Normal">Normal</option>
                                <option value="Remplacement">Replacement</option>
                                <option value="Rattrapage">Make-up</option>
                            </select>

                            <div className="md:col-span-2 text-right flex items-center justify-end">
                                <span className="text-sm text-gray-500">
                                    {filteredExams.length} exam{filteredExams.length > 1 ? 's' : ''} found
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Exam List */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Module
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Title
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Section
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Duration
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Teacher
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredExams.map((exam) => (
                                        <tr key={exam.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {exam.module?.module_name || 'N/A'}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {exam.module?.code || ''}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{exam.title}</div>
                                                {exam.description && (
                                                    <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                                                        {exam.description}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {exam.group?.name || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex space-x-1">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getExamTypeColor(exam.exam_type)}`}>
                                                        {exam.exam_type}
                                                    </span>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getSubtypeColor(exam.exam_subtype)}`}>
                                                        {exam.exam_subtype}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    {exam.duration_minutes} min
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-900">
                                                    {exam.teacher?.user?.first_name} {exam.teacher?.user?.last_name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        href={route('responsable.exams.edit', exam.id)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                    <button 
                                                        onClick={() => {
                                                            if (confirm('Are you sure you want to delete this exam?')) {
                                                                window.location.href = route('responsable.exams.destroy', exam.id);
                                                            }
                                                        }}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredExams.length === 0 && (
                            <div className="text-center py-12">
                                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No exams found</h3>
                                <p className="text-gray-500">
                                    {searchTerm || filterType || filterSubtype
                                        ? 'Try modifying your search filters.' 
                                        : 'Start by creating exams in the planning form.'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
