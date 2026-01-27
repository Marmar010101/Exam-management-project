import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Calendar, Clock, Users, CheckCircle, XCircle, Hourglass, AlertCircle, Send, Bell, CheckSquare, XSquare, Search } from 'lucide-react';

export default function ExamIndex({ exams, flash }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterSubtype, setFilterSubtype] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (flash?.success) {
            showNotification(flash.success, 'success');
        }
        if (flash?.error) {
            showNotification(flash.error, 'error');
        }
    }, [flash]);

    const showNotification = (message, type = 'info') => {
        const notification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date().toLocaleTimeString()
        };
        
        setNotifications(prev => [notification, ...prev]);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 5000);
    };

    const filteredExams = exams.filter(exam => {
        const matchesSearch = exam.module?.module_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            exam.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            exam.group?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            exam.teacher?.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            exam.teacher?.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            exam.exam_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            exam.exam_subtype?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            exam.status?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = !filterType || exam.exam_type === filterType;
        const matchesSubtype = !filterSubtype || exam.exam_subtype === filterSubtype;
        const matchesStatus = !filterStatus || exam.status === filterStatus;

        return matchesSearch && matchesType && matchesSubtype && matchesStatus;
    });

    const handleValidate = (examId) => {
        const { post } = useForm();
        post(route('headdepartment.exams.validate', examId), {
            onSuccess: () => {
                showNotification('Exam validated successfully and notification sent to responsible', 'success');
            },
            onError: () => {
                showNotification('Error validating exam', 'error');
            }
        });
    };

    const handleReject = (examId) => {
        const reason = prompt('Please enter rejection reason:');
        if (reason) {
            const { post } = useForm({ reason });
            post(route('headdepartment.exams.reject', examId), {
                onSuccess: () => {
                    showNotification('Exam rejected successfully and notification sent to responsible', 'success');
                },
                onError: () => {
                    showNotification('Error rejecting exam', 'error');
                }
            });
        }
    };

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

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'accepted': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'validated': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'accepted': return <CheckCircle className="h-4 w-4" />;
            case 'rejected': return <XCircle className="h-4 w-4" />;
            case 'pending': return <Hourglass className="h-4 w-4" />;
            case 'validated': return <CheckCircle className="h-4 w-4" />;
            default: return <AlertCircle className="h-4 w-4" />;
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Exam Management" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Notifications */}
                    <div className="fixed top-4 right-4 z-50 space-y-2">
                        {notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-[300px] animate-pulse ${
                                    notification.type === 'success' ? 'bg-green-100 text-green-800 border-green-200' :
                                    notification.type === 'error' ? 'bg-red-100 text-red-800 border-red-200' :
                                    'bg-blue-100 text-blue-800 border-blue-200'
                                }`}
                            >
                                {notification.type === 'success' && <CheckCircle className="h-5 w-5" />}
                                {notification.type === 'error' && <XCircle className="h-5 w-5" />}
                                {notification.type === 'info' && <Bell className="h-5 w-5" />}
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{notification.message}</p>
                                    <p className="text-xs opacity-75">{notification.timestamp}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Exam Management</h1>
                            <p className="text-gray-600 mt-1">Overview of all department exams</p>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Calendar className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">Pending</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {exams.filter(e => e.status === 'pending').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">Accepted</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {exams.filter(e => e.status === 'accepted').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-red-100 rounded-lg">
                                    <XCircle className="h-6 w-6 text-red-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">Rejected</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {exams.filter(e => e.status === 'rejected').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">Validated</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {exams.filter(e => e.status === 'validated').length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search Bar - Above Filters */}
                    <div className="bg-white rounded-lg shadow p-4 mb-6">
                        <div className="relative">
                            <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by module, title, section, teacher, status..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                            />
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow p-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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

                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="accepted">Accepted</option>
                                <option value="rejected">Rejected</option>
                                <option value="validated">Validated</option>
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
                                            Status
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
                                                <div className="flex flex-col space-y-1">
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
                                                <div className="text-sm text-gray-900">
                                                    {exam.teacher?.user?.first_name} {exam.teacher?.user?.last_name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                                                    {getStatusIcon(exam.status)}
                                                    <span className="ml-1">{exam.status}</span>
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    {exam.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleValidate(exam.id)}
                                                                className="text-green-600 hover:text-green-900"
                                                                title="Accept Exam"
                                                            >
                                                                <CheckSquare className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(exam.id)}
                                                                className="text-red-600 hover:text-red-900"
                                                                title="Reject Exam"
                                                            >
                                                                <XSquare className="h-4 w-4" />
                                                            </button>
                                                        </>
                                                    )}
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
                                    {searchTerm || filterType || filterSubtype || filterStatus
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
