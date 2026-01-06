import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { 
    Calendar, 
    Clock, 
    Users, 
    BookOpen, 
    User,
    AlertCircle,
    CheckCircle,
    XCircle,
    Eye,
    Search,
    ChevronDown,
    ChevronRight
} from 'lucide-react';

export default function FacultySchedule({ 
    faculty = 'L1', 
    speciality = 'Informatique', 
    schedule = {}, 
    groups = [], 
    modules = [],
    teachers = []
}) {
    const { flash = {} } = usePage().props;
    const [selectedFaculty, setSelectedFaculty] = useState(faculty);
    const [selectedSpeciality, setSelectedSpeciality] = useState(speciality);
    const [selectedModule, setSelectedModule] = useState(null);
    const [showTeachersModal, setShowTeachersModal] = useState(false);
    const [showStudentsModal, setShowStudentsModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);

    // Time slots
    const timeSlots = [
        '08:00-09:30',
        '09:30-11:00',
        '11:00-12:30',
        '12:30-14:00',
        '14:00-15:30',
        '15:30-17:00',
        '17:00-18:30'
    ];

    // Days of week
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

    // Get teachers for a specific module
    const getModuleTeachers = (moduleId) => {
        return teachers.filter(teacher => 
            teacher.modules && teacher.modules.some(module => module.id === moduleId)
        );
    };

    // Get students for a specific group
    const getGroupStudents = (groupId) => {
        const group = groups.find(g => g.id === groupId);
        return group ? group.students : [];
    };

    // Get exam for specific slot
    const getExamForSlot = (day, timeSlot, module) => {
        const daySchedule = schedule[day] || {};
        const slotSchedule = daySchedule[timeSlot] || {};
        return slotSchedule[module?.id] || null;
    };

    const handleViewTeachers = (module) => {
        setSelectedModule(module);
        setShowTeachersModal(true);
    };

    const handleViewStudents = (group) => {
        setSelectedGroup(group);
        setShowStudentsModal(true);
    };

    const getExamTypeColor = (type) => {
        switch (type) {
            case 'Final': return 'bg-red-100 text-red-800 border-red-200';
            case 'Midterm': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Quiz': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Practical': return 'bg-green-100 text-green-800 border-green-200';
            case 'Oral': return 'bg-purple-100 text-purple-800 border-purple-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`${selectedFaculty} ${selectedSpeciality} - Planning`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {selectedFaculty} {selectedSpeciality} - Planning
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Emploi du temps et liste des étudiants par groupe
                        </p>
                    </div>

                    {/* Flash Messages */}
                    {flash.success && (
                        <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
                            <div className="flex">
                                <CheckCircle className="h-5 w-5 text-green-400" />
                                <div className="ml-3">
                                    <p className="text-sm text-green-800">{flash.success}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Faculty Selection */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Faculté</label>
                                <select
                                    value={selectedFaculty}
                                    onChange={(e) => setSelectedFaculty(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="L1">L1</option>
                                    <option value="L2">L2</option>
                                    <option value="L3">L3</option>
                                    <option value="M1">M1</option>
                                    <option value="M2">M2</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Spécialité</label>
                                <select
                                    value={selectedSpeciality}
                                    onChange={(e) => setSelectedSpeciality(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="Informatique">Informatique</option>
                                    <option value="Systèmes d'Information">Systèmes d'Information</option>
                                    <option value="Logiciels Intelligents">Logiciels Intelligents</option>
                                    <option value="Tronc Commun">Tronc Commun</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher module, groupe..."
                                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Groups Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Liste des Étudiants par Groupe</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {groups.map((group) => (
                                <div key={group.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-medium text-gray-900">Groupe {group.name}</h3>
                                        <button
                                            onClick={() => handleViewStudents(group)}
                                            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                                        >
                                            <Users size={16} className="mr-1" />
                                            Voir les étudiants
                                        </button>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {group.students?.length || 0} étudiants
                                    </div>
                                    {/* Preview of first 3 students */}
                                    <div className="mt-2 space-y-1">
                                        {group.students?.slice(0, 3).map((student, index) => (
                                            <div key={student.id} className="text-xs text-gray-700">
                                                {index + 1}. {student.first_name} {student.last_name}
                                            </div>
                                        ))}
                                        {group.students?.length > 3 && (
                                            <div className="text-xs text-gray-500">
                                                ... et {group.students.length - 3} autres
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Schedule Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Emploi du Temps</h2>
                            
                            {/* Schedule Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="border border-gray-200 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                Horaire
                                            </th>
                                            {days.map((day) => (
                                                <th key={day} className="border border-gray-200 px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                                                    {day}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {timeSlots.map((timeSlot) => (
                                            <tr key={timeSlot}>
                                                <td className="border border-gray-200 px-4 py-2 text-sm font-medium text-gray-900 bg-gray-50">
                                                    {timeSlot}
                                                </td>
                                                {days.map((day) => (
                                                    <td key={`${day}-${timeSlot}`} className="border border-gray-200 px-2 py-2 align-top">
                                                        <div className="space-y-1">
                                                            {modules.map((module) => {
                                                                const exam = getExamForSlot(day, timeSlot, module);
                                                                if (!exam) return null;
                                                                
                                                                return (
                                                                    <div
                                                                        key={module.id}
                                                                        className={`p-2 rounded text-xs border cursor-pointer hover:shadow-md transition-shadow ${getExamTypeColor(exam.exam_type)}`}
                                                                        onClick={() => handleViewTeachers(module)}
                                                                    >
                                                                        <div className="font-medium">{module.module_name}</div>
                                                                        <div className="text-xs opacity-75">
                                            {exam.room_name} • {exam.teacher_name}
                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Modules with Teachers */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Modules et Enseignants</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {modules.map((module) => {
                                const moduleTeachers = getModuleTeachers(module.id);
                                const responsible = moduleTeachers.find(t => t.is_responsable);
                                
                                return (
                                    <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-medium text-gray-900">{module.module_name}</h3>
                                            <button
                                                onClick={() => handleViewTeachers(module)}
                                                className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                                            >
                                                <Users size={16} className="mr-1" />
                                                Voir les enseignants
                                            </button>
                                        </div>
                                        
                                        {/* Responsible */}
                                        {responsible && (
                                            <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-200">
                                                <div className="text-xs font-medium text-blue-800 mb-1">Responsable:</div>
                                                <div className="text-sm text-blue-900">
                                                    {responsible.first_name} {responsible.last_name}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Other Teachers */}
                                        <div className="text-sm text-gray-600">
                                            {moduleTeachers.length > 0 ? (
                                                <div>
                                                    <div className="text-xs font-medium text-gray-700 mb-1">Enseignants:</div>
                                                    {moduleTeachers.filter(t => !t.is_responsable).map((teacher) => (
                                                        <div key={teacher.id} className="text-xs text-gray-700">
                                                            • {teacher.first_name} {teacher.last_name}
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-xs text-gray-500">Aucun enseignant assigné</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Teachers Modal */}
            {showTeachersModal && selectedModule && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Enseignants - {selectedModule.module_name}
                            </h3>
                            <button
                                onClick={() => setShowTeachersModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {getModuleTeachers(selectedModule.id).map((teacher) => (
                                <div key={teacher.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center">
                                                <User className="h-5 w-5 mr-2 text-gray-400" />
                                                <span className="font-medium text-gray-900">
                                                    {teacher.first_name} {teacher.last_name}
                                                </span>
                                            </div>
                                            {teacher.is_responsable && (
                                                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    Responsable
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {teacher.department} • {teacher.speciality}
                                        </div>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-700">
                                        {teacher.grade}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Students Modal */}
            {showStudentsModal && selectedGroup && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                                Étudiants - Groupe {selectedGroup.name}
                            </h3>
                            <button
                                onClick={() => setShowStudentsModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {getGroupStudents(selectedGroup.id).map((student, index) => (
                                <div key={student.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <User className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">
                                                {index + 1}. {student.first_name} {student.last_name}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {student.matricule}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
