import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    CalendarDays,
    Download,
    Filter,
    Search,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    MapPin,
    Clock,
    Users,
    FileText,
    Plus,
    Eye
} from 'lucide-react';

export default function Index({ calendars = [], groups = [], auth }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('all');
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Filter calendars
    const filteredCalendars = calendars.filter(calendar => {
        const searchMatch = 
            calendar.module_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            calendar.group_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            calendar.room_name?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const groupMatch = selectedGroup === 'all' || calendar.group_id == selectedGroup;
        
        return searchMatch && groupMatch;
    });

    const handleExportPdf = () => {
        window.open('/calendars/export-pdf', '_blank');
    };

    const handleExportGroupPdf = (groupId) => {
        window.open(`/calendars/export-group-pdf/${groupId}`, '_blank');
    };

    const navigateMonth = (direction) => {
        const newMonth = new Date(currentMonth);
        if (direction === 'prev') {
            newMonth.setMonth(newMonth.getMonth() - 1);
        } else {
            newMonth.setMonth(newMonth.getMonth() + 1);
        }
        setCurrentMonth(newMonth);
    };

    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);
        const days = [];

        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="p-2 border border-gray-100"></div>);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const dayExams = filteredCalendars.filter(calendar => {
                const examDate = new Date(calendar.exam_date);
                return examDate.getDate() === day && 
                       examDate.getMonth() === currentMonth.getMonth() &&
                       examDate.getFullYear() === currentMonth.getFullYear();
            });

            days.push(
                <div key={day} className="p-2 border border-gray-100 min-h-[80px] hover:bg-gray-50">
                    <div className="text-sm font-medium text-gray-900 mb-1">{day}</div>
                    <div className="space-y-1">
                        {dayExams.slice(0, 2).map((exam, index) => (
                            <div
                                key={index}
                                className="text-xs p-1 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                                onClick={() => router.get(`/exams/${exam.id}`)}
                            >
                                <div className="font-medium truncate">{exam.module_name}</div>
                                <div className="text-xs opacity-75">{exam.exam_time}</div>
                            </div>
                        ))}
                        {dayExams.length > 2 && (
                            <div className="text-xs text-gray-500">+{dayExams.length - 2} more</div>
                        )}
                    </div>
                </div>
            );
        }

        return days;
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Academic Calendar" />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    <CalendarDays className="h-6 w-6" />
                                    Academic Calendar
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    View and manage exam schedules and academic events
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleExportPdf}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Export PDF
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6">
                        <div className="flex gap-4 items-center">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="text"
                                        placeholder="Search by module, group, or room..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <select
                                value={selectedGroup}
                                onChange={(e) => setSelectedGroup(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Groups</option>
                                {groups.map((group) => (
                                    <option key={group.id} value={group.id}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Calendar Navigation */}
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-6">
                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => navigateMonth('prev')}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <h2 className="text-lg font-semibold text-gray-900">
                                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h2>
                            <button
                                onClick={() => navigateMonth('next')}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="bg-white shadow rounded-lg border border-gray-200">
                        <div className="grid grid-cols-7 gap-0">
                            {/* Day headers */}
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div key={day} className="p-2 bg-gray-50 border border-gray-200 text-center text-sm font-medium text-gray-900">
                                    {day}
                                </div>
                            ))}
                            
                            {/* Calendar days */}
                            {renderCalendar()}
                        </div>
                    </div>

                    {/* Upcoming Exams List */}
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Exams</h3>
                        <div className="bg-white shadow rounded-lg border border-gray-200">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Module
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Group
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Time
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Room
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredCalendars
                                            .filter(calendar => new Date(calendar.exam_date) >= new Date())
                                            .slice(0, 10)
                                            .map((calendar) => (
                                                <tr key={calendar.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {calendar.module_name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {calendar.group_name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {new Date(calendar.exam_date).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {calendar.exam_time}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {calendar.room_name}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => router.get(`/exams/${calendar.id}`)}
                                                                className="text-blue-600 hover:text-blue-900"
                                                                title="View Details"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleExportGroupPdf(calendar.group_id)}
                                                                className="text-green-600 hover:text-green-900"
                                                                title="Export Group Calendar"
                                                            >
                                                                <Download className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {filteredCalendars.length === 0 && (
                                <div className="text-center py-12">
                                    <CalendarDays className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No exams found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Try adjusting your search or filter criteria.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
