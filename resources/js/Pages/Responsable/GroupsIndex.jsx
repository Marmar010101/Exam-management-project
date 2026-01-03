// resources/js/Pages/Responsable/GroupsIndex.jsx
import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Link } from "@inertiajs/react";
import {
    Users,
    UserCircle,
    BookOpen,
    CalendarDays,
    Building,
    PlusCircle,
    Calendar,
    ArrowLeft
} from "lucide-react";

export default function GroupsIndex({ groups = [], auth }) {
    return (
        <AuthenticatedLayout 
            user={auth.user}
            title="All Groups" 
            activeRoute="groups.index"
        >
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Link
                                    href={route('dashboard')}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                                </Link>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    All Groups ({groups.length})
                                </h1>
                            </div>
                            <p className="text-gray-600 ml-10">
                                Manage exams for all academic groups
                            </p>
                        </div>
                    </div>
                </div>

                {/* Groups List */}
                <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    All Academic Groups
                                </h2>
                                <p className="text-blue-100 text-sm mt-1">
                                    Select a group to schedule exams
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Groups List */}
                    <div className="divide-y divide-gray-100">
                        {groups.length > 0 ? (
                            groups.map((group) => (
                                <div key={group.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="mb-4">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {group.name}
                                            </h3>
                                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                                {group.level?.name || 'N/A'}
                                            </span>
                                            {group.speciality && (
                                                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                                    {group.speciality.name}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <UserCircle className="h-4 w-4" />
                                                <span>
                                                    {group.students_count || 0} students
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="h-4 w-4" />
                                                <span>
                                                    {group.modules_count || 0} modules
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CalendarDays className="h-4 w-4" />
                                                <span>
                                                    {group.exams_count || 0} scheduled exams
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Building className="h-4 w-4" />
                                                <span>Cycle: {group.cycle?.name || 'N/A'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <Link
                                            href={route('exams.create') + `?group_id=${group.id}`}
                                            className="flex flex-col items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors"
                                        >
                                            <PlusCircle className="h-5 w-5" />
                                            <div className="text-center">
                                                <div className="font-medium">Create Single Exam</div>
                                                <div className="text-xs text-blue-600">
                                                    Schedule one exam for this group
                                                </div>
                                            </div>
                                        </Link>
                                        
                                        <Link
                                            href={route('session.planning.create', group.id)}
                                            className="flex flex-col items-center justify-center gap-2 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300 transition-colors"
                                        >
                                            <Calendar className="h-5 w-5" />
                                            <div className="text-center">
                                                <div className="font-medium">Plan Entire Session</div>
                                                <div className="text-xs text-emerald-600">
                                                    Schedule all exams for this group
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center">
                                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No groups found
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    Create your first group to get started
                                </p>
                                <Link
                                    href={route('groups.create')}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Create New Group
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}