import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { 
    Calendar, 
    CalendarDays,
    Clock, 
    Users, 
    BookOpen, 
    User,
    AlertCircle,
    CheckCircle,
    Eye,
    Search,
    MapPin,
    Download,
    Printer,
    Filter,
    Check,
    X,
    Clock3
} from 'lucide-react';

export default function FacultySchedule({ 
    cycles = [],
    specialities = [],
    groups = [], 
    modules = [],
    teachers = [],
    examPlans = []
}) {
    const { flash = {} } = usePage().props;
    const [selectedCycle, setSelectedCycle] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [selectedSpeciality, setSelectedSpeciality] = useState('');
    const [selectedSystem, setSelectedSystem] = useState('');
    const [viewMode, setViewMode] = useState('planning');
    const [showGroupsList, setShowGroupsList] = useState(false);
    const [selectedPlanning, setSelectedPlanning] = useState(null);
    const [showConsolidatedPlanning, setShowConsolidatedPlanning] = useState(false);
    
    const [validationStatus, setValidationStatus] = useState({});
    const [validating, setValidating] = useState({});
    
    const validateAllSchedules = (action) => {
        setValidating(prev => ({ ...prev, all: true }));
        
        router.post(route('headdepartment.faculty-schedule.validate'), {
            schedule_id: 'all',
            action: action
        }, {
            onSuccess: (response) => {
                const newStatus = {};
                planningPages.forEach(page => {
                    newStatus[page.id] = action;
                });
                setValidationStatus(newStatus);
                setValidating(prev => ({ ...prev, all: false }));
            },
            onError: (errors) => {
                setValidating(prev => ({ ...prev, all: false }));
                console.error('Erreur de validation globale:', errors);
            }
        });
    };
    
    const getValidationIcon = (scheduleId) => {
        const status = validationStatus[scheduleId];
        switch(status) {
            case 'validate': return <CheckCircle className="w-4 h-4" />;
            case 'reject': return <X className="w-4 h-4" />;
            case 'pending': return <Clock3 className="w-4 h-4" />;
            default: return null;
        }
    };
    
    const generatePlanningPages = () => {
        return [
            {
                id: 'planning-unique',
                title: "Planning Académique Complet - Session Janvier 2026",
                description: "TOUS les 18 tableaux académiques - Licence, Master, Ingénieur",
                dates: ["Dimanche 11/01/2026", "Jeudi 15/01/2026", "Lundi 19/01/2026"],
                timeSlots: ["8h30–10h30", "10h45–12h45", "13h–15h"],
                tableaux: [
                    {
                        title: "1ère Année Ingénieur Informatique (SI)",
                        exams: [
                            [
                                { module: "Algorithmique", teacher: "M. Kaci", room: "Salle N101" },
                                { module: "Systèmes d'Exploitation", teacher: "M. Bensaba", room: "Salle N102" },
                                { module: "Algèbre", teacher: "M. Laskri", room: "Salle N103" },
                                { module: "Analyse", teacher: "M. Touati", room: "Salle N104" }
                            ],
                            [
                                { module: "Expression Écrite et Bureautique", teacher: "Mme. Kaci", room: "Salle N105" },
                                { module: "Structure Machine", teacher: "M. Bensaba", room: "Salle N106" },
                                { module: "Électronique Fondamentale", teacher: "M. Touati", room: "Salle N107" }
                            ]
                        ]
                    },
                    {
                        title: "2ème Année Ingénieur Informatique (SI)",
                        exams: [
                            [
                                { module: "Analyse 3", teacher: "M. Kaci", room: "Salle N108" },
                                { module: "Algorithmique 3", teacher: "M. Bensaba", room: "Salle N109" },
                                { module: "Algèbre 3", teacher: "M. Laskri", room: "Salle N110" },
                                { module: "Programmation Orientée Objet (POO 1)", teacher: "M. Touati", room: "Salle N111" }
                            ],
                            [
                                { module: "Probabilités et Statistiques", teacher: "M. Kaci", room: "Salle N112" },
                                { module: "Systèmes d'Information", teacher: "M. Bensaba", room: "Salle N113" },
                                { module: "Entreprenariat", teacher: "M. Laskri", room: "Salle N114" }
                            ]
                        ]
                    },
                    {
                        title: "3ème Année Ingénieur Informatique – Génie Logiciel (GL)",
                        exams: [
                            [
                                { module: "Génie Logiciel", teacher: "M. Kaci", room: "Salle N115" },
                                { module: "Bases de Données", teacher: "M. Bensaba", room: "Salle N116" },
                                { module: "Algorithmique", teacher: "M. Laskri", room: "Salle N117" },
                                { module: "Systèmes d'Exploitation", teacher: "M. Touati", room: "Salle N118" }
                            ],
                            [
                                { module: "Technologies Optimales", teacher: "M. Kaci", room: "Salle N115" },
                                { module: "Intelligence Artificielle", teacher: "M. Bensaba", room: "Salle N116" },
                                { module: "Développement Mobile", teacher: "M. Laskri", room: "Salle N117" }
                            ]
                        ]
                    },
                    {
                        title: "4ème Année Ingénieur Informatique – Intelligence Artificielle (IA)",
                        exams: [
                            [
                                { module: "Génie Logiciel", teacher: "M. Kaci", room: "Salle N119" },
                                { module: "Bases de Données", teacher: "M. Bensaba", room: "Salle N120" },
                                { module: "Analyse Numérique", teacher: "M. Laskri", room: "Salle N121" },
                                { module: "Systèmes d'Exploitation", teacher: "M. Touati", room: "Salle N122" }
                            ],
                            [
                                { module: "Technologies Optimales", teacher: "M. Kaci", room: "Salle N119" },
                                { module: "Intelligence Artificielle", teacher: "M. Bensaba", room: "Salle N120" },
                                { module: "Développement Mobile", teacher: "M. Laskri", room: "Salle N121" }
                            ]
                        ]
                    },
                    {
                        title: "5ème Année Ingénieur Informatique – Réseaux",
                        exams: [
                            [
                                { module: "Génie Logiciel", teacher: "M. Kaci", room: "Salle N123" },
                                { module: "Bases de Données Avancées", teacher: "M. Bensaba", room: "Salle N124" },
                                { module: "Réseaux Avancés", teacher: "M. Laskri", room: "Salle N125" },
                                { module: "Systèmes d'Exploitation", teacher: "M. Touati", room: "Salle N126" }
                            ],
                            [
                                { module: "Technologies Web", teacher: "M. Kaci", room: "Salle N123" },
                                { module: "Modélisation des Systèmes d'Information", teacher: "M. Bensaba", room: "Salle N124" }
                            ]
                        ]
                    },
                    {
                        title: "6ème Année Ingénieur Informatique – Génie Logiciel (GL)",
                        exams: [
                            [
                                { module: "Conception de Logiciels", teacher: "M. Kaci", room: "Salle N127" },
                                { module: "Data Mining", teacher: "M. Bensaba", room: "Salle N128" },
                                { module: "Compilation 2", teacher: "M. Laskri", room: "Salle N129" },
                                { module: "Web Avancé", teacher: "M. Touati", room: "Salle N130" }
                            ],
                            [
                                { module: "Méthodes de Management Agiles", teacher: "M. Kaci", room: "Salle N127" },
                                { module: "Réseaux et Protocoles", teacher: "M. Bensaba", room: "Salle N128" }
                            ]
                        ]
                    },
                    {
                        title: "7ème Année Ingénieur Informatique – Intelligence Artificielle (IA)",
                        exams: [
                            [
                                { module: "Recherche Opérationnelle", teacher: "M. Kaci", room: "Salle N131" },
                                { module: "Calcul Haute Performance", teacher: "M. Bensaba", room: "Salle N132" },
                                { module: "Machine Learning", teacher: "M. Laskri", room: "Salle N133" },
                                { module: "Représentation des Connaissances", teacher: "M. Touati", room: "Salle N134" }
                            ],
                            [
                                { module: "Business Intelligence", teacher: "M. Kaci", room: "Salle N131" },
                                { module: "Modélisation et Simulation", teacher: "M. Bensaba", room: "Salle N132" },
                                { module: "Techniques de Rédaction", teacher: "M. Laskri", room: "Salle N133" }
                            ]
                        ]
                    },
                    {
                        title: "8ème Année Licence Informatique",
                        exams: [
                            [
                                { module: "Algorithmique", teacher: "M. Kaci", room: "Salle L101" },
                                { module: "Analyse", teacher: "M. Bensaba", room: "Salle L102" },
                                { module: "Algèbre", teacher: "M. Laskri", room: "Salle L103" },
                                { module: "Électricité", teacher: "M. Touati", room: "Salle L104" }
                            ],
                            [
                                { module: "Structure Machine", teacher: "M. Kaci", room: "Salle L105" },
                                { module: "Logiciels Libres", teacher: "M. Bensaba", room: "Salle L106" },
                                { module: "Anglais", teacher: "M. Laskri", room: "Salle L107" }
                            ]
                        ]
                    },
                    {
                        title: "9ème Année Licence Informatique",
                        exams: [
                            [
                                { module: "Algorithmique", teacher: "M. Kaci", room: "Salle L108" },
                                { module: "Théorie des Graphes", teacher: "M. Bensaba", room: "Salle L109" },
                                { module: "Architecture des Ordinateurs", teacher: "M. Laskri", room: "Salle L110" },
                                { module: "Logique Mathématique", teacher: "M. Touati", room: "Salle L111" }
                            ],
                            [
                                { module: "Mathématiques Numériques", teacher: "M. Kaci", room: "Salle L112" },
                                { module: "Systèmes d'Information", teacher: "M. Bensaba", room: "Salle L113" },
                                { module: "Anglais", teacher: "M. Laskri", room: "Salle L114" }
                            ]
                        ]
                    },
                    {
                        title: "10ème Année Licence Informatique",
                        exams: [
                            [
                                { module: "Programmation Logique", teacher: "M. Kaci", room: "Salle L115" },
                                { module: "Compilation", teacher: "M. Bensaba", room: "Salle L116" },
                                { module: "Interfaces Homme-Machine (IHM)", teacher: "M. Laskri", room: "Salle L117" },
                                { module: "Systèmes d'Exploitation", teacher: "M. Touati", room: "Salle L118" }
                            ],
                            [
                                { module: "Génie Logiciel", teacher: "M. Kaci", room: "Salle L119" },
                                { module: "Probabilités", teacher: "M. Bensaba", room: "Salle L120" },
                                { module: "Économie Numérique", teacher: "M. Laskri", room: "Salle L121" }
                            ]
                        ]
                    },
                    {
                        title: "11ème Année Master Génie Logiciel (GL)",
                        exams: [
                            [
                                { module: "Ingénierie des Exigences", teacher: "M. Kaci", room: "Salle M001" },
                                { module: "Calcul Haute Performance", teacher: "M. Bensaba", room: "Salle M002" },
                                { module: "Intelligence Artificielle", teacher: "M. Laskri", room: "Salle M003" },
                                { module: "Architecture d'Entreprise", teacher: "M. Touati", room: "Salle M004" }
                            ],
                            [
                                { module: "Web Avancé", teacher: "M. Kaci", room: "Salle M005" },
                                { module: "Arduino", teacher: "M. Bensaba", room: "Salle M006" },
                                { module: "Anglais", teacher: "M. Laskri", room: "Salle M007" }
                            ]
                        ]
                    },
                    {
                        title: "12ème Année Master Intelligence Artificielle (IA)",
                        exams: [
                            [
                                { module: "Analyse de Données", teacher: "M. Kaci", room: "Salle M007" },
                                { module: "Bases de Données Avancées", teacher: "M. Bensaba", room: "Salle M008" },
                                { module: "Applications Automatiques", teacher: "M. Laskri", room: "Salle M009" },
                                { module: "Représentation des Connaissances", teacher: "M. Touati", room: "Salle M010" }
                            ],
                            [
                                { module: "Recherche Heuristique", teacher: "M. Kaci", room: "Salle M011" },
                                { module: "Réseaux Avancés", teacher: "M. Bensaba", room: "Salle M012" },
                                { module: "Data Science", teacher: "M. Laskri", room: "Salle M013" },
                                { module: "Anglais", teacher: "M. Touati", room: "Salle M014" }
                            ]
                        ]
                    },
                    {
                        title: "13ème Année Master Réseaux et Systèmes Distribués (RSD)",
                        exams: [
                            [
                                { module: "Protocoles et Concepts", teacher: "M. Kaci", room: "Salle R001" },
                                { module: "Téléphonie IP", teacher: "M. Bensaba", room: "Salle R002" },
                                { module: "Algorithmique Avancée", teacher: "M. Laskri", room: "Salle R003" },
                                { module: "Modélisation", teacher: "M. Touati", room: "Salle R004" }
                            ],
                            [
                                { module: "Administration des SGBD", teacher: "M. Kaci", room: "Salle R005" },
                                { module: "Algorithmique Avancée", teacher: "M. Bensaba", room: "Salle R006" },
                                { module: "Anglais", teacher: "M. Laskri", room: "Salle R007" }
                            ]
                        ]
                    },
                    {
                        title: "14ème Année Master Systèmes d'Information et Connaissances (SIC)",
                        exams: [
                            [
                                { module: "Ingénierie des Exigences", teacher: "M. Kaci", room: "Salle S001" },
                                { module: "Bases de Données Avancées", teacher: "M. Bensaba", room: "Salle S002" },
                                { module: "Systèmes d'Information Avancés", teacher: "M. Laskri", room: "Salle S003" },
                                { module: "Algorithmique Avancée", teacher: "M. Touati", room: "Salle S004" }
                            ],
                            [
                                { module: "Intelligence Artificielle", teacher: "M. Kaci", room: "Salle S005" },
                                { module: "Réseaux et Connaissances Sémantiques", teacher: "M. Bensaba", room: "Salle S006" },
                                { module: "Anglais", teacher: "M. Laskri", room: "Salle S007" }
                            ]
                        ]
                    },
                    {
                        title: "15ème Année Master Génie Logiciel (GL)",
                        exams: [
                            [
                                { module: "Ingénierie des Systèmes", teacher: "M. Kaci", room: "Salle GL001" },
                                { module: "Cloud Computing", teacher: "M. Bensaba", room: "Salle GL002" },
                                { module: "Validation et Vérification (V&V)", teacher: "M. Laskri", room: "Salle GL003" },
                                { module: "Ingénierie des Exigences et Requêtes (IR)", teacher: "M. Touati", room: "Salle GL004" }
                            ],
                            [
                                { module: "Architecture Logicielle Avancée", teacher: "M. Kaci", room: "Salle GL005" },
                                { module: "Éthique et Déontologie", teacher: "M. Bensaba", room: "Salle GL006" }
                            ]
                        ]
                    },
                    {
                        title: "16ème Année Master Intelligence Artificielle (IA)",
                        exams: [
                            [
                                { module: "Fouille de Données", teacher: "M. Kaci", room: "Salle IA001" },
                                { module: "Cloud Computing", teacher: "M. Bensaba", room: "Salle IA002" },
                                { module: "Traitement Automatique du Langage Naturel (TALN)", teacher: "M. Laskri", room: "Salle IA003" },
                                { module: "Apprentissage Profond", teacher: "M. Touati", room: "Salle IA004" }
                            ],
                            [
                                { module: "Apprentissage par Contraintes (ACL)", teacher: "M. Kaci", room: "Salle IA005" },
                                { module: "Éthique et Déontologie", teacher: "M. Bensaba", room: "Salle IA006" }
                            ]
                        ]
                    },
                    {
                        title: "17ème Année Master Réseaux et Systèmes Distribués (RSD)",
                        exams: [
                            [
                                { module: "Pair-à-Pair (P2P)", teacher: "M. Kaci", room: "Salle RSD001" },
                                { module: "Ingénierie des Réseaux", teacher: "M. Bensaba", room: "Salle RSD002" },
                                { module: "Réseaux Mobiles", teacher: "M. Laskri", room: "Salle RSD003" },
                                { module: "Systèmes Distribués", teacher: "M. Touati", room: "Salle RSD004" }
                            ],
                            [
                                { module: "Applications Réparties", teacher: "M. Kaci", room: "Salle RSD005" },
                                { module: "Systèmes Embarqués", teacher: "M. Bensaba", room: "Salle RSD006" },
                                { module: "Éthique et Déontologie", teacher: "M. Laskri", room: "Salle RSD007" }
                            ]
                        ]
                    },
                    {
                        title: "18ème Année Master Systèmes d'Information et Connaissances (SIC)",
                        exams: [
                            [
                                { module: "Ingénierie des Systèmes", teacher: "M. Kaci", room: "Salle SIC001" },
                                { module: "Représentation des Connaissances Web", teacher: "M. Bensaba", room: "Salle SIC002" },
                                { module: "Ingénierie des Requêtes", teacher: "M. Laskri", room: "Salle SIC003" },
                                { module: "Business Intelligence", teacher: "M. Touati", room: "Salle SIC004" }
                            ],
                            [
                                { module: "Management de Projets", teacher: "M. Kaci", room: "Salle SIC005" },
                                { module: "Éthique et Déontologie", teacher: "M. Bensaba", room: "Salle SIC006" }
                            ]
                        ]
                    }
                ]
            }
        ];
    };
    
    const planningPages = generatePlanningPages();
    
    return (
        <AuthenticatedLayout>
            <Head title="Planning des Examens Financier" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Planning des Examens Financier
                                </h1>
                                <p className="mt-2 text-gray-600">
                                    Session Janvier 2026 - TOUS les 18 tableaux académiques
                                </p>
                            </div>
                        </div>
                    </div>
                    
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
                    
                    <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Validation Globale du Planning
                            </h2>
                            <div className="text-sm text-gray-500">
                                Validez le planning en une seule action
                            </div>
                        </div>
                        
                        <div className="flex justify-center space-x-4 mb-6">
                            <button
                                onClick={() => setShowConsolidatedPlanning(!showConsolidatedPlanning)}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                            >
                                <BookOpen className="h-5 w-5 mr-2" />
                                {showConsolidatedPlanning ? 'Afficher Séparé' : 'Rassembler tous les plannings'}
                            </button>
                            
                            <button
                                onClick={() => validateAllSchedules('validate')}
                                disabled={validating.all || validationStatus.all === 'validate'}
                                className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                            >
                                {validating.all ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                ) : (
                                    <Check className="h-5 w-5 mr-2" />
                                )}
                                Valider planning
                            </button>
                            
                            <button
                                onClick={() => validateAllSchedules('reject')}
                                disabled={validating.all || validationStatus.all === 'reject'}
                                className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                            >
                                {validating.all ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                ) : (
                                    <X className="h-5 w-5 mr-2" />
                                )}
                                Refuser planning
                            </button>
                            
                            <button
                                onClick={() => validateAllSchedules('pending')}
                                disabled={validating.all || validationStatus.all === 'pending'}
                                className="bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                            >
                                {validating.all ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                ) : (
                                    <Clock3 className="h-5 w-5 mr-2" />
                                )}
                                Mettre planning en attente
                            </button>
                        </div>
                        
                        <div className="text-center">
                            <div className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100">
                                {getValidationIcon('all') ? (
                                    <>
                                        {getValidationIcon('all')}
                                        <span className="ml-2 font-medium">
                                            {validationStatus.all === 'validate' ? 'Le planning est validé' : 
                                             validationStatus.all === 'reject' ? 'Le planning est refusé' : 
                                             validationStatus.all === 'pending' ? 'Le planning est en attente' : 
                                             'État du planning non défini'}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="h-5 w-5 text-gray-600" />
                                        <span className="ml-2 font-medium text-gray-600">
                                            Aucune action de validation effectuée
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Planning Display - Separate or Consolidated */}
                    {showConsolidatedPlanning ? (
                        // Consolidated Planning View
                        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6">
                                <div className="text-center">
                                    <h2 className="text-3xl font-bold mb-2">
                                        📋 Planning Consolidé - Tous les Départements
                                    </h2>
                                    <p className="text-purple-100">
                                        Vue unifiée de tous les examens validés - Session Janvier 2026
                                    </p>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-gray-700">
                                        <MapPin className="h-5 w-5 mr-2 text-purple-600" />
                                        <span className="font-medium">Salles : </span>
                                        <span className="text-purple-600 font-semibold">Amphi 1-6, N101-N104, Labo 001-003</span>
                                    </div>
                                    
                                    <div className="bg-purple-600 px-4 py-2 rounded-lg">
                                        <div className="inline-flex items-center text-white">
                                            <BookOpen className="h-4 w-4 mr-2" />
                                            {planningPages[0].tableaux.length} départements
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                                    Département
                                                </th>
                                                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                                    Créneau
                                                </th>
                                                <th className="border border-gray-300 px-4 py-3 text-center text-sm font-bold text-gray-700">
                                                    <div className="font-semibold">Dimanche 11/01/2026</div>
                                                </th>
                                                <th className="border border-gray-300 px-4 py-3 text-center text-sm font-bold text-gray-700">
                                                    <div className="font-semibold">Jeudi 15/01/2026</div>
                                                </th>
                                                <th className="border border-gray-300 px-4 py-3 text-center text-sm font-bold text-gray-700">
                                                    <div className="font-semibold">Lundi 19/01/2026</div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {planningPages[0].tableaux.map((tableau, tableIndex) => {
                                                const timeSlots = ['8h30–10h30', '10h45–12h45', '13h–15h'];
                                                return timeSlots.map((timeSlot, timeIndex) => (
                                                    <tr key={`${tableIndex}-${timeIndex}`} className={timeIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                        {timeIndex === 0 && (
                                                            <td 
                                                                rowSpan={3} 
                                                                className="border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700 align-middle bg-purple-50"
                                                            >
                                                                {tableau.title}
                                                            </td>
                                                        )}
                                                        <td className="border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700">
                                                            {timeSlot}
                                                        </td>
                                                        {['dimanche', 'jeudi', 'lundi'].map((day, dayIndex) => {
                                                            const exam = tableau.exams[timeIndex] && tableau.exams[timeIndex][dayIndex];
                                                            return (
                                                                <td key={`${dayIndex}-${timeIndex}`} className="border border-gray-300 px-3 py-3 align-top">
                                                                    {exam ? (
                                                                        <div className="space-y-1">
                                                                            <div className="font-semibold text-gray-900 text-sm">
                                                                                {exam.module}
                                                                            </div>
                                                                            <div className="text-xs text-gray-600">
                                                                                <div className="flex items-center">
                                                                                    <User className="h-3 w-3 mr-1" />
                                                                                    {exam.teacher}
                                                                                </div>
                                                                            </div>
                                                                            <div className="text-xs text-blue-600 font-medium">
                                                                                <MapPin className="h-3 w-3 mr-1 inline" />
                                                                                {exam.room}
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="h-16"></div>
                                                                    )}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ));
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            <div className="bg-gray-100 px-6 py-4 text-center">
                                <p className="text-xs text-gray-500 italic">
                                    Planning académique consolidé - Université des Sciences
                                </p>
                            </div>
                        </div>
                    ) : (
                        // Separate Planning View (Original)
                        <div className="space-y-12">
                            {planningPages[0].tableaux.map((tableau, tableIndex) => (
                            <div key={tableIndex} className="bg-white shadow-xl rounded-lg overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold mb-2">
                                            {tableau.title}
                                        </h2>
                                        <p className="text-blue-100">
                                            {planningPages[0].title}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-gray-700">
                                            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                                            <span className="font-medium">Salles : </span>
                                            <span className="text-blue-600 font-semibold">Amphi 1-6, N101-N104, Labo 001-003</span>
                                        </div>
                                        
                                        <div className="bg-blue-600 px-4 py-2 rounded-lg">
                                            <button
                                                onClick={() => setShowGroupsList(!showGroupsList)}
                                                className="inline-flex items-center text-white hover:text-blue-100 transition-colors"
                                            >
                                                <Users className="h-4 w-4 mr-2" />
                                                Voir les groupes
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border border-gray-300 px-4 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                                        Créneau
                                                    </th>
                                                    {planningPages[0].dates.map((date, index) => (
                                                        <th key={index} className="border border-gray-300 px-4 py-3 text-center text-sm font-bold text-gray-700">
                                                            <div className="font-semibold">{date}</div>
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {planningPages[0].timeSlots.map((timeSlot, timeIndex) => (
                                                    <tr key={timeSlot} className={timeIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                        <td className="border border-gray-300 px-4 py-3 text-sm font-semibold text-gray-700">
                                                            {timeSlot}
                                                        </td>
                                                        {planningPages[0].dates.map((date, dateIndex) => {
                                                            const exam = tableau.exams[timeIndex] && tableau.exams[timeIndex][dateIndex];
                                                            return (
                                                                <td key={`${dateIndex}-${timeIndex}`} className="border border-gray-300 px-3 py-3 align-top">
                                                                    {exam ? (
                                                                        <div className="space-y-1">
                                                                            <div className="font-semibold text-gray-900 text-sm">
                                                                                {exam.module}
                                                                            </div>
                                                                            <div className="text-xs text-gray-600">
                                                                                <div className="flex items-center">
                                                                                    <User className="h-3 w-3 mr-1" />
                                                                                    {exam.teacher}
                                                                                </div>
                                                                            </div>
                                                                            <div className="text-xs text-blue-600 font-medium">
                                                                                <MapPin className="h-3 w-3 mr-1 inline" />
                                                                                {exam.room}
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="h-16"></div>
                                                                    )}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-100 px-6 py-4 text-center">
                                    <p className="text-xs text-gray-500 italic">
                                        Planning académique - Université des Sciences
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    )}
                    
                    {showGroupsList && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-bold">
                                            Liste des Groupes d'Étudiants
                                        </h3>
                                        <button
                                            onClick={() => setShowGroupsList(false)}
                                            className="text-white hover:text-gray-200 transition-colors"
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="p-6 overflow-y-auto max-h-[60vh]">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {groups.map((group) => (
                                            <div key={group.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="font-semibold text-gray-900 text-lg">
                                                        Groupe {group.name}
                                                    </h4>
                                                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                                        {group.students?.length || 0} étudiants
                                                    </span>
                                                </div>
                                                
                                                {group.level && (
                                                    <div className="text-sm text-gray-600 mb-2">
                                                        <span className="font-medium">Niveau : </span>
                                                        {group.level.name}
                                                    </div>
                                                )}
                                                
                                                {group.speciality && (
                                                    <div className="text-sm text-gray-600 mb-2">
                                                        <span className="font-medium">Spécialité : </span>
                                                        {group.speciality.name}
                                                    </div>
                                                )}
                                                
                                                {group.students && group.students.length > 0 && (
                                                    <div className="space-y-2">
                                                        <div className="text-sm font-medium text-gray-700 mb-2">
                                                            Étudiants du groupe :
                                                        </div>
                                                        <div className="space-y-1">
                                                            {group.students.slice(0, 5).map((student, index) => (
                                                                <div key={student.id} className="flex items-center text-sm text-gray-600 py-1">
                                                                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                                                                        <span className="text-xs font-medium text-gray-700">
                                                                            {student.first_name?.[0]}{student.last_name?.[0]}
                                                                        </span>
                                                                    </div>
                                                                    <span>
                                                                        {student.first_name} {student.last_name}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                            {group.students.length > 5 && (
                                                                <div className="text-xs text-gray-500 italic">
                                                                    ... et {group.students.length - 5} autres étudiants
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
