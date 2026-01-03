import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { 
    Calendar, 
    Clock, 
    Users, 
    BookOpen, 
    Filter, 
    ChevronLeft, 
    ChevronRight, 
    Plus, 
    Edit, 
    Trash2,
    MapPin,
    User,
    AlertCircle
} from 'lucide-react';

export default function Exams_planning({ exams = [], groups = [], modules = [], teachers = [], rooms = [], filieres = [], years = [] }) {
    const [selectedYear, setSelectedYear] = useState(years[0]?.id || '');
    const [selectedFiliere, setSelectedFiliere] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentWeek, setCurrentWeek] = useState(0);
    const [viewMode, setViewMode] = useState('week'); // week, month, list
    const [showModal, setShowModal] = useState(false);
    const [selectedExam, setSelectedExam] = useState(null);

    // Categories d'examens
    const categories = ['Contrôle', 'Test_TP', 'Examen'];
    
    // Jours de la semaine
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeSlots = [
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
    ];

    // Filtrer les examens selon les critères
    const filteredExams = exams.filter(exam => {
        const yearMatch = !selectedYear || exam.group?.level?.annee_id == selectedYear;
        const filiereMatch = !selectedFiliere || exam.group?.speciality?.filiere_id == selectedFiliere;
        const categoryMatch = !selectedCategory || exam.exam_category === selectedCategory;
        return yearMatch && filiereMatch && categoryMatch;
    });

    // Obtenir la date de début de la semaine
    const getWeekDates = () => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1 + (currentWeek * 7));
        
        return weekDays.map((day, index) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + index);
            return {
                day,
                date: date.getDate(),
                fullDate: date.toISOString().split('T')[0]
            };
        });
    };

    // Obtenir les examens pour une date et heure spécifiques
    const getExamsForSlot = (date, time) => {
        return filteredExams.filter(exam => {
            const examDate = exam.exame_date;
            const examTime = exam.exame_time;
            return examDate === date && examTime === time;
        });
    };

    // Couleurs selon la catégorie
    const getCategoryColor = (category) => {
        switch (category) {
            case 'Contrôle': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Test_TP': return 'bg-green-100 text-green-800 border-green-200';
            case 'Examen': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const weekDates = getWeekDates();

    return (
        <AuthenticatedLayout header="Exams Planning">
            <Head title="Exams Planning" />
            
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header avec filtres */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Department Schedule</h1>
                            <p className="text-gray-600 mt-1">Complete exam schedule for all departments</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                <Plus size={18} className="mr-2" />
                                Add Exam
                            </button>
                        </div>
                    </div>

                    {/* Filtres */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Years</option>
                                {years.map(year => (
                                    <option key={year.id} value={year.id}>{year.annee}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                            <select
                                value={selectedFiliere}
                                onChange={(e) => setSelectedFiliere(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Departments</option>
                                {filieres.map(filiere => (
                                    <option key={filiere.id} value={filiere.id}>{filiere.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Categories</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">View Mode</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setViewMode('week')}
                                    className={`px-3 py-2 rounded-lg transition-colors ${
                                        viewMode === 'week' 
                                            ? 'bg-blue-500 text-white' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Week
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`px-3 py-2 rounded-lg transition-colors ${
                                        viewMode === 'list' 
                                            ? 'bg-blue-500 text-white' 
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    List
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation semaine */}
                {viewMode === 'week' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setCurrentWeek(currentWeek - 1)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {weekDates[0]?.fullDate && new Date(weekDates[0].fullDate).toLocaleDateString('en-US', { 
                                        month: 'long', 
                                        day: 'numeric',
                                        year: 'numeric'
                                    })} - {weekDates[5]?.fullDate && new Date(weekDates[5].fullDate).toLocaleDateString('en-US', { 
                                    month: 'long', 
                                    day: 'numeric',
                                    year: 'numeric'
                                })}
                                </h3>
                            </div>
                            
                            <button
                                onClick={() => setCurrentWeek(currentWeek + 1)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Vue semaine - Tableau */}
                {viewMode === 'week' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Time
                                        </th>
                                        {weekDates.map(({ day, date }) => (
                                            <th key={day} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                <div>{day}</div>
                                                <div className="text-lg font-normal text-gray-900">{date}</div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {timeSlots.map(time => (
                                        <tr key={time} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
                                                <div className="flex items-center">
                                                    <Clock size={16} className="mr-2 text-gray-400" />
                                                    {time}
                                                </div>
                                            </td>
                                            {weekDates.map(({ fullDate }) => {
                                                const slotExams = getExamsForSlot(fullDate, time);
                                                return (
                                                    <td key={fullDate} className="px-2 py-2 border-r border-gray-200 align-top">
                                                        <div className="space-y-1 min-h-[60px]">
                                                            {slotExams.map(exam => (
                                                                <div
                                                                    key={exam.id}
                                                                    className={`p-2 rounded-lg text-xs border cursor-pointer hover:shadow-md transition-shadow ${getCategoryColor(exam.exam_category)}`}
                                                                    onClick={() => setSelectedExam(exam)}
                                                                >
                                                                    <div className="font-semibold truncate">{exam.module?.module_name}</div>
                                                                    <div className="flex items-center mt-1">
                                                                        <Users size={12} className="mr-1" />
                                                                        {exam.group?.name}
                                                                    </div>
                                                                    <div className="flex items-center mt-1">
                                                                        <MapPin size={12} className="mr-1" />
                                                                        Room {exam.room?.name || 'TBD'}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Vue liste */}
                {viewMode === 'list' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date & Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Module
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Category
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Group
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Teacher
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Room
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredExams.map(exam => (
                                        <tr key={exam.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{exam.exame_date}</div>
                                                <div className="text-sm text-gray-500">{exam.exame_time}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{exam.module?.module_name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(exam.exam_category)}`}>
                                                    {exam.exam_category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{exam.group?.name}</div>
                                                <div className="text-sm text-gray-500">{exam.group?.speciality?.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{exam.teacher?.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{exam.room?.name || 'TBD'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setSelectedExam(exam)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button className="text-red-600 hover:text-red-900">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <Calendar className="text-blue-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">{filteredExams.length}</h3>
                                <p className="text-sm text-gray-600">Total Exams</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-red-100 rounded-lg">
                                <AlertCircle className="text-red-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {filteredExams.filter(e => e.exam_category === 'Examen').length}
                                </h3>
                                <p className="text-sm text-gray-600">Final Exams</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <AlertCircle className="text-blue-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {filteredExams.filter(e => e.exam_category === 'Contrôle').length}
                                </h3>
                                <p className="text-sm text-gray-600">Controls</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <AlertCircle className="text-green-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {filteredExams.filter(e => e.exam_category === 'Test_TP').length}
                                </h3>
                                <p className="text-sm text-gray-600">TP Tests</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal détails examen */}
            {selectedExam && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Exam Details</h3>
                                <button
                                    onClick={() => setSelectedExam(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ×
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Module</label>
                                    <p className="text-gray-900">{selectedExam.module?.module_name}</p>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(selectedExam.exam_category)}`}>
                                        {selectedExam.exam_category}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Date</label>
                                        <p className="text-gray-900">{selectedExam.exame_date}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Time</label>
                                        <p className="text-gray-900">{selectedExam.exame_time}</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Group</label>
                                        <p className="text-gray-900">{selectedExam.group?.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Teacher</label>
                                        <p className="text-gray-900">{selectedExam.teacher?.name}</p>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Room</label>
                                    <p className="text-gray-900">{selectedExam.room?.name || 'TBD'}</p>
                                </div>
                            </div>
                            
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setSelectedExam(null)}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Close
                                </button>
                                <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
