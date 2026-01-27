import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Plus, Edit2, Trash2, Calendar, Clock, MapPin, Search, X, BookOpen, CheckCircle, XCircle, AlertCircle, Info, User, Clock as PendingIcon } from 'lucide-react';

export default function Exams() {
    const { exams, totalExams, examStats, flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedExam, setSelectedExam] = useState(null);
    const [showValidateModal, setShowValidateModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [activeTab, setActiveTab] = useState('pending');
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');

    // Show notification on component mount if there's a flash message
    React.useEffect(() => {
        console.log('HeadDepartment - flash messages:', flash);
        
        if (flash?.headdepartment_notification) {
            console.log('HeadDepartment - notification found:', flash.headdepartment_notification);
            setNotificationMessage(flash.headdepartment_notification.message);
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 8000);
        }
        
        if (flash?.success) {
            setNotificationMessage(flash.success);
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 8000);
        }
    }, [flash]);

    // Debug: Check if exams are received
    console.log('HeadDepartment Exams - exams received:', exams?.length, exams);

    // Use exams directly without sample
    const allExams = exams || [];

    // Filter exams
    const filteredExams = allExams.filter(exam => {
        const matchesSearch = 
            exam.module?.module_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.exam_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (exam.created_by && exam.created_by.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesSearch;
    });

    // Separate exams by status
    const pendingExams = filteredExams.filter(exam => exam.status === 'pending');
    const processedExams = filteredExams.filter(exam => exam.status !== 'pending');

    const handleValidate = (exam) => {
        setSelectedExam(exam);
        setShowValidateModal(true);
    };

    const confirmValidate = () => {
        router.put(`/HeadDepartment/Exams/${selectedExam.id}/validate`);
        setShowValidateModal(false);
        setSelectedExam(null);
        setTimeout(() => window.location.reload(), 500);
    };

    const handleReject = (exam) => {
        setSelectedExam(exam);
        setShowRejectModal(true);
    };

    const confirmReject = () => {
        router.put(`/HeadDepartment/Exams/${selectedExam.id}/reject`, {
            reason: rejectionReason
        });
        setShowRejectModal(false);
        setSelectedExam(null);
        setRejectionReason('');
        setTimeout(() => window.location.reload(), 500);
    };

    const handleShowDetails = (exam) => {
        setSelectedExam(exam);
        setShowDetailsModal(true);
    };

    return (
        <AuthenticatedLayout header="Exam Management">
            <Head title="Exam Management" />

            <div className="max-w-7xl mx-auto">
                {/* HeadDepartment notification */}
                {showNotification && (
                    <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <AlertCircle className="text-blue-600 mr-3" size={20} />
                            <span className="text-blue-800 font-medium">{notificationMessage}</span>
                        </div>
                        <button
                            onClick={() => setShowNotification(false)}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}

                {/* Success messages */}
                {flash?.success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        {flash.success}
                    </div>
                )}

                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <BookOpen className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Exams</p>
                                <p className="text-2xl font-bold text-gray-900">{totalExams || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <PendingIcon className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Pending</p>
                                <p className="text-2xl font-bold text-gray-900">{examStats?.pending || 0}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white shadow-sm rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-full">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Accepted</p>
                                <p className="text-2xl font-bold text-gray-900">{examStats?.accepted || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search bar */}
                <div className="bg-white shadow-sm rounded-lg mb-6 p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by module, type, created by..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Navigation tabs */}
                <div className="bg-white shadow-sm rounded-lg mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex">
                            <button
                                onClick={() => setActiveTab('pending')}
                                className={`py-3 px-6 border-b-2 font-medium text-sm ${
                                    activeTab === 'pending'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Pending ({pendingExams.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('processed')}
                                className={`py-3 px-6 border-b-2 font-medium text-sm ${
                                    activeTab === 'processed'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Accepted/Rejected ({processedExams.length})
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Pending exams table */}
                {activeTab === 'pending' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Pending Exams</h2>
                                <p className="text-sm text-gray-500 mt-1">Validate or reject exams created by Responsables</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Module
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created By
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {pendingExams.length > 0 ? (
                                        pendingExams.map((exam) => (
                                            <tr key={exam.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <BookOpen className="text-gray-400 mr-2" size={16} />
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {exam.module_name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            exam.exam_type === 'Normal'
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : exam.exam_type === 'Rattrapage'
                                                                ? 'bg-red-100 text-red-800'
                                                                : exam.exam_type === 'Remplacement'
                                                                ? 'bg-orange-100 text-orange-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                    >
                                                        {exam.exam_type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <User className="text-gray-400 mr-2" size={16} />
                                                        <span className="text-sm text-gray-900">
                                                            {exam.created_by || 'Unknown'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => handleValidate(exam)}
                                                            className="text-green-600 hover:text-green-900 transition-colors"
                                                            title="Validate"
                                                        >
                                                            <CheckCircle size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(exam)}
                                                            className="text-red-600 hover:text-red-900 transition-colors"
                                                            title="Reject"
                                                        >
                                                            <XCircle size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleShowDetails(exam)}
                                                            className="text-blue-600 hover:text-blue-900 transition-colors"
                                                            title="Details"
                                                        >
                                                            <Info size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center">
                                                <div className="text-gray-500">
                                                    <BookOpen className="mx-auto mb-2" size={48} />
                                                    <p className="text-sm">
                                                        {searchTerm ? 'No exams found for this search' : 'No pending exams'}
                                                    </p>
                                                    <p className="text-xs mt-1">
                                                        {searchTerm ? 'Try another search' : 'All exams have been processed'}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Validation Modal */}
                {showValidateModal && selectedExam && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                            <div className="flex items-center mb-4">
                                <CheckCircle className="text-green-600 mr-3" size={24} />
                                <h3 className="text-lg font-semibold text-gray-900">Accept Exam</h3>
                            </div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">Are you sure you want to accept this exam?</p>
                                <div className="bg-gray-50 p-3 rounded mb-3">
                                    <p className="text-sm"><strong>Module:</strong> {selectedExam.module_name}</p>
                                    <p className="text-sm"><strong>Type:</strong> {selectedExam.exam_type}</p>
                                    <p className="text-sm"><strong>Created By:</strong> {selectedExam.created_by}</p>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowValidateModal(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmValidate}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                                >
                                    Accept
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Rejection Modal */}
                {showRejectModal && selectedExam && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                            <div className="flex items-center mb-4">
                                <XCircle className="text-red-600 mr-3" size={24} />
                                <h3 className="text-lg font-semibold text-gray-900">Reject Exam</h3>
                            </div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 mb-2">Are you sure you want to reject this exam?</p>
                                <div className="bg-gray-50 p-3 rounded mb-3">
                                    <p className="text-sm"><strong>Module:</strong> {selectedExam.module_name}</p>
                                    <p className="text-sm"><strong>Type:</strong> {selectedExam.exam_type}</p>
                                    <p className="text-sm"><strong>Created By:</strong> {selectedExam.created_by}</p>
                                </div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Rejection reason:
                                </label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                    rows="3"
                                    placeholder="Explain why you are rejecting this exam..."
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setShowRejectModal(false);
                                        setRejectionReason('');
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmReject}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
