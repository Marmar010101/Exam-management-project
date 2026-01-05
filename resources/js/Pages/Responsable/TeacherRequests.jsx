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
    Filter,
    Search
} from 'lucide-react';

export default function HeadDepartmentTeacherRequests({ 
    requests = [],
    user = null 
}) {
    const { flash } = usePage().props;
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const handleStatusUpdate = (requestId, newStatus) => {
        if (confirm(`Êtes-vous sûr de vouloir ${newStatus === 'approved' ? 'approuver' : newStatus === 'rejected' ? 'refuser' : 'mettre en attente'} cette demande ?`)) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = route('headdepartment.teacher_requests.update', requestId);
            
            const formData = new FormData();
            formData.append('status', newStatus);
            
            form.submit();
        }
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

    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case 'high': return 'bg-red-100 text-red-800 border-red-200';
            case 'normal': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Filter requests
    const filteredRequests = requests.filter(request => {
        const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (request.user?.name && request.user.name.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'pending').length,
        approved: requests.filter(r => r.status === 'approved').length,
        rejected: requests.filter(r => r.status === 'rejected').length
    };

    return (
        <AuthenticatedLayout header="Gestion des Demandes">
            <Head title="Gestion des Demandes" />
            
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
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 rounded-lg">
                                <Clock className="text-yellow-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">En attente</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <CheckCircle className="text-green-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Approuvées</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-red-100 rounded-lg">
                                <XCircle className="text-red-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Refusées</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Rechercher par titre ou enseignant..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="sm:w-48">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">Tous les statuts</option>
                                <option value="pending">En attente</option>
                                <option value="approved">Approuvées</option>
                                <option value="rejected">Refusées</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Requests List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Liste des demandes</h3>
                        
                        {filteredRequests.length === 0 ? (
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
                                                Enseignant
                                            </th>
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
                                                Urgence
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
                                        {filteredRequests.map((request) => (
                                            <tr key={request.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {request.user?.name || 'N/A'}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {request.user?.email || ''}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900">
                                                        {getTypeLabel(request.type)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {request.title}
                                                    </div>
                                                    {request.module && (
                                                        <div className="text-sm text-gray-500">
                                                            Module: {request.module.name}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {request.date ? new Date(request.date).toLocaleDateString('fr-FR') : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs rounded-full border ${getUrgencyColor(request.urgency)}`}>
                                                        {request.urgency === 'high' ? 'Urgent' : 
                                                         request.urgency === 'normal' ? 'Normal' : 'Faible'}
                                                    </span>
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
                                                    {/* Show details button */}
                                                    <button className="text-blue-600 hover:text-blue-900 mr-2">
                                                        <Eye size={16} />
                                                    </button>
                                                    
                                                    {/* Action buttons for Head Department */}
                                                    {request.status === 'pending' && (
                                                        <>
                                                            <button 
                                                                onClick={() => handleStatusUpdate(request.id, 'approved')}
                                                                className="text-green-600 hover:text-green-900 mr-2"
                                                                title="Approuver"
                                                            >
                                                                <CheckCircle size={16} />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleStatusUpdate(request.id, 'rejected')}
                                                                className="text-red-600 hover:text-red-900"
                                                                title="Refuser"
                                                            >
                                                                <XCircle size={16} />
                                                            </button>
                                                        </>
                                                    )}
                                                    {request.status !== 'pending' && (
                                                        <button 
                                                            onClick={() => handleStatusUpdate(request.id, 'pending')}
                                                            className="text-yellow-600 hover:text-yellow-900"
                                                            title="Mettre en attente"
                                                        >
                                                            <Clock size={16} />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
