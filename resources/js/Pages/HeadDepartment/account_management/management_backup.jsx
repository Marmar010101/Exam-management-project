import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Plus, Edit2, Trash2, Search, User, Users, BookOpen, GraduationCap, Shield } from 'lucide-react';

const roleIcons = {
    student: Users,
    teacher: BookOpen,
    responsable: Shield,
    head_department: GraduationCap,
};

const roleColors = {
    student: 'bg-blue-100 text-blue-800',
    teacher: 'bg-green-100 text-green-800',
    responsable: 'bg-purple-100 text-purple-800',
    head_department: 'bg-orange-100 text-orange-800',
};

const roleLabels = {
    student: 'Étudiant',
    teacher: 'Enseignant',
    responsable: 'Responsable',
    head_department: 'Head Department',
};

export default function Management() {
    const { users, flash } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('student');
    const [formData, setFormData] = useState({
        matricule: '',
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'student'
    });

    const tabs = [
        { key: 'student', label: 'Étudiants', icon: Users },
        { key: 'teacher', label: 'Enseignants', icon: BookOpen },
        { key: 'responsable', label: 'Responsables', icon: Shield },
        { key: 'head_department', label: 'Head Department', icon: GraduationCap },
    ];

    const filteredUsers = users?.filter(user => 
        user.role === activeTab &&
        ((user.first_name || '').toLowerCase().includes(search.toLowerCase()) ||
         (user.last_name || '').toLowerCase().includes(search.toLowerCase()) ||
         (user.email || '').toLowerCase().includes(search.toLowerCase()) ||
         (user.matricule || '').toLowerCase().includes(search.toLowerCase()))
    ) || [];

    const tabsWithCount = tabs.map(tab => ({
        ...tab,
        count: users?.filter(u => u.role === tab.key).length || 0
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const submitData = {
            ...formData,
        };
        
        if (editingUser) {
            router.put(route('headdepartment.management.update', editingUser.id), submitData, {
                onSuccess: () => {
                    setShowModal(false);
                    setEditingUser(null);
                    resetForm();
                },
                onError: (errors) => {
                    console.error('Errors:', errors);
                }
            });
        } else {
            router.post(route('headdepartment.management.store'), submitData, {
                onSuccess: () => {
                    setShowModal(false);
                    resetForm();
                },
                onError: (errors) => {
                    console.error('Errors:', errors);
                }
            });
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            matricule: user.matricule,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: '',
            role: user.role
        });
        setShowModal(true);
    };

    const handleDelete = (user) => {
        if (user.role === 'head_department') {
            alert('Le Head Department ne peut pas être supprimé');
            return;
        }
        
        if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
            router.delete(route('headdepartment.management.destroy', user.id), {
                onSuccess: () => {
                    // La redirection est automatique avec Inertia
                },
                onError: (errors) => {
                    console.error('Errors:', errors);
                }
            });
        }
    };

    const resetForm = () => {
        setFormData({
            matricule: '',
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            role: 'student'
        });
    };

    const openModal = () => {
        setEditingUser(null);
        resetForm();
        setShowModal(true);
    };

    const RoleIcon = roleIcons[activeTab];

    return (
        <AuthenticatedLayout header="Gestion des Comptes">
            <Head title="Gestion des Comptes" />

            <div className="max-w-7xl mx-auto">
                {/* Messages de succès/erreur */}
                {flash?.success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {flash.error}
                    </div>
                )}

                {/* Tabs de filtrage */}
                <div className="mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            {tabsWithCount.map((tab) => {
                                const TabIcon = tab.icon;
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                                            activeTab === tab.key
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        <TabIcon className="mr-2 h-5 w-5" />
                                        {tab.label}
                                        <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                                            {tab.count}
                                        </span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Barre d'actions */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher un utilisateur..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        onClick={openModal}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        <Plus size={20} />
                        <span>Créer un compte</span>
                    </button>
                </div>

                {/* Tableau des utilisateurs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Matricule
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Nom complet
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rôle
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-mono text-gray-900">
                                                    {user.matricule || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 mr-3">
                                                        <User className="h-4 w-4 text-gray-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {user.first_name || ''} {user.last_name || ''}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {user.role === 'student' ? 'Student' : 
                                                             user.role === 'teacher' ? 'Teacher' :
                                                             user.role === 'responsable' ? 'Responsible' : 'Head Department'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">
                                                    {user.email || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleColors[user.role]}`}>
                                                    {roleLabels[user.role]}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="text-blue-600 hover:text-blue-900 transition-colors"
                                                        title="Modifier"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    {user.role !== 'head_department' && (
                                                        <button
                                                            onClick={() => handleDelete(user)}
                                                            className="text-red-600 hover:text-red-900 transition-colors"
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="text-gray-500">
                                                <RoleIcon className="mx-auto mb-2" size={48} />
                                                <p className="text-sm">Aucun {roleLabels[activeTab].toLowerCase()} trouvé</p>
                                                <p className="text-xs mt-1">Ajoutez votre premier {roleLabels[activeTab].toLowerCase()} pour commencer</p>
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
                                    {editingUser ? "Modifier l'utilisateur" : "Créer un compte"}
                                </h3>
                                
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Matricule / ID
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.matricule}
                                            onChange={(e) => setFormData({...formData, matricule: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Ex: STU003"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Prénom
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.first_name}
                                                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Prénom"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nom
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.last_name}
                                                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Nom"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="email@univ.dz"
                                            required
                                        />
                                    </div>

                                    {!editingUser && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Mot de passe
                                            </label>
                                            <input
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="••••••••"
                                                required
                                                minLength="8"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Rôle
                                        </label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="student">Étudiant</option>
                                            <option value="teacher">Enseignant</option>
                                            <option value="responsable">Responsable</option>
                                            <option value="head_department">Head Department</option>
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
                                            {editingUser ? 'Mettre à jour' : 'Enregistrer'}
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
