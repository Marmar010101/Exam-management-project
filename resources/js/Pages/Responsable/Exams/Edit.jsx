import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Calendar, Clock, Users, Edit, Trash2, Save, X, AlertCircle, CheckCircle, Hourglass } from 'lucide-react';

export default function ExamEdit({ exam, sections, modules, teachers }) {
    const { data, setData, post, processing, errors } = useForm({
        id: exam.id,
        section_id: exam.group_id || '',
        module_id: exam.module_id || '',
        exam_type: exam.exam_type || '',
        exam_subtype: exam.exam_subtype || '',
        duration: exam.duration_minutes || 120,
        description: exam.description || '',
        teacher_id: exam.teacher_id || '',
    });

    const [filteredModules, setFilteredModules] = useState([]);
    const [availableExamTypes, setAvailableExamTypes] = useState([]);
    const [availableSubtypes, setAvailableSubtypes] = useState([]);

    useEffect(() => {
        if (data.section_id) {
            const section = sections.find(s => s.id == data.section_id);
            if (section) {
                const sectionModules = modules.filter(module => 
                    module.level_id === section.level_id && 
                    module.speciality_id === section.speciality_id
                );
                setFilteredModules(sectionModules);
            }
        }
    }, [data.section_id, sections, modules]);

    useEffect(() => {
        if (data.module_id) {
            const module = modules.find(m => m.id == data.module_id);
            if (module) {
                const examTypes = getExamTypesForModule(module);
                setAvailableExamTypes(examTypes);
                
                // Set available subtypes based on current exam type
                if (data.exam_type) {
                    const subtypes = getSubtypesForExamType(data.exam_type);
                    setAvailableSubtypes(subtypes);
                }
            }
        }
    }, [data.module_id, modules, data.exam_type]);

    const handleSectionChange = (e) => {
        const sectionId = e.target.value;
        setData('section_id', sectionId);
        setData('module_id', '');
        setData('exam_type', '');
        setData('exam_subtype', '');

        if (sectionId) {
            const section = sections.find(s => s.id == sectionId);
            if (section) {
                const sectionModules = modules.filter(module => 
                    module.level_id === section.level_id && 
                    module.speciality_id === section.speciality_id
                );
                setFilteredModules(sectionModules);
            }
        } else {
            setFilteredModules([]);
        }
    };

    const handleModuleChange = (e) => {
        const moduleId = e.target.value;
        setData('module_id', moduleId);
        setData('exam_type', '');
        setData('exam_subtype', '');

        if (moduleId) {
            const module = modules.find(m => m.id == moduleId);
            if (module) {
                const examTypes = getExamTypesForModule(module);
                setAvailableExamTypes(examTypes);
            }
        } else {
            setAvailableExamTypes([]);
        }
    };

    const handleExamTypeChange = (e) => {
        const examType = e.target.value;
        setData('exam_type', examType);
        setData('exam_subtype', '');
        
        // Set available subtypes based on exam type
        const subtypes = getSubtypesForExamType(examType);
        setAvailableSubtypes(subtypes);
    };

    const getSubtypesForExamType = (examType) => {
        switch (examType) {
            case 'Exam':
                return ['Normal', 'Replacement', 'Make-up'];
            case 'Control':
                return ['Normal', 'Replacement'];
            case 'Test_TP':
                return []; // No subtypes for Test_TP
            default:
                return [];
        }
    };

    const getExamTypesForModule = (module) => {
        const moduleName = module.module_name.toLowerCase();
        const types = ['Exam'];

        // Modules with TD have Controls
        if (moduleName.includes('algorithmique') || 
            moduleName.includes('algèbre') || 
            moduleName.includes('analyse') ||
            moduleName.includes('probabilité') ||
            moduleName.includes('mathématique') ||
            moduleName.includes('logique')) {
            types.push('Control');
        }

        // Modules with TP have Test_TP
        if (moduleName.includes('programmation') || 
            moduleName.includes('base de données') ||
            moduleName.includes('réseaux') ||
            moduleName.includes('système') ||
            moduleName.includes('logiciel') ||
            moduleName.includes('web') ||
            moduleName.includes('compilation') ||
            moduleName.includes('arduino')) {
            types.push('Test_TP');
        }

        return types;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('responsable.exams.update', exam.id));
    };

    const getExamTypeColor = (type) => {
        switch (type) {
            case 'Exam': return 'bg-blue-100 text-blue-800';
            case 'Control': return 'bg-green-100 text-green-800';
            case 'Test_TP': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit Exam" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Edit Exam</h1>
                                <p className="text-gray-600 mt-1">Update exam details below</p>
                            </div>
                            <Link
                                href={route('responsable.exams.index')}
                                className="text-gray-600 hover:text-gray-900 flex items-center"
                            >
                                <X className="h-5 w-5 mr-1" />
                                Cancel
                            </Link>
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
                                    value={data.section_id}
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

                            {/* Module Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Module <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.module_id}
                                    onChange={handleModuleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    disabled={!data.section_id}
                                >
                                    <option value="">Select a module</option>
                                    {filteredModules.map((module) => (
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
                                <select
                                    value={data.exam_type}
                                    onChange={handleExamTypeChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    disabled={!data.module_id}
                                >
                                    <option value="">Select exam type</option>
                                    {availableExamTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type} {type === 'Exam' ? '(Final)' : type === 'Control' ? '(Continuous)' : '(Practical)'}
                                        </option>
                                    ))}
                                </select>
                                {errors.exam_type && (
                                    <p className="mt-1 text-sm text-red-600">{errors.exam_type}</p>
                                )}
                            </div>

                            {/* Exam Subtype */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Exam Subtype {data.exam_type === 'Test_TP' ? (
                                        <span className="text-gray-500">(Not applicable)</span>
                                    ) : (
                                        <span className="text-red-500">*</span>
                                    )}
                                </label>
                                {data.exam_type === 'Test_TP' ? (
                                    <div className="p-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 text-center">
                                        No subtypes available for Test TP
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {availableSubtypes.map((subtype) => (
                                            <label key={subtype} className="relative">
                                                <input
                                                    type="radio"
                                                    name="exam_subtype"
                                                    value={subtype}
                                                    checked={data.exam_subtype === subtype}
                                                    onChange={(e) => setData('exam_subtype', e.target.value)}
                                                    className="sr-only peer"
                                                    required={data.exam_type !== 'Test_TP'}
                                                />
                                                <div className={`p-3 border-2 rounded-lg cursor-pointer transition-all peer-checked:border-blue-500 peer-checked:bg-blue-50 ${
                                                    subtype === 'Normal' ? 'bg-gray-100 text-gray-800' :
                                                    subtype === 'Replacement' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    <div className="text-center">
                                                        <div className="font-medium">{subtype}</div>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
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
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Updating...' : 'Update Exam'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
