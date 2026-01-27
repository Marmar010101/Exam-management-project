import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Calendar, Users, MapPin, ChevronLeft, Save, Play, RotateCcw, CheckCircle, AlertCircle, Send } from 'lucide-react';

export default function ExamPlansCreate({ groups = [], modules = [], teachers = [], rooms = [], examTypes = [], existingExamPlans = [] }) {
    console.log('=== INITIAL DATA DEBUG ===');
    console.log('Groups count:', groups.length);
    console.log('Modules count:', modules.length);
    console.log('Teachers count:', teachers.length);
    console.log('Rooms count:', rooms.length);
    console.log('Existing Exam Plans count:', existingExamPlans.length);
    
    const { data, setData, post, processing, errors } = useForm({
        semester: '',
        groups: [],
        modules: [],
        teachers: [],
        rooms: [],
        exam_type: 'Exam',
        exam_subtype: '',
        start_date: '',
        end_date: '',
        start_time: '08:00',
        end_time: '10:00',
        description: '',
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [filteredExams, setFilteredExams] = useState([]);
    const [generatedExams, setGeneratedExams] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState('');
    const [availableSemesters, setAvailableSemesters] = useState([]);

    // Get exam subtypes based on exam type
    const getExamSubtypes = (examType) => {
        switch (examType) {
            case 'Exam':
                return [
                    { value: 'Normal', label: 'Normal' },
                    { value: 'Replacement', label: 'Replacement' },
                    { value: 'Make-up', label: 'Make-up' }
                ];
            case 'Control':
                return [
                    { value: 'Normal', label: 'Normal' },
                    { value: 'Replacement', label: 'Replacement' }
                ];
            case 'Test TP':
                return [];
            default:
                return [];
        }
    };

    const currentExamSubtypes = getExamSubtypes(data.exam_type);

    // Handle exam type change
    const handleExamTypeChange = (examType) => {
        setData('exam_type', examType);
        setData('exam_subtype', '');
    };

    // Handle multi-select
    const handleMultiSelect = (field, value) => {
        const currentValues = data[field] || [];
        if (currentValues.includes(value)) {
            setData(field, currentValues.filter(v => v !== value));
        } else {
            setData(field, [...currentValues, value]);
        }
    };

    // Handle select all
    const handleSelectAll = (field, items) => {
        const currentValues = data[field] || [];
        const allValues = items.map(item => item.id);
        
        if (currentValues.length === allValues.length) {
            setData(field, []);
        } else {
            setData(field, allValues);
        }
    };

    // Filter existing exams based on selections
    useEffect(() => {
        if (!data.semester || data.groups.length === 0 || !data.exam_type) {
            setFilteredExams([]);
            return;
        }

        console.log('=== FILTERING EXISTING EXAMS ===');
        console.log('Semester:', data.semester);
        console.log('Selected groups:', data.groups);
        console.log('Exam type:', data.exam_type);
        console.log('Existing exam plans:', existingExamPlans.length);

        // Get selected groups with their characteristics
        const selectedGroupsData = groups.filter(g => data.groups.includes(g.id));
        console.log('Selected groups data:', selectedGroupsData);

        // Filter existing exam plans based on selections
        const filtered = existingExamPlans.filter(examPlan => {
            console.log(`Checking exam plan: ${examPlan.module_name}`);
            console.log(`- Semester ID: ${examPlan.semester_id}, Selected: ${data.semester}`);
            console.log(`- Level ID: ${examPlan.level_id}, Speciality ID: ${examPlan.speciality_id}`);
            
            // Check if exam type matches
            const examTypeMatch = examPlan.exam_type && examPlan.exam_type.some(type => 
                type.toLowerCase().includes(data.exam_type.toLowerCase()) || 
                data.exam_type.toLowerCase().includes(type.toLowerCase())
            );
            
            if (!examTypeMatch) {
                console.log(`❌ Exam plan ${examPlan.module_name} - Type mismatch`);
                return false;
            }

            // Check semester match
            const semesterMatch = examPlan.semester_id === parseInt(data.semester);
            
            if (!semesterMatch) {
                console.log(`❌ Exam plan ${examPlan.module_name} - Semester mismatch (${examPlan.semester_id} vs ${data.semester})`);
                return false;
            }

            // Check if module matches any selected group characteristics (level_id and speciality_id)
            const matchesGroup = selectedGroupsData.some(group => {
                const levelMatch = examPlan.level_id === group.level_id;
                const specialityMatch = examPlan.speciality_id === group.speciality_id;
                
                console.log(`Group match check for ${examPlan.module_name}: level=${levelMatch}, speciality=${specialityMatch}`);
                console.log(`- Exam: level_id=${examPlan.level_id}, speciality_id=${examPlan.speciality_id}`);
                console.log(`- Group: level_id=${group.level_id}, speciality_id=${group.speciality_id}`);
                
                return levelMatch && specialityMatch;
            });

            if (!matchesGroup) {
                console.log(`❌ Exam plan ${examPlan.module_name} - No group match`);
                return false;
            }

            console.log(`✅ Exam plan ${examPlan.module_name} - Matches criteria`);
            return true;
        });

        console.log('Filtered exams count:', filtered.length);
        setFilteredExams(filtered);
    }, [data.semester, data.groups, data.exam_type, existingExamPlans, groups]);

    // Update available semesters - HARDCODED S1/S2 FOR RESPONSABLE
    useEffect(() => {
        // Always show only S1 and S2 for responsable
        setAvailableSemesters([
            { id: '37', name: 'Semestre 1', count: 10 },
            { id: '38', name: 'Semestre 2', count: 10 }
        ]);
    }, []);

    // Generate individual exam entries from filtered exam plans - SAMPLE DATA FOR FRONTEND
    useEffect(() => {
        // Sample exams for frontend demonstration
        const sampleExams = [
            {
                id: 'exam_1',
                module_id: 1,
                module_name: 'Algorithmique',
                module_code: 'ALG101',
                exam_type: 'Exam',
                exam_subtype: 'Normal',
                title: 'Algorithmique - Exam Normal',
                groups: [],
                semester_id: data.semester || '37',
                level_id: 1,
                speciality_id: 1
            },
            {
                id: 'exam_2',
                module_id: 2,
                module_name: 'Bases de Données',
                module_code: 'DB101',
                exam_type: 'Control',
                exam_subtype: 'Normal',
                title: 'Bases de Données - Control Normal',
                groups: [],
                semester_id: data.semester || '37',
                level_id: 1,
                speciality_id: 1
            },
            {
                id: 'exam_3',
                module_id: 3,
                module_name: 'Systèmes d\'Exploitation',
                module_code: 'OS101',
                exam_type: 'Test_TP',
                exam_subtype: 'Normal',
                title: 'Systèmes d\'Exploitation - Test_TP Normal',
                groups: [],
                semester_id: data.semester || '37',
                level_id: 1,
                speciality_id: 1
            }
        ];

        setGeneratedExams(sampleExams);
    }, [data.semester, data.exam_type]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Frontend only - simulate submission
        setIsProcessing(true);
        
        setTimeout(() => {
            alert('Exam plan created successfully!');
            setIsProcessing(false);
            // Redirect to exam-plans list
            window.location.href = '/responsable/exam-plans';
        }, 1000);
    };

    return (
        <AuthenticatedLayout header="Create Exam Plans">
            <Head title="Create Exam Plans" />
            
            <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    {/* Demo Notice */}
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-4">
                        <strong>Mode Démo:</strong> Formulaire de démonstration
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Link href="/responsable/exam-plans" className="mr-4 p-2 text-gray-600 hover:text-gray-900">
                                <ChevronLeft className="h-5 w-5" />
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900">Create Exam Plans</h1>
                        </div>
                    </div>
                    <p className="text-gray-600 mt-2">Create exam plans based on modules and exam types</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                            Basic Information
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type *</label>
                                <select
                                    value={data.exam_type}
                                    onChange={(e) => handleExamTypeChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={isProcessing}
                                >
                                    <option value="Exam">Exam</option>
                                    <option value="Control">Control</option>
                                    <option value="Test TP">Test TP</option>
                                </select>
                                {errors.exam_type && <p className="text-red-500 text-sm mt-1">{errors.exam_type}</p>}
                            </div>

                            {currentExamSubtypes.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Exam Subtype *</label>
                                    <select
                                        value={data.exam_subtype}
                                        onChange={(e) => setData('exam_subtype', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={isProcessing}
                                    >
                                        <option value="">Select subtype...</option>
                                        {currentExamSubtypes.map(subtype => (
                                            <option key={subtype.value} value={subtype.value}>
                                                {subtype.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.exam_subtype && <p className="text-red-500 text-sm mt-1">{errors.exam_subtype}</p>}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                                <input
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={isProcessing}
                                />
                                {errors.start_date && <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                                <input
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) => setData('end_date', e.target.value)}
                                    min={data.start_date}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={isProcessing}
                                />
                                {errors.end_date && <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                                <input
                                    type="time"
                                    value={data.start_time}
                                    onChange={(e) => setData('start_time', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={isProcessing}
                                />
                                {errors.start_time && <p className="text-red-500 text-sm mt-1">{errors.start_time}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
                                <input
                                    type="time"
                                    value={data.end_time}
                                    onChange={(e) => setData('end_time', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={isProcessing}
                                />
                                {errors.end_time && <p className="text-red-500 text-sm mt-1">{errors.end_time}</p>}
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                placeholder="Additional notes about this exam plan..."
                                disabled={isProcessing}
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                        </div>
                    </div>

                    {/* Groups Selection */}
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold flex items-center">
                                <Users className="h-5 w-5 mr-2 text-green-600" />
                                Groups *
                            </h2>
                            <button
                                type="button"
                                onClick={() => handleSelectAll('groups', groups)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                                disabled={isProcessing}
                            >
                                {data.groups?.length === groups.length ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>
                        
                        <div className="grid gap-3 max-h-60 overflow-y-auto">
                            {groups.map(group => (
                                <label key={group.id} className="flex items-start space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                    <input
                                        type="checkbox"
                                        checked={data.groups?.includes(group.id) || false}
                                        onChange={() => handleMultiSelect('groups', group.id)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                                        disabled={isProcessing}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium text-gray-700 truncate">{group.name}</span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-1 mt-1">
                                            {group.level && (
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-yellow-100 text-yellow-700 font-medium">
                                                    {typeof group.level === 'object' ? group.level.name || 'Level' : group.level}
                                                </span>
                                            )}
                                            {group.speciality && (
                                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-purple-100 text-purple-700 font-medium">
                                                    {typeof group.speciality === 'object' ? group.speciality.name || 'Speciality' : group.speciality}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                        {errors.groups && <p className="text-red-500 text-sm mt-2">{errors.groups}</p>}
                    </div>

                    {/* Semester Selection */}
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold flex items-center">
                                <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                                Semestre *
                            </h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {availableSemesters.length > 0 ? (
                                availableSemesters.map((semester) => (
                                    <button
                                        key={semester.id}
                                        type="button"
                                        onClick={() => {
                                            console.log('Semester button clicked:', semester.id);
                                            setData('semester', semester.id);
                                        }}
                                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors text-left ${
                                            data.semester === semester.id 
                                                ? 'bg-indigo-50 border-indigo-500 hover:bg-indigo-100' 
                                                : 'border-gray-200 hover:bg-gray-50 hover:border-indigo-300'
                                        }`}
                                        disabled={isProcessing}
                                    >
                                        <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${
                                            data.semester === semester.id 
                                                ? 'border-indigo-600' 
                                                : 'border-gray-300'
                                        }`}>
                                            {data.semester === semester.id && (
                                                <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">{semester.name}</div>
                                            <div className="text-sm text-gray-500">{semester.count} modules disponibles</div>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="col-span-2">
                                    <div className="text-center text-gray-500 py-4 mb-4">
                                        {data.groups.length > 0 ? 'Chargement des semestres...' : 'Veuillez d\'abord sélectionner une section'}
                                        <div className="mt-2 text-xs text-gray-400">
                                            Debug: availableSemesters = {availableSemesters.length}, groups = {data.groups.length}
                                        </div>
                                    </div>
                                    
                                    {/* Fallback: Show all semesters */}
                                    <div className="border-t pt-4">
                                        <p className="text-sm text-gray-600 mb-3">Tous les semestres (sélection manuelle) :</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {[
                                                { id: '37', name: 'Semestre 1 (S1)', count: 10 },
                                                { id: '38', name: 'Semestre 2 (S2)', count: 10 },
                                                { id: '39', name: 'Semestre 3 (S1)', count: 10 },
                                                { id: '40', name: 'Semestre 4 (S2)', count: 10 },
                                                { id: '41', name: 'Semestre 5 (S1)', count: 22 },
                                                { id: '42', name: 'Semestre 6 (S2)', count: 2 }
                                            ].map((semester) => (
                                                <button
                                                    key={semester.id}
                                                    type="button"
                                                    onClick={() => {
                                                        console.log('Fallback semester button clicked:', semester.id);
                                                        setData('semester', semester.id);
                                                    }}
                                                    className={`flex items-center space-x-2 p-2 rounded border text-sm text-left transition-colors ${
                                                        data.semester === semester.id 
                                                            ? 'bg-indigo-50 border-indigo-500 hover:bg-indigo-100' 
                                                            : 'border-gray-200 hover:bg-gray-50 hover:border-indigo-300'
                                                    }`}
                                                    disabled={isProcessing}
                                                >
                                                    <div className={`h-3 w-3 rounded-full border-2 flex items-center justify-center ${
                                                        data.semester === semester.id 
                                                            ? 'border-indigo-600' 
                                                            : 'border-gray-300'
                                                    }`}>
                                                        {data.semester === semester.id && (
                                                            <div className="h-1.5 w-1.5 rounded-full bg-indigo-600"></div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-medium text-gray-900">{semester.name}</div>
                                                        <div className="text-xs text-gray-500">{semester.count} modules</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        {errors.semester && <p className="text-red-500 text-sm mt-2">{errors.semester}</p>}
                        
                        {/* Debug: Show selected semester */}
                        {data.semester && (
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
                                <span className="font-medium">Semestre sélectionné:</span> {data.semester}
                            </div>
                        )}
                        
                        {/* No debug buttons - clean frontend */}
                    </div>

                    {/* Available Exams */}
                    {generatedExams.length > 0 && (
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold flex items-center">
                                    <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                                    Available Exams ({generatedExams.length})
                                </h2>
                            </div>
                            
                            <div className="text-sm text-gray-600 mb-4">
                                Based on {filteredExams.length} exam plans and {data.exam_type} type
                            </div>

                            <div className="grid gap-2 max-h-96 overflow-y-auto">
                                {generatedExams.map(exam => (
                                    <label key={exam.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                checked={data.modules?.includes(exam.id) || false}
                                                onChange={() => handleMultiSelect('modules', exam.id)}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                disabled={isProcessing}
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">{exam.title}</div>
                                                <div className="text-sm text-gray-500">
                                                    {exam.module_code} • {exam.exam_type}
                                                    {exam.exam_subtype && ` • ${exam.exam_subtype}`}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    Semester: {exam.semester_id} • Level: {exam.level_id} • Speciality: {exam.speciality_id}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {exam.exam_type.toLowerCase().includes('exam') && (
                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                    Exam
                                                </span>
                                            )}
                                            {exam.exam_type.toLowerCase().includes('control') && (
                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                                    Control
                                                </span>
                                            )}
                                            {exam.exam_type.toLowerCase().includes('test') && (
                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                                    Test TP
                                                </span>
                                            )}
                                            {exam.exam_subtype && (
                                                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                    {exam.exam_subtype}
                                                </span>
                                            )}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No Exams Found */}
                    {data.semester && data.groups.length > 0 && data.exam_type && generatedExams.length === 0 && (
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <div className="text-center py-8 text-gray-500">
                                <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                                <p className="text-lg font-medium">Aucun examen trouvé</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    Pour les sections et le type d'examen sélectionnés
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                    Essayez de créer des examens d'abord, ou vérifiez les filtres sélectionnés
                                </p>
                                
                                {/* DEBUG: Show filtered exam plans */}
                                <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">
                                        Examens filtrés ({filteredExams.length}) - Semestre: {data.semester || 'Non sélectionné'}
                                    </p>
                                    <div className="max-h-60 overflow-y-auto text-xs">
                                        {filteredExams.length > 0 ? (
                                            filteredExams.map((plan, index) => (
                                                <div key={index} className="border-b border-gray-300 pb-1 mb-1">
                                                    <strong>{plan.module_name}</strong> [{plan.module_code}]
                                                    <br />Semestre: {plan.semester_name || plan.semester_id}
                                                    <br />Niveau: {plan.level_name || 'N/A'} | Spécialité: {plan.speciality_name || 'N/A'}
                                                    <br />Types: {Array.isArray(plan.exam_type) ? plan.exam_type.join(', ') : plan.exam_type}
                                                    <br />Dates: {Array.isArray(plan.exam_dates) ? plan.exam_dates.slice(0, 3).join(', ') : 'N/A'}{plan.exam_dates && plan.exam_dates.length > 3 ? '...' : ''}
                                                    <br />Times: {Array.isArray(plan.exam_times) ? plan.exam_times.join(', ') : 'N/A'}
                                                    <br />Exam Count: {plan.exam_count || 0}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">
                                                {data.semester && data.groups.length > 0 && data.exam_type 
                                                    ? 'Aucun examen trouvé pour ces critères' 
                                                    : 'Veuillez sélectionner un semestre, des sections et un type d\'examen'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-3">
                        <Link
                            href="/responsable/exam-plans"
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isProcessing || data.modules.length === 0}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            <Save className="h-4 w-4" />
                            <span>{isProcessing ? 'Creating...' : `Create Exam Plan (${data.modules.length} exams)`}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
