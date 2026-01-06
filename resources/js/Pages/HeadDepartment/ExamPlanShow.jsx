import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { 
    Calendar, 
    Clock, 
    Users, 
    BookOpen, 
    MapPin,
    User,
    AlertCircle,
    CheckCircle,
    XCircle,
    ArrowLeft,
    Edit,
    Trash2
} from 'lucide-react';

export default function ExamPlanShow({ examPlan }) {
    const { flash = {} } = usePage().props;
    const [showValidationModal, setShowValidationModal] = useState(false);
    const [validationNotes, setValidationNotes] = useState('');
    const [validationAction, setValidationAction] = useState('validate');

    const handleValidate = (action) => {
        setValidationAction(action);
        setValidationNotes('');
        setShowValidationModal(true);
    };

    const handleSubmitValidation = () => {
        router.post(`/headdepartment/exam-plans/${examPlan.id}/validate`, {
            action: validationAction,
            validation_notes: validationNotes
        }, {
            onSuccess: () => {
                setShowValidationModal(false);
                setValidationNotes('');
            }
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'validated': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'scheduled': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <AlertCircle className="h-5 w-5" />;
            case 'validated': return <CheckCircle className="h-5 w-5" />;
            case 'rejected': return <XCircle className="h-5 w-5" />;
            case 'scheduled': return <Calendar className="h-5 w-5" />;
            default: return <AlertCircle className="h-5 w-5" />;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Exam Plan Details" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <button
                                    onClick={() => router.visit('/headdepartment/exams_planing')}
                                    className="mr-4 p-2 text-gray-600 hover:text-gray-900"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Exam Plan Details</h1>
                                    <p className="mt-2 text-gray-600">Complete information about this exam plan</p>
                                </div>
                            </div>
                            {examPlan.status === 'pending' && (
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => handleValidate('validate')}
                                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        <CheckCircle size={18} className="mr-2" />
                                        Validate
                                    </button>
                                    <button
                                        onClick={() => handleValidate('reject')}
                                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        <XCircle size={18} className="mr-2" />
                                        Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Flash Messages */}
                    {flash.success && (
                        <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
                            <div className="flex">
                                <CheckCircle className="h-5 w-5 text-green-400" />
                                <div className="ml-3">
                                    <p className="text-sm text-green-800">{flash.success}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {flash.error && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
                            <div className="flex">
                                <XCircle className="h-5 w-5 text-red-400" />
                                <div className="ml-3">
                                    <p className="text-sm text-red-800">{flash.error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Exam Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Exam Information Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900">Exam Information</h2>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(examPlan.status)}`}>
                                        {getStatusIcon(examPlan.status)}
                                        <span className="ml-1">{examPlan.status}</span>
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Module</label>
                                            <div className="mt-1 flex items-center">
                                                <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                                                <span className="text-sm text-gray-900">{examPlan.module_name}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Group</label>
                                            <div className="mt-1 flex items-center">
                                                <Users className="h-4 w-4 mr-2 text-gray-400" />
                                                <span className="text-sm text-gray-900">{examPlan.group_name}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Exam Type</label>
                                            <div className="mt-1">
                                                <span className="text-sm text-gray-900">{examPlan.exam_type}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Duration</label>
                                            <div className="mt-1">
                                                <span className="text-sm text-gray-900">{examPlan.duration_minutes} minutes</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Date</label>
                                            <div className="mt-1 flex items-center">
                                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                                <span className="text-sm text-gray-900">{examPlan.formatted_date}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Time</label>
                                            <div className="mt-1 flex items-center">
                                                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                                <span className="text-sm text-gray-900">{examPlan.formatted_time}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Room</label>
                                            <div className="mt-1 flex items-center">
                                                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                                                <span className="text-sm text-gray-900">{examPlan.room_name}</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Teacher</label>
                                            <div className="mt-1 flex items-center">
                                                <User className="h-4 w-4 mr-2 text-gray-400" />
                                                <span className="text-sm text-gray-900">{examPlan.teacher_name}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {examPlan.description && (
                                    <div className="mt-6">
                                        <label className="block text-sm font-medium text-gray-500">Description</label>
                                        <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-700">{examPlan.description}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Validation Information */}
                            {(examPlan.status === 'validated' || examPlan.status === 'rejected' || examPlan.status === 'scheduled') && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Validation Information</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Validated By</label>
                                            <div className="mt-1 text-sm text-gray-900">{examPlan.validator?.first_name} {examPlan.validator?.last_name}</div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">Validated At</label>
                                            <div className="mt-1 text-sm text-gray-900">{examPlan.validated_at}</div>
                                        </div>
                                        {examPlan.validation_notes && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-500">Validation Notes</label>
                                                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                                    <p className="text-sm text-gray-700">{examPlan.validation_notes}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Status & Actions */}
                        <div className="space-y-6">
                            {/* Status Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Status Information</h2>
                                <div className="text-center">
                                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getStatusColor(examPlan.status)} mb-4`}>
                                        {getStatusIcon(examPlan.status)}
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 capitalize">{examPlan.status}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {examPlan.status === 'pending' && 'Waiting for validation'}
                                        {examPlan.status === 'validated' && 'Approved by Head Department'}
                                        {examPlan.status === 'rejected' && 'Rejected by Head Department'}
                                        {examPlan.status === 'scheduled' && 'Scheduled and confirmed'}
                                    </p>
                                </div>
                            </div>

                            {/* Created By Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Created By</h2>
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                        <User className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{examPlan.created_by}</div>
                                        <div className="text-sm text-gray-500">{examPlan.created_at}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Validation Modal */}
            {showValidationModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                {validationAction === 'validate' ? 'Validate Exam Plan' : 'Reject Exam Plan'}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {validationAction === 'validate' 
                                    ? 'Are you sure you want to validate this exam plan?' 
                                    : 'Are you sure you want to reject this exam plan?'}
                            </p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Validation Notes (optional)
                            </label>
                            <textarea
                                value={validationNotes}
                                onChange={(e) => setValidationNotes(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder={validationAction === 'validate' 
                                    ? 'Add any notes about this validation...' 
                                    : 'Reason for rejection...'}
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowValidationModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitValidation}
                                className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                                    validationAction === 'validate'
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-red-600 hover:bg-red-700'
                                }`}
                            >
                                {validationAction === 'validate' ? 'Validate' : 'Reject'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
