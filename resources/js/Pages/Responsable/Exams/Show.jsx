import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import ResponsableLayout from '../../../Layouts/ResponsableLayout';
import {
    Calendar,
    Clock,
    Users,
    MapPin,
    BookOpen,
    GraduationCap,
    Edit,
    Trash2,
    Save,
    X,
    AlertCircle,
    CheckCircle,
    Building,
    User,
    Printer,
    Mail,
    Download,
    ChevronLeft,
    Eye
} from 'lucide-react';

export default function Show({ exam, modules, groups, teachers, rooms, examTypes }) {
    const [isEditing, setIsEditing] = useState(false);
    
    // Use invigilators instead of teachers for initial data
    const teacherIds = exam.invigilators ? exam.invigilators.map(inv => inv.id) : [];
    
    const { data, setData, put, processing, errors } = useForm({
        module_id: exam.module_id,
        group_id: exam.group_id,
        exam_date: exam.exam_date,
        exam_time: exam.exam_time,
        duration: exam.duration,
        exam_type: exam.exam_type,
        room_ids: exam.rooms.map(room => room.id),
        teacher_ids: teacherIds // Use invigilators data
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('exams.update', exam.id), {
            onSuccess: () => setIsEditing(false)
        });
    };

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete the exam for "${exam.module?.module_name}"? This action cannot be undone.`)) {
            router.delete(route('exams.destroy', exam.id));
        }
    };

    const getExamStatus = () => {
        const today = new Date().toISOString().split('T')[0];
        const examDate = exam.exam_date;
        
        if (examDate === today) return 'today';
        if (examDate > today) return 'upcoming';
        return 'past';
    };

    const statusConfig = {
        today: { label: 'Today', color: 'bg-green-100 text-green-800' },
        upcoming: { label: 'Upcoming', color: 'bg-blue-100 text-blue-800' },
        past: { label: 'Completed', color: 'bg-gray-100 text-gray-800' }
    };

    const status = getExamStatus();

    return (
        <ResponsableLayout title={`Exam: ${exam.module?.module_name || 'Untitled'}`} activeRoute="exams">
            <Head title={`Exam: ${exam.module?.module_name || 'Untitled'}`} />
            
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link
                                href={route('exams.index')}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                            >
                                <ChevronLeft className="h-5 w-5" />
                                Back to Exams
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {exam.module?.module_name || 'Untitled Exam'}
                            </h1>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig[status].color}`}>
                                {statusConfig[status].label}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                exam.exam_type === 'Continuous assessment' ? 'bg-blue-100 text-blue-800' :
                                exam.exam_type === 'Final exam' ? 'bg-red-100 text-red-800' :
                                exam.exam_type === 'Make-up exam' ? 'bg-yellow-100 text-yellow-800' :
                                exam.exam_type === 'Replacement exam' ? 'bg-purple-100 text-purple-800' :
                                exam.exam_type === 'Practical test' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {exam.exam_type}
                            </span>
                        </div>
                        <p className="text-gray-600 mt-2">
                            {exam.module?.description || 'Exam details and management'}
                        </p>
                    </div>
                    
                    <div className="flex gap-3">
                        <button
                            onClick={() => window.print()}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <Printer className="h-4 w-4" />
                            Print
                        </button>
                        <button
                            onClick={() => router.visit(`/invigilation/exam/${exam.id}/print`)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <Download className="h-4 w-4" />
                            PDF
                        </button>
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <Edit className="h-4 w-4" />
                                Edit Exam
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <X className="h-4 w-4" />
                                Cancel
                            </button>
                        )}
                    </div>
                </div>

                {/* Error Display */}
                {errors && Object.keys(errors).length > 0 && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-5 w-5 text-red-500" />
                            <h3 className="font-medium text-red-800">Please fix the following errors:</h3>
                        </div>
                        <ul className="list-disc pl-5 text-red-700">
                            {Object.entries(errors).map(([field, message]) => (
                                <li key={field}>{message}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Main Content */}
                {isEditing ? (
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg border overflow-hidden">
                        {/* Form Header */}
                        <div className="bg-gray-50 px-6 py-4 border-b">
                            <h2 className="text-lg font-semibold">Edit Exam Details</h2>
                            <p className="text-sm text-gray-600">Update exam information and settings</p>
                        </div>
                        
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Module Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Module
                                    </label>
                                    <select
                                        value={data.module_id}
                                        onChange={(e) => setData('module_id', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Module</option>
                                        {modules.map(module => (
                                            <option key={module.id} value={module.id}>
                                                {module.module_name} ({module.group?.name})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Group Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Group
                                    </label>
                                    <select
                                        value={data.group_id}
                                        onChange={(e) => setData('group_id', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Select Group</option>
                                        {groups.map(group => (
                                            <option key={group.id} value={group.id}>
                                                {group.name} - {group.level?.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Date & Time */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={data.exam_date}
                                        onChange={(e) => setData('exam_date', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Time
                                    </label>
                                    <input
                                        type="time"
                                        value={data.exam_time}
                                        onChange={(e) => setData('exam_time', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                                {/* Duration & Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Duration (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        value={data.duration}
                                        onChange={(e) => setData('duration', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                        min="30"
                                        max="240"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Exam Type
                                    </label>
                                    <select
                                        value={data.exam_type}
                                        onChange={(e) => setData('exam_type', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        {examTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Rooms Section */}
                            <div className="mt-8 border-t pt-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Rooms
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {rooms.map(room => (
                                        <label key={room.id} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="checkbox"
                                                checked={data.room_ids.includes(room.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setData('room_ids', [...data.room_ids, room.id]);
                                                    } else {
                                                        setData('room_ids', data.room_ids.filter(id => id !== room.id));
                                                    }
                                                }}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <div className="ml-3">
                                                <div className="font-medium">{room.room_name}</div>
                                                <div className="text-sm text-gray-600">
                                                    Capacity: {room.capacity} • Type: {room.room_type}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Teachers Section */}
                            <div className="mt-8 border-t pt-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Invigilators
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {teachers.map(teacher => (
                                        <label key={teacher.id} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                                            <input
                                                type="checkbox"
                                                checked={data.teacher_ids.includes(teacher.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setData('teacher_ids', [...data.teacher_ids, teacher.id]);
                                                    } else {
                                                        setData('teacher_ids', data.teacher_ids.filter(id => id !== teacher.id));
                                                    }
                                                }}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <div className="ml-3">
                                                <div className="font-medium">
                                                    {teacher.first_name} {teacher.last_name}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    {teacher.grade} • {teacher.is_responsable ? 'Responsable' : 'Teacher'}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="mt-8 pt-8 border-t flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    /* View Mode */
                    <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
                        {/* Info Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-5 w-5" />
                                            <span className="text-lg font-medium">
                                                {new Date(exam.exam_date).toLocaleDateString('en-US', { 
                                                    weekday: 'long', 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-5 w-5" />
                                            <span className="text-lg font-medium">
                                                {exam.exam_time} • Duration: {exam.duration} minutes
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 mt-4">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-5 w-5" />
                                            <span>Group: {exam.group?.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <BookOpen className="h-5 w-5" />
                                            <span>Module: {exam.module?.module_name}</span>
                                        </div>
                                    </div>
                                </div>
                                {/* REMOVED Exam ID section - that's what you wanted */}
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column */}
                                <div>
                                    {/* Module Details */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <BookOpen className="h-5 w-5" />
                                            Module Information
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="text-gray-600">Module Name</span>
                                                <span className="font-medium">{exam.module?.module_name}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="text-gray-600">Responsible Teacher</span>
                                                <span className="font-medium">{exam.module?.teacher?.name || 'Not assigned'}</span>
                                            </div>
                                            {/* REMOVED Credits row - that's what you wanted */}
                                        </div>
                                    </div>

                                    {/* Group Details */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <Users className="h-5 w-5" />
                                            Group Information
                                        </h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="text-gray-600">Group Name</span>
                                                <span className="font-medium">{exam.group?.name}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="text-gray-600">Level</span>
                                                <span className="font-medium">{exam.group?.level?.name}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="text-gray-600">Speciality</span>
                                                <span className="font-medium">{exam.group?.speciality?.name || 'Common'}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="text-gray-600">Semester</span>
                                                <span className="font-medium">{exam.group?.semester?.name || 'N/A'}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="text-gray-600">Number of Students</span>
                                                <span className="font-medium">{exam.group?.student_count || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div>
                                    {/* Rooms */}
                                    <div className="mb-8">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <MapPin className="h-5 w-5" />
                                            Assigned Rooms ({exam.rooms?.length || 0})
                                        </h3>
                                        {exam.rooms?.length > 0 ? (
                                            <div className="space-y-3">
                                                {exam.rooms.map(room => (
                                                    <div key={room.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                        <div>
                                                            <div className="font-medium">{room.room_name}</div>
                                                            <div className="text-sm text-gray-600">
                                                                Type: {room.room_type} • Capacity: {room.capacity}
                                                            </div>
                                                        </div>
                                                        <span className={`px-3 py-1 text-sm rounded-full ${
                                                            room.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {room.availability ? 'Available' : 'Unavailable'}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-center py-4">No rooms assigned</p>
                                        )}
                                    </div>

                                    {/* Invigilators */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                            <User className="h-5 w-5" />
                                            Assigned Invigilators ({exam.invigilators?.length || 0})
                                        </h3>
                                        {exam.invigilators?.length > 0 ? (
                                            <div className="space-y-3">
                                                {exam.invigilators.map(teacher => (
                                                    <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                        <div>
                                                            <div className="font-medium">
                                                                {teacher.first_name} {teacher.last_name}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                {teacher.grade} • {teacher.email}
                                                            </div>
                                                        </div>
                                                        {teacher.id === exam.module?.teacher_id && (
                                                            <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                                                                Module Responsible
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-center py-4">No invigilators assigned</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="mt-8 pt-8 border-t">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-sm text-gray-600">Created At</div>
                                        <div className="font-medium">
                                            {new Date(exam.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-sm text-gray-600">Updated At</div>
                                        <div className="font-medium">
                                            {new Date(exam.updated_at).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <div className="text-sm text-gray-600">Status</div>
                                        <div className="font-medium flex items-center gap-2">
                                            {exam.has_conflicts ? (
                                                <>
                                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                                    <span className="text-red-600">Has Conflicts</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                                    <span className="text-green-600">No Conflicts</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {exam.conflict_warnings && (
                                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                                            <h4 className="font-medium text-yellow-800">Conflict Warnings:</h4>
                                        </div>
                                        <p className="text-yellow-700 text-sm">{exam.conflict_warnings}</p>
                                    </div>
                                )}
                            </div>

                            {/* Danger Zone */}
                            <div className="mt-8 pt-8 border-t border-red-200">
                                <h3 className="text-lg font-semibold text-red-700 mb-4">Danger Zone</h3>
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-medium text-red-800">Delete this exam</h4>
                                            <p className="text-red-700 text-sm mt-1">
                                                Once deleted, this exam and all its associated data cannot be recovered.
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleDelete}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete Exam
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ResponsableLayout>
    );
}