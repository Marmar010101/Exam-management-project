import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Calendar,
    Clock,
    Users,
    Plus,
    PlusCircle,
    Eye,
    Edit,
    Trash2,
    Filter,
    Search,
    AlertCircle,
    CheckCircle,
    XCircle,
    PlayCircle,
    Send,
    Download
} from 'lucide-react';

export default function ExamPlansIndex() {
    const { examPlans = [], allExams = [], totalExamPlans = 0, totalIndividualExams = 0, flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sendingToHead, setSendingToHead] = useState({});

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
            case 'validated': return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
            case 'scheduled': return <PlayCircle className="h-4 w-4 text-blue-600" />;
            case 'sent_to_head': return <Send className="h-4 w-4 text-purple-600" />;
            default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
        }
    };

    const getExamTypeIcon = (type) => {
        switch (type) {
            case 'Normal': return <Calendar className="h-4 w-4 text-purple-600" />;
            case 'Replacement': return <Clock className="h-4 w-4 text-blue-600" />;
            case 'Retake': return <AlertCircle className="h-4 w-4 text-orange-600" />;
            case 'Test': return <Users className="h-4 w-4 text-green-600" />;
            default: return <Calendar className="h-4 w-4 text-gray-600" />;
        }
    };

    // Send exam plan to Head Department
    const sendToHeadDepartment = (examId) => {
        setSendingToHead(prev => ({ ...prev, [examId]: true }));
        
        router.post(`/responsable/exam-plans/${examId}/send-to-head`, {}, {
            onSuccess: () => {
                setSendingToHead(prev => ({ ...prev, [examId]: false }));
            },
            onError: () => {
                setSendingToHead(prev => ({ ...prev, [examId]: false }));
            }
        });
    };

    // Send all pending exam plans to Head Department
    const sendAllToHeadDepartment = () => {
        const pendingPlans = filteredExamPlans.filter(exam => exam.status === 'pending');
        
        if (pendingPlans.length === 0) {
            alert('Aucun exam plan en attente à envoyer');
            return;
        }
        
        if (confirm(`Êtes-vous sûr de vouloir envoyer ${pendingPlans.length} exam plans au Head Department?`)) {
            setSendingToHead(prev => ({ ...prev, all: true }));
            
            router.post('/responsable/exam-plans/send-all-to-head', {}, {
                onSuccess: () => {
                    setSendingToHead(prev => ({ ...prev, all: false }));
                },
                onError: () => {
                    setSendingToHead(prev => ({ ...prev, all: false }));
                }
            });
        }
    };

    // Batch actions for grouped exam plans
    const batchDelete = (batchId) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer tous les exam plans de ce groupe?')) {
            router.post('/responsable/exam-plans/batch-delete', { batch_id: batchId });
        }
    };

    const batchSendToHead = (batchId) => {
        if (confirm('Êtes-vous sûr de vouloir envoyer tous les exam plans de ce groupe au Head Department?')) {
            router.post('/responsable/exam-plans/batch-send-to-head', { batch_id: batchId });
        }
    };

    // Filter exam plans
    const filteredExamPlans = examPlans.filter(exam => {
        const matchesSearch = exam.group_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exam.module_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           exam.teacher_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || exam.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Group exam plans by batch_id
    const groupedExamPlans = {};
    filteredExamPlans.forEach(exam => {
        if (exam.batch_id) {
            if (!groupedExamPlans[exam.batch_id]) {
                groupedExamPlans[exam.batch_id] = [];
            }
            groupedExamPlans[exam.batch_id].push(exam);
        }
    });

    const canEdit = (status) => ['pending', 'rejected'].includes(status);
    const canDelete = (status) => ['pending', 'rejected'].includes(status);
    const canSendToHead = (status) => ['pending'].includes(status);

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
                            <h1 className="text-2xl font-bold text-gray-900">Exam Plans Management</h1>
                            <p className="text-gray-600 mt-1">Manage and create exam plans for your department</p>
                        </div>
                        <div className="flex space-x-3">
                            <Link
                                href="/responsable/exam-plans/create"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create Exam Plans
                            </Link>
                        </div>
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
                                <option value="sent_to_head">Sent to Head</option>
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
                                        Teachers & Rooms
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
                                {Object.keys(groupedExamPlans).length > 0 ? (
                                    Object.entries(groupedExamPlans).map(([batchId, batchPlans]) => (
                                        <React.Fragment key={batchId}>
                                            {/* Header row for grouped plans */}
                                            <tr className="bg-indigo-50 border-b-2 border-indigo-200">
                                                <td colSpan="6" className="px-6 py-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                                Planning Unifié - {batchPlans.length} groupes
                                                            </div>
                                                            <span className="ml-3 text-sm text-indigo-700">
                                                                {batchPlans.map(p => p.group_name).join(', ')}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => batchSendToHead(batchId)}
                                                                className="inline-flex items-center px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700"
                                                            >
                                                                <Send className="h-4 w-4 mr-1" />
                                                                Envoyer tous
                                                            </button>
                                                            <button
                                                                onClick={() => batchDelete(batchId)}
                                                                className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-1" />
                                                                Supprimer tous
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* Individual plan rows */}
                                            {batchPlans.map((exam, index) => (
                                                <tr key={exam.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="flex items-center">
                                                                <div className="text-sm font-medium text-gray-900">{exam.group_name}</div>
                                                                {exam.is_planning_generated && (
                                                                    <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                                        exam.planning_type === 'consolidated' 
                                                                            ? 'bg-indigo-100 text-indigo-800' 
                                                                            : 'bg-purple-100 text-purple-800'
                                                                    }`}>
                                                                        <Calendar className="h-3 w-3 mr-1" />
                                                                        {exam.planning_type === 'consolidated' ? 'Unifié' : 'Planning'}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-sm text-gray-500">{exam.module_name}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="text-sm text-gray-900">
                                                                {exam.teachers && exam.teachers.length > 0 
                                                                    ? exam.teachers.map(t => `${t.first_name} ${t.last_name}`).join(', ')
                                                                    : exam.teacher_name || 'Not Assigned'
                                                                }
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {exam.rooms && exam.rooms.length > 0 
                                                                    ? exam.rooms.map(r => r.room_name || r.name).join(', ')
                                                                    : exam.room_name || 'Not Assigned'
                                                                }
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            {getExamTypeIcon(exam.exam_type)}
                                                            <span className="ml-2 text-sm text-gray-900">{exam.exam_type}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-900">
                                                            {exam.start_date && new Date(exam.start_date).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {exam.start_time} - {exam.end_time}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            {getStatusIcon(exam.status)}
                                                            <span className="ml-2 text-sm text-gray-900 capitalize">{exam.status}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-2">
                                                            <Link
                                                                href={`/responsable/exam-plans/${exam.id}`}
                                                                className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                                                            >
                                                                <Eye className="h-4 w-4 mr-1" />
                                                                View
                                                            </Link>
                                                            {canEdit(exam.status) && (
                                                                <Link
                                                                    href={`/responsable/exam-plans/${exam.id}/edit`}
                                                                    className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                                                                >
                                                                    <Edit className="h-4 w-4 mr-1" />
                                                                    Edit
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))
                                ) : (
                                    filteredExamPlans.map((exam) => (
                                        <tr key={exam.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="flex items-center">
                                                        <div className="text-sm font-medium text-gray-900">{exam.group_name}</div>
                                                        {exam.is_planning_generated && (
                                                            <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                                exam.planning_type === 'consolidated' 
                                                                    ? 'bg-indigo-100 text-indigo-800' 
                                                                    : 'bg-purple-100 text-purple-800'
                                                            }`}>
                                                                <Calendar className="h-3 w-3 mr-1" />
                                                                {exam.planning_type === 'consolidated' ? 'Planning' : 'Individuel'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{exam.module_name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm text-gray-900">
                                                        {exam.teachers && exam.teachers.length > 0 
                                                            ? exam.teachers.map(t => `${t.first_name} ${t.last_name}`).join(', ')
                                                            : exam.teacher_name || 'Not Assigned'
                                                        }
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {exam.rooms && exam.rooms.length > 0 
                                                            ? exam.rooms.map(r => r.room_name || r.name).join(', ')
                                                            : exam.room_name || 'Not Assigned'
                                                        }
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {getExamTypeIcon(exam.exam_type)}
                                                    <span className="ml-2 text-sm text-gray-900">{exam.exam_type}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {exam.start_date && new Date(exam.start_date).toLocaleDateString()}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {exam.start_time} - {exam.end_time}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {getStatusIcon(exam.status)}
                                                    <span className="ml-2 text-sm text-gray-900 capitalize">{exam.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/responsable/exam-plans/${exam.id}`}
                                                        className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View
                                                    </Link>
                                                    {canEdit(exam.status) && (
                                                        <Link
                                                            href={`/responsable/exam-plans/${exam.id}/edit`}
                                                            className="inline-flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                                                        >
                                                            <Edit className="h-4 w-4 mr-1" />
                                                            Edit
                                                        </Link>
                                                    )}
                                                    {canSendToHead(exam.status) && (
                                                        <button
                                                            onClick={() => sendToHeadDepartment(exam.id)}
                                                            disabled={sendingToHead[exam.id]}
                                                            className="inline-flex items-center px-3 py-1 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 disabled:bg-gray-400"
                                                        >
                                                            <Send className="h-4 w-4 mr-1" />
                                                            {sendingToHead[exam.id] ? 'Sending...' : 'Send'}
                                                        </button>
                                                    )}
                                                    {canDelete(exam.status) && (
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Are you sure you want to delete this exam plan?')) {
                                                                    router.delete(`/responsable/exam-plans/${exam.id}`);
                                                                }
                                                            }}
                                                            className="inline-flex items-center px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-1" />
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                            No exam plans found
                                        </td>
                                    </tr>
                                )
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Individual Exams Table */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 mt-6">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">All Individual Exams ({totalIndividualExams})</h2>
                            <div className="text-sm text-gray-500">
                                Total: {totalIndividualExams} exams
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Module
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Group
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Teacher
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Room
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
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {allExams && allExams.length > 0 ? (
                                    allExams.map((exam) => (
                                        <tr key={exam.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{exam.module_name}</div>
                                                    <div className="text-sm text-gray-500">{exam.exam_code}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{exam.group_name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{exam.teacher_name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">{exam.room_name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {getExamTypeIcon(exam.exam_type)}
                                                    <span className="ml-2 text-sm text-gray-900">{exam.exam_type}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    {exam.formatted_date}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {exam.formatted_time}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    {getStatusIcon(exam.status)}
                                                    <span className="ml-2 text-sm text-gray-900 capitalize">{exam.status_label}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                            No individual exams found
                                        </td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
