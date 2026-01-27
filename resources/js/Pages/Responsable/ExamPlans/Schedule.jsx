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
    Clock3,
    PlusCircle
} from 'lucide-react';

export default function ExamPlansSchedule({ 
    examPlans = [],
    groups = [],
    modules = [],
    teachers = [],
    rooms = []
}) {
    const { flash = {} } = usePage().props;
    const [viewMode, setViewMode] = useState('planning');
    const [showGroupsList, setShowGroupsList] = useState(false);
    const [selectedPlanning, setSelectedPlanning] = useState(null);
    
    const [validationStatus, setValidationStatus] = useState({});
    const [validating, setValidating] = useState({});
    
    // Organiser les exam plans par niveau et spécialité
    const organizeExamPlansByLevel = () => {
        const organized = {};
        
        examPlans.forEach(plan => {
            const levelName = plan.group?.level?.name || 'Niveau non défini';
            const specialityName = plan.group?.speciality?.name || 'Spécialité non définée';
            const key = `${levelName} - ${specialityName}`;
            
            if (!organized[key]) {
                organized[key] = {
                    title: key,
                    exams: []
                };
            }
            
            organized[key].exams.push({
                module: plan.module?.module_name || plan.module_name || 'Module non défini',
                teacher: plan.teacher ? `${plan.teacher.first_name} ${plan.teacher.last_name}` : 
                         plan.teacher_name || 'Enseignant non assigné',
                room: plan.room ? plan.room.room_name || plan.room.name : 
                       plan.room_name || 'Salle non assignée',
                date: plan.start_date,
                time: `${plan.start_time} - ${plan.end_time}`,
                type: plan.exam_type,
                subtype: plan.exam_subtype
            });
        });
        
        return Object.values(organized);
    };
    
    const generatePlanningPages = () => {
        const organizedPlans = organizeExamPlansByLevel();
        
        return [
            {
                id: 'exam-planning',
                title: "Planning des Exam Plans - Session Actuelle",
                description: "TOUS les tableaux d'exam plans créés",
                dates: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"],
                timeSlots: ["8h30–10h30", "10h45–12h45", "13h–15h", "15h15–17h15"],
                tableaux: organizedPlans.map(plan => ({
                    title: plan.title,
                    exams: organizeExamsByTimeSlot(plan.exams)
                }))
            }
        ];
    };
    
    const organizeExamsByTimeSlot = (exams) => {
        const timeSlots = ["8h30–10h30", "10h45–12h45", "13h–15h", "15h15–17h15"];
        const dates = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
        
        const organized = [];
        
        timeSlots.forEach((timeSlot, timeIndex) => {
            const slotExams = [];
            dates.forEach((date, dateIndex) => {
                // Trouver un examen pour ce créneau ou utiliser un placeholder
                const exam = exams[timeIndex * dates.length + dateIndex] || 
                           exams[0] || // Utiliser le premier examen si disponible
                           {
                               module: "En attente",
                               teacher: "Non assigné",
                               room: "À définir"
                           };
                slotExams.push(exam);
            });
            organized.push(slotExams);
        });
        
        return organized;
    };
    
    const planningPages = generatePlanningPages();
    
    return (
        <AuthenticatedLayout header="Exam Plans Schedule - Responsible">
            <Head title="Exam Plans Schedule - Responsible" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Planning des Exam Plans
                                </h1>
                                <p className="mt-2 text-gray-600">
                                    Session Actuelle - Tous les exam plans créés
                                </p>
                            </div>
                            <Link
                                href="/responsable/exam-plans/create"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center transition-colors"
                            >
                                <PlusCircle className="h-5 w-5 mr-2" />
                                Créer un exam plan
                            </Link>
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
                                Gestion des Exam Plans
                            </h2>
                            <div className="text-sm text-gray-500">
                                {examPlans.length} exam plans créés
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <Calendar className="h-8 w-8 text-blue-600 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-blue-900">Période d'examens</p>
                                        <p className="text-xs text-blue-700">Session actuelle</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-green-900">Plans validés</p>
                                        <p className="text-xs text-green-700">
                                            {examPlans.filter(p => p.status === 'validated').length} plans
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <Clock className="h-8 w-8 text-yellow-600 mr-3" />
                                    <div>
                                        <p className="text-sm font-medium text-yellow-900">En attente</p>
                                        <p className="text-xs text-yellow-700">
                                            {examPlans.filter(p => p.status === 'pending').length} plans
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
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
                                            <span className="text-blue-600 font-semibold">
                                                {rooms.map(r => r.room_name || r.name).slice(0, 5).join(', ')}...
                                            </span>
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
                                                                            {exam.type && (
                                                                                <div className="text-xs text-purple-600">
                                                                                    <BookOpen className="h-3 w-3 mr-1 inline" />
                                                                                    {exam.type}
                                                                                    {exam.subtype && ` (${exam.subtype})`}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="text-gray-400 text-xs text-center">
                                                                            Pas d'examen
                                                                        </div>
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
                            </div>
                        ))}
                    </div>
                    
                    {/* Empty State */}
                    {examPlans.length === 0 && (
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
                            <div className="flex flex-col items-center">
                                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg font-medium">Aucun exam plan trouvé</p>
                                <p className="text-gray-400 text-sm mt-2">
                                    Créez votre premier exam plan pour voir le planning
                                </p>
                                <Link
                                    href="/responsable/exam-plans/create"
                                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center transition-colors"
                                >
                                    <PlusCircle className="h-5 w-5 mr-2" />
                                    Créer un exam plan
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
