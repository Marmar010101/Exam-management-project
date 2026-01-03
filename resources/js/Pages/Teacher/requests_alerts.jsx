import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
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
    const [showAbsenceModal, setShowAbsenceModal] = useState(false);
    const [showDelayModal, setShowDelayModal] = useState(false);
    const [selectedSurveillance, setSelectedSurveillance] = useState(null);
    const [selectedExam, setSelectedExam] = useState(null);

    // Stats for dashboard
    const stats = {
        modulesCount: modules.length,
        surveillancesCount: surveillances.length,
        upcomingExamsCount: exams.filter(e => new Date(e.date) > new Date()).length,
        pendingRequestsCount: requests.filter(r => r.status === 'pending').length
    };

    const handleAbsenceRequest = (surveillance) => {
        setSelectedSurveillance(surveillance);
        setShowAbsenceModal(true);
    };

    const handleDelayRequest = (exam) => {
        setSelectedExam(exam);
        setShowDelayModal(true);
    };

    const submitAbsenceRequest = (e) => {
        e.preventDefault();
        const form = e.target;
        form.submit();
    };

    const submitDelayRequest = (e) => {
        e.preventDefault();
        const form = e.target;
        form.submit();
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'absence': return 'Absence';
            case 'delay_date': return 'Changement de date';
            case 'delay_duration': return 'Changement de durée';
            case 'other': return 'Autre';
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

    return (
        <AuthenticatedLayout header="Demandes & Alertes">
            <Head title="Demandes & Alertes" />
            
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Success Message */}
                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                        {flash.success}
                    </div>
                )}

                {/* Dashboard Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <BookOpen className="text-blue-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Modules assignés</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.modulesCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <Calendar className="text-purple-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Surveillances</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.surveillancesCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-orange-100 rounded-lg">
                                <AlertTriangle className="text-orange-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Examens à venir</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.upcomingExamsCount}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Bell className="text-yellow-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Demandes en attente</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.pendingRequestsCount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('requests')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'requests'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-center">
                                    <Send size={16} className="mr-2" />
                                    Mes Demandes
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('surveillances')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'surveillances'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-center">
                                    <Calendar size={16} className="mr-2" />
                                    Surveillance
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('exams')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'exams'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-center">
                                    <BookOpen size={16} className="mr-2" />
                                    Examens & Modules
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('alerts')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'alerts'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-center">
                                    <Bell size={16} className="mr-2" />
                                    Alertes
                                </div>
                            </button>
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* Mes Demandes Tab */}
                        {activeTab === 'requests' && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique de mes demandes</h3>
                                {requests.length === 0 ? (
                                    <div className="text-center py-8">
                                        <AlertTriangle className="text-gray-400 mx-auto mb-3" size={48} />
                                        <p className="text-gray-500">Aucune demande trouvée</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Type
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Titre
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Date
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Statut
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Date de réponse
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {requests.map((request) => (
                                                    <tr key={request.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="text-sm text-gray-900">
                                                                {getTypeLabel(request.type)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {request.title}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {request.date ? new Date(request.date).toLocaleDateString('fr-FR') : '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                {getStatusIcon(request.status)}
                                                                <span className={`ml-2 px-2 py-1 text-xs rounded-full border ${getStatusColor(request.status)}`}>
                                                                    {request.status === 'pending' ? 'En attente' :
                                                                     request.status === 'approved' ? 'Acceptée' : 'Refusée'}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {request.response_date ? 
                                                                new Date(request.response_date).toLocaleDateString('fr-FR') : '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button className="text-blue-600 hover:text-blue-900">
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
                        )}

                        {/* Surveillance Tab */}
                        {activeTab === 'surveillances' && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Mes surveillances assignées</h3>
                                {surveillances.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Calendar className="text-gray-400 mx-auto mb-3" size={48} />
                                        <p className="text-gray-500">Aucune surveillance assignée</p>
                                    </div>
                                ) : (
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
                                                        Type
                                                    </th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {surveillances.map((surveillance) => (
                                                    <tr key={surveillance.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {surveillance.module}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {surveillance.group}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(surveillance.date).toLocaleDateString('fr-FR')}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {surveillance.time}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {surveillance.room}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                                surveillance.urgency === 'high' 
                                                                    ? 'bg-red-100 text-red-800 border-red-200'
                                                                    : 'bg-blue-100 text-blue-800 border-blue-200'
                                                            }`}>
                                                                {surveillance.urgency === 'high' ? 'Urgent' : 'Normal'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button 
                                                                onClick={() => handleAbsenceRequest(surveillance)}
                                                                className="text-red-600 hover:text-red-900"
                                                                title="Demander absence"
                                                            >
                                                                <Send size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Examens & Modules Tab */}
                        {activeTab === 'exams' && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Mes examens et modules</h3>
                                
                                {/* Modules Section */}
                                <div className="mb-8">
                                    <h4 className="text-md font-medium text-gray-900 mb-3">Modules assignés</h4>
                                    {modules.length === 0 ? (
                                        <div className="text-center py-4">
                                            <BookOpen className="text-gray-400 mx-auto mb-2" size={32} />
                                            <p className="text-gray-500">Aucun module assigné</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {modules.map((module) => (
                                                <div key={module.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                    <h5 className="font-medium text-gray-900">{module.name}</h5>
                                                    <p className="text-sm text-gray-600">{module.code}</p>
                                                    <p className="text-sm text-gray-500">{module.speciality}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Exams Section */}
                                <div>
                                    <h4 className="text-md font-medium text-gray-900 mb-3">Examens à venir</h4>
                                    {exams.length === 0 ? (
                                        <div className="text-center py-4">
                                            <Calendar className="text-gray-400 mx-auto mb-2" size={32} />
                                            <p className="text-gray-500">Aucun examen à venir</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Module
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Type
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Date
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Durée
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Groupe
                                                        </th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {exams.map((exam) => (
                                                        <tr key={exam.id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {exam.module}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                                    exam.type === 'normal' 
                                                                        ? 'bg-green-100 text-green-800 border-green-200'
                                                                        : 'bg-orange-100 text-orange-800 border-orange-200'
                                                                }`}>
                                                                    {exam.type === 'normal' ? 'Normal' : 'Rattrapage'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {new Date(exam.date).toLocaleDateString('fr-FR')}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {exam.duration}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {exam.group}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <button 
                                                                    onClick={() => handleDelayRequest(exam)}
                                                                    className="text-blue-600 hover:text-blue-900"
                                                                    title="Demander changement"
                                                                >
                                                                    <Send size={16} />
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
                        )}

                        {/* Alertes Tab */}
                        {activeTab === 'alerts' && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertes administratives</h3>
                                {alerts.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Bell className="text-gray-400 mx-auto mb-3" size={48} />
                                        <p className="text-gray-500">Aucune alerte</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {alerts.map((alert) => (
                                            <div key={alert.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                                <div className="flex items-start">
                                                    <div className={`p-2 rounded-lg mr-3 ${
                                                        alert.type === 'urgent' 
                                                            ? 'bg-red-100' 
                                                            : alert.type === 'info' 
                                                            ? 'bg-blue-100' 
                                                            : 'bg-yellow-100'
                                                    }`}>
                                                        <Bell className={`${
                                                            alert.type === 'urgent' 
                                                                ? 'text-red-600' 
                                                                : alert.type === 'info' 
                                                                ? 'text-blue-600' 
                                                                : 'text-yellow-600'
                                                        }`} size={20} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className="font-medium text-gray-900">{alert.title}</h4>
                                                            <span className="text-sm text-gray-500">
                                                                {new Date(alert.created_at).toLocaleDateString('fr-FR')}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600">{alert.message}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Absence Request Modal */}
                {showAbsenceModal && selectedSurveillance && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-xl bg-white">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Demande d'absence</h3>
                                <button
                                    onClick={() => setShowAbsenceModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <XCircle size={20} />
                                </button>
                            </div>

                            <form method="POST" action={route('teacher.requests.store')} onSubmit={submitAbsenceRequest}>
                                <div className="space-y-4">
                                    <input type="hidden" name="type" value="absence" />
                                    <input type="hidden" name="module_id" value={selectedSurveillance.module_id} />
                                    <input type="hidden" name="date" value={selectedSurveillance.date} />
                                    <input type="hidden" name="time" value={selectedSurveillance.time} />
                                    <input type="hidden" name="room" value={selectedSurveillance.room} />
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Titre <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            defaultValue={`Demande d'absence - ${selectedSurveillance.module}`}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Raison <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="description"
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Veuillez expliquer la raison de votre absence..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Urgence <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="urgency"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="low">Faible</option>
                                            <option value="normal">Normal</option>
                                            <option value="high">Urgent</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowAbsenceModal(false)}
                                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                                    >
                                        <Send size={16} className="mr-2" />
                                        Envoyer la demande
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delay Request Modal */}
                {showDelayModal && selectedExam && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-xl bg-white">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Demande de changement</h3>
                                <button
                                    onClick={() => setShowDelayModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <XCircle size={20} />
                                </button>
                            </div>

                            <form method="POST" action={route('teacher.requests.store')} onSubmit={submitDelayRequest}>
                                <div className="space-y-4">
                                    <input type="hidden" name="module_id" value={selectedExam.module_id} />
                                    <input type="hidden" name="date" value={selectedExam.date} />
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Type de demande <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="type"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="delay_date">Changement de date</option>
                                            <option value="delay_duration">Changement de durée</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Titre <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            defaultValue={`Demande de modification - ${selectedExam.module}`}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="description"
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Veuillez expliquer la raison de votre demande..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nouvelle valeur <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="new_duration"
                                            placeholder="ex: 3 heures ou nouvelle date"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Urgence <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="urgency"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="low">Faible</option>
                                            <option value="normal">Normal</option>
                                            <option value="high">Urgent</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowDelayModal(false)}
                                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                                    >
                                        <Send size={16} className="mr-2" />
                                        Envoyer la demande
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
