import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import ResponsableLayout from '../../../Layouts/ResponsableLayout';
import { 
    Calendar, 
    Clock, 
    Users, 
    BookOpen, 
    Home,
    AlertCircle,
    CheckCircle,
    XCircle,
    Loader2,
    ArrowLeft,
    Sparkles,
    UserPlus,
    Settings,
    Eye,
    Building
} from 'lucide-react';

export default function CreateExam({ modules = [], groups = [], teachers = [], rooms = [], examTypes = [], flash }) {
    const { data, setData, post, processing, errors } = useForm({
        module_id: '',
        group_id: '',
        exam_date: '',
        exam_time: '',
        duration: 90,
        exam_type: 'Final',
        room_ids: [],
        teacher_ids: [],
    });

    const [conflicts, setConflicts] = useState({
        room_conflicts: {},
        teacher_conflicts: {},
        resource_conflicts: [],
        available_rooms: [],
        available_teachers: [],
        conflict_details: [],
        summary_conflicts: []
    });
    
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [roomAssignmentMethod, setRoomAssignmentMethod] = useState('manual');
    const [teacherAssignmentMethod, setTeacherAssignmentMethod] = useState('manual');
    const [createdExamId, setCreatedExamId] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [autoAssignLoading, setAutoAssignLoading] = useState({
        rooms: false,
        teachers: false
    });

    // Show flash messages from Laravel
    useEffect(() => {
        if (flash?.success) {
            setSuccessMessage(flash.success);
        }
        if (flash?.error) {
            setSuccessMessage(flash.error);
        }
        if (flash?.warning) {
            setSuccessMessage(flash.warning);
        }
        // If exam is returned in flash data, extract its ID
        if (flash?.exam?.id) {
            setCreatedExamId(flash.exam.id);
        }
    }, [flash]);

    // Filter modules based on selected group
    const filteredModules = data.group_id && Array.isArray(modules)
        ? modules.filter(module => module.group_id == data.group_id)
        : [];

    // Get selected group details for student count
    useEffect(() => {
        if (data.group_id) {
            const group = groups.find(g => g.id == data.group_id);
            setSelectedGroup(group);
        } else {
            setSelectedGroup(null);
        }
    }, [data.group_id, groups]);

    // Check availability when time/date changes
    useEffect(() => {
        const checkAvailabilityTimer = setTimeout(() => {
            if (data.exam_date && data.exam_time && data.duration && data.group_id) {
                checkAvailability();
            }
        }, 500);

        return () => clearTimeout(checkAvailabilityTimer);
    }, [data.exam_date, data.exam_time, data.duration, data.group_id]);

    // Check availability function
    const checkAvailability = async () => {
        setCheckingAvailability(true);
        try {
            const response = await router.post(route('exams.check-availability'), {
                exam_date: data.exam_date,
                exam_time: data.exam_time,
                duration: data.duration,
                group_id: data.group_id,
                room_ids: data.room_ids,
                teacher_ids: data.teacher_ids,
            }, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page) => {
                    if (page.props.availabilityResult) {
                        const result = page.props.availabilityResult;
                        setConflicts(result);
                    }
                }
            });
        } catch (error) {
            console.error('Error checking availability:', error);
        } finally {
            setCheckingAvailability(false);
        }
    };

    // Auto-assign rooms function
    const handleAutoAssignRooms = async () => {
        if (!data.exam_date || !data.exam_time || !data.group_id) {
            alert('Please select date, time, and group first');
            return;
        }

        setAutoAssignLoading(prev => ({ ...prev, rooms: true }));
        
        try {
            const studentCount = selectedGroup?.students_count || 30;
            
            // Use the existing check-availability endpoint to get available rooms
            const availabilityResponse = await router.post(route('exams.check-availability'), {
                exam_date: data.exam_date,
                exam_time: data.exam_time,
                duration: data.duration,
                group_id: data.group_id,
                room_ids: [],
                teacher_ids: [],
            }, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page) => {
                    if (page.props.availabilityResult?.available_rooms) {
                        const availableRooms = page.props.availabilityResult.available_rooms;
                        
                        // Filter rooms that have no conflicts and have capacity
                        const suitableRooms = availableRooms.filter(room => 
                            !conflicts.room_conflicts?.[room.id] && room.capacity > 0
                        ).sort((a, b) => a.capacity - b.capacity);
                        
                        if (suitableRooms.length === 0) {
                            alert('No available rooms found for the selected time. Please try a different time or select rooms manually.');
                            setAutoAssignLoading(prev => ({ ...prev, rooms: false }));
                            return;
                        }
                        
                        // Strategy 1: Find the smallest room that can accommodate all students
                        const perfectRoom = suitableRooms.find(room => 
                            room.capacity >= studentCount && 
                            room.capacity <= studentCount * 1.2
                        );
                        
                        if (perfectRoom) {
                            setData('room_ids', [perfectRoom.id]);
                            setRoomAssignmentMethod('auto');
                            setSuccessMessage(`Auto-assigned: ${perfectRoom.room_name} (${perfectRoom.capacity} seats for ${studentCount} students)`);
                            setTimeout(() => setSuccessMessage(''), 3000);
                            setAutoAssignLoading(prev => ({ ...prev, rooms: false }));
                            return;
                        }
                        
                        // Strategy 2: Find the room with capacity closest to student count
                        const closestRoom = suitableRooms.reduce((closest, room) => {
                            if (room.capacity >= studentCount) {
                                if (!closest || room.capacity < closest.capacity) {
                                    return room;
                                }
                            }
                            return closest;
                        }, null);
                        
                        if (closestRoom) {
                            setData('room_ids', [closestRoom.id]);
                            setRoomAssignmentMethod('auto');
                            setSuccessMessage(`Auto-assigned: ${closestRoom.room_name} (${closestRoom.capacity} seats for ${studentCount} students)`);
                            setTimeout(() => setSuccessMessage(''), 3000);
                            setAutoAssignLoading(prev => ({ ...prev, rooms: false }));
                            return;
                        }
                        
                        // Strategy 3: If no single room is big enough, find combination of rooms
                        let remainingCapacity = studentCount;
                        const selectedRoomIds = [];
                        let totalSelectedCapacity = 0;
                        
                        // Start with smallest rooms first to avoid too much extra capacity
                        for (const room of suitableRooms) {
                            if (remainingCapacity <= 0) break;
                            
                            if (totalSelectedCapacity + room.capacity <= studentCount * 1.5) {
                                selectedRoomIds.push(room.id);
                                totalSelectedCapacity += room.capacity;
                                remainingCapacity -= room.capacity;
                            }
                            
                            if (remainingCapacity <= 0) break;
                        }
                        
                        if (selectedRoomIds.length > 0 && totalSelectedCapacity >= studentCount) {
                            setData('room_ids', selectedRoomIds);
                            setRoomAssignmentMethod('auto');
                            
                            const selectedRoomNames = selectedRoomIds.map(id => {
                                const room = suitableRooms.find(r => r.id === id);
                                return room ? `${room.room_name} (${room.capacity})` : '';
                            }).filter(Boolean);
                            
                            setSuccessMessage(`Auto-assigned rooms: ${selectedRoomNames.join(', ')} (Total: ${totalSelectedCapacity} seats for ${studentCount} students)`);
                            setTimeout(() => setSuccessMessage(''), 3000);
                        } else {
                            const smallestRoom = suitableRooms[0];
                            if (smallestRoom) {
                                setData('room_ids', [smallestRoom.id]);
                                setRoomAssignmentMethod('auto');
                                setSuccessMessage(`Auto-assigned ${smallestRoom.room_name} (${smallestRoom.capacity} seats). Note: Capacity is less than student count (${studentCount})`);
                                setTimeout(() => setSuccessMessage(''), 5000);
                            } else {
                                alert('No suitable rooms found for auto-assignment. Please select rooms manually.');
                            }
                        }
                    } else {
                        const sortedAllRooms = [...rooms]
                            .filter(room => room.capacity > 0)
                            .sort((a, b) => a.capacity - b.capacity);
                        
                        const suitableRoom = sortedAllRooms.find(room => room.capacity >= studentCount);
                        
                        if (suitableRoom) {
                            setData('room_ids', [suitableRoom.id]);
                            setRoomAssignmentMethod('auto');
                            setSuccessMessage(`Auto-assigned: ${suitableRoom.room_name} (${suitableRoom.capacity} seats for ${studentCount} students) - No availability check`);
                        } else {
                            const smallestRoom = sortedAllRooms[0];
                            if (smallestRoom) {
                                setData('room_ids', [smallestRoom.id]);
                                setRoomAssignmentMethod('auto');
                                setSuccessMessage(`Auto-assigned ${smallestRoom.room_name} (${smallestRoom.capacity} seats). Note: Capacity is less than student count (${studentCount}) - No availability check`);
                            }
                        }
                        setTimeout(() => setSuccessMessage(''), 3000);
                    }
                }
            });
        } catch (error) {
            console.error('Error auto-assigning rooms:', error);
            alert('Error auto-assigning rooms. Please try manual selection.');
        } finally {
            setAutoAssignLoading(prev => ({ ...prev, rooms: false }));
        }
    };

    // Auto-assign teachers function
    const handleAutoAssignTeachers = async () => {
        if (!data.exam_date || !data.exam_time) {
            alert('Please select date and time first');
            return;
        }

        setAutoAssignLoading(prev => ({ ...prev, teachers: true }));
        
        try {
            const availabilityResponse = await router.post(route('exams.check-availability'), {
                exam_date: data.exam_date,
                exam_time: data.exam_time,
                duration: data.duration,
                group_id: data.group_id,
                room_ids: data.room_ids,
                teacher_ids: [],
            }, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: (page) => {
                    if (page.props.availabilityResult?.available_teachers) {
                        const availableTeachers = page.props.availabilityResult.available_teachers;
                        
                        const suitableTeachers = availableTeachers.filter(teacher => 
                            !conflicts.teacher_conflicts?.[teacher.id]
                        );
                        
                        if (suitableTeachers.length === 0) {
                            alert('No available teachers found for the selected time. Please try a different time or select teachers manually.');
                            setAutoAssignLoading(prev => ({ ...prev, teachers: false }));
                            return;
                        }
                        
                        const teachersToSelect = Math.min(2, suitableTeachers.length);
                        const selectedIds = suitableTeachers
                            .slice(0, teachersToSelect)
                            .map(teacher => teacher.id);
                        
                        setData('teacher_ids', selectedIds);
                        setTeacherAssignmentMethod('auto');
                        
                        const selectedTeacherNames = selectedIds.map(id => {
                            const teacher = suitableTeachers.find(t => t.id === id);
                            return teacher ? `${teacher.first_name} ${teacher.last_name}` : '';
                        }).filter(Boolean);
                        
                        if (selectedTeacherNames.length > 0) {
                            setSuccessMessage(`Auto-assigned invigilators: ${selectedTeacherNames.join(', ')}`);
                            setTimeout(() => setSuccessMessage(''), 3000);
                        }
                        
                        if (selectedIds.length < 2) {
                            setTimeout(() => {
                                setSuccessMessage(`Only ${selectedIds.length} invigilator(s) available. Please select more manually if needed.`);
                            }, 3500);
                        }
                    } else {
                        const firstTwoTeachers = teachers.slice(0, 2).map(teacher => teacher.id);
                        setData('teacher_ids', firstTwoTeachers);
                        setTeacherAssignmentMethod('auto');
                        
                        const selectedTeacherNames = firstTwoTeachers.map(id => {
                            const teacher = teachers.find(t => t.id == id);
                            return teacher ? `${teacher.first_name} ${teacher.last_name}` : '';
                        }).filter(Boolean);
                        
                        setSuccessMessage(`Auto-assigned invigilators (no availability check): ${selectedTeacherNames.join(', ')}`);
                        setTimeout(() => setSuccessMessage(''), 3000);
                    }
                }
            });
        } catch (error) {
            console.error('Error auto-assigning teachers:', error);
            alert('Error auto-assigning teachers. Please try manual selection.');
        } finally {
            setAutoAssignLoading(prev => ({ ...prev, teachers: false }));
        }
    };

    // Manual assignment functions
    const handleManualRoomAssignment = () => {
        setRoomAssignmentMethod('manual');
    };

    const handleManualTeacherAssignment = () => {
        setTeacherAssignmentMethod('manual');
    };

    const toggleRoomSelection = (roomId) => {
        const room = rooms.find(r => r.id == roomId);
        const status = getRoomStatus(room);
        
        if (status.status === 'conflict' && data.room_ids.includes(roomId)) {
            setData('room_ids', data.room_ids.filter(id => id !== roomId));
        } else if (status.status !== 'conflict') {
            if (data.room_ids.includes(roomId)) {
                setData('room_ids', data.room_ids.filter(id => id !== roomId));
            } else {
                setData('room_ids', [...data.room_ids, roomId]);
            }
        }
        setRoomAssignmentMethod('manual');
    };

    const toggleTeacherSelection = (teacherId) => {
        const teacher = teachers.find(t => t.id == teacherId);
        const status = getTeacherStatus(teacher);
        
        if (status.status === 'conflict' && data.teacher_ids.includes(teacherId)) {
            setData('teacher_ids', data.teacher_ids.filter(id => id !== teacherId));
        } else if (status.status !== 'conflict') {
            if (data.teacher_ids.includes(teacherId)) {
                setData('teacher_ids', data.teacher_ids.filter(id => id !== teacherId));
            } else if (data.teacher_ids.length < 2) {
                setData('teacher_ids', [...data.teacher_ids, teacherId]);
            } else {
                alert('Maximum 2 invigilators allowed. Please remove one first.');
            }
        }
        setTeacherAssignmentMethod('manual');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (data.teacher_ids.length !== 2) {
            alert('Please select exactly 2 invigilators for the exam.');
            return;
        }
        
        if (data.room_ids.length === 0) {
            alert('Please select at least 1 room for the exam.');
            return;
        }
        
        const totalCapacity = calculateTotalCapacity();
        const studentCount = selectedGroup?.students_count || 30;
        
        if (totalCapacity < studentCount) {
            if (!confirm(`Total room capacity (${totalCapacity}) is less than student count (${studentCount}). Continue anyway?`)) {
                return;
            }
        }
        
        if (hasConflicts()) {
            if (!confirm('Conflicts detected. Are you sure you want to create the exam with conflicts?')) {
                return;
            }
        }
        
        post(route('exams.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                // Your store method returns exam in flash data, so we'll get it from flash
                // The flash exam will be picked up by the useEffect above
                setSuccessMessage('Exam created successfully!');
                // Clear form after successful creation
                setTimeout(() => {
                    setData({
                        module_id: '',
                        group_id: '',
                        exam_date: '',
                        exam_time: '',
                        duration: 90,
                        exam_type: 'Final',
                        room_ids: [],
                        teacher_ids: [],
                    });
                    setRoomAssignmentMethod('manual');
                    setTeacherAssignmentMethod('manual');
                    // Don't clear success message or createdExamId yet
                }, 3000);
            },
            onError: (errors) => {
                console.error('Error creating exam:', errors);
                alert('Error creating exam. Please check the form and try again.');
            }
        });
    };

    const hasConflicts = (conflictsData = conflicts) => {
        return Object.keys(conflictsData.room_conflicts || {}).length > 0 ||
               Object.keys(conflictsData.teacher_conflicts || {}).length > 0 ||
               (conflictsData.resource_conflicts || []).length > 0 ||
               (conflictsData.summary_conflicts || []).length > 0;
    };

    const getRoomStatus = (room) => {
        if (!room) return { status: 'unknown', message: 'Unknown' };
        
        if (conflicts.room_conflicts && conflicts.room_conflicts[room.id]) {
            return { 
                status: 'conflict', 
                message: 'Occupied',
                details: 'Room is occupied during this time'
            };
        }
        
        const studentCount = selectedGroup?.students_count || 30;
        if (room.capacity < studentCount) {
            return {
                status: 'warning',
                message: 'Small capacity',
                details: `Capacity (${room.capacity}) < Students (${studentCount})`
            };
        }
        
        return { status: 'available', message: 'Available' };
    };

    const getTeacherStatus = (teacher) => {
        if (!teacher) return { status: 'unknown', message: 'Unknown' };
        
        if (conflicts.teacher_conflicts && conflicts.teacher_conflicts[teacher.id]) {
            return { 
                status: 'conflict', 
                message: 'Busy',
                details: 'Teacher has another assignment'
            };
        }
        return { status: 'available', message: 'Available' };
    };

    const calculateTotalCapacity = () => {
        return data.room_ids.reduce((total, roomId) => {
            const room = rooms.find(r => r.id == roomId);
            return total + (room?.capacity || 0);
        }, 0);
    };

    return (
        <ResponsableLayout title="Create Exam" activeRoute="exams">
            <Head title="Create New Exam" />
            
            <div className="max-w-7xl mx-auto">
                {/* Back Button */}
                <div className="mb-4">
                    <button
                        onClick={() => router.get(route('exams.index'))}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Back to Exams
                    </button>
                </div>

                {/* Success Message with View Exam Button */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-emerald-600" />
                                <span className="text-emerald-800 font-medium">{successMessage}</span>
                            </div>
                            {createdExamId && (
                                <div className="flex items-center gap-3">
                                    <span className="text-sm text-emerald-700">
                                        Exam ID: <span className="font-mono font-medium">{createdExamId}</span>
                                    </span>
                                    <button
                                        onClick={() => router.visit(route('exams.show', createdExamId))}
                                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                                    >
                                        <Eye className="h-4 w-4" />
                                        View Exam Details
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSuccessMessage('');
                                            setCreatedExamId(null);
                                            router.visit(route('exams.create'));
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 border border-emerald-600 text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Create Another
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <BookOpen className="h-7 w-7" />
                                    Create New Exam
                                </h1>
                                <p className="text-blue-100 mt-1">
                                    Schedule an exam with conflict checking and automatic room assignment
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-blue-100">
                                <Settings className="h-4 w-4" />
                                <span>Conflict Detection: Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Basic Information Section */}
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                Exam Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Group Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Users className="inline h-4 w-4 mr-1" />
                                        Group *
                                    </label>
                                    <select
                                        value={data.group_id}
                                        onChange={e => {
                                            setData('group_id', e.target.value);
                                            setData('module_id', '');
                                        }}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Group</option>
                                        {Array.isArray(groups) && groups.map(group => (
                                            <option key={group.id} value={group.id}>
                                                {group.name} - {group.level?.name || ''} {group.speciality?.name || ''}
                                                {group.students_count && ` (${group.students_count} students)`}
                                            </option>
                                        ))}
                                    </select>
                                    {selectedGroup && (
                                        <div className="mt-2 text-sm text-gray-600">
                                            Students: <span className="font-medium">{selectedGroup.students_count || 'Unknown'}</span>
                                        </div>
                                    )}
                                    {errors.group_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.group_id}</p>
                                    )}
                                </div>

                                {/* Module Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <BookOpen className="inline h-4 w-4 mr-1" />
                                        Module *
                                    </label>
                                    <select
                                        value={data.module_id}
                                        onChange={e => setData('module_id', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                        disabled={!data.group_id}
                                    >
                                        <option value="">Select Module</option>
                                        {Array.isArray(filteredModules) && filteredModules.map(module => (
                                            <option key={module.id} value={module.id}>
                                                {module.module_name || module.name} 
                                                {module.teacher && ` (${module.teacher.first_name} ${module.teacher.last_name})`}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.module_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.module_id}</p>
                                    )}
                                </div>

                                {/* Exam Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Exam Type *
                                    </label>
                                    <select
                                        value={data.exam_type}
                                        onChange={e => setData('exam_type', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        {Array.isArray(examTypes) && examTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Date & Time */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Calendar className="inline h-4 w-4 mr-1" />
                                        Date *
                                    </label>
                                    <input
                                        type="date"
                                        value={data.exam_date}
                                        onChange={e => setData('exam_date', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    {errors.exam_date && (
                                        <p className="mt-1 text-sm text-red-600">{errors.exam_date}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Clock className="inline h-4 w-4 mr-1" />
                                        Start Time *
                                    </label>
                                    <input
                                        type="time"
                                        value={data.exam_time}
                                        onChange={e => setData('exam_time', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.exam_time && (
                                        <p className="mt-1 text-sm text-red-600">{errors.exam_time}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Duration (minutes) *
                                    </label>
                                    <input
                                        type="number"
                                        value={data.duration}
                                        onChange={e => setData('duration', e.target.value)}
                                        min="30"
                                        max="240"
                                        step="15"
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                    {errors.duration && (
                                        <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Room Selection Section */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            {/* Section Header with Assignment Controls */}
                            <div className="bg-gray-50 px-6 py-4 border-b">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                            <Home className="h-5 w-5" />
                                            Room Selection
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Current method: <span className={`font-medium px-2 py-1 rounded ${
                                                roomAssignmentMethod === 'auto' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {roomAssignmentMethod === 'auto' ? 'Auto-assigned' : 'Manual selection'}
                                            </span>
                                            {selectedGroup && (
                                                <span className="ml-4">
                                                    • Students: <span className="font-medium">{selectedGroup.students_count || 'Unknown'}</span>
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={handleAutoAssignRooms}
                                            disabled={!data.exam_date || !data.exam_time || autoAssignLoading.rooms}
                                            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                                                roomAssignmentMethod === 'auto'
                                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                            }`}
                                        >
                                            {autoAssignLoading.rooms ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Sparkles className="h-4 w-4" />
                                            )}
                                            Auto-assign Rooms
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleManualRoomAssignment}
                                            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                                                roomAssignmentMethod === 'manual'
                                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                            }`}
                                        >
                                            <Settings className="h-4 w-4" />
                                            Manual Selection
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Selected Rooms Summary */}
                            {data.room_ids.length > 0 && (
                                <div className="px-6 py-4 bg-blue-50 border-b">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Selected Rooms:</h4>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {data.room_ids.map(roomId => {
                                                    const room = rooms.find(r => r.id == roomId);
                                                    if (!room) return null;
                                                    return (
                                                        <span 
                                                            key={room.id}
                                                            className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-blue-200 rounded-full text-sm"
                                                        >
                                                            <Building className="h-3 w-3" />
                                                            {room.room_name} ({room.capacity} seats)
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleRoomSelection(room.id)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <XCircle className="h-3 w-3" />
                                                            </button>
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <span>Total capacity: {calculateTotalCapacity()} seats</span>
                                                {selectedGroup && (
                                                    <span className={
                                                        calculateTotalCapacity() >= (selectedGroup.students_count || 30)
                                                            ? 'text-green-600'
                                                            : 'text-yellow-600'
                                                    }>
                                                        {calculateTotalCapacity() >= (selectedGroup.students_count || 30)
                                                            ? '✓ Sufficient'
                                                            : '⚠️ Insufficient'
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Room Selection Grid */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Array.isArray(rooms) && rooms.map(room => {
                                        const status = getRoomStatus(room);
                                        const isSelected = data.room_ids.includes(room.id);
                                        
                                        return (
                                            <div
                                                key={room.id}
                                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                    isSelected
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                } ${
                                                    status.status === 'conflict'
                                                        ? 'border-red-300 bg-red-50 opacity-75'
                                                        : status.status === 'warning'
                                                        ? 'border-yellow-300 bg-yellow-50'
                                                        : ''
                                                }`}
                                                onClick={() => toggleRoomSelection(room.id)}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="font-semibold text-gray-900">
                                                            {room.room_name}
                                                        </div>
                                                        <div className="text-sm text-gray-600 mt-1">
                                                            Capacity: {room.capacity} students
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            Type: {room.room_type || 'Classroom'}
                                                        </div>
                                                        {selectedGroup && room.capacity < (selectedGroup.students_count || 30) && (
                                                            <div className="text-sm text-yellow-600 mt-1">
                                                                ⚠️ Insufficient for {selectedGroup.students_count} students
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                                                        status.status === 'conflict'
                                                            ? 'bg-red-100 text-red-800'
                                                            : status.status === 'warning'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {status.status === 'conflict' ? (
                                                            <XCircle className="h-3 w-3" />
                                                        ) : status.status === 'warning' ? (
                                                            <AlertCircle className="h-3 w-3" />
                                                        ) : (
                                                            <CheckCircle className="h-3 w-3" />
                                                        )}
                                                        {status.message}
                                                    </div>
                                                </div>
                                                {isSelected && (
                                                    <div className="mt-3 text-sm text-blue-600 font-medium flex items-center gap-1">
                                                        <CheckCircle className="h-4 w-4" />
                                                        Selected
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Teacher Selection Section */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            {/* Section Header with Assignment Controls */}
                            <div className="bg-gray-50 px-6 py-4 border-b">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                            <Users className="h-5 w-5" />
                                            Assign Invigilators (Required: 2)
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Current method: <span className={`font-medium px-2 py-1 rounded ${
                                                teacherAssignmentMethod === 'auto' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {teacherAssignmentMethod === 'auto' ? 'Auto-assigned' : 'Manual selection'}
                                            </span>
                                            <span className="ml-4">
                                                • Selected: <span className={`font-medium ${
                                                    data.teacher_ids.length === 2 ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {data.teacher_ids.length}/2
                                                </span>
                                            </span>
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={handleAutoAssignTeachers}
                                            disabled={!data.exam_date || !data.exam_time || autoAssignLoading.teachers}
                                            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                                                teacherAssignmentMethod === 'auto'
                                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                            }`}
                                        >
                                            {autoAssignLoading.teachers ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Sparkles className="h-4 w-4" />
                                            )}
                                            Auto-assign Teachers
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleManualTeacherAssignment}
                                            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                                                teacherAssignmentMethod === 'manual'
                                                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                            }`}
                                        >
                                            <UserPlus className="h-4 w-4" />
                                            Manual Selection
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Selected Teachers Summary */}
                            {data.teacher_ids.length > 0 && (
                                <div className="px-6 py-4 bg-blue-50 border-b">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Selected Invigilators:</h4>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {data.teacher_ids.map(teacherId => {
                                                    const teacher = teachers.find(t => t.id == teacherId);
                                                    if (!teacher) return null;
                                                    return (
                                                        <span 
                                                            key={teacher.id}
                                                            className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-blue-200 rounded-full text-sm"
                                                        >
                                                            <Users className="h-3 w-3" />
                                                            {teacher.first_name} {teacher.last_name}
                                                            {teacher.is_responsable && (
                                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                                                    Resp.
                                                                </span>
                                                            )}
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleTeacherSelection(teacher.id)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <XCircle className="h-3 w-3" />
                                                            </button>
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-700">
                                            <div className="flex items-center gap-2">
                                                <span>Selected: {data.teacher_ids.length}/2</span>
                                                {data.teacher_ids.length === 2 ? (
                                                    <span className="text-green-600">✓ Complete</span>
                                                ) : (
                                                    <span className="text-yellow-600">Need {2 - data.teacher_ids.length} more</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Teacher Selection Grid */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Array.isArray(teachers) && teachers.map(teacher => {
                                        const status = getTeacherStatus(teacher);
                                        const isSelected = data.teacher_ids.includes(teacher.id);
                                        
                                        return (
                                            <div
                                                key={teacher.id}
                                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                                                    isSelected
                                                        ? 'border-blue-500 bg-blue-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                } ${
                                                    status.status === 'conflict'
                                                        ? 'border-red-300 bg-red-50 opacity-75'
                                                        : ''
                                                }`}
                                                onClick={() => toggleTeacherSelection(teacher.id)}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <div className="font-semibold text-gray-900">
                                                            {teacher.first_name} {teacher.last_name}
                                                        </div>
                                                        <div className="text-sm text-gray-600 mt-1">
                                                            Grade: {teacher.grade || 'N/A'}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            Email: {teacher.email || teacher.user?.email || 'N/A'}
                                                        </div>
                                                    </div>
                                                    <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                                                        status.status === 'conflict'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {status.status === 'conflict' ? (
                                                            <XCircle className="h-3 w-3" />
                                                        ) : (
                                                            <CheckCircle className="h-3 w-3" />
                                                        )}
                                                        {status.message}
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2 mt-2">
                                                    {teacher.is_responsable && (
                                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                            Responsable
                                                        </span>
                                                    )}
                                                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                                                        Teacher
                                                    </span>
                                                    {isSelected && (
                                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                            Selected
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Conflict Alerts */}
                        {hasConflicts() && (
                            <div className="border-t pt-8">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                    <div className="flex items-center gap-3 text-red-800 mb-4">
                                        <AlertCircle className="h-6 w-6" />
                                        <h3 className="text-lg font-semibold">Conflict Warnings Detected!</h3>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {Object.keys(conflicts.room_conflicts || {}).length > 0 && (
                                            <div>
                                                <h4 className="font-medium text-red-700">Room Conflicts:</h4>
                                                <ul className="list-disc pl-5 text-red-600">
                                                    {Object.entries(conflicts.room_conflicts || {}).map(([roomId, roomConflict]) => {
                                                        const room = rooms.find(r => r.id == roomId);
                                                        return (
                                                            <li key={roomId}>
                                                                {room?.room_name} is already occupied during this time
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        )}
                                        
                                        {Object.keys(conflicts.teacher_conflicts || {}).length > 0 && (
                                            <div>
                                                <h4 className="font-medium text-red-700">Teacher Conflicts:</h4>
                                                <ul className="list-disc pl-5 text-red-600">
                                                    {Object.entries(conflicts.teacher_conflicts || {}).map(([teacherId, teacherConflict]) => {
                                                        const teacher = teachers.find(t => t.id == teacherId);
                                                        return (
                                                            <li key={teacherId}>
                                                                {teacher?.first_name} {teacher?.last_name} has another assignment at this time
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        )}
                                        
                                        {(conflicts.resource_conflicts || []).length > 0 && (
                                            <div>
                                                <h4 className="font-medium text-red-700">Resource Conflicts:</h4>
                                                <ul className="list-disc pl-5 text-red-600">
                                                    {conflicts.resource_conflicts.map((conflict, index) => (
                                                        <li key={index}>{conflict.message || conflict}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                                        <p className="text-yellow-800 text-sm">
                                            <strong>Note:</strong> You can still create the exam with conflicts, 
                                            but it may cause scheduling issues. Consider changing the time, 
                                            room, or teachers to resolve conflicts.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center border-t pt-8">
                            <div className="text-sm text-gray-500">
                                {checkingAvailability && (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Checking availability...
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => router.get(route('exams.index'))}
                                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing || checkingAvailability || data.teacher_ids.length !== 2 || data.room_ids.length === 0}
                                    className={`px-6 py-3 rounded-lg text-white font-medium transition flex items-center gap-2 ${
                                        hasConflicts()
                                            ? 'bg-yellow-600 hover:bg-yellow-700'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                    } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : hasConflicts() ? (
                                        'Create with Conflicts'
                                    ) : (
                                        'Create Exam'
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </ResponsableLayout>
    );
}