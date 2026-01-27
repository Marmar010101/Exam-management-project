import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Plus, Edit2, Trash2, Calendar, Clock, MapPin, Search, X, BookOpen, Check, Filter, Eye, AlertCircle, CheckCircle, Clock as PendingIcon } from 'lucide-react';

export default function Exams() {
    const { exams, modules, rooms, flash } = usePage().props;
    
    const [showModal, setShowModal] = useState(false);
    const [editingExam, setEditingExam] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAllExams, setShowAllExams] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all, pending, accepted
    const [typeFilter, setTypeFilter] = useState('all'); // all, Normal, Rattrapage, etc.
    
    const [formData, setFormData] = useState({
        section_id: '',
        module_id: '',
        semester_id: '37',
        exam_type: 'Exam',
        exam_subtype: 'Normal',
        duration: '120',
        description: '',
        teacher_id: '',
        exam_date_old: '',
        exam_time_old: '',
        room_id: ''
    });

    // Filtrer les examens selon la recherche et les filtres
    const filteredExams = exams?.filter(exam => {
        const matchesSearch = 
            exam.module?.module_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.exam_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (exam.status || 'pending').toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = 
            statusFilter === 'all' || 
            (statusFilter === 'pending' && (exam.status || 'pending') === 'pending') ||
            (statusFilter === 'accepted' && (exam.status || 'pending') === 'approved');
        
        const matchesType = 
            typeFilter === 'all' || 
            exam.exam_type === typeFilter;
        
        return matchesSearch && matchesStatus && matchesType;
    }) || [];

    // Définir displayedExams
    const displayedExams = showAllExams ? filteredExams : filteredExams.slice(0, 10) || [];
    
    // Debug: Check if exams are received
    console.log('Responsable Exams - exams received:', exams?.length, exams);
    console.log('Responsable Exams - filtered exams:', filteredExams.length, filteredExams);
    console.log('Responsable Exams - status filter:', statusFilter);
    console.log('Responsable Exams - type filter:', typeFilter);
    
    // Show notification on component mount if there's a flash message
    useEffect(() => {
        if (flash?.success) {
            setNotificationMessage(flash.success);
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 5000);
        }
    }, [flash]);

    // Status badge component
    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <PendingIcon className="w-3 h-3 mr-1" />
                        En attente
                    </span>
                );
            case 'approved':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approuvé
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Rejeté
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <Clock className="w-3 h-3 mr-1" />
                        {status}
                    </span>
                );
        }
    };
    const [filters, setFilters] = useState({
        exam_type: '',
        module_id: '',
        room_id: '',
        date_range: ''
    });
    // Debug: Watch formData changes
    useEffect(() => {
        console.log('Form data changed:', formData);
    }, [formData]);

    const handleEdit = (exam) => {
        console.log('Editing exam:', exam); // Debug log
        setEditingExam(exam);
        
        // Format date for input field (YYYY-MM-DD)
        const formattedDate = exam.exam_date_old ? exam.exam_date_old.split(' ')[0] : '';
        
        // Format time for input field (HH:MM) - handle if time contains full datetime
        let formattedTime = '';
        if (exam.exam_time_old) {
            // If time contains date, extract just the time part
            if (exam.exam_time_old.includes(' ')) {
                const timePart = exam.exam_time_old.split(' ')[1] || exam.exam_time_old.split(' ')[0];
                formattedTime = timePart.split(':').slice(0, 2).join(':');
            } else {
                formattedTime = exam.exam_time_old.split(':').slice(0, 2).join(':');
            }
        }
        
        const formDataToSet = {
            section_id: exam.group_id || '',
            module_id: exam.module_id || '',
            semester_id: exam.semester_id || '37',
            exam_type: exam.exam_type || 'Exam',
            exam_subtype: exam.exam_subtype || 'Normal',
            exam_date_old: formattedDate,
            exam_time_old: formattedTime,
            room_id: exam.room_id || '',
            teacher_id: exam.teacher_id || '',
            duration: exam.duration_minutes || '120',
            description: exam.description || ''
        };
        
        console.log('Setting form data:', formDataToSet); // Debug log
        
        // Force form data update
        setFormData(formDataToSet);
        
        // Force modal to open after a short delay to ensure form is updated
        setTimeout(() => {
            setShowModal(true);
            console.log('Modal opened with data:', formData);
        }, 100);
    };

    const handleDelete = (examId) => {
        if (confirm('Are you sure you want to delete this exam?')) {
            router.delete(route('responsable.exams.destroy', examId));
        }
    };

    const handleValidate = (examId) => {
        if (confirm('Are you sure you want to validate this exam?')) {
            router.post(route('responsable.exams.validate', { id: examId }));
        }
    };

    const resetForm = () => {
        setFormData({
            section_id: '',
            module_id: '',
            semester_id: '37',
            exam_type: 'Exam',
            exam_subtype: 'Normal',
            duration: '120',
            description: '',
            teacher_id: '',
            exam_date_old: '',
            exam_time_old: '',
            room_id: ''
        });
        setEditingExam(null);
    };

    const resetFilters = () => {
        setFilters({
            exam_type: '',
            module_id: '',
            room_id: '',
            date_range: ''
        });
    };

    const openModal = () => {
        setEditingExam(null);
        resetForm();
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingExam(null);
        resetForm();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log('Submitting exam data:', formData);
        
        if (editingExam) {
            console.log('Updating exam:', editingExam.id, formData);
            router.put(route('responsable.exams.update', editingExam.id), formData, {
                onSuccess: () => {
                    closeModal();
                },
                onError: (errors) => {
                    console.error('Update errors:', errors);
                }
            });
        } else {
            console.log('Creating exam with data:', formData);
            router.post(route('responsable.exams.store'), formData, {
                onSuccess: () => {
                    closeModal();
                },
                onError: (errors) => {
                    console.error('Create errors:', errors);
                }
            });
        }
    };

    const getExamTypes = () => {
        switch(formData.exam_category) {
            case 'Exam':
            case 'Control':
                return ['Normal', 'Rattrapage', 'Remplacement'];
            case 'Test_TP':
                return ['Normal', 'Rattrapage'];
            default:
                return ['Normal', 'Rattrapage', 'Remplacement', 'Contrôle Continue', 'Test TP'];
        }
    };

    return (
        <AuthenticatedLayout header="Exam Management">
            <Head title="Exam Management" />

            <div className="max-w-7xl mx-auto">
                {/* Success/error messages */}
                {flash?.success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        {flash.success}
                    </div>
                )}

                {/* Dynamic notification */}
                {showNotification && (
                    <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <CheckCircle className="text-green-600 mr-3" size={20} />
                            <span className="text-green-800 font-medium">{notificationMessage}</span>
                        </div>
                        <button
                            onClick={() => setShowNotification(false)}
                            className="text-green-600 hover:text-green-800"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}

                {/* Simple search bar */}
                <div className="bg-white shadow-sm rounded-lg mb-6 p-4">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher par module, type, statut..."
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

                    {/* Filter buttons */}
                    <div className="space-y-3">
                        {/* Status filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setStatusFilter('all')}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                        statusFilter === 'all'
                                            ? 'bg-gray-800 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Tous
                                </button>
                                <button
                                    onClick={() => setStatusFilter('pending')}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                        statusFilter === 'pending'
                                            ? 'bg-yellow-500 text-white'
                                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                    }`}
                                >
                                    En attente
                                </button>
                                <button
                                    onClick={() => setStatusFilter('accepted')}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                        statusFilter === 'accepted'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                                >
                                    Acceptés
                                </button>
                            </div>
                        </div>

                        {/* Type filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setTypeFilter('all')}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                        typeFilter === 'all'
                                            ? 'bg-gray-800 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Tous
                                </button>
                                <button
                                    onClick={() => setTypeFilter('Normal')}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                        typeFilter === 'Normal'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                    }`}
                                >
                                    Normal
                                </button>
                                <button
                                    onClick={() => setTypeFilter('Rattrapage')}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                        typeFilter === 'Rattrapage'
                                            ? 'bg-red-500 text-white'
                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                    }`}
                                >
                                    Rattrapage
                                </button>
                                <button
                                    onClick={() => setTypeFilter('Remplacement')}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                        typeFilter === 'Remplacement'
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                    }`}
                                >
                                    Remplacement
                                </button>
                                <button
                                    onClick={() => setTypeFilter('Control')}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                        typeFilter === 'Control'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                                >
                                    Contrôle
                                </button>
                                <button
                                    onClick={() => setTypeFilter('Test_TP')}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                        typeFilter === 'Test_TP'
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                    }`}
                                >
                                    Test TP
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                    {/* Main card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    {/* Header with add button and stats */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Exam Planning</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {showAllExams ? `Showing all ${filteredExams.length} exams` : `Showing ${displayedExams.length} of ${filteredExams.length} exams`}
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                {filteredExams.length > 10 && (
                                    <button
                                        onClick={() => setShowAllExams(!showAllExams)}
                                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <Eye size={20} />
                                        <span>{showAllExams ? 'Show Less' : 'See All'}</span>
                                    </button>
                                )}
                                <button
                                    onClick={() => window.location.href = '/Responsable/Exams/Create'}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Plus size={20} />
                                    <span>Create Exam</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Exams table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Module
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
                                {displayedExams.length > 0 ? (
                                    displayedExams.map((exam) => (
                                        <tr key={exam.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <BookOpen className="text-gray-400 mr-2" size={16} />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {exam.module?.module_name || exam.module_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        exam.exam_type === 'Normal'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : exam.exam_type === 'Rattrapage'
                                                            ? 'bg-red-100 text-red-800'
                                                            : exam.exam_type === 'Remplacement'
                                                            ? 'bg-orange-100 text-orange-800'
                                                            : exam.exam_type === 'Contrôle Continue'
                                                            ? 'bg-green-100 text-green-800'
                                                            : exam.exam_type === 'Test TP'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}
                                                >
                                                    {exam.exam_type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(exam.status || 'pending')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        onClick={() => handleEdit(exam)}
                                                        className="text-blue-600 hover:text-blue-900 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleValidate(exam.id)}
                                                        className="text-green-600 hover:text-green-900 transition-colors"
                                                        title="Validate"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(exam.id)}
                                                        className="text-red-600 hover:text-red-900 transition-colors"
                                                        title="Delete"
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
                                                <p className="text-sm font-medium">
                                                    {searchTerm || (filters.exam_type || filters.module_id || filters.room_id || filters.date_range) 
                                                        ? 'No exams found matching your criteria' 
                                                        : 'No exams scheduled'}
                                                </p>
                                                <p className="text-xs mt-1">
                                                    {searchTerm || (filters.exam_type || filters.module_id || filters.room_id || filters.date_range) 
                                                        ? 'Try adjusting your search or filters' 
                                                        : 'Start by adding your first exam'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {/* Show "See All" message if there are more exams */}
                                {!showAllExams && filteredExams.length > 10 && displayedExams.length > 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => setShowAllExams(true)}
                                                className="inline-flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
                                            >
                                                <Eye size={16} />
                                                <span>See all {filteredExams.length} exams</span>
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add/Edit modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-xl bg-white">
                        <div className="mt-3">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                {editingExam ? 'Edit Exam' : 'Add Exam'}
                            </h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Section/Group
                                    </label>
                                    <select
                                        value={formData.section_id}
                                        onChange={(e) => setFormData({...formData, section_id: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Select a section</option>
                                        {/* Groups should be loaded from props - using mock data for now */}
                                        <option value="1">L1-SI</option>
                                        <option value="2">L2-SI</option>
                                        <option value="3">L3-SI</option>
                                    </select>
                                </div>

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
                                        <option value="">Select a module</option>
                                        {modules?.filter(module => module && module.code && !module.code.includes('PMM') && !module.code.includes('RMM') && !module.code.includes('SMM')).map((module) => (
                                            <option key={module.id} value={module.id}>
                                                {module.module_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Semester
                                    </label>
                                    <select
                                        value={formData.semester_id}
                                        onChange={(e) => setFormData({...formData, semester_id: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="37">S1</option>
                                        <option value="38">S2</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Exam Type
                                    </label>
                                    <select
                                        value={formData.exam_type}
                                        onChange={(e) => setFormData({...formData, exam_type: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="Exam">Exam</option>
                                        <option value="Control">Control</option>
                                        <option value="Test_TP">Test_TP</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Exam Subtype
                                    </label>
                                    <select
                                        value={formData.exam_subtype}
                                        onChange={(e) => setFormData({...formData, exam_subtype: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="Normal">Normal</option>
                                        <option value="Remplacement">Remplacement</option>
                                        <option value="Rattrapage">Rattrapage</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Teacher
                                    </label>
                                    <select
                                        value={formData.teacher_id}
                                        onChange={(e) => setFormData({...formData, teacher_id: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    >
                                        <option value="">Select a teacher</option>
                                        {/* Teachers should be loaded from props */}
                                        <option value="1">Dr. Omar</option>
                                        <option value="2">Dr. Leila</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Duration (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        min="15"
                                        max="240"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        rows="3"
                                    />
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        {editingExam ? 'Update' : 'Save'}
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
