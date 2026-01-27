import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ExamCreate({ sections, modules, teachers, semesters }) {
    // Debug: Check if props are received
    console.log('Props received:', { sections, modules, teachers, semesters });
    console.log('Sections count:', sections?.length);
    console.log('Modules count:', modules?.length);
    console.log('Teachers count:', teachers?.length);
    console.log('Semesters count:', semesters?.length);
    
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedModule, setSelectedModule] = useState('');
    const [selectedExamType, setSelectedExamType] = useState('');
    const [selectedSubtype, setSelectedSubtype] = useState('');
    const [availableModules, setAvailableModules] = useState([]);
    const [availableSemesters, setAvailableSemesters] = useState([]);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        section_id: '',
        module_id: '',
        semester_id: '',
        exam_type: '',
        exam_subtype: '',
        duration: 120,
        description: '',
        teacher_id: '',
    });

    // Handle section change
    const handleSectionChange = (e) => {
        const sectionId = e.target.value;
        setSelectedSection(sectionId);
        setSelectedModule('');
        setSelectedExamType('');
        setSelectedSubtype('');
        
        setData('section_id', sectionId);
        setData('module_id', '');
        setData('semester_id', '');
        setData('exam_type', '');
        setData('exam_subtype', '');

        // Get correct semesters based on level
        if (sectionId) {
            const section = sections.find(s => s.id == sectionId);
            console.log('Selected section:', section); // Debug
            
            if (section) {
                // Map level to correct semester IDs
                const levelSemesterMap = {
                    11: [37, 38], // L1 -> Semestre 1 (37), Semestre 2 (38)
                    12: [37, 38], // L2 -> Semestre 1 (37), Semestre 2 (38)
                    13: [39, 40], // L3 -> Semestre 1 (39), Semestre 2 (40)
                    14: [41, 42], // M1 -> Semestre 1 (41), Semestre 2 (42)
                    15: [43, 44], // M2 -> Semestre 1 (43), Semestre 2 (44)
                    16: [45, 46], // ing1 -> Semestre 1 (45), Semestre 2 (46)
                    17: [47, 48], // ing2 -> Semestre 1 (47), Semestre 2 (48)
                    18: [49, 50], // ing3 -> Semestre 1 (49), Semestre 2 (50)
                    19: [51, 52], // ing4 -> Semestre 1 (51), Semestre 2 (52)
                    20: [53, 54], // ing5 -> Semestre 1 (53), Semestre 2 (54)
                    21: [37, 38], // L1 -> Semestre 1 (37), Semestre 2 (38)
                    22: [37, 38], // L2 -> Semestre 1 (37), Semestre 2 (38)
                    23: [39, 40], // L3 -> Semestre 1 (39), Semestre 2 (40)
                    24: [41, 42], // M1 -> Semestre 1 (41), Semestre 2 (42)
                    25: [43, 44], // M2 -> Semestre 1 (43), Semestre 2 (44)
                    26: [45, 46], // ing1 -> Semestre 1 (45), Semestre 2 (46)
                    27: [47, 48], // ing2 -> Semestre 1 (47), Semestre 2 (48)
                    28: [49, 50], // ing3 -> Semestre 1 (49), Semestre 2 (50)
                    29: [51, 52], // ing4 -> Semestre 1 (51), Semestre 2 (52)
                    30: [53, 54], // ing5 -> Semestre 1 (53), Semestre 2 (54)
                };
                
                const semesterIds = levelSemesterMap[section.level_id] || [37, 38]; // Default to first 2
                
                let availableSemesters = semesters.filter(semester => 
                    semesterIds.includes(semester.id)
                );
                
                console.log('Level:', section.level_id, 'Semesters:', availableSemesters); // Debug
                setAvailableSemesters(availableSemesters);
            }
        } else {
            setAvailableSemesters([]);
        }
        
        // Reset modules when section changes
        setAvailableModules([]);
    };

    // Handle semester change (filters modules)
    const handleSemesterChange = (e) => {
        const semesterId = e.target.value;
        setData('semester_id', semesterId);
        setSelectedModule('');
        setData('module_id', '');
        
        // Simple: show all modules for the selected section
        if (selectedSection && semesterId) {
            const section = sections.find(s => s.id == selectedSection);
            
            if (section) {
                // Filter only by section (level and speciality)
                let filteredModules = modules.filter(module => 
                    module.level_id === section.level_id && 
                    module.speciality_id === section.speciality_id
                );
                
                console.log('Modules for section:', filteredModules.length);
                setAvailableModules(filteredModules);
            }
        } else {
            setAvailableModules([]);
        }
    };

    // Handle module change
    const handleModuleChange = (e) => {
        const moduleId = e.target.value;
        setSelectedModule(moduleId);
        setSelectedExamType('');
        setSelectedSubtype('');
        
        setData('module_id', moduleId);
        setData('exam_type', '');
        setData('exam_subtype', '');
    };

    // Handle exam type change
    const handleExamTypeChange = (e) => {
        const examType = e.target.value;
        setSelectedExamType(examType);
        setSelectedSubtype('');
        
        setData('exam_type', examType);
        setData('exam_subtype', '');
    };

    // Handle subtype change
    const handleSubtypeChange = (e) => {
        const subtype = e.target.value;
        setSelectedSubtype(subtype);
        setData('exam_subtype', subtype);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting exam data:', data);
        post('/Responsable/Exams', {
            ...data,
            exam_subtype: data.exam_subtype || 'Normal',
            onSuccess: () => {
                console.log('Exam created successfully');
                reset();
                setSelectedSection('');
                setSelectedModule('');
                setSelectedExamType('');
                setSelectedSubtype('');
                setAvailableModules([]);
                // Redirect to exams index page
                window.location.href = '/Responsable/Exams';
            },
            onError: (errors) => {
                console.error('Create exam errors:', errors);
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Exam" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Create New Exam</h1>
                                <p className="text-gray-600 mt-1">Fill in the exam details below</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="text-gray-600 hover:text-gray-900 flex items-center"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-lg shadow">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Section Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Section <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={selectedSection}
                                    onChange={handleSectionChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select a section</option>
                                    {sections.map((section) => (
                                        <option key={section.id} value={section.id}>
                                            {section.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.section_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.section_id}</p>
                                )}
                            </div>

                            {/* Semester Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Semester <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.semester_id}
                                    onChange={handleSemesterChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    disabled={!selectedSection}
                                >
                                    <option value="">Select a semester</option>
                                    {availableSemesters.map((semester) => (
                                        <option key={semester.id} value={semester.id}>
                                            {semester.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.semester_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.semester_id}</p>
                                )}
                            </div>

                            {/* Module Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Module <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={selectedModule}
                                    onChange={handleModuleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    disabled={!selectedSection || !data.semester_id}
                                >
                                    <option value="">Select a module</option>
                                    {availableModules.map((module) => (
                                        <option key={module.id} value={module.id}>
                                            {module.module_name} ({module.code})
                                        </option>
                                    ))}
                                </select>
                                {errors.module_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.module_id}</p>
                                )}
                            </div>

                            {/* Exam Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Exam Type <span className="text-red-500">*</span>
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="exam_type"
                                            value="Exam"
                                            checked={selectedExamType === 'Exam'}
                                            onChange={handleExamTypeChange}
                                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            required
                                        />
                                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                            Exam (Final)
                                        </span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="exam_type"
                                            value="Control"
                                            checked={selectedExamType === 'Control'}
                                            onChange={handleExamTypeChange}
                                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            required
                                        />
                                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                            Control (Continuous)
                                        </span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="exam_type"
                                            value="Test_TP"
                                            checked={selectedExamType === 'Test_TP'}
                                            onChange={handleExamTypeChange}
                                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            required
                                        />
                                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                            Test_TP (Practical)
                                        </span>
                                    </label>
                                </div>
                                {errors.exam_type && (
                                    <p className="mt-1 text-sm text-red-600">{errors.exam_type}</p>
                                )}
                            </div>

                            {/* Exam Subtype */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Exam Subtype
                                    {selectedExamType === 'Test_TP' ? (
                                        <span className="text-gray-500 ml-1">(Not applicable)</span>
                                    ) : (
                                        <span className="text-red-500 ml-1">*</span>
                                    )}
                                </label>
                                {selectedExamType === 'Test_TP' ? (
                                    <div className="p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 text-center">
                                        No subtypes available for Test TP
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="exam_subtype"
                                                value="Normal"
                                                checked={selectedSubtype === 'Normal'}
                                                onChange={handleSubtypeChange}
                                                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                required={selectedExamType !== 'Test_TP'}
                                            />
                                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                                Normal
                                            </span>
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="exam_subtype"
                                                value="Replacement"
                                                checked={selectedSubtype === 'Replacement'}
                                                onChange={handleSubtypeChange}
                                                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                required={selectedExamType !== 'Test_TP'}
                                            />
                                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                                                Replacement
                                            </span>
                                        </label>
                                        {selectedExamType === 'Exam' && (
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="exam_subtype"
                                                    value="Make-up"
                                                    checked={selectedSubtype === 'Make-up'}
                                                    onChange={handleSubtypeChange}
                                                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                    required={selectedExamType !== 'Test_TP'}
                                                />
                                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                                    Make-up
                                                </span>
                                            </label>
                                        )}
                                    </div>
                                )}
                                {errors.exam_subtype && (
                                    <p className="mt-1 text-sm text-red-600">{errors.exam_subtype}</p>
                                )}
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Duration (minutes) <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.duration}
                                    onChange={(e) => setData('duration', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value={60}>1 hour</option>
                                    <option value={90}>1.5 hours</option>
                                    <option value={120}>2 hours</option>
                                    <option value={150}>2.5 hours</option>
                                    <option value={180}>3 hours</option>
                                    <option value={240}>4 hours</option>
                                </select>
                                {errors.duration && (
                                    <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                                )}
                            </div>

                            {/* Teacher */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Teacher <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.teacher_id}
                                    onChange={(e) => setData('teacher_id', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select a teacher</option>
                                    {teachers.map((teacher) => (
                                        <option key={teacher.id} value={teacher.id}>
                                            {teacher.user.first_name} {teacher.user.last_name}
                                        </option>
                                    ))}
                                </select>
                                {errors.teacher_id && (
                                    <p className="mt-1 text-sm text-red-600">{errors.teacher_id}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter exam description (optional)"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-3 pt-4 border-t">
                                <Link
                                    href={route('responsable.exams.index')}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {processing ? 'Creating...' : 'Create Exam'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
