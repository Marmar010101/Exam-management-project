import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { 
    Printer, 
    Download, 
    CalendarDays, 
    Clock, 
    Users, 
    Building,
    RefreshCw,
    MapPin,
    Send,
    PlusCircle,
    AlertCircle,
    CheckCircle,
    XCircle,
    PlayCircle,
    X
} from 'lucide-react';

export default function PlanningCalendar({ planning, group, auth, examPlans = [] }) {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        // Combine existing planning with new exam plans
        const allEvents = [];
        
        // Add existing planning events
        if (planning && planning.length > 0) {
            planning.forEach(exam => {
                const moduleName = exam.module_name || 'Module';
                const roomName = exam.room_name || 'No Room';
                const examId = exam.id;

                // Determine color based on exam type
                let backgroundColor = '#3B82F6';
                switch (exam.exam_type) {
                    case 'Continuous assessment':
                        backgroundColor = '#10B981';
                        break;
                    case 'Final exam':
                        backgroundColor = '#3B82F6';
                        break;
                    case 'Make-up exam':
                        backgroundColor = '#F59E0B';
                        break;
                    case 'Replacement exam':
                        backgroundColor = '#EF4444';
                        break;
                    case 'Practical test':
                        backgroundColor = '#8B5CF6';
                        break;
                    default:
                        backgroundColor = '#6B7280';
                }

                allEvents.push({
                    id: `exam-${examId}`,
                    title: `${moduleName} - ${roomName}`,
                    start: exam.date,
                    backgroundColor: backgroundColor,
                    borderColor: backgroundColor,
                    extendedProps: {
                        type: 'exam',
                        examId: examId,
                        examType: exam.exam_type,
                        module: moduleName,
                        room: roomName,
                        teacher: exam.teacher_name || 'No Teacher',
                        group: exam.group_name || 'No Group'
                    }
                });
            });
        }

        // Add exam plan events
        if (examPlans && examPlans.length > 0) {
            examPlans.forEach(plan => {
                const moduleName = plan.module_name || 'Module';
                const roomName = plan.room_name || 'No Room';
                const planId = plan.id;

                // Determine color based on status
                let backgroundColor = '#6B7280';
                switch (plan.status) {
                    case 'pending':
                        backgroundColor = '#F59E0B';
                        break;
                    case 'validated':
                        backgroundColor = '#10B981';
                        break;
                    case 'rejected':
                        backgroundColor = '#EF4444';
                        break;
                    case 'scheduled':
                        backgroundColor = '#3B82F6';
                        break;
                    default:
                        backgroundColor = '#6B7280';
                }

                allEvents.push({
                    id: `plan-${planId}`,
                    title: `${moduleName} (${plan.status})`,
                    start: `${plan.exam_date}T${plan.start_time}`,
                    end: `${plan.exam_date}T${plan.end_time}`,
                    backgroundColor: backgroundColor,
                    borderColor: backgroundColor,
                    extendedProps: {
                        type: 'exam_plan',
                        planId: planId,
                        status: plan.status,
                        examType: plan.exam_type,
                        module: moduleName,
                        room: roomName,
                        teacher: plan.teacher_name || 'No Teacher',
                        group: plan.group_name || 'No Group'
                    }
                });
            });
        }

        setEvents(allEvents);
    }, [planning, examPlans]);

    const handleEventClick = (clickInfo) => {
        const event = clickInfo.event;
        const extendedProps = event.extendedProps;

        if (extendedProps.type === 'exam_plan') {
            // Navigate to exam plan details
            window.location.href = `/responsable/exam-plans/${extendedProps.planId}`;
        } else {
            // Handle existing exam click
            console.log('Existing exam clicked:', extendedProps);
        }
    };

    const handleDateSelect = (selectInfo) => {
        // Open create modal when selecting a date
        setShowCreateModal(true);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
            case 'validated': return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
            case 'scheduled': return <PlayCircle className="h-4 w-4 text-blue-600" />;
            default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
        }
    };

    return (
        <AuthenticatedLayout header="Planning Calendar - Responsible">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Planning Calendar</h1>
                            <p className="text-gray-600 mt-1">Manage exam schedules and create new exam plans</p>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center transition-colors"
                            >
                                <PlusCircle className="h-5 w-5 mr-2" />
                                Create Exam Plan
                            </button>
                            <Link
                                href={route('responsable.exam-plans.index')}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center transition-colors"
                            >
                                <CalendarDays className="h-5 w-5 mr-2" />
                                View All Plans
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                                <CalendarDays className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Plans</p>
                                <p className="text-2xl font-bold text-gray-900">{examPlans.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
                                <AlertCircle className="h-8 w-8 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {examPlans.filter(p => p.status === 'pending').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Validated</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {examPlans.filter(p => p.status === 'validated').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                                <Clock className="h-8 w-8 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Scheduled</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {examPlans.filter(p => p.status === 'scheduled').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Calendar */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                    <div className="mb-4 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">Exam Calendar</h2>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => window.location.reload()}
                                className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100"
                            >
                                <RefreshCw className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay'
                        }}
                        events={events}
                        eventClick={handleEventClick}
                        selectable={true}
                        select={handleDateSelect}
                        height="auto"
                        aspectRatio={1.8}
                        eventDisplay="block"
                        displayEventTime={true}
                        eventBackgroundColor="#3B82F6"
                        eventBorderColor="#3B82F6"
                        eventTextColor="#FFFFFF"
                    />
                </div>

                {/* Create Exam Plan Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-900">Create Exam Plan</h3>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <p className="text-gray-600">
                                    Choose how you want to create your exam plan:
                                </p>
                                
                                <div className="space-y-3">
                                    <Link
                                        href={route('responsable.exam-plans.create')}
                                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium text-center transition-colors"
                                    >
                                        Create Detailed Exam Plan
                                    </Link>
                                    
                                    <button
                                        onClick={() => {
                                            alert('Quick creation feature coming soon! Use the detailed form for now.');
                                            setShowCreateModal(false);
                                        }}
                                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors"
                                    >
                                        Quick Create (Coming Soon)
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
