import React, { useState } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Clock,
    Calendar,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Search,
    User,
    FileText
} from 'lucide-react';

export default function TeacherRequests({ 
    requests = [],
    stats = {}
}) {
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const handleStatusUpdate = (requestId, newStatus) => {
        if (confirm(`Are you sure you want to ${newStatus === 'approved' ? 'approve' : newStatus === 'rejected' ? 'reject' : 'set to pending'} this request?`)) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = route('responsable.teacher_requests.update', requestId);
            
            const formData = new FormData();
            formData.append('status', newStatus);
            formData.append('_method', 'PUT');
            
            form.submit();
        }
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
            case 'absence': return 'Absence';
            case 'room_change': return 'Room Change';
            case 'time_change': return 'Time Change';
            case 'exam_change': return 'Exam Change';
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

    // Filter requests
    const filteredRequests = requests.filter(request => {
        const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (request.teacher_name && request.teacher_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (request.description && request.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <AuthenticatedLayout header="Teacher Requests Management">
            <Head title="Teacher Requests Management" />
            
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Success Message */}
                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                        {flash.success}
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <AlertTriangle className="text-blue-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total_requests || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Clock className="text-yellow-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.pending_requests || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CheckCircle className="text-green-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Approved</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.approved_requests || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-red-100 rounded-lg">
                                <XCircle className="text-red-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Rejected</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.rejected_requests || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search requests..."
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
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Requests Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">All Teacher Requests</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Teacher
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Urgency
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
                                {filteredRequests.length > 0 ? (
                                    filteredRequests.map((request) => (
                                        <tr key={request.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <User className="h-8 w-8 text-gray-400 mr-3" />
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {request.teacher_name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {request.teacher_email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {getTypeLabel(request.type)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-900">
                                                    <div className="font-medium">{request.title}</div>
                                                    {request.description && (
                                                        <div className="text-gray-500 text-xs mt-1 line-clamp-2">
                                                            {request.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {request.date ? (
                                                    <div className="flex items-center">
                                                        <Calendar className="h-4 w-4 mr-2" />
                                                        {request.date}
                                                        {request.time && <span className="ml-2">{request.time}</span>}
                                                    </div>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                                                    {request.urgency && getUrgencyLabel(request.urgency)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {getStatusIcon(request.status)}
                                                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                                        {getStatusLabel(request.status)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    {request.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusUpdate(request.id, 'approved')}
                                                                className="text-green-600 hover:text-green-900 font-medium"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(request.id, 'rejected')}
                                                                className="text-red-600 hover:text-red-900 font-medium"
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(request.id)}
                                                        className="text-gray-600 hover:text-gray-900 font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                                                <p className="text-gray-500 text-lg font-medium">No requests found</p>
                                                <p className="text-gray-400 text-sm mt-2">
                                                    {searchTerm || statusFilter !== 'all' 
                                                        ? 'Try adjusting your search or filter criteria' 
                                                        : 'No teacher requests have been submitted yet'}
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
