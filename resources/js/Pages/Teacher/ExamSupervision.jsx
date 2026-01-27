import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Eye, 
    Calendar, 
    Clock, 
    MapPin, 
    Users,
    AlertTriangle,
    Send,
    X,
    Info
} from 'lucide-react';

export default function TeacherExamSupervision({ 
    surveillances = []
}) {
    const { flash } = usePage().props;
    const [showAbsenceModal, setShowAbsenceModal] = useState(false);
    const [selectedSurveillance, setSelectedSurveillance] = useState(null);
    const [absenceReason, setAbsenceReason] = useState('');

    // Mock data for demonstration
    const mockSurveillances = [
        {
            id: 1,
            module: 'Database Systems',
            group: 'CS2A',
            date: 'January 15, 2025',
            time: '08:00 - 10:00',
            room: 'A101',
            students: 45,
            type: 'Final',
            urgency: 'high'
        },
        {
            id: 2,
            module: 'Algorithm Analysis',
            group: 'CS1B',
            date: 'January 17, 2025',
            time: '10:00 - 12:00',
            room: 'B202',
            students: 38,
            type: 'Midterm',
            urgency: 'normal'
        },
        {
            id: 3,
            module: 'Web Development',
            group: 'CS3A',
            date: 'January 20, 2025',
            time: '14:00 - 16:00',
            room: 'C303',
            students: 42,
            type: 'Final',
            urgency: 'low'
        },
        {
            id: 4,
            module: 'Data Structures',
            group: 'CS2B',
            date: 'January 22, 2025',
            time: '08:00 - 10:00',
            room: 'D404',
            students: 40,
            type: 'Midterm',
            urgency: 'normal'
        },
        {
            id: 5,
            module: 'Machine Learning',
            group: 'CS4A',
            date: 'January 25, 2025',
            time: '10:00 - 12:00',
            room: 'A101',
            students: 35,
            type: 'Final',
            urgency: 'high'
        }
    ];

    const handleAbsenceRequest = (surveillance) => {
        setSelectedSurveillance(surveillance);
        setShowAbsenceModal(true);
        setAbsenceReason('');
    };

    const handleSubmitAbsence = (e) => {
        e.preventDefault();
        if (!absenceReason.trim()) {
            alert('Please provide a reason for your absence request');
            return;
        }
        
        // Here you would normally send the request to your backend
        alert('Absence request submitted successfully!');
        setShowAbsenceModal(false);
        setSelectedSurveillance(null);
        setAbsenceReason('');
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Final':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'Midterm':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case 'high':
                return 'border-red-500 bg-red-50 text-red-700';
            case 'normal':
                return 'border-yellow-500 bg-yellow-50 text-yellow-700';
            case 'low':
                return 'border-green-500 bg-green-50 text-green-700';
            default:
                return 'border-gray-500 bg-gray-50 text-gray-700';
        }
    };

    const getUrgencyLabel = (urgency) => {
        switch (urgency) {
            case 'high':
                return 'Urgent';
            case 'normal':
                return 'Normal';
            case 'low':
                return 'Low';
            default:
                return 'Normal';
        }
    };

    const sortedSurveillances = [...mockSurveillances].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
    });

    return (
        <AuthenticatedLayout header="Exam Supervision">
            <Head title="Exam Supervision" />
            
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Success Message */}
                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                        {flash.success}
                    </div>
                )}

                {/* Info Section */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
                    <div className="flex items-start">
                        <Info className="text-blue-600 mr-3 mt-1" size={20} />
                        <div>
                            <h4 className="font-medium text-blue-900 dark:text-white mb-2">Consultation and Absence Request</h4>
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                You can view all supervisions assigned to you.
                                In case of unavailability, you can send an absence request for a specific supervision.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                <Eye className="text-blue-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{mockSurveillances.length}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Supervisions</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                                <AlertTriangle className="text-red-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {mockSurveillances.filter(s => s.urgency === 'high').length}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Urgent</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                                <Calendar className="text-orange-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {mockSurveillances.filter(s => s.type === 'Final').length}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Final Exams</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                <Users className="text-green-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {mockSurveillances.reduce((sum, s) => sum + s.students, 0)}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Supervision List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Assigned Supervision List</h3>
                        
                        {sortedSurveillances.length === 0 ? (
                            <div className="text-center py-8">
                                <Calendar className="text-gray-400 dark:text-gray-500 mx-auto mb-3" size={48} />
                                <p className="text-gray-500 dark:text-gray-400">No supervisions assigned</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Module
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Group
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Time
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Room
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Students
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Urgency
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {sortedSurveillances.map(surveillance => (
                                            <tr key={surveillance.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {surveillance.module}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-white">{surveillance.group}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 dark:text-white">{surveillance.date}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                                                        <Clock size={16} className="mr-1" />
                                                        {surveillance.time}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                                                        <MapPin size={16} className="mr-1" />
                                                        {surveillance.room}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm text-gray-900 dark:text-white">
                                                        <Users size={16} className="mr-1" />
                                                        {surveillance.students}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(surveillance.type)}`}>
                                                        {surveillance.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs rounded-full border ${getUrgencyColor(surveillance.urgency)}`}>
                                                        {getUrgencyLabel(surveillance.urgency)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button
                                                        onClick={() => handleAbsenceRequest(surveillance)}
                                                        className="text-red-600 hover:text-red-900 font-medium"
                                                    >
                                                        Request Absence
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

                {/* Absence Request Modal */}
                {showAbsenceModal && selectedSurveillance && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-xl bg-white dark:bg-gray-800">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Absence Request</h3>
                                <button
                                    onClick={() => setShowAbsenceModal(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="mb-4">
                                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                    <div className="font-medium text-gray-900 dark:text-white">{selectedSurveillance.module}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {selectedSurveillance.date} • {selectedSurveillance.time}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Room {selectedSurveillance.room} • Group {selectedSurveillance.group}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Reason for Absence <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={absenceReason}
                                    onChange={(e) => setAbsenceReason(e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Please explain the reason for your absence..."
                                    required
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowAbsenceModal(false)}
                                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmitAbsence}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                                >
                                    <Send size={16} className="mr-2" />
                                    Send Request
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
