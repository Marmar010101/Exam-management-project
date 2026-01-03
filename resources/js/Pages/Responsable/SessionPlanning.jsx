// resources/js/Pages/Responsable/SessionPlanning.jsx
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    BookOpen,
    Users,
    Building,
    CheckCircle,
    AlertCircle,
    Save,
    CalendarDays,
    XCircle,
    Users as UsersIcon,
    Building as BuildingIcon,
    Clock as ClockIcon,
    AlertTriangle,
    Info
} from 'lucide-react';

export default function SessionPlanning({ group, modules, rooms, teachers, examTypes, auth }) {
    const [selectedModules, setSelectedModules] = useState([]);
    const [dateRange, setDateRange] = useState({
        start_date: '',
        end_date: ''
    });
    const [selectedExamType, setSelectedExamType] = useState('Continuous assessment');
    const [generatedPlanning, setGeneratedPlanning] = useState([]);
    const [conflicts, setConflicts] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [scheduledCount, setScheduledCount] = useState(0);
    const [failedCount, setFailedCount] = useState(0);
    const [failedExams, setFailedExams] = useState([]);

    const toggleModuleSelection = (module) => {
        const moduleName = module.module_name || module.name || `Module ${module.id}`;
        
        if (selectedModules.find(m => m.id === module.id)) {
            setSelectedModules(selectedModules.filter(m => m.id !== module.id));
        } else {
            setSelectedModules([
                ...selectedModules,
                {
                    id: module.id,
                    name: moduleName,
                    duration: 120,
                    teacher_id: module.teacher_id
                }
            ]);
        }
    };

    const updateModuleDuration = (moduleId, duration) => {
        setSelectedModules(selectedModules.map(module =>
            module.id === moduleId ? { ...module, duration } : module
        ));
    };

    const generatePlanning = async () => {
        if (!dateRange.start_date || !dateRange.end_date || selectedModules.length === 0) {
            alert('Please select date range and at least one module');
            return;
        }

        setIsGenerating(true);
        setMessage('');
        setError(null);
        setConflicts([]);
        setScheduledCount(0);
        setFailedCount(0);
        setFailedExams([]);
        
        const modulesWithNames = selectedModules.map(module => ({
            id: module.id,
            name: module.name || `Module ${module.id}`,
            duration: module.duration
        }));

        const formData = {
            group_id: group.id,
            start_date: dateRange.start_date,
            end_date: dateRange.end_date,
            exam_type: selectedExamType,
            modules: modulesWithNames,
        };

        try {
            const response = await window.axios.post(route('session.planning.store'), formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.data.success) {
                setGeneratedPlanning(response.data.exams);
                setConflicts(response.data.conflicts || []);
                setMessage(response.data.message);
                setScheduledCount(response.data.scheduled_count || 0);
                setFailedCount(response.data.failed_count || 0);
                
                if (response.data.exams.length > 0) {
                    setTimeout(() => {
                        window.location.href = route('planning.calendar', { group: group.id });
                    }, 1500);
                }
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            let errorData = {
                message: 'Error generating planning',
                details: {},
                conflicts: [],
                scheduled_count: 0,
                failed_count: selectedModules.length
            };
            
            if (error.response?.data) {
                errorData = {
                    message: error.response.data.message || 'Failed to generate planning',
                    details: error.response.data,
                    conflicts: error.response.data.conflicts || [],
                    scheduled_count: error.response.data.scheduled_count || 0,
                    failed_count: error.response.data.failed_count || selectedModules.length,
                    failed_exams: error.response.data.failed_exams || [],
                    can_partial_save: error.response.data.can_partial_save || false
                };
            } else if (error.response?.data?.errors) {
                errorData.message = Object.values(error.response.data.errors).flat().join(', ');
            } else if (error.message) {
                errorData.message = error.message;
            }
            
            setError(errorData);
            setConflicts(errorData.conflicts);
            setScheduledCount(errorData.scheduled_count);
            setFailedCount(errorData.failed_count);
            setFailedExams(errorData.failed_exams || []);
        } finally {
            setIsGenerating(false);
        }
    };

    const clearErrors = () => {
        setError(null);
        setConflicts([]);
    };

    const getConflictIcon = (type) => {
        switch(type) {
            case 'room_unavailable':
                return <BuildingIcon className="h-4 w-4" />;
            case 'teacher_unavailable':
            case 'insufficient_teachers':
                return <UsersIcon className="h-4 w-4" />;
            case 'group_conflict':
                return <Users className="h-4 w-4" />;
            case 'time_slot':
                return <ClockIcon className="h-4 w-4" />;
            default:
                return <AlertCircle className="h-4 w-4" />;
        }
    };

    const getConflictColor = (type) => {
        switch(type) {
            case 'room_unavailable':
                return 'text-red-700 bg-red-50 border-red-200';
            case 'teacher_unavailable':
                return 'text-amber-700 bg-amber-50 border-amber-200';
            case 'insufficient_teachers':
                return 'text-orange-700 bg-orange-50 border-orange-200';
            case 'group_conflict':
                return 'text-purple-700 bg-purple-50 border-purple-200';
            case 'time_slot':
                return 'text-blue-700 bg-blue-50 border-blue-200';
            default:
                return 'text-gray-700 bg-gray-50 border-gray-200';
        }
    };

    // Helper to get teacher name from conflict data
    const getTeacherNameFromConflictData = (conflictData) => {
        if (conflictData.teacher_name) return conflictData.teacher_name;
        
        // Try to find teacher from modules list
        const module = modules.find(m => m.id === parseInt(conflictData.module_id));
        if (module?.teacher) {
            return `${module.teacher.first_name || ''} ${module.teacher.last_name || ''}`.trim();
        }
        
        return 'N/A';
    };

    return (
        <AuthenticatedLayout 
            user={auth.user}
            title="Plan Entire Session" 
            activeRoute="dashboard"
        >
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Plan Entire Session
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Generate exam schedule for {group.name}
                            </p>
                        </div>
                        <Link
                            href={route('responsable.dashboard')}
                            className="text-gray-600 hover:text-gray-900"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>

                {/* Success Message */}
                {message && !error && (
                    <div className="mb-6 p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5" />
                            <span>{message}</span>
                        </div>
                    </div>
                )}

                {/* Error and Conflicts Display */}
                {error && (
                    <div className="mb-6 space-y-4">
                        {/* Error Header */}
                        <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="h-5 w-5" />
                                    <span className="font-medium">{error.message}</span>
                                </div>
                                <button
                                    onClick={clearErrors}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <XCircle className="h-5 w-5" />
                                </button>
                            </div>
                            
                            {/* Summary Stats */}
                            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center p-3 bg-white rounded border">
                                    <div className="text-2xl font-bold text-emerald-600">
                                        {scheduledCount}
                                    </div>
                                    <div className="text-sm text-gray-600">Scheduled</div>
                                </div>
                                <div className="text-center p-3 bg-white rounded border">
                                    <div className="text-2xl font-bold text-red-600">
                                        {failedCount}
                                    </div>
                                    <div className="text-sm text-gray-600">Failed</div>
                                </div>
                                <div className="text-center p-3 bg-white rounded border">
                                    <div className="text-2xl font-bold text-amber-600">
                                        {Object.keys(conflicts).length}
                                    </div>
                                    <div className="text-sm text-gray-600">Modules with Conflicts</div>
                                </div>
                                <div className="text-center p-3 bg-white rounded border">
                                    <div className="text-2xl font-bold text-gray-600">
                                        {selectedModules.length}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Selected</div>
                                </div>
                            </div>
                        </div>

                        {/* Failed Exams Summary */}
                        {failedExams.length > 0 && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                                    <h3 className="font-medium text-amber-800">
                                        Modules That Could Not Be Scheduled
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {failedExams.map((exam, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                                            <span className="font-medium text-gray-700">
                                                {exam.module_name}
                                            </span>
                                            <span className="text-sm text-gray-500">
                                                {exam.duration} min
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Detailed Conflicts Card */}
                        {Object.keys(conflicts).length > 0 && (
                            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                                {/* Card Header */}
                                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Info className="h-5 w-5 text-gray-600" />
                                            <div>
                                                <h3 className="font-semibold text-gray-900 text-lg">
                                                    Detailed Conflict Analysis
                                                </h3>
                                                <p className="text-gray-600 text-sm mt-1">
                                                    Understanding why exams couldn't be scheduled
                                                </p>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
                                            {Object.keys(conflicts).length} modules affected
                                        </span>
                                    </div>
                                </div>

                                {/* Conflicts Content */}
                                <div className="p-6">
                                    <div className="space-y-6">
                                        {Object.entries(conflicts).map(([moduleId, conflictData]) => {
                                            const teacherName = getTeacherNameFromConflictData(conflictData);
                                            
                                            return (
                                                <div key={moduleId} className="border border-gray-200 rounded-lg p-5">
                                                    {/* Module Header */}
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3">
                                                                <BookOpen className="h-5 w-5 text-gray-400" />
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-900 text-lg">
                                                                        {conflictData.module_name || `Module ${moduleId}`}
                                                                    </h4>
                                                                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                                                        <span className="flex items-center gap-1">
                                                                            <Clock className="h-3 w-3" />
                                                                            Duration: {conflictData.duration || 120} minutes
                                                                        </span>
                                                                        {teacherName && teacherName !== 'N/A' && (
                                                                            <span className="flex items-center gap-1">
                                                                                <Users className="h-3 w-3" />
                                                                                Teacher: {teacherName}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col items-end">
                                                            <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full mb-2">
                                                                Not Scheduled
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {conflictData.conflicts?.length || 0} conflict(s)
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Conflict Reasons */}
                                                    <div className="space-y-3">
                                                        <h5 className="font-medium text-gray-700 text-sm uppercase tracking-wide">
                                                            Why this couldn't be scheduled:
                                                        </h5>
                                                        
                                                        {conflictData.conflicts && conflictData.conflicts.length > 0 ? (
                                                            <div className="space-y-3">
                                                                {conflictData.conflicts.map((conflict, index) => (
                                                                    <div 
                                                                        key={index}
                                                                        className={`p-3 rounded-lg border ${getConflictColor(conflict.type)}`}
                                                                    >
                                                                        <div className="flex items-start gap-3">
                                                                            <div className="mt-0.5">
                                                                                {getConflictIcon(conflict.type)}
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <div className="flex items-center justify-between mb-1">
                                                                                    <span className="font-medium">
                                                                                        {conflict.type_label || conflict.type?.replace('_', ' ')}
                                                                                    </span>
                                                                                    <span className="text-xs text-gray-500">
                                                                                        {conflict.date} at {conflict.time}
                                                                                    </span>
                                                                                </div>
                                                                                <p className="text-sm">{conflict.message}</p>
                                                                                
                                                                                {/* Show existing conflicts if available */}
                                                                                {conflict.existing_exams && conflict.existing_exams.length > 0 && (
                                                                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                                                                        <p className="text-xs font-medium text-gray-600 mb-1">
                                                                                            Conflicting with:
                                                                                        </p>
                                                                                        <ul className="space-y-1">
                                                                                            {conflict.existing_exams.map((exam, idx) => (
                                                                                                <li key={idx} className="text-xs text-gray-500 flex items-center gap-2">
                                                                                                    <div className="h-1 w-1 rounded-full bg-gray-400"></div>
                                                                                                    {exam.module} ({exam.time})
                                                                                                </li>
                                                                                            ))}
                                                                                        </ul>
                                                                                    </div>
                                                                                )}
                                                                                
                                                                                {/* Show existing assignments if available */}
                                                                                {conflict.existing_assignments && conflict.existing_assignments.length > 0 && (
                                                                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                                                                        <p className="text-xs font-medium text-gray-600 mb-1">
                                                                                            Teacher already assigned to:
                                                                                        </p>
                                                                                        <ul className="space-y-1">
                                                                                            {conflict.existing_assignments.map((exam, idx) => (
                                                                                                <li key={idx} className="text-xs text-gray-500 flex items-center gap-2">
                                                                                                    <div className="h-1 w-1 rounded-full bg-gray-400"></div>
                                                                                                    {exam.module} ({exam.time})
                                                                                                </li>
                                                                                            ))}
                                                                                        </ul>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-4 text-gray-500 italic">
                                                                No specific conflict details available
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Suggestions for this module */}
                                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-medium">Suggestions:</span> Try reducing duration, selecting a different date range, or manually scheduling this module.
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* General Suggestions and Actions */}
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-3">
                                                    How to Resolve These Issues:
                                                </h4>
                                                <ul className="space-y-2 text-sm text-gray-600">
                                                    <li className="flex items-start gap-2">
                                                        <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mt-1.5"></div>
                                                        <span>Extend your selected date range to provide more days</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <div className="h-1.5 w-1.5 bg-green-500 rounded-full mt-1.5"></div>
                                                        <span>Reduce exam durations where possible</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <div className="h-1.5 w-1.5 bg-purple-500 rounded-full mt-1.5"></div>
                                                        <span>Schedule problematic modules manually first</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <div className="h-1.5 w-1.5 bg-amber-500 rounded-full mt-1.5"></div>
                                                        <span>Check room availability and teacher schedules</span>
                                                    </li>
                                                </ul>
                                            </div>
                                            
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-3">
                                                    Available Actions:
                                                </h4>
                                                <div className="space-y-3">
                                                    <button
                                                        onClick={clearErrors}
                                                        className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                    >
                                                        Clear Conflicts and Adjust Parameters
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (confirm('This will clear all current selections. Continue?')) {
                                                                setSelectedModules([]);
                                                                setDateRange({ start_date: '', end_date: '' });
                                                                clearErrors();
                                                            }
                                                        }}
                                                        className="w-full px-4 py-2.5 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors"
                                                    >
                                                        Start Fresh with New Selection
                                                    </button>
                                                    <Link
                                                        href={route('responsable.dashboard')}
                                                        className="block w-full text-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                    >
                                                        Return to Dashboard
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Main Planning Interface */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Configuration */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Date Range Selection */}
                        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <CalendarDays className="h-5 w-5" />
                                Select Exam Period
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        value={dateRange.start_date}
                                        onChange={(e) => setDateRange({...dateRange, start_date: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        value={dateRange.end_date}
                                        onChange={(e) => setDateRange({...dateRange, end_date: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        min={dateRange.start_date || new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Exam Type Selection */}
                        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Exam Type
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {examTypes.map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setSelectedExamType(type)}
                                        className={`px-4 py-3 rounded-lg border text-center transition-colors ${
                                            selectedExamType === type
                                                ? 'bg-blue-50 border-blue-300 text-blue-700'
                                                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Modules Selection */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Select Modules ({selectedModules.length} selected)
                                </h2>
                                {selectedModules.length > 0 && (
                                    <button
                                        onClick={() => {
                                            if (confirm('Clear all selected modules?')) {
                                                setSelectedModules([]);
                                            }
                                        }}
                                        className="text-sm text-red-600 hover:text-red-800"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>
                            
                            {modules.map((module) => {
                                const isSelected = selectedModules.find(m => m.id === module.id);
                                const moduleName = module.module_name || module.name || `Module ${module.id}`;
                                const teacherName = module.teacher ? 
                                    `${module.teacher.first_name || ''} ${module.teacher.last_name || ''}`.trim() 
                                    : module.teacher_name || 'N/A';
                                
                                return (
                                    <div
                                        key={module.id}
                                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                                            isSelected
                                                ? 'border-blue-300 bg-blue-50 shadow-sm'
                                                : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                        onClick={() => toggleModuleSelection(module)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900 mb-1">
                                                    {moduleName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Teacher: {teacherName}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {isSelected && (
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-sm text-gray-600">Duration:</label>
                                                        <select
                                                            onClick={(e) => e.stopPropagation()}
                                                            value={selectedModules.find(m => m.id === module.id)?.duration || 120}
                                                            onChange={(e) => updateModuleDuration(module.id, parseInt(e.target.value))}
                                                            className="px-2 py-1 border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        >
                                                            <option value="60">1 hour</option>
                                                            <option value="90">1.5 hours</option>
                                                            <option value="120">2 hours</option>
                                                            <option value="150">2.5 hours</option>
                                                            <option value="180">3 hours</option>
                                                            <option value="240">4 hours</option>
                                                        </select>
                                                        <span className="text-sm text-gray-500">min</span>
                                                    </div>
                                                )}
                                                <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                                                    isSelected
                                                        ? 'border-blue-500 bg-blue-500'
                                                        : 'border-gray-300'
                                                }`}>
                                                    {isSelected && <CheckCircle className="h-4 w-4 text-white" />}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Column: Preview & Actions */}
                    <div className="space-y-6">
                        {/* Summary Card */}
                        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Planning Summary
                            </h2>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Group:</span>
                                    <span className="font-medium">{group.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Exam Type:</span>
                                    <span className="font-medium">{selectedExamType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Period:</span>
                                    <span className="font-medium">
                                        {dateRange.start_date ? new Date(dateRange.start_date).toLocaleDateString() : 'Not set'} 
                                        {' to '}
                                        {dateRange.end_date ? new Date(dateRange.end_date).toLocaleDateString() : 'Not set'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Modules Selected:</span>
                                    <span className="font-medium">{selectedModules.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Estimated Days Needed:</span>
                                    <span className="font-medium">
                                        {selectedModules.length > 0 ? Math.ceil(selectedModules.length / 3) : 0}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={generatePlanning}
                                disabled={!dateRange.start_date || !dateRange.end_date || selectedModules.length === 0 || isGenerating}
                                className={`w-full mt-6 px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                                    !dateRange.start_date || !dateRange.end_date || selectedModules.length === 0 || isGenerating
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Calendar className="h-5 w-5" />
                                        Generate Planning
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                            <h3 className="font-medium text-gray-900 mb-4">
                                Quick Statistics
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                    <span className="text-gray-600">Available Modules:</span>
                                    <span className="font-medium">{modules.length}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                                    <span className="text-blue-600">Selected Modules:</span>
                                    <span className="font-medium text-blue-700">{selectedModules.length}</span>
                                </div>
                                {error && (
                                    <>
                                        <div className="flex justify-between items-center p-3 bg-emerald-50 rounded">
                                            <span className="text-emerald-600">Successfully Scheduled:</span>
                                            <span className="font-medium text-emerald-700">{scheduledCount}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                                            <span className="text-red-600">Failed to Schedule:</span>
                                            <span className="font-medium text-red-700">{failedCount}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Success Preview - Only shown when successfully generated */}
                        {generatedPlanning.length > 0 && !error && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                                    <h3 className="font-semibold text-emerald-800">
                                        Planning Generated Successfully!
                                    </h3>
                                </div>
                                <p className="text-emerald-700 text-sm mb-4">
                                    {generatedPlanning.length} exams scheduled successfully
                                </p>
                                <button
                                    onClick={() => window.location.href = route('planning.calendar', { group: group.id })}
                                    className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 flex items-center justify-center gap-2 transition-colors"
                                >
                                    <CalendarDays className="h-5 w-5" />
                                    View Calendar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}