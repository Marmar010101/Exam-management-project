import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Calendar,
    Clock,
    Users,
    PlusCircle,
    Eye,
    Edit,
    Trash2,
    Filter,
    Search,
    AlertCircle,
    CheckCircle,
    XCircle,
    PlayCircle
} from 'lucide-react';

export default function ExamPlansIndex({ examPlans = [] }) {
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
            case 'validated': return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
            case 'scheduled': return <PlayCircle className="h-4 w-4 text-blue-600" />;
            default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
        }
    };

    const getExamTypeIcon = (type) => {
        switch (type) {
            case 'Final': return <Calendar className="h-4 w-4 text-purple-600" />;
            case 'Midterm': return <Clock className="h-4 w-4 text-blue-600" />;
            case 'Quiz': return <AlertCircle className="h-4 w-4 text-orange-600" />;
            case 'Practical': return <Users className="h-4 w-4 text-green-600" />;
            case 'Oral': return <PlayCircle className="h-4 w-4 text-indigo-600" />;
            default: return <Calendar className="h-4 w-4 text-gray-600" />;
        }
    };

    // Filter exam plans
    const filteredExamPlans = examPlans.filter(plan => {
        const matchesSearch = plan.group_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           plan.module_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           plan.teacher_name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const canEdit = (status) => ['pending', 'rejected'].includes(status);
    const canDelete = (status) => ['pending', 'rejected'].includes(status);

    return (
        <AuthenticatedLayout header="Exam Plans Management - Responsible">
            <Head title="Exam Plans Management - Responsible" />
            
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Success Message */}
                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
                        {flash.success}
                    </div>
                )}

                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Exam Plans</h1>
                            <p className="text-gray-600 mt-1">Create and manage exam plans for validation</p>
                        </div>
                        <Link
                            href={route('responsable.exam-plans.create')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center transition-colors"
                        >
                            <PlusCircle className="h-5 w-5 mr-2" />
                            Create New Plan
                        </Link>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search exam plans..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="validated">Validated</option>
                                <option value="rejected">Rejected</option>
                                <option value="scheduled">Scheduled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Exam Plans Table */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">All Exam Plans</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Group & Module
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Teacher & Room
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredExamPlans.length > 0 ? (
                                    filteredExamPlans.map((plan) => (
                                        <tr key={plan.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{plan.group_name}</div>
                                                    <div className="text-sm text-gray-500">{plan.module_name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm text-gray-900">{plan.teacher_name}</div>
                                                    <div className="text-sm text-gray-500">{plan.room_name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {getExamTypeIcon(plan.exam_type)}
                                                    <span className="ml-2 text-sm text-gray-900">{plan.exam_type}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm text-gray-900">{plan.formatted_date}</div>
                                                    <div className="text-sm text-gray-500">{plan.formatted_time}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {getStatusIcon(plan.status)}
                                                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${plan.status_color}`}>
                                                        {plan.status_label}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <Link
                                                        href={route('responsable.exam-plans.show', plan.id)}
                                                        className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View
                                                    </Link>
                                                    {canEdit(plan.status) && (
                                                        <Link
                                                            href={route('responsable.exam-plans.edit', plan.id)}
                                                            className="text-green-600 hover:text-green-800 font-medium inline-flex items-center"
                                                        >
                                                            <Edit className="h-4 w-4 mr-1" />
                                                            Edit
                                                        </Link>
                                                    )}
                                                    {canDelete(plan.status) && (
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Are you sure you want to delete this exam plan?')) {
                                                                    const form = document.createElement('form');
                                                                    form.method = 'POST';
                                                                    form.action = route('responsable.exam-plans.destroy', plan.id);
                                                                    
                                                                    const formData = new FormData();
                                                                    formData.append('_method', 'DELETE');
                                                                    
                                                                    form.submit();
                                                                }
                                                            }}
                                                            className="text-red-600 hover:text-red-800 font-medium inline-flex items-center"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-1" />
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-500 text-lg font-medium">No exam plans found</p>
                                                <p className="text-gray-400 text-sm mt-2">
                                                    {searchTerm || statusFilter !== 'all' 
                                                        ? 'Try adjusting your search or filter criteria' 
                                                        : 'No exam plans have been created yet'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
