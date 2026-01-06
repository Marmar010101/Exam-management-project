import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { 
    Calendar, 
    Clock, 
    Users, 
    BookOpen, 
    Filter, 
    ChevronLeft, 
    ChevronRight, 
    Plus, 
    Edit, 
    Trash2,
    MapPin,
    User,
    AlertCircle,
    CheckCircle,
    XCircle,
    Eye,
    MessageSquare,
    Search
} from 'lucide-react';

export default function Exams_planning({ examPlans = [], stats = {} }) {
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showValidationModal, setShowValidationModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [validationNotes, setValidationNotes] = useState('');
    const [validationAction, setValidationAction] = useState('validate'); // 'validate' or 'reject'

    // Filtrer les exam plans
    const filteredPlans = examPlans.filter(plan => {
        const matchesSearch = plan.group_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            plan.module_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            plan.teacher_name.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || plan.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const handleValidate = (plan, action) => {
        setSelectedPlan(plan);
        setValidationAction(action);
        setValidationNotes('');
        setShowValidationModal(true);
    };

    const handleSubmitValidation = () => {
        if (!selectedPlan) return;

        router.post(`/headdepartment/exam-plans/${selectedPlan.id}/validate`, {
            action: validationAction,
            validation_notes: validationNotes
        }, {
            onSuccess: () => {
                setShowValidationModal(false);
                setSelectedPlan(null);
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
            case 'pending': return <AlertCircle className="h-4 w-4" />;
            case 'validated': return <CheckCircle className="h-4 w-4" />;
            case 'rejected': return <XCircle className="h-4 w-4" />;
            case 'scheduled': return <Calendar className="h-4 w-4" />;
            default: return <AlertCircle className="h-4 w-4" />;
        }
    };
    
    return (
        <AuthenticatedLayout>
            <Head title="Exam Plans Validation" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Exam Plans Validation</h1>
                        <p className="mt-2 text-gray-600">Review and validate exam plans submitted by responsables</p>
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

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Calendar className="text-blue-600" size={24} />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">{stats.pending_count || 0}</h3>
                                    <p className="text-sm text-gray-600">Pending</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <CheckCircle className="text-green-600" size={24} />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">{stats.validated_count || 0}</h3>
                                    <p className="text-sm text-gray-600">Validated</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-red-100 rounded-lg">
                                    <XCircle className="text-red-600" size={24} />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">{stats.rejected_count || 0}</h3>
                                    <p className="text-sm text-gray-600">Rejected</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <AlertCircle className="text-purple-600" size={24} />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">{stats.scheduled_count || 0}</h3>
                                    <p className="text-sm text-gray-600">Scheduled</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search exam plans..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="md:w-48">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

                    {/* Exam Plans List */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Group / Module
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date & Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Teacher / Room
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
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
                                    {filteredPlans.length > 0 ? (
                                        filteredPlans.map((plan) => (
                                            <tr key={plan.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900">{plan.group_name}</div>
                                                        <div className="text-sm text-gray-500">{plan.module_name}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-gray-900">
                                                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                                        {plan.formatted_date}
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-500">
                                                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                                                        {plan.formatted_time}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{plan.teacher_name}</div>
                                                    <div className="text-sm text-gray-500">{plan.room_name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                                                        {getStatusIcon(plan.status)}
                                                        <span className="ml-1">{plan.status}</span>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {plan.created_by}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => router.visit(`/headdepartment/exam-plans/${plan.id}`)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        {plan.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleValidate(plan, 'validate')}
                                                                    className="text-green-600 hover:text-green-900"
                                                                >
                                                                    <CheckCircle size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleValidate(plan, 'reject')}
                                                                    className="text-red-600 hover:text-red-900"
                                                                >
                                                                    <XCircle size={16} />
                                                                </button>
                                                            </>
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
                                                            : 'No exam plans have been submitted yet'}
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
            </div>

            {/* Validation Modal */}
            {showValidationModal && selectedPlan && (
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

                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">Exam Plan Details:</h4>
                            <div className="text-sm text-gray-600 space-y-1">
                                <div><strong>Group:</strong> {selectedPlan.group_name}</div>
                                <div><strong>Module:</strong> {selectedPlan.module_name}</div>
                                <div><strong>Date:</strong> {selectedPlan.formatted_date}</div>
                                <div><strong>Time:</strong> {selectedPlan.formatted_time}</div>
                                <div><strong>Teacher:</strong> {selectedPlan.teacher_name}</div>
                                <div><strong>Room:</strong> {selectedPlan.room_name}</div>
                            </div>
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
