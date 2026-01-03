// resources/js/Pages/Responsable/PlanningCalendar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import ResponsableLayout from '@/Layouts/ResponsableLayout';
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
    Send 
} from 'lucide-react';

export default function PlanningCalendar({ planning, group }) {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (planning && planning.length > 0) {
            console.log('Planning data sample:', planning[0]); // Debug
            
            const calendarEvents = planning.map(exam => {
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
                }

                return {
                    id: examId,
                    title: moduleName,
                    start: exam.exam_date,
                    end: exam.exam_date,
                    allDay: false,
                    backgroundColor: backgroundColor,
                    borderColor: backgroundColor,
                    textColor: '#FFFFFF',
                    extendedProps: {
                        room: roomName,
                        examId: examId,
                    }
                };
            });

            setEvents(calendarEvents);
        } else {
            setEvents([]);
        }
    }, [planning]);

    const handleRefresh = () => {
        setIsLoading(true);
        window.location.reload();
    };

    const handlePrint = () => {
        window.print();
    };

    const handleExport = () => {
    const url = route('calendars.export.group.pdf', { group: group.id });

    window.open(url, '_blank');
};


    // Get date range for display
    const getDateRange = () => {
        if (planning.length === 0) return '';
        
        const dates = planning.map(e => new Date(e.exam_date));
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));
        
        return `${minDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - ${maxDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    };

    // Custom event content renderer - SIMPLIFIED: ONLY MODULE AND ROOM
    const renderEventContent = (eventInfo) => {
        const event = eventInfo.event;
        const extendedProps = event.extendedProps;
        
        return (
            <div className="h-full p-1">
                <Link 
                    href={route('exams.show', extendedProps.examId)}
                    className="block h-full hover:opacity-90 transition-opacity"
                >
                    <div className="flex flex-col h-full justify-between">
                        {/* ONLY Module Name (Bold, Top) */}
                        <div className="font-bold text-xs mb-1 truncate leading-tight">
                            {event.title}
                        </div>
                        
                        {/* ONLY Room Name (Below with icon) - NO TIME, NO DATE, NO TYPE */}
                        <div className="text-[10px] opacity-90 truncate flex items-center gap-0.5">
                            <MapPin className="h-2.5 w-2.5 flex-shrink-0" />
                            <span>{extendedProps.room}</span>
                        </div>
                        
                        {/* REMOVED: Time and Type display completely */}
                    </div>
                </Link>
            </div>
        );
    };

    // Event click handler
    const handleEventClick = (clickInfo) => {
        clickInfo.jsEvent.preventDefault();
        if (clickInfo.event.extendedProps.examId) {
            window.location.href = route('exams.show', clickInfo.event.extendedProps.examId);
        }
    };

    return (
        <ResponsableLayout title="Exam Calendar" activeRoute="dashboard">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Exam Calendar: {group.name}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {planning.length} exams scheduled • {getDateRange()}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleRefresh}
                                disabled={isLoading}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                            >
                                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                            <button
                                onClick={handleExport}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Export
                            </button>

                             
                            <button
                                onClick={handlePrint}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                            >
                                <Printer className="h-4 w-4" />
                                Print
                            </button>
                            <Link
                                href={route('session.planning.create', { group: group.id })}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                            >
                                <CalendarDays className="h-4 w-4" />
                                Plan New Session
                            </Link>
                            
                        </div>
                    </div>
                </div>

                {/* Calendar - Full Width */}
                <div className="bg-white rounded-xl shadow border border-gray-200 p-4">
                    {planning.length === 0 ? (
                        <div className="text-center py-12">
                            <CalendarDays className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No exams scheduled yet
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Create a session planning to schedule exams for this group.
                            </p>
                            <Link
                                href={route('session.planning.create', { group: group.id })}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <CalendarDays className="h-4 w-4 mr-2" />
                                Plan New Session
                            </Link>
                        </div>
                    ) : (
                        <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay'
                            }}
                            events={events}
                            height="700px"
                            eventDisplay="block"
                            // Customize month view display
                            dayMaxEvents={4}
                            dayMaxEventRows={4}
                            moreLinkClick="popover"
                            moreLinkContent={args => {
                                return `+${args.num} more`;
                            }}
                            // Custom event rendering
                            eventContent={renderEventContent}
                            // Event click handler
                            eventClick={handleEventClick}
                            // Remove time display completely
                            eventTimeFormat={false}
                        />
                    )}
                </div>

                {/* Legend */}
                {planning.length > 0 && (
                    <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
                        <h3 className="font-medium text-gray-900 mb-3">Exam Type Legend</h3>
                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-blue-500"></div>
                                <span className="text-sm text-gray-600">Final Exam</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-green-500"></div>
                                <span className="text-sm text-gray-600">Continuous Assessment</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-amber-500"></div>
                                <span className="text-sm text-gray-600">Make-up Exam</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-red-500"></div>
                                <span className="text-sm text-gray-600">Replacement Exam</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-purple-500"></div>
                                <span className="text-sm text-gray-600">Practical Test</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Custom CSS for FullCalendar */}
            <style jsx global>{`
                /* Make events fill the entire day cell */
                .fc-daygrid-event {
                    margin: 1px 0 !important;
                    height: auto !important;
                    min-height: 38px !important;
                    border-radius: 4px !important;
                    border: none !important;
                }
                
                .fc-daygrid-block-event {
                    position: relative !important;
                    padding: 2px !important;
                }
                
                .fc-event-main {
                    padding: 0 !important;
                    height: 100% !important;
                }
                
                .fc-event-title-container {
                    height: 100% !important;
                }
                
                /* Remove all date/time from event */
                .fc-event-time {
                    display: none !important;
                }
                
                /* Date number styling */
                .fc-daygrid-day-number {
                    font-weight: 600 !important;
                    color: #374151 !important;
                    padding: 4px !important;
                    font-size: 14px !important;
                }
                
                /* Today's date */
                .fc-day-today {
                    background-color: #eff6ff !important;
                }
                
                .fc-day-today .fc-daygrid-day-number {
                    background-color: #3b82f6 !important;
                    color: white !important;
                    border-radius: 9999px !important;
                    width: 24px !important;
                    height: 24px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                
                /* Hover effect for events */
                .fc-daygrid-event:hover {
                    opacity: 0.9 !important;
                    transform: translateY(-1px) !important;
                    transition: all 0.2s ease !important;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
                }
                
                /* Make more link smaller */
                .fc-daygrid-more-link {
                    font-size: 11px !important;
                    color: #6b7280 !important;
                    padding: 2px 4px !important;
                    background-color: #f3f4f6 !important;
                    border-radius: 4px !important;
                    margin-top: 2px !important;
                }
            `}</style>
        </ResponsableLayout>
    );
}