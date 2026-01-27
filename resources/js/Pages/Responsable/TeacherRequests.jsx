import React, { useState } from 'react';
import { Head, usePage, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Clock,
    Calendar,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Search,
    User,
    FileText,
    Bell,
    Send
} from 'lucide-react';

export default function TeacherRequests({ 
    requests = [],
    stats = {},
    notifications = []
}) {
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [showProcessModal, setShowProcessModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [processFormData, setProcessFormData] = useState({
        decision: '',
        rejection_reason: '',
        new_date: '',
        new_time: '',
        new_room: '',
        student_message: '',
        absence_date: '',
        absence_type: 'justified',
        absence_impact: '',
        cancellation_action: ''
    });

    const [statusFilter, setStatusFilter] = useState('all');

    const handleProcessRequest = (request) => {
        setSelectedRequest(request);
        setProcessFormData({
            decision: '',
            rejection_reason: '',
            new_date: '',
            new_time: '',
            new_room: '',
            student_message: '',
            absence_date: '',
            absence_type: 'justified',
            absence_impact: '',
            cancellation_action: ''
        });
        setShowProcessModal(true);
    };

    const handleProcessSubmit = (e) => {
        e.preventDefault();
        
        if (!processFormData.decision) {
            alert('Please select a decision (Approve or Reject)');
            return;
        }

        if (processFormData.decision === 'rejected' && !processFormData.rejection_reason) {
            alert('Please provide a rejection reason');
            return;
        }

        // Use Inertia router to submit the form
        router.post(route('responsable.teacher_requests.process', selectedRequest.id), {
            decision: processFormData.decision,
            rejection_reason: processFormData.rejection_reason,
            new_date: processFormData.new_date,
            new_time: processFormData.new_time,
            new_room: processFormData.new_room,
            student_message: processFormData.student_message,
            absence_date: processFormData.absence_date,
            absence_type: processFormData.absence_type,
            absence_impact: processFormData.absence_impact,
            cancellation_action: processFormData.cancellation_action
        }, {
            onSuccess: () => {
                setShowProcessModal(false);
                setProcessFormData({
                    decision: '',
                    rejection_reason: '',
                    new_date: '',
                    new_time: '',
                    new_room: '',
                    student_message: '',
                    absence_date: '',
                    absence_type: 'justified',
                    absence_impact: '',
                    cancellation_action: ''
                });
                // Reload the page to show updated data
                window.location.reload();
            },
            onError: (errors) => {
                console.log('Process errors:', errors);
                alert('Error processing request: ' + Object.values(errors).join(', '));
            }
        });
    };

    const handleDelete = (requestId) => {
        if (confirm('Are you sure you want to delete this request?')) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = route('responsable.teacher_requests.destroy', requestId);
            
            const formData = new FormData();
            formData.append('_method', 'DELETE');
            
            form.submit();
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'delay_exam': return 'Delay Exam';
            case 'delay_test': return 'Delay Test';
            case 'absence': return 'Absence';
            case 'cancel_exam': return 'Cancel Exam';
            case 'cancel_test': return 'Cancel Test';
            default: return type;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <Clock className="text-yellow-600" size={16} />;
            case 'approved': return <CheckCircle className="text-green-600" size={16} />;
            case 'rejected': return <XCircle className="text-red-600" size={16} />;
            default: return <Clock className="text-gray-600" size={16} />;
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return 'Pending';
            case 'approved': return 'Approved';
            case 'rejected': return 'Rejected';
            default: return status;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'approved': return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200';
            case 'normal': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getUrgencyLabel = (urgency) => {
        switch (urgency) {
            case 'high': return 'High';
            case 'normal': return 'Normal';
            case 'low': return 'Low';
            default: return urgency;
        }
    };

    // Filter requests based on search and status
    const filteredRequests = requests.filter(request => {
        const matchesSearch = request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.teacher_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.type?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <AuthenticatedLayout header="Teacher Requests Management">
            <Head title="Teacher Requests" />
            
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Success Message */}
                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                        {flash.success}
                    </div>
                )}

                {/* Notifications */}
                {notifications && notifications.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
                        <div className="flex items-center">
                            <Bell className="text-yellow-600 mr-2" size={20} />
                            <div>
                                <h4 className="font-semibold text-yellow-900">New Teacher Requests</h4>
                                <p className="text-sm text-yellow-800">
                                    You have {notifications.length} new request{notifications.length > 1 ? 's' : ''} waiting for approval.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                <FileText className="text-blue-600 dark:text-blue-400" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Requests</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                                <Clock className="text-yellow-600 dark:text-yellow-400" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.approved || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                                <XCircle className="text-red-600 dark:text-red-400" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejected</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.rejected || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search requests..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </div>
                        <div className="md:w-48">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Requests Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">All Teacher Requests</h3>
                        
                        {filteredRequests.length === 0 ? (
                            <div className="text-center py-8">
                                <FileText className="text-gray-400 dark:text-gray-500 mx-auto mb-3" size={48} />
                                <p className="text-gray-500 dark:text-gray-400">No requests found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Teacher
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Title
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Urgency
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {filteredRequests.map((request) => (
                                            <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <User className="text-gray-400 mr-2" size={16} />
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                {request.teacher_name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {request.teacher_email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900 dark:text-white">
                                                        {getTypeLabel(request.type)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {request.title}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate">
                                                        {request.description}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(request.created_at).toLocaleDateString('fr-FR', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs rounded-full border ${getUrgencyColor(request.urgency)}`}>
                                                        {getUrgencyLabel(request.urgency)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {getStatusIcon(request.status)}
                                                        <span className={`ml-2 px-2 py-1 text-xs rounded-full border ${getStatusColor(request.status)}`}>
                                                            {getStatusLabel(request.status)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        {request.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleProcessRequest(request)}
                                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                                    title="Process Request"
                                                                >
                                                                    Process Request
                                                                </button>
                                                            </>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(request.id)}
                                                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400"
                                                            title="Delete"
                                                        >
                                                            <XCircle size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Process Request Modal */}
                {showProcessModal && selectedRequest && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-10 mx-auto p-5 border w-[800px] max-h-[90vh] overflow-y-auto shadow-lg rounded-xl bg-white dark:bg-gray-800">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Process Request
                                </h3>
                                <button
                                    onClick={() => setShowProcessModal(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500"
                                >
                                    <XCircle size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleProcessSubmit} method="POST" action={route('responsable.teacher_requests.process', selectedRequest.id)} className="space-y-6">
                                {/* Request Information (Read-only) */}
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Request Information</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Teacher Name
                                            </label>
                                            <div className="mt-1 text-sm text-gray-900 dark:text-white">
                                                {selectedRequest.teacher_name}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Teacher Email
                                            </label>
                                            <div className="mt-1 text-sm text-gray-900 dark:text-white">
                                                {selectedRequest.teacher_email}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Request Type
                                            </label>
                                            <div className="mt-1 text-sm text-gray-900 dark:text-white">
                                                {getTypeLabel(selectedRequest.type)}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Urgency
                                            </label>
                                            <div className="mt-1">
                                                <span className={`px-2 py-1 text-xs rounded-full border ${getUrgencyColor(selectedRequest.urgency)}`}>
                                                    {getUrgencyLabel(selectedRequest.urgency)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Request Title
                                            </label>
                                            <div className="mt-1 text-sm text-gray-900 dark:text-white">
                                                {selectedRequest.title}
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Reason Provided by Teacher
                                            </label>
                                            <div className="mt-1 text-sm text-gray-900 dark:text-white">
                                                {selectedRequest.description}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Submission Date
                                            </label>
                                            <div className="mt-1 text-sm text-gray-900 dark:text-white">
                                                {new Date(selectedRequest.created_at).toLocaleDateString('en-US')}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Current Status
                                            </label>
                                            <div className="mt-1">
                                                <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(selectedRequest.status)}`}>
                                                    {getStatusLabel(selectedRequest.status)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Decision Choice */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Decision <span className="text-red-500">*</span>
                                    </label>
                                    <div className="space-y-2">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="decision"
                                                value="approved"
                                                checked={processFormData.decision === 'approved'}
                                                onChange={(e) => setProcessFormData({...processFormData, decision: e.target.value})}
                                                className="mr-2"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Approve the request</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="decision"
                                                value="rejected"
                                                checked={processFormData.decision === 'rejected'}
                                                onChange={(e) => setProcessFormData({...processFormData, decision: e.target.value})}
                                                className="mr-2"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">Reject the request</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Conditional Fields for Approved */}
                                {processFormData.decision === 'approved' && (
                                    <div className="space-y-4">
                                        {(selectedRequest.type === 'delay_exam' || selectedRequest.type === 'delay_test') && (
                                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                                                <h5 className="text-md font-medium text-gray-900 dark:text-white mb-3">Exam/Test Rescheduling</h5>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Confirmed New Date <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={processFormData.new_date}
                                                            onChange={(e) => setProcessFormData({...processFormData, new_date: e.target.value})}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Confirmed New Time <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="time"
                                                            value={processFormData.new_time}
                                                            onChange={(e) => setProcessFormData({...processFormData, new_time: e.target.value})}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Room (if needed)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={processFormData.new_room}
                                                            onChange={(e) => setProcessFormData({...processFormData, new_room: e.target.value})}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                            placeholder="e.g., A101"
                                                        />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Message to Send to Students
                                                        </label>
                                                        <textarea
                                                            rows={3}
                                                            value={processFormData.student_message}
                                                            onChange={(e) => setProcessFormData({...processFormData, student_message: e.target.value})}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                            placeholder="Enter message to inform students about the rescheduling..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {selectedRequest.type === 'absence' && (
                                            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                                                <h5 className="text-md font-medium text-gray-900 dark:text-white mb-3">Absence Validation</h5>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Validated Absence Date <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={processFormData.absence_date}
                                                            onChange={(e) => setProcessFormData({...processFormData, absence_date: e.target.value})}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Absence Type <span className="text-red-500">*</span>
                                                        </label>
                                                        <select
                                                            value={processFormData.absence_type}
                                                            onChange={(e) => setProcessFormData({...processFormData, absence_type: e.target.value})}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                        >
                                                            <option value="justified">Justified</option>
                                                            <option value="unjustified">Unjustified</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                            Impact on Sessions or Exams
                                                        </label>
                                                        <textarea
                                                            rows={3}
                                                            value={processFormData.absence_impact}
                                                            onChange={(e) => setProcessFormData({...processFormData, absence_impact: e.target.value})}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                            placeholder="Describe the impact on scheduled sessions or exams..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {(selectedRequest.type === 'cancel_exam' || selectedRequest.type === 'cancel_test') && (
                                            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                                                <h5 className="text-md font-medium text-gray-900 dark:text-white mb-3">Cancellation Confirmation</h5>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Action to Create Automatically
                                                    </label>
                                                    <textarea
                                                        rows={3}
                                                        value={processFormData.cancellation_action}
                                                        onChange={(e) => setProcessFormData({...processFormData, cancellation_action: e.target.value})}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                        placeholder="e.g., Exam cancelled, Session removed, Students notified..."
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Conditional Fields for Rejected */}
                                {processFormData.decision === 'rejected' && (
                                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                                        <h5 className="text-md font-medium text-gray-900 dark:text-white mb-3">Rejection Details</h5>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Rejection Reason <span className="text-red-500">*</span>
                                            </label>
                                            <textarea
                                                rows={4}
                                                value={processFormData.rejection_reason}
                                                onChange={(e) => setProcessFormData({...processFormData, rejection_reason: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                placeholder="Please explain why this request is being rejected..."
                                                required
                                            />
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                This reason will be automatically sent to the teacher as an explanatory message.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Form Buttons */}
                                <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        type="button"
                                        onClick={() => setShowProcessModal(false)}
                                        className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Confirm Decision
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
