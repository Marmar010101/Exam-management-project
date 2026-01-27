import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DepartmentPlanningView from '@/Components/DepartmentPlanningView';
import { 
    ChevronLeft,
    Send,
    Edit
} from 'lucide-react';

export default function ExamPlanShow({ examPlan, allExamPlans }) {
    const canEdit = ['pending', 'rejected'].includes(examPlan.status);
    const canSendToHead = ['pending'].includes(examPlan.status);

    // Get planning data from examPlan or generate default structure
    const planningData = examPlan.planning_data ? 
        JSON.parse(examPlan.planning_data) : 
        generateDefaultPlanning();

    return (
        <AuthenticatedLayout>
            <Head title="Planning des Examens" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Planning des Examens
                                </h1>
                                <p className="mt-2 text-gray-600">
                                    Session Janvier 2026 - {examPlan.group_name || 'Tous les départements'}
                                </p>
                            </div>
                            <div className="flex space-x-3">
                                {canEdit && (
                                    <Link
                                        href={route('responsable.exam-plans.edit', examPlan.id)}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Modifier
                                    </Link>
                                )}
                                {canSendToHead && (
                                    <button
                                        onClick={() => {
                                            if (confirm('Êtes-vous sûr de vouloir envoyer ce planning au Head Department?')) {
                                                // Handle send to head
                                            }
                                        }}
                                        className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                                    >
                                        <Send className="h-4 w-4 mr-2" />
                                        Envoyer au Head
                                    </button>
                                )}
                                <Link
                                    href={route('responsable.exam-plans.index')}
                                    className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2" />
                                    Retour aux plans
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    {/* Planning Display */}
                    <DepartmentPlanningView planning={planningData} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Generate default planning structure if no data exists
function generateDefaultPlanning() {
    return {
        title: "Planning des Examens - Session Janvier 2026",
        subtitle: "Vue unifiée de tous les départements",
        timeSlots: ['8h30–10h30', '10h45–12h45', '13h–15h'],
        dates: ['Dimanche 11/01/2026', 'Jeudi 15/01/2026', 'Lundi 19/01/2026'],
        departments: {
            'Informatique Fondamentale': {
                name: 'Informatique Fondamentale',
                icon: '🔬',
                color: 'red',
                totalExams: 3,
                levels: {
                    'L1': {
                        name: 'L1',
                        specialties: {
                            'Tronc Commun': {
                                name: 'Tronc Commun',
                                groups: [{
                                    id: 1,
                                    name: 'L1 TC1',
                                    students: 25,
                                    examsGrid: [
                                        [
                                            { modules: ['Algorithmique'], teacher: 'Dr. Omar', room: 'Amphi 1', groupSize: 25, roomCapacity: 150 },
                                            { modules: ['Bases de Données'], teacher: 'Dr. Leila', room: 'Amphi 2', groupSize: 25, roomCapacity: 150 },
                                            { modules: ['Réseaux'], teacher: 'Dr. Karim', room: 'Amphi 3', groupSize: 25, roomCapacity: 150 }
                                        ],
                                        [
                                            { modules: ['Mathématiques'], teacher: 'Dr. Fatima', room: 'Amphi 1', groupSize: 25, roomCapacity: 150 },
                                            { modules: ['Programmation'], teacher: 'Dr. Ahmed', room: 'Amphi 2', groupSize: 25, roomCapacity: 150 },
                                            { modules: ['Structures'], teacher: 'Dr. Mohamed', room: 'Amphi 3', groupSize: 25, roomCapacity: 150 }
                                        ],
                                        [
                                            { modules: ['Logique'], teacher: 'Dr. Nadia', room: 'Amphi 1', groupSize: 25, roomCapacity: 150 },
                                            { modules: ['Algorithmique Avancée'], teacher: 'Dr. Omar', room: 'Amphi 2', groupSize: 25, roomCapacity: 150 },
                                            { modules: ['Systèmes'], teacher: 'Dr. Leila', room: 'Amphi 3', groupSize: 25, roomCapacity: 150 }
                                        ]
                                    ]
                                }]
                            }
                        }
                    }
                }
            }
        },
        totalDepartments: 1,
        availableRooms: [
            { name: 'Amphi 1', capacity: 150, type: 'Amphithéâtre' },
            { name: 'Amphi 2', capacity: 150, type: 'Amphithéâtre' },
            { name: 'Amphi 3', capacity: 150, type: 'Amphithéâtre' }
        ],
        conflictIndicators: {
            teacherConflicts: 0,
            roomConflicts: 0,
            capacityIssues: 0,
            totalExams: 9
        }
    };
}
