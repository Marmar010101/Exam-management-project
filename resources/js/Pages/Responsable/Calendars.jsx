import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link } from '@inertiajs/react';
import {
    CalendarDays,
    Search,
    Users,
    Building,
    ChevronRight,
    Eye,
    FileText,
    Download,
    Clock,
    Send
} from 'lucide-react';

export default function Calendars({ groups, examsByGroup }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedGroups, setExpandedGroups] = useState({});
    const [validationStatus, setValidationStatus] = useState({});

    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleGroupExpansion = (groupId) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId]
        }));

        if (!expandedGroups[groupId]) {
            checkValidationStatus(groupId);
        }
    };

    const getExamCount = (groupId) =>
        examsByGroup[groupId]?.length || 0;

    const getDateRange = (groupId) => {
        const exams = examsByGroup[groupId] || [];
        if (!exams.length) return 'No exams';

        const dates = exams.map(e => new Date(e.exam_date));
        return `${new Date(Math.min(...dates)).toLocaleDateString()} - ${new Date(Math.max(...dates)).toLocaleDateString()}`;
    };

    const checkValidationStatus = async (groupId) => {
        const res = await fetch(route('calendar.validation.status', { group: groupId }));
        const data = await res.json();
        setValidationStatus(prev => ({ ...prev, [groupId]: data }));
    };

    const sendForValidation = async (groupId) => {
        const status = validationStatus[groupId];
        if (status?.has_pending_request) return;

        if (!confirm('Send this calendar for validation?')) return;

        await fetch(route('calendar.validation.send', { group: groupId }), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document
                    .querySelector('meta[name="csrf-token"]')
                    .getAttribute('content'),
            },
        });

        checkValidationStatus(groupId);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Exam Calendars
                </h2>
            }
        >
            <div className="max-w-7xl mx-auto py-6 px-4">
                {/* HEADER */}
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">📅 Group Exam Calendars</h1>
                        <p className="text-gray-600">Manage exam schedules for all groups</p>
                    </div>
                    <Link
                        href={route('calendars.export.pdf')}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg flex items-center gap-2"
                    >
                        <Download size={16} />
                        Export All
                    </Link>
                </div>

                {/* SEARCH */}
                <div className="mb-6 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search groups..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg"
                        />
                    </div>
                    <span className="text-sm text-gray-600">
                        {filteredGroups.length} / {groups.length}
                    </span>
                </div>

                {/* GROUPS */}
                <div className="bg-white rounded-xl shadow border divide-y">
                    {filteredGroups.map(group => {
                        const expanded = expandedGroups[group.id];
                        const examCount = getExamCount(group.id);

                        return (
                            <div key={group.id}>
                                <div
                                    className="p-6 flex justify-between cursor-pointer hover:bg-gray-50"
                                    onClick={() => toggleGroupExpansion(group.id)}
                                >
                                    <div>
                                        <h3 className="font-semibold">{group.name}</h3>
                                        <p className="text-sm text-gray-600">
                                            {examCount} exams · {getDateRange(group.id)}
                                        </p>
                                    </div>
                                    <ChevronRight
                                        className={`transition ${expanded ? 'rotate-90' : ''}`}
                                    />
                                </div>

                                {expanded && (
                                    <div className="bg-gray-50 p-6 space-y-4">
                                        {examCount ? (
                                            <>
                                                {examsByGroup[group.id].slice(0, 3).map(exam => (
                                                    <div key={exam.id} className="flex justify-between text-sm">
                                                        <span>{exam.module_name}</span>
                                                        <span>{exam.exam_date} · {exam.exam_time}</span>
                                                    </div>
                                                ))}

                                                <div className="flex gap-3 flex-wrap">
                                                    <Link
                                                        href={route('planning.calendar', group.id)}
                                                        className="btn-primary"
                                                    >
                                                        <Eye size={14} /> View
                                                    </Link>
                                                    <Link
                                                        href={route('calendars.export.group.pdf', group.id)}
                                                        className="btn-secondary"
                                                    >
                                                        <FileText size={14} /> PDF
                                                    </Link>
                                                    <button
                                                        onClick={() => sendForValidation(group.id)}
                                                        disabled={validationStatus[group.id]?.has_pending_request}
                                                        className="btn-warning"
                                                    >
                                                        <Send size={14} />
                                                        {validationStatus[group.id]?.has_pending_request
                                                            ? 'Pending'
                                                            : 'Send'}
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-gray-500">No exams scheduled</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
