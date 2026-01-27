import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ChevronLeft } from 'lucide-react';

export default function ExamPlansCreate({ 
    groups = [], 
    modules = [], 
    teachers = [], 
    rooms = [], 
    examTypes = []
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        group: '',
        groups: [], // Changed from single group to array
        modules: [], // Changed from single module to array
        rooms: [], // Changed from single room to array
        teachers: [], // Changed from single teacher to array
        exam_type: 'Exam', // Changed to 'Exam'
        exam_subtype: 'Normal', // New field for subtype
        start_date: '', // Changed from exam_date to start_date
        end_date: '', // Added end_date
        start_time: '',
        end_time: '',
        description: '',
    });

    // Get available subtypes based on exam type
    const getAvailableSubtypes = () => {
        switch (data.exam_type) {
            case 'Control':
                return [
                    { value: 'Normal', label: 'Normal' },
                    { value: 'Replacement', label: 'Replacement' }
                ];
            case 'Test_TP':
                return [
                    { value: 'Test', label: 'Test' }
                ];
            default: // Exam
                return [
                    { value: 'Normal', label: 'Normal' },
                    { value: 'Replacement', label: 'Replacement' },
                    { value: 'Retake', label: 'Retake' }
                ];
        }
    };

    // Get available modules based on exam type
    const getAvailableModules = () => {
        if (!data.exam_type) return modules || [];
        
        // Filter modules based on their exam_types field
        return (modules || []).filter(module => {
            const moduleExamTypes = module.exam_types || [];
            return moduleExamTypes.includes(data.exam_type);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Test minimal
        const testData = {
            groups: [1], // Remplacez par un ID de groupe existant
            modules: [1], // Remplacez par un ID de module existant
            teachers: [],
            rooms: [],
            exam_type: 'Exam',
            exam_subtype: 'Normal',
            start_date: '2024-01-30',
            end_date: '2024-01-30',
            start_time: '09:00',
            end_time: '11:00',
            description: 'Test exam'
        };
        
        console.log('Test data:', testData);
        
        post(route('responsable.exam-plans.store'), testData, {
            onSuccess: () => console.log('Success!'),
            onError: (errors) => console.error('Errors:', errors)
        });
    };

    const handleModuleChange = (moduleId) => {
        if (moduleId === 'all') {
            // Toggle all available modules
            const availableModules = getAvailableModules();
            const currentModules = data.modules || [];
            if (currentModules.length === availableModules.length) {
                setData('modules', []);
            } else {
                setData('modules', availableModules.map(m => m.id));
            }
        } else {
            // Toggle individual module
            const currentModules = data.modules || [];
            const newModules = currentModules.includes(moduleId)
                ? currentModules.filter(id => id !== moduleId)
                : [...currentModules, moduleId];
            setData('modules', newModules);
        }
        
        // Reset groups when modules change
        setData('groups', []);
        // Reset subtype to first available option
        setData('exam_subtype', getAvailableSubtypes()[0]?.value || 'Normal');
    };

    const handleExamTypeChange = (examType) => {
        setData('exam_type', examType);
        // Reset subtype to first available option
        setData('exam_subtype', getAvailableSubtypes()[0]?.value || 'Normal');
        // Reset selected modules when exam type changes
        setData('modules', []);
        setData('groups', []);
    };

    // Get groups that are associated with selected modules
    const getAvailableGroups = () => {
        if (!data.modules || data.modules.length === 0) return [];
        
        // Get unique level_id and speciality_id combinations from selected modules
        const moduleCombinations = data.modules.map(moduleId => {
            const module = modules.find(m => m.id === moduleId);
            return module ? {
                level_id: module.level_id,
                speciality_id: module.speciality_id
            } : null;
        }).filter(Boolean);
        
        // Filter groups that exactly match any of the module combinations
        const availableGroups = (groups || []).filter(group => {
            return moduleCombinations.some(combo => 
                group.level_id === combo.level_id && 
                group.speciality_id === combo.speciality_id
            );
        });
        
        // If no groups found for exact matches, show a helpful message
        if (availableGroups.length === 0 && moduleCombinations.length > 0) {
            const comboInfo = moduleCombinations.map(combo => 
                `Level ${combo.level_id}, Speciality ${combo.speciality_id}`
            ).join(', ');
            console.log('No groups found for combinations:', comboInfo);
        }
        
        return availableGroups;
    };

    const handleRoomChange = (roomId) => {
        if (roomId === 'all') {
            // Toggle all available rooms
            const availableRooms = getAvailableRooms();
            const currentRooms = data.rooms || [];
            if (currentRooms.length === availableRooms.length) {
                setData('rooms', []);
            } else {
                setData('rooms', availableRooms.map(r => r.id));
            }
        } else {
            // Toggle individual room
            const currentRooms = data.rooms || [];
            const newRooms = currentRooms.includes(roomId)
                ? currentRooms.filter(id => id !== roomId)
                : [...currentRooms, roomId];
            setData('rooms', newRooms);
        }
    };

    const isAllRoomsSelected = (data.rooms || []).length === (rooms || []).length && (rooms || []).length > 0;

    const handleTeacherChange = (teacherId) => {
        if (teacherId === 'all') {
            // Toggle all available teachers
            const availableTeachers = getAvailableTeachers();
            const currentTeachers = data.teachers || [];
            if (currentTeachers.length === availableTeachers.length) {
                setData('teachers', []);
            } else {
                setData('teachers', availableTeachers.map(t => t.id));
            }
        } else {
            // Toggle individual teacher
            const currentTeachers = data.teachers || [];
            const newTeachers = currentTeachers.includes(teacherId)
                ? currentTeachers.filter(id => id !== teacherId)
                : [...currentTeachers, teacherId];
            setData('teachers', newTeachers);
        }
    };

    const isAllTeachersSelected = (data.teachers || []).length === (teachers || []).length && (teachers || []).length > 0;

    // Get available teachers (all teachers are available for now)
    const getAvailableTeachers = () => {
        return teachers || [];
    };

    // Get available rooms (all rooms are available for now)
    const getAvailableRooms = () => {
        return rooms || [];
    };

    const isAllSelected = (data.modules || []).length === (getAvailableModules() || []).length && (getAvailableModules() || []).length > 0;
    const isAllGroupsSelected = (data.groups || []).length === getAvailableGroups().length && getAvailableGroups().length > 0;

    const handleStartDateChange = (date) => {
        setData('start_date', date);
        // If end_date is before start_date, update it
        if (data.end_date && data.end_date < date) {
            setData('end_date', date);
        }
    };

    const handleEndDateChange = (date) => {
        // Only allow end_date to be after or equal to start_date
        if (data.start_date && date >= data.start_date) {
            setData('end_date', date);
        }
    };

    const handleGroupChange = (groupId) => {
        if (groupId === 'all') {
            // Toggle all available groups
            const currentGroups = data.groups || [];
            const availableGroups = getAvailableGroups();
            if (currentGroups.length === availableGroups.length) {
                setData('groups', []);
            } else {
                setData('groups', availableGroups.map(g => g.id));
            }
        } else {
            // Toggle individual group
            const currentGroups = data.groups || [];
            const newGroups = currentGroups.includes(groupId)
                ? currentGroups.filter(id => id !== groupId)
                : [...currentGroups, groupId];
            setData('groups', newGroups);
        }
    };

    return (
        <AuthenticatedLayout header="Create Exam Plan - Responsible">
            <Head title="Create Exam Plan - Responsible" />
            
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <Link
                            href="/responsable/exam-plans"
                            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Back to Exam Plans
                        </Link>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Create Exam Plan</h1>
                    <p className="mt-2 text-gray-600">Schedule a new exam for selected groups and modules</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Exam Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Exam Type
                            </label>
                            <select
                                value={data.exam_type}
                                onChange={(e) => handleExamTypeChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="Exam">Exam</option>
                                <option value="Control">Control</option>
                                <option value="Test_TP">Test_TP</option>
                            </select>
                        </div>

                        {/* Exam Subtype */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {data.exam_type === 'Test_TP' ? 'Type de Test' : 'Type d\'Examen'}
                            </label>
                            <select
                                value={data.exam_subtype}
                                onChange={(e) => setData('exam_subtype', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                {getAvailableSubtypes().map(subtype => (
                                    <option key={subtype.value} value={subtype.value}>
                                        {subtype.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Module */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Modules
                            </label>
                            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                                {/* Select All Option */}
                                <div className="flex items-center p-2 hover:bg-gray-50 rounded">
                                    <input
                                        type="checkbox"
                                        id="select-all"
                                        checked={isAllSelected}
                                        onChange={() => handleModuleChange('all')}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="select-all" className="ml-2 text-sm font-medium text-gray-900">
                                        Sélectionner tous les modules ({getAvailableModules().length})
                                    </label>
                                </div>
                                
                                {/* Individual Modules */}
                                {Array.isArray(getAvailableModules()) && getAvailableModules().map((module) => (
                                    <div key={module.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                                        <input
                                            type="checkbox"
                                            id={`module-${module.id}`}
                                            checked={data.modules.includes(module.id)}
                                            onChange={() => handleModuleChange(module.id)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor={`module-${module.id}`} className="ml-2 text-sm text-gray-700">
                                            {module.module_name || module.name || 'Unnamed Module'}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {data.modules.length > 0 && (
                                <p className="text-xs text-gray-500 mt-1">
                                    {data.modules.length} module(s) sélectionné(s)
                                </p>
                            )}
                        </div>

                        {/* Groups */}
                        {data.modules.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Groups
                                </label>
                                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                                    {/* Select All Option */}
                                    <div className="flex items-center p-2 hover:bg-gray-50 rounded">
                                        <input
                                            type="checkbox"
                                            id="select-all-groups"
                                            checked={isAllGroupsSelected}
                                            onChange={() => handleGroupChange('all')}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="select-all-groups" className="ml-2 text-sm font-medium text-gray-900">
                                            Sélectionner tous les groupes ({getAvailableGroups().length})
                                        </label>
                                    </div>
                                    
                                    {/* Individual Groups */}
                                    {getAvailableGroups().length > 0 ? (
                                        getAvailableGroups().map((group) => (
                                            <div key={group.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                                                <input
                                                    type="checkbox"
                                                    id={`group-${group.id}`}
                                                    checked={data.groups.includes(group.id)}
                                                    onChange={() => handleGroupChange(group.id)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor={`group-${group.id}`} className="ml-2 text-sm text-gray-700">
                                                    {group.name || 'Unnamed Group'}
                                                    {group.level && <span className="text-gray-500 ml-1">({group.level.name})</span>}
                                                    {group.speciality && <span className="text-gray-500 ml-1">- {group.speciality.name}</span>}
                                                </label>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-gray-500 text-sm p-2">
                                            Aucun groupe trouvé pour les modules sélectionnés
                                        </div>
                                    )}
                                </div>
                                {data.groups.length > 0 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {data.groups.length} groupe(s) sélectionné(s)
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Date Range */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => handleStartDateChange(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) => handleEndDateChange(e.target.value)}
                                    min={data.start_date}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>
                        {data.start_date && data.end_date && (
                            <p className="text-xs text-gray-500">
                                Période : {data.start_date} au {data.end_date}
                            </p>
                        )}

                        {/* Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Time
                                </label>
                                <input
                                    type="time"
                                    value={data.start_time}
                                    onChange={(e) => setData('start_time', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Time
                                </label>
                                <input
                                    type="time"
                                    value={data.end_time}
                                    onChange={(e) => setData('end_time', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>

                        {/* Room */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rooms
                            </label>
                            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                                {/* Select All Option */}
                                <div className="flex items-center p-2 hover:bg-gray-50 rounded">
                                    <input
                                        type="checkbox"
                                        id="select-all-rooms"
                                        checked={isAllRoomsSelected}
                                        onChange={() => handleRoomChange('all')}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="select-all-rooms" className="ml-2 text-sm font-medium text-gray-900">
                                        Sélectionner toutes les salles ({rooms.length})
                                    </label>
                                </div>
                                
                                {/* Individual Rooms */}
                                {Array.isArray(rooms) && rooms.map((room) => (
                                    <div key={room.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                                        <input
                                            type="checkbox"
                                            id={`room-${room.id}`}
                                            checked={data.rooms.includes(room.id)}
                                            onChange={() => handleRoomChange(room.id)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor={`room-${room.id}`} className="ml-2 text-sm text-gray-700">
                                            {room.room_name || room.name || 'Unnamed Room'}
                                            {room.capacity && <span className="text-gray-500 ml-1">({room.capacity} places)</span>}
                                            {room.type && <span className="text-gray-500 ml-1">- {room.type}</span>}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {data.rooms.length > 0 && (
                                <p className="text-xs text-gray-500 mt-1">
                                    {data.rooms.length} salle(s) sélectionnée(s)
                                </p>
                            )}
                        </div>

                        {/* Teacher */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Teachers
                            </label>
                            <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                                {/* Select All Option */}
                                <div className="flex items-center p-2 hover:bg-gray-50 rounded">
                                    <input
                                        type="checkbox"
                                        id="select-all-teachers"
                                        checked={isAllTeachersSelected}
                                        onChange={() => handleTeacherChange('all')}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="select-all-teachers" className="ml-2 text-sm font-medium text-gray-900">
                                        Sélectionner tous les enseignants ({teachers.length})
                                    </label>
                                </div>
                                
                                {/* Individual Teachers */}
                                {Array.isArray(teachers) && teachers.map((teacher) => (
                                    <div key={teacher.id} className="flex items-center p-2 hover:bg-gray-50 rounded">
                                        <input
                                            type="checkbox"
                                            id={`teacher-${teacher.id}`}
                                            checked={data.teachers.includes(teacher.id)}
                                            onChange={() => handleTeacherChange(teacher.id)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor={`teacher-${teacher.id}`} className="ml-2 text-sm text-gray-700">
                                            {teacher.first_name} {teacher.last_name}
                                            {teacher.speciality && <span className="text-gray-500 ml-1">- {teacher.speciality}</span>}
                                            {teacher.department && <span className="text-gray-500 ml-1">({teacher.department})</span>}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            {data.teachers.length > 0 && (
                                <p className="text-xs text-gray-500 mt-1">
                                    {data.teachers.length} enseignant(s) sélectionné(s)
                                </p>
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
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Optional description or notes about this exam..."
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-3">
                            <Link
                                href="/responsable/exam-plans"
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {processing ? 'Creating...' : 'Create Exam Plan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
