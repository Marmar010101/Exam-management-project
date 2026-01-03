import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Bell,
    AlertTriangle,
    Info,
    AlertCircle,
    Eye,
    Plus
} from 'lucide-react';

export default function TeacherAlerts({ 
    alerts = [],
    user = null 
}) {
    const { flash } = usePage().props;
    const [showCreateModal, setShowCreateModal] = useState(false);

    const submitAlert = (e) => {
        e.preventDefault();
        const form = e.target;
        form.submit();
    };

    const getAlertIcon = (type) => {
        switch (type) {
            case 'urgent': return <AlertTriangle className="text-red-600" size={20} />;
            case 'warning': return <AlertCircle className="text-yellow-600" size={20} />;
            case 'info': 
            default: return <Info className="text-blue-600" size={20} />;
        }
    };

    const getAlertColor = (type) => {
        switch (type) {
            case 'urgent': return 'bg-red-100 border-red-200';
            case 'warning': return 'bg-yellow-100 border-yellow-200';
            case 'info': 
            default: return 'bg-blue-100 border-blue-200';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200';
            case 'normal': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': 
            default: return 'bg-green-100 text-green-800 border-green-200';
        }
    };

    return (
        <AuthenticatedLayout header="Alertes">
            <Head title="Alertes" />
            
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Success Message */}
                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                        {flash.success}
                    </div>
                )}

                {/* Header with Create Button */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Historique des alertes</h2>
                        <p className="text-gray-600 mt-1">Consultez toutes les alertes administratives</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                        <Plus size={18} className="mr-2" />
                        Créer Alerte
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Bell className="text-blue-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total</p>
                                <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-red-100 rounded-lg">
                                <AlertTriangle className="text-red-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Urgentes</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {alerts.filter(a => a.type === 'urgent').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <AlertCircle className="text-yellow-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Avertissements</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {alerts.filter(a => a.type === 'warning').length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <Info className="text-green-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Informations</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {alerts.filter(a => a.type === 'info').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alerts List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Liste des alertes</h3>
                        
                        {alerts.length === 0 ? (
                            <div className="text-center py-8">
                                <Bell className="text-gray-400 mx-auto mb-3" size={48} />
                                <p className="text-gray-500">Aucune alerte trouvée</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {alerts.map((alert) => (
                                    <div key={alert.id} className={`rounded-lg p-4 border ${getAlertColor(alert.type)}`}>
                                        <div className="flex items-start">
                                            <div className="mr-3">
                                                {getAlertIcon(alert.type)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                                                    <div className="flex items-center space-x-2">
                                                        <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(alert.priority)}`}>
                                                            {alert.priority === 'high' ? 'Élevée' : 
                                                             alert.priority === 'normal' ? 'Normale' : 'Faible'}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            {new Date(alert.created_at).toLocaleDateString('fr-FR')}
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                                                {alert.sender && (
                                                    <p className="text-xs text-gray-500">
                                                        Envoyé par: {alert.sender}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="ml-3">
                                                <button className="text-blue-600 hover:text-blue-900">
                                                    <Eye size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Create Alert Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-xl bg-white">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Créer une Alerte</h3>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <AlertTriangle size={20} />
                                </button>
                            </div>

                            <form method="POST" action={route('teacher.alerts.store')} onSubmit={submitAlert}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Titre de l'alerte <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Titre de l'alerte..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Message <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="message"
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Décrivez votre alerte en détail..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Type d'alerte <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="type"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="info">Information</option>
                                            <option value="warning">Avertissement</option>
                                            <option value="urgent">Urgent</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Priorité <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="priority"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="low">Faible</option>
                                            <option value="normal">Normal</option>
                                            <option value="high">Élevée</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                                    >
                                        <Bell size={16} className="mr-2" />
                                        Créer l'alerte
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
