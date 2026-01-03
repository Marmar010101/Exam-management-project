import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Calendar,
    Clock,
    Users,
    MapPin,
    BookOpen,
    GraduationCap,
    Filter,
    Search,
    PlusCircle,
    Edit,
    Trash2,
    Eye,
    Download,
    AlertCircle,
    CheckCircle,
    XCircle,
    ChevronDown,
    ChevronUp,
    Building,
    User,
    CalendarDays,
} from 'lucide-react';

export default function Index({ exams = [], stats = {}, error = null, auth }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [expandedExam, setExpandedExam] = useState(null);

    // Filter exams
    const filteredExams = exams.filter(exam => {
        const searchMatch = 
            exam.module_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.group_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.exam_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exam.rooms.some(room => room.name.toLowerCase().includes(searchTerm.toLowerCase()));
        
        let typeMatch = true;
        switch (filterType) {
            case 'upcoming': typeMatch = exam.is_upcoming; break;
            case 'past': typeMatch = exam.is_past; break;
            case 'today': typeMatch = exam.is_today; break;
            default: typeMatch = true;
        }
        
        return searchMatch && typeMatch;
    });

    const toggleExpand = (id) => {
        setExpandedExam(expandedExam === id ? null : id);
    };

    const handleDelete = (id, moduleName) => {
        if (confirm(`Are you sure you want to delete the exam for "${moduleName}"?\n\nThis action cannot be undone.`)) {
            router.delete(route('exams.destroy', id));
        }
    };

    // Safe route check function
    const getExamDetailRoute = (examId) => {
        try {
            // First try exams.show
            return route('exams.show', examId);
        } catch (error) {
            try {
                // Fallback to exams.edit
                return route('exams.edit', examId);
            } catch (error) {
                // Last resort, use #
                return '#';
            }
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Exams Management" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    <GraduationCap className="h-6 w-6" />
                                    Exam Management
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Schedule, manage, and monitor all exams
                                </p>
                            </div>
                            <Link
                                href={route('exams.create')}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <PlusCircle className="h-4 w-4 mr-2" />
                                Schedule New Exam
                            </Link>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                                <p className="text-red-700">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                            <div className="flex items-center">
                                <div className="rounded-full bg-blue-100 p-3">
                                    <BookOpen className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Exams</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total || 0}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                            <div className="flex items-center">
                                <div className="rounded-full bg-green-100 p-3">
                                    <Calendar className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Upcoming</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.upcoming || 0}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                            <div className="flex items-center">
                                <div className="rounded-full bg-yellow-100 p-3">
                                    <Clock className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Today</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.today || 0}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                            <div className="flex items-center">
                                <div className="rounded-full bg-gray-100 p-3">
                                    <CalendarDays className="h-6 w-6 text-gray-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Past Exams</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.past || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search exams by module, group, type, or room..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All Exams</option>
                                    <option value="upcoming">Upcoming</option>
                                    <option value="today">Today</option>
                                    <option value="past">Past</option>
                                </select>
                                
                                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                    <Filter className="h-4 w-4" />
                                    More Filters
                                </button>
                                
                                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                    <Download className="h-4 w-4" />
                                    Export
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Exams List */}
                    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                        {filteredExams.length > 0 ? (
                            <div className="divide-y divide-gray-200">
                                {filteredExams.map((exam) => (
                                    <div key={exam.id} className="hover:bg-gray-50 transition-colors">
                                        {/* Exam Header */}
                                        <div className="p-4">
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    {/* Safe exam detail link */}
                                                    <Link 
                                                        href={getExamDetailRoute(exam.id)}
                                                        className="block hover:text-blue-600"
                                                    >
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                                                                {exam.module_name}
                                                            </h3>
                                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                                exam.exam_type === 'Examen' ? 'bg-red-100 text-red-800' :
                                                                exam.exam_type === 'Contrôle' ? 'bg-blue-100 text-blue-800' :
                                                                exam.exam_type === 'Rattrapage' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-gray-100 text-gray-800'
                                                            }`}>
                                                                {exam.exam_type}
                                                            </span>
                                                            {exam.is_today && (
                                                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                                                    Today
                                                                </span>
                                                            )}
                                                            {exam.is_upcoming && !exam.is_today && (
                                                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                                                    Upcoming
                                                                </span>
                                                            )}
                                                            {exam.is_past && (
                                                                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                                                                    Completed
                                                                </span>
                                                            )}
                                                        </div>
                                                    </Link>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>{exam.formatted_date}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <Clock className="h-4 w-4" />
                                                            <span>{exam.time_range} ({exam.duration} min)</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <Users className="h-4 w-4" />
                                                            <span>{exam.group_name}</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                                            <Building className="h-4 w-4" />
                                                            <span>System: {exam.system}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                                            <GraduationCap className="h-4 w-4" />
                                                            <span>Level: {exam.level}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                                            <BookOpen className="h-4 w-4" />
                                                            <span>Speciality: {exam.speciality}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>Semester: {exam.semester}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleExpand(exam.id);
                                                        }}
                                                        className="p-2 hover:bg-gray-100 rounded"
                                                    >
                                                        {expandedExam === exam.id ? (
                                                            <ChevronUp className="h-5 w-5 text-gray-400" />
                                                        ) : (
                                                            <ChevronDown className="h-5 w-5 text-gray-400" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Expanded Details */}
                                        {expandedExam === exam.id && (
                                            <div className="px-4 pb-4 pt-0 border-t border-gray-200">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                                    {/* Rooms Section */}
                                                    <div>
                                                        <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                            <MapPin className="h-4 w-4" />
                                                            Assigned Rooms ({exam.total_rooms})
                                                        </h4>
                                                        {exam.rooms.length > 0 ? (
                                                            <div className="space-y-2">
                                                                {exam.rooms.map((room) => (
                                                                    <div key={room.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                                        <div>
                                                                            <div className="font-medium">{room.name}</div>
                                                                            <div className="text-sm text-gray-600">
                                                                                {room.type} • Capacity: {room.capacity}
                                                                            </div>
                                                                        </div>
                                                                        <div className={`px-2 py-1 text-xs rounded-full ${
                                                                            room.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                                        }`}>
                                                                            {room.availability ? 'Available' : 'Unavailable'}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-gray-500 text-sm">No rooms assigned yet</p>
                                                        )}
                                                    </div>
                                                    
                                                    {/* Invigilators Section */}
                                                    <div>
                                                        <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                            <Users className="h-4 w-4" />
                                                            Invigilators ({exam.total_invigilators})
                                                        </h4>
                                                        {exam.teachers.length > 0 ? (
                                                            <div className="space-y-2">
                                                                {exam.teachers.map((teacher) => (
                                                                    <div key={teacher.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                                        <div>
                                                                            <div className="font-medium">{teacher.name}</div>
                                                                            <div className="text-sm text-gray-600">{teacher.email}</div>
                                                                        </div>
                                                                        {teacher.id === exam.module_responsible_id && (
                                                                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                                                                Responsible
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <p className="text-gray-500 text-sm">No invigilators assigned yet</p>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {/* Actions */}
                                                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
                                                    <div className="text-sm text-gray-500">
                                                        Module Responsible: <span className="font-medium">{exam.module_responsible}</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {route().has('exams.edit') && (
                                                            <Link
                                                                href={route('exams.edit', exam.id)}
                                                                className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(exam.id, exam.module_name)}
                                                            className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="text-center py-12">
                                <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {searchTerm || filterType !== 'all' ? 'No matching exams found' : 'No exams scheduled yet'}
                                </h3>
                                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                    {searchTerm || filterType !== 'all' 
                                        ? 'Try adjusting your search or filter criteria'
                                        : 'Start scheduling exams to manage your examination session. Create your first exam to get started.'
                                    }
                                </p>
                                {(!searchTerm && filterType === 'all') && (
                                    <Link
                                        href={route('exams.create')}
                                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        <PlusCircle className="h-5 w-5 mr-2" />
                                        Schedule Your First Exam
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Footer Stats */}
                    <div className="mt-6 text-sm text-gray-500 flex justify-between items-center">
                        <div>
                            Showing {filteredExams.length} of {exams.length} exams
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span>Upcoming: {stats.upcoming || 0}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <span>Today: {stats.today || 0}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                                <span>Past: {stats.past || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}