import React, { useState } from 'react';
import { Head, usePage, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Clock,
    Calendar,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Eye,
    BookOpen,
    Users,
    Bell,
    Send,
    Plus
} from 'lucide-react';

export default function TeacherRequestsAlerts({ 
    requests = [],
    modules = [],
    exams = [],
    surveillances = [],
    alerts = [],
    user = null 
}) {
    const { flash } = usePage().props;
    const [activeTab, setActiveTab] = useState('requests');
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [selectedRequestType, setSelectedRequestType] = useState('');
    
    const { data, setData, post, processing, errors, reset } = useForm({
        type: '',
        title: '',
        description: '',
        urgency: 'normal',
        module_id: '',
        exam_id: '',
        new_date: '',
        new_time: '',
        reason: '',
        justification_file: null
    });

    // Stats for dashboard
    const stats = {
        modulesCount: modules.length,
        surveillancesCount: surveillances.length,
        upcomingExamsCount: exams.filter(e => new Date(e.date) > new Date()).length,
        pendingRequestsCount: requests.filter(r => r.status === 'pending').length
    };

    const handleCreateRequest = (type) => {
        setSelectedRequestType(type);
        setData({
            ...data,
            type: type,
            title: getRequestTitle(type)
        });
        setShowRequestModal(true);
    };

    const getRequestTitle = (type) => {
        switch (type) {
            case 'delay_exam': return 'Delay Exam Request';
            case 'delay_test': return 'Delay Test Request';
            case 'absence': return 'Absence Request';
            case 'cancel_exam': return 'Cancel Exam Request';
            case 'cancel_test': return 'Cancel Test Request';
            default: return 'Request';
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'approved': return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const submitRequest = (e) => {
        e.preventDefault();
        
        post(route('teacher.requests.store'), {
            onSuccess: () => {
                setShowRequestModal(false);
                reset();
                // Reload page to show new request
                window.location.reload();
            },
            onError: (errors) => {
                console.log('Form errors:', errors);
            }
        });
    };

    return (
        <AuthenticatedLayout header="Teacher Requests">
            <Head title="Teacher Requests" />
            
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header with Create Request Button */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Request History</h2>
                    <button
                        onClick={() => setShowRequestModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                    >
                        <Plus size={20} className="mr-2" />
                        Create Request
                    </button>
                </div>

                {/* Success Message */}
                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                        {flash.success}
                    </div>
                )}

                {/* My Requests */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Requests</h3>
                        {requests.length === 0 ? (
                            <div className="text-center py-8">
                                <Bell className="text-gray-400 dark:text-gray-500 mx-auto mb-3" size={48} />
                                <p className="text-gray-500 dark:text-gray-400">No requests found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
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
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Response Date
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {requests.map((request) => (
                                            <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900 dark:text-white">
                                                        {getTypeLabel(request.type)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {request.title}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {request.date ? new Date(request.date).toLocaleDateString('en-US') : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {getStatusIcon(request.status)}
                                                        <span className={`ml-2 px-2 py-1 text-xs rounded-full border ${getStatusColor(request.status)}`}>
                                                            {request.status === 'pending' ? 'Pending' :
                                                             request.status === 'approved' ? 'Approved' : 'Rejected'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {request.response_date ? 
                                                        new Date(request.response_date).toLocaleDateString('en-US') : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400">
                                                        <Eye size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Request Modal */}
                {showRequestModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-xl bg-white dark:bg-gray-800">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Create New Request
                                </h3>
                                <button
                                    onClick={() => setShowRequestModal(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500"
                                >
                                    <XCircle size={20} />
                                </button>
                            </div>

                            <form onSubmit={submitRequest}>
                                <div className="space-y-4">
                                    {/* Request Type Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Request Type <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.type}
                                            onChange={(e) => {
                                                setData('type', e.target.value);
                                                setData('title', getRequestTitle(e.target.value));
                                                setSelectedRequestType(e.target.value);
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            required
                                        >
                                            <option value="">Select request type...</option>
                                            <option value="delay_exam">Delay Exam</option>
                                            <option value="delay_test">Delay Test</option>
                                            <option value="absence">Be Absent</option>
                                            <option value="cancel_exam">Cancel Exam</option>
                                            <option value="cancel_test">Cancel Test</option>
                                        </select>
                                        {errors.type && (
                                            <p className="mt-1 text-sm text-red-600">{errors.type}</p>
                                        )}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Title <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        {errors.title && (
                                            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Reason <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            rows={4}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            placeholder="Please explain the reason for your request..."
                                            required
                                        />
                                        {errors.description && (
                                            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Urgency <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.urgency}
                                            onChange={(e) => setData('urgency', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            required
                                        >
                                            <option value="low">Low</option>
                                            <option value="normal">Normal</option>
                                            <option value="high">High</option>
                                        </select>
                                        {errors.urgency && (
                                            <p className="mt-1 text-sm text-red-600">{errors.urgency}</p>
                                        )}
                                    </div>

                                    {(selectedRequestType === 'delay_exam' || selectedRequestType === 'delay_test') && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                New Date <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={data.new_date}
                                                onChange={(e) => setData('new_date', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                                required
                                            />
                                            {errors.new_date && (
                                                <p className="mt-1 text-sm text-red-600">{errors.new_date}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Justification File Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Justification File (if available)
                                        </label>
                                        <input
                                            type="file"
                                            onChange={(e) => setData('justification_file', e.target.files[0])}
                                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        />
                                        {errors.justification_file && (
                                            <p className="mt-1 text-sm text-red-600">{errors.justification_file}</p>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            Upload supporting documents (PDF, DOC, DOCX, JPG, PNG - Max 5MB)
                                        </p>
                                    </div>

                                    {/* Small letter note */}
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                        <p className="text-sm text-blue-800 dark:text-blue-200">
                                            <strong>Note:</strong> Please provide a detailed explanation. You may upload supporting documents if available. 
                                            All requests are subject to approval by the responsible administrator.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowRequestModal(false)}
                                        className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                                        disabled={processing}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-r-2 border-t-2 border-l-2 border-blue-600 mr-2"></div>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={16} className="mr-2" />
                                                Submit Request
                                            </>
                                        )}
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
