import ResponsableLayout from '@/Layouts/ResponsableLayout';
import { Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react'; // Added useEffect
import {
    CalendarDays,
    Filter,
    Search,
    Users,
    Building,
    ChevronRight,
    Eye,
    FileText,
    Download,
    Printer,
    Clock,
    Send
} from 'lucide-react';

export default function Calendars({ groups, examsByGroup, filters: initialFilters }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [expandedGroups, setExpandedGroups] = useState({});
    const [validationStatus, setValidationStatus] = useState({});
    

    const filteredGroups = groups.filter(group => 
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Toggle group expansion
    const toggleGroupExpansion = (groupId) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId]
        }));
        
        // Check validation status when expanding
        if (!expandedGroups[groupId]) {
            checkValidationStatus(groupId);
        }
    };

    // Get exam count for a group
    const getExamCount = (groupId) => {
        return examsByGroup[groupId]?.length || 0;
    };

    // Get date range for a group
    const getDateRange = (groupId) => {
        const exams = examsByGroup[groupId] || [];
        if (exams.length === 0) return 'No exams';
        
        const dates = exams.map(e => new Date(e.exam_date));
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));
        
        return `${minDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - ${maxDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`;
    };

    // Function to check validation status
    const checkValidationStatus = async (groupId) => {
        try {
            const response = await fetch(route('calendar.validation.status', { group: groupId }));
            const data = await response.json();
            setValidationStatus(prev => ({ 
                ...prev, 
                [groupId]: data 
            }));
            return data;
        } catch (error) {
            console.error('Error checking validation status:', error);
            return null;
        }
    };

    // Function to send for validation
    const sendForValidation = async (groupId) => {
        // Check status first
        const status = await checkValidationStatus(groupId);
        
        if (status?.has_pending_request) {
            alert('This calendar is already pending validation.');
            return;
        }

        if (!confirm('Are you sure you want to send this exam calendar for head department validation? Once validated, it will be published to students and teachers.')) {
            return;
        }

        try {
            const response = await fetch(route('calendar.validation.send', { group: groupId }), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                }
            });

            const data = await response.json();
            
            if (response.ok && data.success) {
                alert('Calendar sent for validation successfully!');
                // Update status
                await checkValidationStatus(groupId);
            } else {
                throw new Error(data.message || 'Failed to send for validation');
            }
        } catch (error) {
            alert('Error sending for validation: ' + error.message);
            console.error('Validation error:', error);
        }
    };

    return (
        <ResponsableLayout title="Exam Calendars" activeRoute="calendars">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                📅 Group Exam Calendars
                            </h1>
                            <p className="text-gray-600 mt-1">
                                View and manage exam schedules for all groups
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href={route('calendars.export.pdf')}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Export All
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Search and Stats */}
                <div className="mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search groups..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="text-sm text-gray-600">
                            Showing {filteredGroups.length} of {groups.length} groups
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Users className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Groups</p>
                                    <p className="text-xl font-semibold">{groups.length}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <CalendarDays className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Groups with Exams</p>
                                    <p className="text-xl font-semibold">
                                        {Object.keys(examsByGroup).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <Clock className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Exams</p>
                                    <p className="text-xl font-semibold">
                                        {Object.values(examsByGroup).reduce((sum, exams) => sum + exams.length, 0)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-50 rounded-lg">
                                    <Building className="h-5 w-5 text-amber-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Active Rooms</p>
                                    <p className="text-xl font-semibold">
                                        {(() => {
                                            const roomSet = new Set();
                                            Object.values(examsByGroup).forEach(exams => {
                                                exams.forEach(exam => {
                                                    if (exam.room_name && exam.room_name !== 'No Room') {
                                                        roomSet.add(exam.room_name);
                                                    }
                                                });
                                            });
                                            return roomSet.size;
                                        })()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Groups List */}
                <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-900">All Groups</h2>
                    </div>
                    
                    <div className="divide-y divide-gray-200">
                        {filteredGroups.length === 0 ? (
                            <div className="px-6 py-8 text-center">
                                <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No groups found
                                </h3>
                                <p className="text-gray-600">
                                    Try adjusting your search term
                                </p>
                            </div>
                        ) : (
                            filteredGroups.map((group) => {
                                const examCount = getExamCount(group.id);
                                const isExpanded = expandedGroups[group.id];
                                const hasExams = examCount > 0;
                                
                                return (
                                    <div key={group.id} className="hover:bg-gray-50">
                                        {/* Group Header */}
                                        <div 
                                            className="px-6 py-4 flex items-center justify-between cursor-pointer"
                                            onClick={() => toggleGroupExpansion(group.id)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                                                    hasExams ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                                                }`}>
                                                    <CalendarDays className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">
                                                        {group.name}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                                        <span className="flex items-center gap-1">
                                                            <CalendarDays className="h-3 w-3" />
                                                            {examCount} exams
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            {getDateRange(group.id)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className={`px-2 py-1 text-xs rounded-full ${
                                                    hasExams 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {hasExams ? 'Active' : 'No Exams'}
                                                </div>
                                                <ChevronRight className={`h-4 w-4 text-gray-400 transition-transform ${
                                                    isExpanded ? 'rotate-90' : ''
                                                }`} />
                                            </div>
                                        </div>
                                        
                                        {/* Expanded Content */}
                                        {isExpanded && (
                                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                                {hasExams ? (
                                                    <div className="space-y-4">
                                                        {/* Quick Exam Summary */}
                                                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                                                            <h4 className="font-medium text-gray-900 mb-3">Recent Exams</h4>
                                                            <div className="space-y-2">
                                                                {examsByGroup[group.id].slice(0, 3).map((exam) => (
                                                                    <div key={exam.id} className="flex items-center justify-between text-sm">
                                                                        <div>
                                                                            <span className="font-medium text-gray-900">
                                                                                {exam.module_name || 'Module'}
                                                                            </span>
                                                                            <span className="text-gray-500 ml-2">
                                                                                {new Date(exam.exam_date).toLocaleDateString()} at {exam.exam_time}
                                                                            </span>
                                                                        </div>
                                                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                                                            exam.exam_type === 'Continuous assessment' ? 'bg-green-100 text-green-800' :
                                                                            exam.exam_type === 'Final exam' ? 'bg-blue-100 text-blue-800' :
                                                                            exam.exam_type === 'Make-up exam' ? 'bg-amber-100 text-amber-800' :
                                                                            exam.exam_type === 'Replacement exam' ? 'bg-red-100 text-red-800' :
                                                                            'bg-purple-100 text-purple-800'
                                                                        }`}>
                                                                            {exam.exam_type}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Actions */}
                                                        <div className="flex items-center gap-3">
                                                            <Link
                                                                href={route('planning.calendar', { group: group.id })}
                                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                                View Full Calendar
                                                            </Link>
                                                            <Link
                                                                href={route('calendars.export.group.pdf', { group: group.id })}
                                                                target="_blank"
                                                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                                                            >
                                                                <FileText className="h-4 w-4" />
                                                                Export PDF
                                                            </Link>
                                                            <Link
                                                                href={route('session.planning.create', { group: group.id })}
                                                                className="px-4 py-2 border border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-50 flex items-center gap-2"
                                                            >
                                                                <CalendarDays className="h-4 w-4" />
                                                                Plan New Session
                                                            </Link>
                                                            
                                                            {/* Send for Validation Button */}
                                                            <button
                                                                onClick={() => sendForValidation(group.id)}
                                                                disabled={validationStatus[group.id]?.has_pending_request}
                                                                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                                                                    validationStatus[group.id]?.has_pending_request
                                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                        : 'bg-purple-600 text-white hover:bg-purple-700'
                                                                }`}
                                                            >
                                                                <Send className="h-4 w-4" />
                                                                {validationStatus[group.id]?.has_pending_request ? 'Pending Validation' : 'Send for Validation'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-6">
                                                        <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                        <h4 className="font-medium text-gray-900 mb-2">
                                                            No exams scheduled
                                                        </h4>
                                                        <p className="text-gray-600 mb-4">
                                                            This group has no scheduled exams yet.
                                                        </p>
                                                        <Link
                                                            href={route('session.planning.create', { group: group.id })}
                                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                        >
                                                            <CalendarDays className="h-4 w-4 mr-2" />
                                                            Plan First Session
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-6 bg-white rounded-lg border border-gray-200 p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Status Legend</h3>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-sm text-gray-600">Group with scheduled exams</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                            <span className="text-sm text-gray-600">Group with no exams</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            <span className="text-sm text-gray-600">Calendar pending validation</span>
                        </div>
                    </div>
                </div>
            </div>
        </ResponsableLayout>
    );
}