import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Calendar,
    Clock,
    Users,
    Download,
    Mail,
    Filter,
    AlertCircle,
    CheckCircle,
    Eye,
    Printer,
    Bell,
    Sparkles,
    Settings,
    XCircle,
    Loader2,
    Home,
    ArrowLeft,
    ExternalLink,
    Save,
    Edit2,
    X
} from 'lucide-react';

export default function InvigilationIndex({ 
    exams = [], 
    teachers = [], 
    schedules = [],
    filters = {},
    flash = {},
    auth
}) {
    const { props } = usePage();
    const [selectedDate, setSelectedDate] = useState(filters.date || '');
    const [selectedRoom, setSelectedRoom] = useState(filters.room_id || '');
    const [selectedTeacher, setSelectedTeacher] = useState(filters.teacher_id || '');
    const [autoAssignLoading, setAutoAssignLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [editingExam, setEditingExam] = useState(null);
    const [editingTeacher, setEditingTeacher] = useState(null);

    // Show flash messages
    useEffect(() => {
        if (flash.success) {
            setSuccessMessage(flash.success);
            setTimeout(() => setSuccessMessage(''), 5000);
        }
        if (flash.error) {
            setErrorMessage(flash.error);
            setTimeout(() => setErrorMessage(''), 5000);
        }
        if (flash.warning) {
            setErrorMessage(flash.warning);
            setTimeout(() => setErrorMessage(''), 5000);
        }
    }, [flash]);

    // Get unique rooms from exams
    const rooms = [...new Set(exams.flatMap(exam => 
        exam.rooms?.map(room => ({ id: room.id, name: room.room_name })) || []
    ))];

    // Filter exams based on selections
    const filteredExams = exams.filter(exam => {
        if (selectedDate && exam.exam_date !== selectedDate) return false;
        if (selectedRoom && !exam.rooms?.some(room => room.id == selectedRoom)) return false;
        if (selectedTeacher) {
            const examSchedules = schedules.filter(s => s.exam_id === exam.id);
            return examSchedules.some(s => s.teacher_id == selectedTeacher);
        }
        return true;
    });

    // Get teacher schedule
    const getTeacherSchedule = (teacherId) => {
        return schedules.filter(schedule => schedule.teacher_id == teacherId);
    };

    // Get invigilators for a specific exam
    const getExamInvigilators = (examId) => {
        const exam = exams.find(e => e.id == examId);
        
        console.log('Exam:', exam); // Debug
        console.log('Exam invigilators:', exam?.invigilators); // Debug
        
        // Try invigilators first, then invigilation_schedules
        const invigilatorList = exam?.invigilators || exam?.invigilation_schedules || [];
        
        console.log('Invigilator list:', invigilatorList); // Debug
        
        if (!invigilatorList || invigilatorList.length === 0) {
            return [];
        }
        
        // If it's invigilators (direct teacher objects)
        if (invigilatorList[0]?.first_name) {
            return invigilatorList.map((teacher, index) => ({
                id: index, // Temporary ID since these might not have schedule IDs
                exam_id: examId,
                teacher_id: teacher.id,
                role: 'assistant', // Default role
                teacher_name: `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim(),
                teacher_email: teacher.user?.email || teacher.email || 'No email',
                teacher_grade: teacher.grade || 'N/A',
                is_responsable: teacher.is_responsable || false
            }));
        }
        
        // If it's invigilation schedules
        return invigilatorList.map(schedule => ({
            id: schedule.id,
            exam_id: schedule.exam_id,
            teacher_id: schedule.teacher_id,
            role: schedule.role || 'assistant',
            notes: schedule.notes,
            notified: schedule.notified || false,
            teacher_name: schedule.teacher ? 
                `${schedule.teacher.first_name || ''} ${schedule.teacher.last_name || ''}`.trim() : 
                'Unknown Teacher',
            teacher_email: schedule.teacher?.user?.email || schedule.teacher?.email || 'No email',
            teacher_grade: schedule.teacher?.grade || 'N/A',
            is_responsable: schedule.teacher?.is_responsable || false
        }));
    };

    const handleAutoAssign = async () => {
        setAutoAssignLoading(true);
        try {
            const examIds = filteredExams.map(e => e.id);
            
            await router.post('/invigilation/auto-assign', {
                exam_ids: examIds
            }, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page) => {
                    if (page.props.results) {
                        const results = page.props.results;
                        setSuccessMessage(`Auto-assignment completed: ${results.assigned} assigned, ${results.skipped} skipped`);
                    }
                },
                onError: (errors) => {
                    console.error('Auto-assign error:', errors);
                    setErrorMessage('Error during auto-assignment');
                }
            });
        } catch (error) {
            console.error('Auto-assign error:', error);
            setErrorMessage('Error during auto-assignment');
        } finally {
            setAutoAssignLoading(false);
        }
    };

    const handleManualAssign = (examId, teacherId, role = 'assistant') => {
        router.post('/invigilation/manual-assign', {
            exam_id: examId,
            teacher_id: teacherId,
            role: role
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setSuccessMessage('Teacher assigned successfully');
                setEditingExam(null);
                setEditingTeacher(null);
            },
            onError: (errors) => {
                setErrorMessage('Error assigning teacher: ' + (errors.message || 'Please try again'));
            }
        });
    };

    const handleRemoveAssignment = (scheduleId) => {
        if (confirm('Are you sure you want to remove this assignment?')) {
            router.delete(`/invigilation/${scheduleId}`, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setSuccessMessage('Assignment removed successfully');
                }
            });
        }
    };

    const handleNotifyTeacher = (teacherId) => {
        router.post('/invigilation/notify', { teacher_id: teacherId }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setSuccessMessage('Notification sent to teacher');
            },
            onError: (errors) => {
                setErrorMessage('Error sending notification');
            }
        });
    };

    const handleNotifyAll = (examId) => {
        const examInvigilators = getExamInvigilators(examId);
        examInvigilators.forEach(invigilator => {
            handleNotifyTeacher(invigilator.teacher_id);
        });
    };

    const handleDownloadSchedule = (type = 'all') => {
        const params = new URLSearchParams();
        if (selectedDate) params.append('date', selectedDate);
        if (selectedRoom) params.append('room_id', selectedRoom);
        if (selectedTeacher) params.append('teacher_id', selectedTeacher);
        
        window.open(`/invigilation/download/${type}?${params.toString()}`, '_blank');
    };

    const handleSendEmails = () => {
        const teacherIds = teachers.map(t => t.id);
        if (teacherIds.length === 0) {
            setErrorMessage('No teachers available');
            return;
        }

        router.post('/invigilation/send-emails', {
            teacher_ids: teacherIds
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setSuccessMessage('Emails sent to all teachers');
            },
            onError: (errors) => {
                setErrorMessage('Error sending emails');
            }
        });
    };

    // Start editing invigilator
    const startEditInvigilator = (examId, teacherId = null) => {
        setEditingExam(examId);
        setEditingTeacher(teacherId);
    };

    // Save edited invigilator
    const saveInvigilator = (examId, teacherId, role = 'assistant') => {
        handleManualAssign(examId, teacherId, role);
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingExam(null);
        setEditingTeacher(null);
    };

    return (
        <AuthenticatedLayout 
            user={auth.user}
            title="Invigilation Assignment" 
            activeRoute="invigilation"
        >
            <Head title="Invigilation Management" />
            
            <div className="max-w-7xl mx-auto p-4">
                {/* Messages */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-emerald-600" />
                            <span className="text-emerald-800 font-medium">{successMessage}</span>
                        </div>
                    </div>
                )}

                {errorMessage && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <span className="text-red-800 font-medium">{errorMessage}</span>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <button
                                        onClick={() => router.get('/exams')}
                                        className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Back to Exams
                                    </button>
                                </div>
                                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <Users className="h-7 w-7" />
                                    Invigilator Assignment
                                </h1>
                                <p className="text-purple-100 mt-1">
                                    Manage invigilators and notify teachers
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleAutoAssign}
                                    disabled={autoAssignLoading || filteredExams.length === 0}
                                    className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {autoAssignLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Sparkles className="h-4 w-4" />
                                    )}
                                    Auto-assign All
                                </button>
                                <button
                                    onClick={handleSendEmails}
                                    className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 flex items-center gap-2 transition-colors"
                                >
                                    <Mail className="h-4 w-4" />
                                    Notify All Teachers
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <Filter className="h-5 w-5 text-gray-500" />
                        <h2 className="text-lg font-semibold">Filters</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Date
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Room
                            </label>
                            <select
                                value={selectedRoom}
                                onChange={(e) => setSelectedRoom(e.target.value)}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            >
                                <option value="">All Rooms</option>
                                {rooms.map(room => (
                                    <option key={room.id} value={room.id}>{room.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Teacher
                            </label>
                            <select
                                value={selectedTeacher}
                                onChange={(e) => setSelectedTeacher(e.target.value)}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            >
                                <option value="">All Teachers</option>
                                {teachers.map(teacher => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.first_name} {teacher.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Exams with Invigilator Assignment */}
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Eye className="h-5 w-5" />
                                Exam Invigilation Schedule
                            </h2>
                            <p className="text-sm text-gray-500">
                                Showing {filteredExams.length} exam(s)
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleDownloadSchedule('pdf')}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Export PDF
                            </button>
                        </div>
                    </div>
                    
                    {filteredExams.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                            <p className="text-lg font-medium mb-2">No exams found</p>
                            <p className="text-gray-600 mb-4">Try adjusting your filters or create some exams first.</p>
                            <button
                                onClick={() => router.get('/exams/create')}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:opacity-90 flex items-center gap-2 mx-auto"
                            >
                                <Settings className="h-4 w-4" />
                                Create New Exam
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredExams.map(exam => {
                                const examInvigilators = getExamInvigilators(exam.id);
                                
                                return (
                                    <div key={exam.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                        {/* Exam Header */}
                                        <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg mb-2">
                                                        {exam.module?.module_name || 'Unknown Module'}
                                                    </h3>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>{new Date(exam.exam_date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4" />
                                                            <span>{exam.exam_time} • {exam.duration} mins</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4" />
                                                            <span>Group: {exam.group?.name || 'Unknown'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Home className="h-4 w-4" />
                                                            <span>Rooms: {exam.rooms?.map(r => r.room_name).join(', ') || 'None'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 ml-4">
                                                    <button
                                                        onClick={() => window.open(`/invigilation/exam/${exam.id}/print`, '_blank')}
                                                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1 transition-colors"
                                                        title="Print schedule"
                                                    >
                                                        <Printer className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => window.open(`/exams/${exam.id}`, '_blank')}
                                                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1 transition-colors"
                                                        title="View exam details"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Invigilator Assignment Section */}
                                        <div className="p-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <div>
                                                    <h4 className="font-medium">Assigned Invigilators</h4>
                                                    <p className="text-sm text-gray-500">
                                                        {examInvigilators.length} assigned (Required: 2)
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    {editingExam === exam.id ? (
                                                        <div className="flex gap-2">
                                                            <select
                                                                value={editingTeacher || ''}
                                                                onChange={(e) => setEditingTeacher(e.target.value)}
                                                                className="text-sm border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500"
                                                            >
                                                                <option value="">Select Teacher...</option>
                                                                {teachers.map(teacher => (
                                                                    <option key={teacher.id} value={teacher.id}>
                                                                        {teacher.first_name} {teacher.last_name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <select
                                                                className="text-sm border-gray-300 rounded-lg focus:border-purple-500 focus:ring-purple-500"
                                                                defaultValue="assistant"
                                                            >
                                                                <option value="main">Main</option>
                                                                <option value="assistant">Assistant</option>
                                                                <option value="backup">Backup</option>
                                                            </select>
                                                            <button
                                                                onClick={() => saveInvigilator(exam.id, editingTeacher)}
                                                                disabled={!editingTeacher}
                                                                className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                                                            >
                                                                <Save className="h-4 w-4" />
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={cancelEdit}
                                                                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-1"
                                                            >
                                                                <X className="h-4 w-4" />
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => startEditInvigilator(exam.id)}
                                                                className="px-3 py-2 text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:opacity-90 flex items-center gap-1"
                                                            >
                                                                <Edit2 className="h-4 w-4" />
                                                                Add/Edit Invigilator
                                                            </button>
                                                            <button
                                                                onClick={() => handleNotifyAll(exam.id)}
                                                                disabled={examInvigilators.length === 0}
                                                                className="px-3 py-2 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-1"
                                                            >
                                                                <Bell className="h-4 w-4" />
                                                                Notify All
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {examInvigilators.length === 0 ? (
                                                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                                                    <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                                                    <p className="font-medium mb-2">No invigilators assigned</p>
                                                    <p className="text-gray-600 mb-4">Click "Add/Edit Invigilator" to assign teachers</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {examInvigilators.map((invigilator, index) => (
                                                        <div 
                                                            key={invigilator.id}
                                                            className="border border-green-200 bg-green-50 rounded-lg p-4 hover:bg-green-100 transition-colors"
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <div className="font-medium">
                                                                            {invigilator.teacher_name}
                                                                        </div>
                                                                        <span className={`px-2 py-1 text-xs rounded ${
                                                                            invigilator.role === 'main' ? 'bg-blue-100 text-blue-800' :
                                                                            invigilator.role === 'assistant' ? 'bg-green-100 text-green-800' :
                                                                            'bg-gray-100 text-gray-800'
                                                                        }`}>
                                                                            {invigilator.role || 'assistant'}
                                                                        </span>
                                                                    </div>
                                                                    
                                                                    <div className="text-sm text-gray-600 space-y-1">
                                                                        <div>Grade: {invigilator.teacher_grade || 'N/A'}</div>
                                                                        <div>Email: {invigilator.teacher_email || 'No email'}</div>
                                                                        
                                                                        {invigilator.is_responsable && (
                                                                            <span className="inline-block text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                                                Module Responsable
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    
                                                                    {invigilator.notes && (
                                                                        <div className="mt-2 text-sm text-gray-500">
                                                                            <span className="font-medium">Notes:</span> {invigilator.notes}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex flex-col gap-2 ml-4">
                                                                    <button
                                                                        onClick={() => handleRemoveAssignment(invigilator.id)}
                                                                        className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                                                                        title="Remove assignment"
                                                                    >
                                                                        <XCircle className="h-4 w-4" />
                                                                    </button>
                                                                    {!invigilator.notified && (
                                                                        <button
                                                                            onClick={() => handleNotifyTeacher(invigilator.teacher_id)}
                                                                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                                                                            title="Send notification"
                                                                        >
                                                                            <Mail className="h-4 w-4" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}