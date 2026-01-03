import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { BookOpen, Calendar, Clock, MapPin } from 'lucide-react';

export default function MyExams() {
    // Données fictives pour le moment - TOUS les examens de l'étudiant
    const exams = [
        {
            id: 1,
            module: 'Algorithmique et Structures de Données',
            date: '12/01/2025',
            time: '09:00',
            room: 'B12',
            type: 'Examen'
        },
        {
            id: 2,
            module: 'Bases de Données',
            date: '15/01/2025',
            time: '14:00',
            room: 'A101',
            type: 'Contrôle'
        },
        {
            id: 3,
            module: 'Programmation Orientée Objet',
            date: '20/01/2025',
            time: '10:00',
            room: 'C201',
            type: 'Rattrapage'
        },
        {
            id: 4,
            module: 'Réseaux Informatiques',
            date: '25/01/2025',
            time: '16:00',
            room: 'B205',
            type: 'Examen'
        },
        {
            id: 5,
            module: 'Mathématiques Appliquées',
            date: '28/01/2025',
            time: '11:00',
            room: 'A102',
            type: 'Contrôle'
        },
        {
            id: 6,
            module: 'Anglais Technique',
            date: '30/01/2025',
            time: '15:00',
            room: 'D101',
            type: 'Examen'
        },
        {
            id: 7,
            module: 'Génie Logiciel',
            date: '02/02/2025',
            time: '08:30',
            room: 'C301',
            type: 'Examen'
        },
        {
            id: 8,
            module: 'Intelligence Artificielle',
            date: '05/02/2025',
            time: '13:30',
            room: 'B201',
            type: 'Contrôle'
        }
    ];

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

    return (
        <AuthenticatedLayout header="Mes Examens">
            <Head title="Mes Examens - Étudiant" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* En-tête */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes Examens</h1>
                        <p className="text-gray-600">
                            Consultez la liste complète de tous vos examens
                        </p>
                    </div>

                    {/* Liste complète des examens */}
                    <div className="space-y-4">
                        {exams.map((exam) => (
                            <div
                                key={exam.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        {/* Module */}
                                        <div className="flex items-center mb-3">
                                            <BookOpen className="text-gray-400 mr-3" size={20} />
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {exam.module}
                                            </h3>
                                        </div>

                                        {/* Détails de l'examen */}
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                            {/* Date */}
                                            <div className="flex items-center">
                                                <Calendar className="text-gray-400 mr-2" size={16} />
                                                <div>
                                                    <p className="text-sm text-gray-500">Date</p>
                                                    <p className="text-sm font-medium text-gray-900">{exam.date}</p>
                                                </div>
                                            </div>

                                            {/* Heure */}
                                            <div className="flex items-center">
                                                <Clock className="text-gray-400 mr-2" size={16} />
                                                <div>
                                                    <p className="text-sm text-gray-500">Heure</p>
                                                    <p className="text-sm font-medium text-gray-900">{exam.time}</p>
                                                </div>
                                            </div>

                                            {/* Salle */}
                                            <div className="flex items-center">
                                                <MapPin className="text-gray-400 mr-2" size={16} />
                                                <div>
                                                    <p className="text-sm text-gray-500">Salle</p>
                                                    <p className="text-sm font-medium text-gray-900">{exam.room}</p>
                                                </div>
                                            </div>

                                            {/* Type */}
                                            <div className="flex items-center">
                                                <div>
                                                    <p className="text-sm text-gray-500">Type</p>
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(
                                                            exam.type
                                                        )}`}
                                                    >
                                                        {exam.type}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Message si pas d'examens */}
                    {exams.length === 0 && (
                        <div className="text-center py-12">
                            <BookOpen className="mx-auto mb-4 text-gray-300" size={48} />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Aucun examen trouvé
                            </h3>
                            <p className="text-gray-500">
                                Vous n'avez aucun examen programmé pour le moment
                            </p>
                        </div>
                    )}

                    {/* Note explicative */}
                    <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">
                                    📚 My Exams vs Calendar
                                </h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <p><strong>My Exams</strong> : Liste complète de TOUS vos examens</p>
                                    <p><strong>Calendar</strong> : Examens organisés par date avec vue calendrier</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
