import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Plus, Edit2, Trash2, BookOpen, Code, GraduationCap, Search, X } from 'lucide-react';
import SimpleAcademicSelector from '@/Components/SimpleAcademicSelector';

export default function Modules() {
    const { modules, specialities, levels, semesters, filieres, flash } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [editingModule, setEditingModule] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [formData, setFormData] = useState({
        module_name: '',
        code: '',
        speciality_id: '',
        level_id: '',
        semester_id: '',
        teacher_id: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (editingModule) {
            router.put(route('modules.update', editingModule.id), formData, {
                onSuccess: () => {
                    setShowModal(false);
                    setEditingModule(null);
                    resetForm();
                }
            });
        } else {
            router.post(route('modules.store'), formData, {
                onSuccess: () => {
                    setShowModal(false);
                    resetForm();
                }
            });
        }
    };

    const handleEdit = (module) => {
        setEditingModule(module);
        setFormData({
            module_name: module.module_name,
            code: module.code,
            speciality_id: module.speciality_id,
            level_id: module.level_id,
            semester_id: module.semester_id,
            teacher_id: module.teacher_id
        });
        setShowModal(true);
    };

    const handleDelete = (moduleId) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce module ?')) {
            router.delete(route('modules.destroy', moduleId));
        }
    };

    const resetForm = () => {
        setFormData({
            module_name: '',
            code: '',
            speciality_id: '',
            level_id: '',
            semester_id: '',
            teacher_id: ''
        });
    };

    const openModal = () => {
        setEditingModule(null);
        resetForm();
        setShowModal(true);
    };

    // Filtrer les modules selon la recherche
    const filteredModules = modules?.filter(module => 
        module.module_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.speciality?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.level?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    return (
        <AuthenticatedLayout header="Gestion des Modules">
            <Head title="Gestion des Modules" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg mb-6">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-lg font-semibold text-gray-900">Modules</h1>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Gestion des modules académiques
                                    </p>
                                </div>
                                <button
                                    onClick={openModal}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    <Plus className="mr-2" size={16} />
                                    Ajouter un module
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Barre de recherche */}
                    <div className="bg-white shadow-sm rounded-lg mb-6 p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Rechercher par nom, code, spécialité, niveau..."
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

                    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Code module
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nom du module
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Spécialité
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Niveau
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Semestre
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredModules.length > 0 ? (
                                        filteredModules.map((module) => (
                                            <tr key={module.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <Code className="text-gray-400 mr-2" size={16} />
                                                        <span className="text-sm font-medium text-gray-900">
                                                            {module.code}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <BookOpen className="text-gray-400 mr-2" size={16} />
                                                        <span className="text-sm text-gray-900">
                                                            {module.module_name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                        {module.speciality}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <GraduationCap className="text-gray-400 mr-2" size={16} />
                                                        <span className="text-sm text-gray-900">
                                                            {module.level}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {module.semester}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(module)}
                                                            className="text-blue-600 hover:text-blue-900 transition-colors"
                                                            title="Modifier"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(module.id)}
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
                                                    <BookOpen className="mx-auto mb-2" size={48} />
                                                    <p className="text-sm">
                                                        {searchTerm ? 'Aucun module trouvé pour cette recherche' : 'Aucun module trouvé'}
                                                    </p>
                                                    <p className="text-xs mt-1">
                                                        {searchTerm ? 'Essayez une autre recherche' : 'Ajoutez votre premier module pour commencer'}
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

            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-[600px] shadow-lg rounded-xl bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {editingModule ? 'Modifier un module' : 'Ajouter un module'}
                            </h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nom du module
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.module_name}
                                            onChange={(e) => setFormData({...formData, module_name: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Code
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.code}
                                            onChange={(e) => setFormData({...formData, code: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Sélecteur académique simplifié */}
                                <div className="space-y-4">
                                    {/* Spécialité */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Spécialité
                                        </label>
                                        <select
                                            value={formData.speciality_id}
                                            onChange={(e) => setFormData({...formData, speciality_id: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Sélectionner une spécialité</option>
                                            {specialities?.map((speciality) => (
                                                <option key={speciality.id} value={speciality.id}>
                                                    {speciality.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Niveau */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Niveau
                                        </label>
                                        <select
                                            value={formData.level_id}
                                            onChange={(e) => setFormData({...formData, level_id: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Sélectionner un niveau</option>
                                            {levels?.map((level) => (
                                                <option key={level.id} value={level.id}>
                                                    {level.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Semestre - S1 ou S2 */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Semestre
                                        </label>
                                        <select
                                            value={formData.semester_id}
                                            onChange={(e) => setFormData({...formData, semester_id: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Sélectionner un semestre</option>
                                            {semesters?.filter(s => s.name === 'S1' || s.name === 'S2').map((semester) => (
                                                <option key={semester.id} value={semester.id}>
                                                    {semester.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                                    >
                                        {editingModule ? 'Modifier' : 'Ajouter'}
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
