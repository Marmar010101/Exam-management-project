import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Plus, Edit2, Trash2, MapPin, Users } from 'lucide-react';

export default function Salles() {
    const { rooms, flash } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [formData, setFormData] = useState({
        room_name: '',
        room_capacity: '',
        room_type: '',
        availability: 'Disponible'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingRoom) {
            router.put(route('rooms.update', editingRoom.id), formData, {
                onSuccess: () => {
                    setShowModal(false);
                    setEditingRoom(null);
                    resetForm();
                }
            });
        } else {
            router.post(route('rooms.store'), formData, {
                onSuccess: () => {
                    setShowModal(false);
                    resetForm();
                }
            });
        }
    };

    const handleEdit = (room) => {
        setEditingRoom(room);
        setFormData({
            room_name: room.room_name,
            room_capacity: room.room_capacity,
            room_type: room.room_type,
            availability: room.availability === 'Disponible' ? 'Disponible' : 'Indisponible'
        });
        setShowModal(true);
    };

    const handleDelete = (roomId) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) {
            router.delete(route('rooms.destroy', roomId));
        }
    };

    const resetForm = () => {
        setFormData({
            room_name: '',
            room_capacity: '',
            room_type: '',
            availability: 'Disponible'
        });
    };

    const openModal = () => {
        setEditingRoom(null);
        resetForm();
        setShowModal(true);
    };

    return (
        <AuthenticatedLayout header="Gestion des Salles">
            <Head title="Gestion des Salles" />

            <div className="max-w-7xl mx-auto">
                {/* Messages de succès/erreur */}
                {flash?.success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        {flash.success}
                    </div>
                )}

                {/* Carte principale */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    {/* En-tête avec bouton d'ajout */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Liste des Salles</h2>
                                <p className="text-sm text-gray-500 mt-1">Gérez les salles d'examen disponibles</p>
                            </div>
                            <button
                                onClick={openModal}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                <Plus size={20} />
                                <span>Ajouter une salle</span>
                            </button>
                        </div>
                    </div>

                    {/* Tableau des salles */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nom de la salle
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Capacité
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {rooms?.length > 0 ? (
                                    rooms.map((room) => (
                                        <tr key={room.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <MapPin className="text-gray-400 mr-2" size={16} />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {room.room_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Users className="text-gray-400 mr-2" size={16} />
                                                    <span className="text-sm text-gray-900">
                                                        {room.room_capacity} personnes
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">
                                                    {room.room_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        room.status_color === 'green'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {room.status_text}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        onClick={() => handleEdit(room)}
                                                        className="text-blue-600 hover:text-blue-900 transition-colors"
                                                        title="Modifier"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(room.id)}
                                                        className="text-red-600 hover:text-red-900 transition-colors"
                                                        title="Supprimer"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="text-gray-500">
                                                <MapPin className="mx-auto mb-2" size={48} />
                                                <p className="text-sm">Aucune salle trouvée</p>
                                                <p className="text-xs mt-1">Ajoutez votre première salle pour commencer</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal d'ajout/modification */}
                {showModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-xl bg-white">
                            <div className="mt-3">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    {editingRoom ? 'Modifier une salle' : 'Ajouter une salle'}
                                </h3>
                                
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nom de la salle
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.room_name}
                                            onChange={(e) => setFormData({...formData, room_name: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Capacité
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.room_capacity}
                                            onChange={(e) => setFormData({...formData, room_capacity: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            min="1"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Type de salle
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.room_type}
                                            onChange={(e) => setFormData({...formData, room_type: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Ex: Salle d'examen, Laboratoire, etc."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Disponibilité
                                        </label>
                                        <select
                                            value={formData.availability}
                                            onChange={(e) => setFormData({...formData, availability: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="Disponible">Disponible</option>
                                            <option value="Indisponible">Indisponible</option>
                                        </select>
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                        >
                                            {editingRoom ? 'Mettre à jour' : 'Enregistrer'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
