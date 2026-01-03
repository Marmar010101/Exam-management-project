import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
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

export default function TeacherSurveillance({ 
    surveillances = []
}) {
    const [showAbsenceModal, setShowAbsenceModal] = useState(false);
    const [selectedSurveillance, setSelectedSurveillance] = useState(null);
    const [absenceReason, setAbsenceReason] = useState('');

    // Mock data for demonstration
    const mockSurveillances = [
        {
            id: 1,
            module: 'Database Systems',
            group: 'CS2A',
            date: '15 Janvier 2025',
            time: '08:00 - 10:00',
            room: 'A101',
            type: 'Final',
            students: 45,
            status: 'upcoming',
            urgency: 'high'
        },
        {
            id: 2,
            module: 'Web Development',
            group: 'CS2B',
            date: '17 Janvier 2025',
            time: '14:00 - 16:00',
            room: 'B201',
            type: 'Midterm',
            students: 38,
            status: 'upcoming',
            urgency: 'normal'
        },
        {
            id: 3,
            module: 'Algorithms',
            group: 'CS2A',
            date: '20 Janvier 2025',
            time: '10:00 - 12:00',
            room: 'C301',
            type: 'Final',
            students: 42,
            status: 'upcoming',
            urgency: 'normal'
        },
        {
            id: 4,
            module: 'Computer Networks',
            group: 'CS2C',
            date: '22 Janvier 2025',
            time: '16:00 - 18:00',
            room: 'D101',
            type: 'Final',
            students: 35,
            status: 'upcoming',
            urgency: 'low'
        },
        {
            id: 5,
            module: 'Software Engineering',
            group: 'CS2B',
            date: '25 Janvier 2025',
            time: '09:00 - 11:00',
            room: 'A102',
            type: 'Midterm',
            students: 40,
            status: 'upcoming',
            urgency: 'normal'
        },
        {
            id: 6,
            module: 'Artificial Intelligence',
            group: 'CS2C',
            date: '28 Janvier 2025',
            time: '13:00 - 15:00',
            room: 'B202',
            type: 'Final',
            students: 33,
            status: 'upcoming',
            urgency: 'normal'
        }
    ];

    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case 'high':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'normal':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-800 border-green-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getUrgencyLabel = (urgency) => {
        switch (urgency) {
            case 'high':
                return 'Urgent';
            case 'normal':
                return 'Normal';
            case 'low':
                return 'Faible';
            default:
                return 'Normal';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Final':
                return 'bg-red-100 text-red-800';
            case 'Midterm':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleAbsenceRequest = (surveillance) => {
        setSelectedSurveillance(surveillance);
        setShowAbsenceModal(true);
    };

    const handleSubmitAbsence = () => {
        if (!absenceReason.trim()) {
            alert('Veuillez fournir une raison pour votre demande d\'absence');
            return;
        }

        // Simulate API call
        console.log('Absence request submitted:', {
            surveillance: selectedSurveillance,
            reason: absenceReason
        });

        alert('Demande d\'absence soumise avec succès!');
        setShowAbsenceModal(false);
        setSelectedSurveillance(null);
        setAbsenceReason('');
    };

    const sortedSurveillances = [...mockSurveillances].sort((a, b) => {
        // Sort by date first, then by urgency
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        if (dateA !== dateB) {
            return dateA - dateB;
        }
        const urgencyOrder = { high: 0, normal: 1, low: 2 };
        return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    });

    return (
        <AuthenticatedLayout header="Surveillance des examens">
            <Head title="Surveillance des examens" />
            
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Info Section */}
                <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                    <div className="flex items-start">
                        <Info className="text-blue-600 mr-3 mt-1" size={20} />
                        <div>
                            <h4 className="font-medium text-blue-900 mb-2">Consultation et demande d'absence</h4>
                            <p className="text-sm text-blue-800">
                                Vous pouvez consulter toutes les surveillances qui vous sont assignées. 
                                En cas d'indisponibilité, vous pouvez envoyer une demande d'absence pour une surveillance spécifique.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Eye className="text-blue-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">{mockSurveillances.length}</h3>
                                <p className="text-sm text-gray-600">Total surveillances</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-red-100 rounded-lg">
                                <AlertTriangle className="text-red-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {mockSurveillances.filter(s => s.urgency === 'high').length}
                                </h3>
                                <p className="text-sm text-gray-600">Urgentes</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <Calendar className="text-orange-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {mockSurveillances.filter(s => s.type === 'Final').length}
                                </h3>
                                <p className="text-sm text-gray-600">Examens finaux</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Users className="text-green-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {mockSurveillances.reduce((sum, s) => sum + s.students, 0)}
                                </h3>
                                <p className="text-sm text-gray-600">Total étudiants</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Surveillance List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Liste des surveillances assignées</h3>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Module
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Groupe
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Heure
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Salle
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Étudiants
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Urgence
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sortedSurveillances.map(surveillance => (
                                    <tr key={surveillance.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {surveillance.module}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{surveillance.group}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{surveillance.date}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <Clock size={16} className="mr-1" />
                                                {surveillance.time}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-900">
                                                <MapPin size={16} className="mr-1" />
                                                {surveillance.room}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-sm text-gray-900">
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
                                                Demander absence
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Absence Request Modal */}
                {showAbsenceModal && selectedSurveillance && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-xl bg-white">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Demande d'absence</h3>
                                <button
                                    onClick={() => setShowAbsenceModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="mb-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="font-medium text-gray-900">{selectedSurveillance.module}</div>
                                    <div className="text-sm text-gray-600">
                                        {selectedSurveillance.date} • {selectedSurveillance.time}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Salle {selectedSurveillance.room} • Groupe {selectedSurveillance.group}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Raison de l'absence <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={absenceReason}
                                    onChange={(e) => setAbsenceReason(e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Veuillez expliquer la raison de votre absence..."
                                    required
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowAbsenceModal(false)}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleSubmitAbsence}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                                >
                                    <Send size={16} className="mr-2" />
                                    Envoyer la demande
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
