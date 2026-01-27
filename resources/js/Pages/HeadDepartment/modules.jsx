import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Plus, Edit2, Trash2, BookOpen, Code, GraduationCap, Search, X, Filter, Globe } from 'lucide-react';
import SimpleAcademicSelector from '@/Components/SimpleAcademicSelector';

export default function Modules() {
    const { modules, specialities, levels, semesters, cycles, flash } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [editingModule, setEditingModule] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCycle, setFilterCycle] = useState('');
    const [filterSpeciality, setFilterSpeciality] = useState('');
    const [filterLevel, setFilterLevel] = useState('');
    
    const [formData, setFormData] = useState({
        module_name: '',
        code: '',
        speciality_id: '',
        level_id: '',
        semester_id: '',
        credits: '',
        volume_cm: '',
        volume_td: ''
    });

    // État pour les options filtrées
    const [filteredLevels, setFilteredLevels] = useState([]);
    const [filteredSemesters, setFilteredSemesters] = useState([]);

    // Initialiser les données au chargement
    useEffect(() => {
        console.log('=== INITIALIZATION DEBUG ===');
        console.log('Specialities:', specialities);
        console.log('Specialities count:', specialities ? specialities.length : 'undefined');
        console.log('Levels:', levels);
        console.log('Levels count:', levels ? levels.length : 'undefined');
        console.log('Semesters:', semesters);
        console.log('Semesters count:', semesters ? semesters.length : 'undefined');
        console.log('Cycles:', cycles);
        console.log('=== END INITIALIZATION DEBUG ===');
        
        // Initialiser les états filtrés avec toutes les données
        if (levels && levels.length > 0) {
            console.log('Setting initial filtered levels:', levels);
            setFilteredLevels(levels);
        } else {
            console.log('No levels available, setting empty array');
            setFilteredLevels([]);
        }
        
        if (semesters && semesters.length > 0) {
            console.log('Setting initial filtered semesters:', semesters);
            setFilteredSemesters(semesters);
        } else {
            console.log('No semesters available, setting empty array');
            setFilteredSemesters([]);
        }
    }, [specialities, levels, semesters, cycles]);

    // Effet pour synchroniser les données lors de l'édition
    useEffect(() => {
        if (editingModule && showModal) {
            console.log('Syncing edit data...', editingModule);
            
            // S'assurer que les filtres sont corrects
            if (editingModule.speciality_id) {
                let filteredLevelsList = [];
                if (editingModule.speciality_id == '30') { // Tronc Commun
                    filteredLevelsList = levels.filter(l => 
                        l.name === 'ing1' || l.name === 'ing2' || 
                        l.name === 'L1' || l.name === 'L2' || l.name === 'L3'
                    );
                } else {
                    // Autres spécialités
                    filteredLevelsList = levels.filter(l => 
                        l.name === 'M1' || l.name === 'M2' || 
                        l.name === 'ing3' || l.name === 'ing4' || l.name === 'ing5'
                    );
                }
                setFilteredLevels(filteredLevelsList);
                
                // Filtrer les semestres si le niveau est défini
                if (editingModule.level_id) {
                    const levelSemesters = semesters.filter(s => 
                        String(s.level_id) === String(editingModule.level_id)
                    );
                    setFilteredSemesters(levelSemesters);
                }
            }
        }
    }, [editingModule, showModal, levels, semesters]);

    // Fonction pour gérer le changement de spécialité
    const handleSpecialityChange = (specialityId) => {
        console.log('=== SPECIALITY CHANGE DEBUG ===');
        console.log('Speciality change triggered with specialityId:', specialityId);
        console.log('Editing module:', editingModule);
        console.log('Available levels count:', levels.length);
        
        // Vérifier si on est en mode édition
        const isEditing = editingModule !== null;
        
        // Mettre à jour le formulaire
        setFormData(prev => ({
            ...prev, 
            speciality_id: specialityId
        }));
        
        if (!specialityId) {
            console.log('No speciality selected, showing all levels');
            setFilteredLevels(levels);
            setFilteredSemesters([]);
            return;
        }
        
        // Filtrer les niveaux selon la spécialité
        let filteredLevelsList = [];
        if (specialityId == '30') { // Tronc Commun (ID: 30)
            filteredLevelsList = levels.filter(l => 
                l.name === 'ing1' || l.name === 'ing2' || 
                l.name === 'L1' || l.name === 'L2' || l.name === 'L3'
            );
            console.log('Tronc Commun levels:', filteredLevelsList.map(l => ({id: l.id, name: l.name})));
        } else {
            // Autres spécialités (IDs: 26, 27, 28, 29) - Intelligence Artificielle, Génie Logiciel, Réseaux, Systèmes d'Information
            filteredLevelsList = levels.filter(l => 
                l.name === 'M1' || l.name === 'M2' || 
                l.name === 'ing3' || l.name === 'ing4' || l.name === 'ing5'
            );
            console.log('Speciality levels:', filteredLevelsList.map(l => ({id: l.id, name: l.name})));
        }
        
        setFilteredLevels(filteredLevelsList);
        
        // Ne vider les semestres que si on n'est pas en édition
        if (!isEditing) {
            setFilteredSemesters([]);
        }
        
        console.log('=== END SPECIALITY CHANGE DEBUG ===');
    };

    // Fonction pour gérer le changement de niveau
    const handleLevelChange = (levelId) => {
        console.log('=== LEVEL CHANGE DEBUG ===');
        console.log('Level change triggered with levelId:', levelId);
        console.log('Editing module:', editingModule);
        console.log('Available semesters count:', semesters.length);
        
        // Vérifier si on est en mode édition
        const isEditing = editingModule !== null;
        
        // Mettre à jour le formulaire
        setFormData(prev => ({
            ...prev, 
            level_id: levelId
        }));
        
        if (!levelId) {
            console.log('No level selected, clearing semesters');
            setFilteredSemesters([]);
            return;
        }
        
        // Filtrer les semestres selon le niveau
        const levelSemesters = semesters.filter(s => {
            const match = String(s.level_id) === String(levelId);
            console.log(`Semester ${s.name} (level_id: ${s.level_id}) vs levelId: ${levelId} -> ${match}`);
            return match;
        });
        
        console.log('Final filtered semesters:', levelSemesters);
        console.log('Semester count:', levelSemesters.length);
        
        setFilteredSemesters(levelSemesters);
        console.log('=== END LEVEL CHANGE DEBUG ===');
    };

    // Fonction pour gérer le changement de semestre
    const handleSemesterChange = (semesterId) => {
        setFormData(prev => ({...prev, semester_id: semesterId}));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log('=== FORM SUBMISSION DEBUG ===');
        console.log('Form data:', formData);
        console.log('Editing module:', editingModule);
        console.log('Speciality ID:', formData.speciality_id);
        console.log('Level ID:', formData.level_id);
        console.log('Semester ID:', formData.semester_id);
        console.log('=== END FORM SUBMISSION DEBUG ===');
        
        try {
            if (editingModule) {
                console.log('Updating module:', editingModule.id);
                router.put(route('headdepartment.modules.update', editingModule.id), formData, {
                    onSuccess: () => {
                        console.log('Update successful');
                        setShowModal(false);
                        setEditingModule(null);
                        resetForm();
                    },
                    onError: (errors) => {
                        console.error('Update errors:', errors);
                        alert('Erreur lors de la mise à jour: ' + JSON.stringify(errors));
                    }
                });
            } else {
                console.log('Creating new module');
                router.post(route('headdepartment.modules.store'), formData, {
                    onSuccess: () => {
                        console.log('Create successful');
                        setShowModal(false);
                        setEditingModule(null);
                        resetForm();
                    },
                    onError: (errors) => {
                        console.error('Create errors:', errors);
                        alert('Erreur lors de la création: ' + JSON.stringify(errors));
                    }
                });
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert('Erreur: ' + error.message);
        }
    };

    const handleEdit = (module) => {
        console.log('Editing module data:', module);
        setEditingModule(module);
        
        // D'abord définir les données du formulaire
        const formDataToSet = {
            module_name: module.module_name,
            code: module.code,
            speciality_id: module.speciality_id,
            level_id: module.level_id,
            semester_id: module.semester_id,
            credits: module.credits || '',
            volume_cm: module.volume_cm || '',
            volume_td: module.volume_td || ''
        };
        setFormData(formDataToSet);
        
        // Charger les filtres immédiatement avec les données existantes
        if (module.speciality_id) {
            console.log('Loading speciality:', module.speciality_id);
            
            // Filtrer les niveaux selon la spécialité
            let filteredLevelsList = [];
            if (module.speciality_id == '10') { // Tronc Commun
                filteredLevelsList = levels.filter(l => l.name === 'ing1' || l.name === 'ing2');
            } else {
                filteredLevelsList = levels.filter(l => 
                    l.name === 'ing3' || l.name === 'ing4' || l.name === 'ing5' || 
                    l.name === 'M1' || l.name === 'M2'
                );
            }
            setFilteredLevels(filteredLevelsList);
            
            // Filtrer les semestres selon le niveau
            if (module.level_id) {
                const levelSemesters = semesters.filter(s => 
                    String(s.level_id) === String(module.level_id)
                );
                setFilteredSemesters(levelSemesters);
                console.log('Semesters filtered for level', module.level_id, ':', levelSemesters);
            }
        }
        
        // Afficher le modal immédiatement (pas besoin de setTimeout)
        setShowModal(true);
    };

    const handleDelete = (moduleId) => {
        if (confirm('Are you sure you want to delete this module?')) {
            console.log('Deleting module:', moduleId);
            try {
                router.delete(route('headdepartment.modules.destroy', moduleId), {
                    onSuccess: () => {
                        console.log('Delete successful');
                    },
                    onError: (errors) => {
                        console.error('Delete errors:', errors);
                        alert('Erreur lors de la suppression: ' + JSON.stringify(errors));
                    }
                });
            } catch (error) {
                console.error('Delete error:', error);
                alert('Erreur: ' + error.message);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            module_name: '',
            code: '',
            speciality_id: '',
            level_id: '',
            semester_id: '',
            credits: '',
            volume_cm: '',
            volume_td: ''
        });
        setFilteredLevels([]);
        setFilteredSemesters([]);
    };

    const filteredModules = modules.filter(module => {
        const matchesSearch = module.module_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            module.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCycle = !filterCycle || module.cycle_name === filterCycle;
        const matchesSpeciality = !filterSpeciality || module.speciality_name === filterSpeciality;
        const matchesLevel = !filterLevel || module.level_name === filterLevel;
        
        return matchesSearch && matchesCycle && matchesSpeciality && matchesLevel;
    });

    const getUniqueValues = (items, key) => {
        return [...new Set(items.map(item => item[key]))].filter(Boolean);
    };

    const getCycleName = (level) => {
        return level?.cycle?.cycle_name || 'N/A';
    };

    return (
        <AuthenticatedLayout>
            <Head title="Modules Management" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Modules Management
                                </h1>
                                <p className="mt-2 text-gray-600">
                                    Manage academic modules by cycle, speciality, and level
                                </p>
                            </div>
                                                    </div>
                    </div>

                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-800">{flash.success}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Filters and Search */}
                    <div className="bg-white rounded-lg shadow mb-6 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search modules..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            
                            <select
                                value={filterCycle}
                                onChange={(e) => setFilterCycle(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Cycles</option>
                                {cycles.map(cycle => (
                                    <option key={cycle.id} value={cycle.cycle_name}>{cycle.cycle_name}</option>
                                ))}
                            </select>
                            
                            <select
                                value={filterSpeciality}
                                onChange={(e) => setFilterSpeciality(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Specialities</option>
                                {specialities.map(speciality => (
                                    <option key={speciality.id} value={speciality.name}>{speciality.name}</option>
                                ))}
                            </select>
                            
                            <select
                                value={filterLevel}
                                onChange={(e) => setFilterLevel(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Levels</option>
                                {levels.map(level => (
                                    <option key={level.id} value={level.name}>{level.name}</option>
                                ))}
                            </select>
                            
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Module
                            </button>
                        </div>
                    </div>

                    {/* Modules Table */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Module
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Code
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cycle
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Speciality
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Level
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Semester
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Credits
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        CM Hours
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        TD Hours
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Teacher
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
                                                    <BookOpen className="h-5 w-5 text-gray-400 mr-2" />
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {module.module_name}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <Code className="h-4 w-4 text-gray-400 mr-1" />
                                                    <span className="text-sm text-gray-900 font-mono">{module.code}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                                                    {module.cycle_name || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                                    {module.speciality_name || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <GraduationCap className="h-4 w-4 text-gray-400 mr-1" />
                                                    <span className="text-sm text-gray-900">{module.level_name || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                                    {module.semester_name || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">{module.credits || 'N/A'}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">{module.volume_cm || 'N/A'}h</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">{module.volume_td || 'N/A'}h</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-900">
                                                    {module.teacher_first_name && module.teacher_last_name 
                                                        ? `${module.teacher_first_name} ${module.teacher_last_name}` 
                                                        : 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(module)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(module.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="11" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                <p className="text-gray-500 text-lg font-medium">
                                                    No modules found
                                                </p>
                                                <p className="text-gray-400 text-sm mt-2">
                                                    {searchTerm || filterCycle || filterSpeciality || filterLevel
                                                        ? 'Try adjusting your search or filters'
                                                        : 'No modules available'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        </div>
                    </div>

                    {/* Add/Edit Modal */}
                    {showModal && (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg p-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        {editingModule ? 'Edit Module' : 'Add New Module'}
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingModule(null);
                                            resetForm();
                                        }}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Module Name
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.module_name}
                                                onChange={(e) => setFormData({...formData, module_name: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                placeholder="e.g., Advanced Algorithms"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Module Code
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.code}
                                                onChange={(e) => setFormData({...formData, code: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                placeholder="e.g., ALG501"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Credits
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="7"
                                                value={formData.credits}
                                                onChange={(e) => setFormData({...formData, credits: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                placeholder="e.g., 6"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                CM Hours
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="60"
                                                value={formData.volume_cm}
                                                onChange={(e) => setFormData({...formData, volume_cm: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                placeholder="ex: 30"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                TD Hours
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="60"
                                                value={formData.volume_td}
                                                onChange={(e) => setFormData({...formData, volume_td: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                placeholder="ex: 30"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Speciality
                                            </label>
                                            <select
                                                value={formData.speciality_id}
                                                onChange={(e) => handleSpecialityChange(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            >
                                                <option value="">Select a speciality</option>
                                                {specialities.map(speciality => (
                                                    <option key={speciality.id} value={speciality.id}>{speciality.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Level
                                            </label>
                                            <select
                                                value={formData.level_id}
                                                onChange={(e) => handleLevelChange(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                disabled={!formData.speciality_id}
                                            >
                                                <option value="">Select a level</option>
                                                {filteredLevels.map(level => (
                                                    <option key={level.id} value={level.id}>{level.name}</option>
                                                ))}
                                            </select>
                                            {/* Debug info */}
                                            <div className="text-xs text-gray-500 mt-1">
                                                Debug: {filteredLevels.length} levels found
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Semester
                                            </label>
                                            <select
                                                value={formData.semester_id}
                                                onChange={(e) => handleSemesterChange(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                                disabled={!formData.level_id}
                                            >
                                                <option value="">Select a semester</option>
                                                {filteredSemesters.map(semester => (
                                                    <option key={semester.id} value={semester.id}>{semester.name}</option>
                                                ))}
                                            </select>
                                            {/* Debug info */}
                                            <div className="text-xs text-gray-500 mt-1">
                                                Debug: {filteredSemesters.length} semestres found
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Selected level_id: {formData.level_id}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Available semesters: {semesters.length}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4 border-t">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowModal(false);
                                                setEditingModule(null);
                                                resetForm();
                                            }}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                        >
                                            {editingModule ? 'Update' : 'Create'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
