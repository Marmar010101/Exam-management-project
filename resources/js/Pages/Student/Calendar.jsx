import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, BookOpen, Clock, MapPin } from 'lucide-react';

export default function StudentCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    // Données fictives basées sur l'exemple réel - Master GL 1ère année 2025-2026
    const exams = [
        // Mercredi 07/01/2026
        {
            id: 1,
            module: 'Ing Exig',
            date: '2026-01-07',
            time: '08:30',
            endTime: '10:30',
            room: 'Noos',
            type: 'Examen',
            teacher: 'Chikh',
            description: 'Commun MI SIC'
        },
        {
            id: 2,
            module: 'Arch. Entreprise',
            date: '2026-01-07',
            time: '10:45',
            endTime: '12:45',
            room: 'Noos',
            type: 'Examen',
            teacher: 'Marouf',
            description: ''
        },
        {
            id: 3,
            module: 'Anglais',
            date: '2026-01-07',
            time: '13:00',
            endTime: '15:00',
            room: 'Noos',
            type: 'Examen',
            teacher: 'Boubris',
            description: 'Commun MI SIC'
        },
        // Dimanche 11/01/2026
        {
            id: 4,
            module: 'Calcul haute performance',
            date: '2026-01-11',
            time: '08:30',
            endTime: '10:30',
            room: 'Noos',
            type: 'Examen',
            teacher: 'Absari',
            description: 'Commun ING4 IA'
        },
        {
            id: 5,
            module: 'Web Av',
            date: '2026-01-11',
            time: '10:45',
            endTime: '12:45',
            room: 'Noos',
            type: 'Examen',
            teacher: 'Meziane A',
            description: ''
        },
        // Jeudi 15/01/2026
        {
            id: 6,
            module: 'IA',
            date: '2026-01-15',
            time: '08:30',
            endTime: '10:30',
            room: 'Noos',
            type: 'Examen',
            teacher: 'Lazouni',
            description: ''
        },
        {
            id: 7,
            module: 'Arduino',
            date: '2026-01-15',
            time: '10:45',
            endTime: '12:45',
            room: 'Noos',
            type: 'Examen',
            teacher: 'Tadaloui',
            description: ''
        },
        {
            id: 8,
            module: 'Arduino',
            date: '2026-01-15',
            time: '13:00',
            endTime: '15:00',
            room: 'Noos',
            type: 'Examen',
            teacher: 'Tadaloui',
            description: 'Labo 102 - 103'
        }
    ];

    // Fonctions pour le calendrier
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const days = [];
        
        // Ajouter les jours vides au début (lundi = 1, dimanche = 0)
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
        for (let i = 0; i < adjustedFirstDay; i++) {
            days.push(null);
        }
        
        // Ajouter les jours du mois
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        
        return days;
    };

    const getExamsForDate = (day) => {
        if (!day) return [];
        
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return exams.filter(exam => exam.date === dateStr);
    };

    const changeMonth = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
        setSelectedDate(null); // Réinitialiser la sélection quand on change de mois
    };

    const handleDateClick = (day) => {
        if (day) {
            setSelectedDate(day === selectedDate ? null : day);
        }
    };

    const monthNames = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    const days = getDaysInMonth(currentDate);
    const selectedDateExams = selectedDate ? getExamsForDate(selectedDate) : [];

    const getTypeColor = (type) => {
        switch (type) {
            case 'Examen':
                return 'bg-blue-100 text-blue-800';
            case 'Contrôle':
                return 'bg-orange-100 text-orange-800';
            case 'Rattrapage':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const hasExam = (day) => {
        return getExamsForDate(day).length > 0;
    };

    return (
        <AuthenticatedLayout header="Calendrier">
            <Head title="Calendrier - Étudiant" />

            <div className="py-6">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    {/* 1️⃣ Zone Calendrier */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        {/* En-tête du calendrier */}
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={() => changeMonth(-1)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            
                            <h2 className="text-xl font-bold text-gray-900">
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h2>
                            
                            <button
                                onClick={() => changeMonth(1)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* Jours de la semaine */}
                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {dayNames.map(day => (
                                <div
                                    key={day}
                                    className="text-center text-sm font-medium text-gray-600 py-2"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* 2️⃣ Grille du calendrier */}
                        <div className="grid grid-cols-7 gap-2">
                            {days.map((day, index) => {
                                const dayExams = getExamsForDate(day);
                                const isSelected = selectedDate === day;
                                const hasExamsToday = hasExam(day);
                                const isToday = 
                                    day === new Date().getDate() && 
                                    currentDate.getMonth() === new Date().getMonth() && 
                                    currentDate.getFullYear() === new Date().getFullYear();

                                return (
                                    <div
                                        key={index}
                                        onClick={() => handleDateClick(day)}
                                        className={`
                                            min-h-[80px] p-2 border rounded-lg cursor-pointer transition-all
                                            ${!day ? 'border-transparent cursor-default' : 'border-gray-200 hover:bg-gray-50'}
                                            ${isSelected ? 'bg-blue-50 border-blue-500 shadow-md' : ''}
                                            ${isToday && !isSelected ? 'bg-blue-100 border-blue-500' : ''}
                                            ${hasExamsToday && !isSelected ? 'bg-green-50 border-green-200' : ''}
                                        `}
                                    >
                                        {day && (
                                            <>
                                                <div className="text-sm font-medium text-gray-900 mb-1">
                                                    {day}
                                                </div>
                                                
                                                {/* Indicateur d'examens */}
                                                {hasExamsToday && (
                                                    <div className="flex justify-center">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 3️⃣ Zone Détails des examens */}
                    {selectedDate && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Examens du {selectedDate} {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h3>
                            
                            {selectedDateExams.length > 0 ? (
                                <div className="space-y-4">
                                    {selectedDateExams.map(exam => (
                                        <div
                                            key={exam.id}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <BookOpen className="text-gray-400" size={20} />
                                                <div>
                                                    <p className="font-medium text-gray-900">📘 Module : {exam.module}</p>
                                                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                                        <span>📝 Type : {exam.type}</span>
                                                        <span>⏰ Heure : {exam.time} - {exam.endTime}</span>
                                                        <span>🏫 Salle : {exam.room}</span>
                                                        <span>👨‍🏫 Enseignant : {exam.teacher}</span>
                                                    </div>
                                                    {exam.description && (
                                                        <p className="text-sm text-gray-500 mt-1">ℹ️ {exam.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <span
                                                className={`px-3 py-1 text-xs font-semibold rounded-full ${getTypeColor(exam.type)}`}
                                            >
                                                {exam.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <CalendarIcon className="mx-auto mb-3 text-gray-300" size={48} />
                                    <p className="text-gray-500 font-medium">
                                        Aucun examen prévu pour ce jour
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
