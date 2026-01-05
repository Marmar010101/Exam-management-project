import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Plus, Edit2, Trash2, Calendar, Clock, MapPin, Search, X, BookOpen } from 'lucide-react';

export default function Exams() {
    const { exams, modules, rooms, flash } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [editingExam, setEditingExam] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        module_id: '',
        exam_date: '',
        exam_time: '',
        room_id: '',
        exam_category: 'Examen',
        exam_type: 'Normal',
        duration: '120'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingExam) {
            router.put(route('exams.update', editingExam.id), formData, {
                onSuccess: () => {
                    setShowModal(false);
                    setEditingExam(null);
                    resetForm();
                }
            });
        } else {
            router.post(route('exams.store'), formData, {
                onSuccess: () => {
                    setShowModal(false);
                    resetForm();
                }
            });
        }
    };

    const handleEdit = (exam) => {
        setEditingExam(exam);
        setFormData({
            module_id: exam.module_id || '',
            exam_date: exam.exam_date || '',
            exam_time: exam.exam_time || '',
            room_id: exam.room_id || '',
            exam_category: exam.exam_category || 'Examen',
            exam_type: exam.exam_type || 'Normal',
            duration: exam.duration || '120'
        });
        setShowModal(true);
    };

    const handleDelete = (examId) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet examen ?')) {
            router.delete(route('exams.destroy', examId));
        }
    };

    const resetForm = () => {
        setFormData({
            module_id: '',
            exam_date: '',
            exam_time: '',
            room_id: '',
            exam_category: 'Examen',
            exam_type: 'Normal',
            duration: '120'
        });
    };

    const openModal = () => {
        setEditingExam(null);
        resetForm();
        setShowModal(true);
    };

    // Obtenir les types selon la catégorie
    const getExamTypes = () => {
        switch(formData.exam_category) {
            case 'Examen':
            case 'Contrôle':
                return ['Normal', 'Rattrapage', 'Remplacement'];
            case 'Test_TP':
                return ['Normal'];
            default:
                return ['Normal'];
        }
    };

    // Filtrer les examens selon la recherche
    const filteredExams = exams?.filter(exam => 
        exam.module?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.date?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.time?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.room?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.type?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <AuthenticatedLayout header="Gestion des Examens">
            <Head title="Gestion des Examens" />

            <div className="max-w-7xl mx-auto">
                {/* Messages de succès/erreur */}
                {flash?.success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        {flash.success}
                    </div>
                )}

                {/* Barre de recherche */}
                <div className="bg-white shadow-sm rounded-lg mb-6 p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher par module, date, heure, salle, type..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

                {/* Carte principale */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    {/* En-tête avec bouton d'ajout */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Planning des Examens</h2>
                                <p className="text-sm text-gray-500 mt-1">Planifiez et gérez les examens</p>
                            </div>
                            <button
                                onClick={openModal}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                <Plus size={20} />
                                <span>Ajouter un examen</span>
                            </button>
                        </div>
                    </div>

                    {/* Tableau des examens */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Module
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredExams.length > 0 ? (
                                    filteredExams.map((exam) => (
                                        <tr key={exam.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <BookOpen className="text-gray-400 mr-2" size={16} />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {exam.module}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Calendar className="text-gray-400 mr-2" size={16} />
                                                    <span className="text-sm text-gray-900">
                                                        {exam.date}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Clock className="text-gray-400 mr-2" size={16} />
                                                    <span className="text-sm text-gray-900">
                                                        {exam.time}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <MapPin className="text-gray-400 mr-2" size={16} />
                                                    <span className="text-sm text-gray-900">
                                                        {exam.room}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        exam.type === 'Normal'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-orange-100 text-orange-800'
                                                    }`}
                                                >
                                                    {exam.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        onClick={() => handleEdit(exam)}
                                                        className="text-blue-600 hover:text-blue-900 transition-colors"
                                                        title="Modifier"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(exam.id)}
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
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="text-gray-500">
                                                <Calendar className="mx-auto mb-2" size={48} />
                                                <p className="text-sm">
                                                    {searchTerm ? 'Aucun examen trouvé pour cette recherche' : 'Aucun examen trouvé'}
                                                </p>
                                                <p className="text-xs mt-1">
                                                    {searchTerm ? 'Essayez une autre recherche' : 'Ajoutez votre premier examen pour commencer'}
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

            {/* Modal d'ajout/modification */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-xl bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {editingExam ? 'Modifier un examen' : 'Ajouter un examen'}
                            </h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Module
                                    </label>
                                    <select
                                        value={formData.module_id}
                                        onChange={(e) => setFormData({...formData, module_id: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Sélectionner un module</option>
                                        {modules?.filter(module => module && module.code && !module.code.includes('PMM') && !module.code.includes('RMM') && !module.code.includes('SMM')).map((module) => (
                                            <option key={module.id} value={module.id}>
                                                {module.module_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.exam_date}
                                        onChange={(e) => setFormData({...formData, exam_date: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Heure
                                    </label>
                                    <input
                                        type="time"
                                        value={formData.exam_time}
                                        onChange={(e) => setFormData({...formData, exam_time: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Salle
                                    </label>
                                    <select
                                        value={formData.room_id}
                                        onChange={(e) => setFormData({...formData, room_id: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Sélectionner une salle</option>
                                        {rooms?.map((room) => (
                                            <option key={room.id} value={room.id}>
                                                {room.room_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Catégorie
                                    </label>
                                    <select
                                        value={formData.exam_category}
                                        onChange={(e) => {
                                            const newCategory = e.target.value;
                                            setFormData({
                                                ...formData, 
                                                exam_category: newCategory,
                                                exam_type: 'Normal' // Réinitialiser le type quand la catégorie change
                                            });
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="Examen">Examen</option>
                                        <option value="Contrôle">Contrôle</option>
                                        <option value="Test_TP">Test_TP</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type
                                    </label>
                                    <select
                                        value={formData.exam_type}
                                        onChange={(e) => setFormData({...formData, exam_type: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        {getExamTypes().map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Durée (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        min="30"
                                        max="240"
                                        required
                                    />
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
                                        {editingExam ? 'Mettre à jour' : 'Enregistrer'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
