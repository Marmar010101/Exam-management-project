import React from "react";
import ResponsableLayout from "@/Layouts/ResponsableLayout";
import {
    Users,
    GraduationCap,
    FileText,
    LayoutDashboard,
    PlusCircle,
    Calendar,
    BookOpen,
    ChevronRight,
    Clock,
    Building,
    UserCircle,
    CalendarDays
} from "lucide-react";
import { Link } from "@inertiajs/react";

export default function Dashboard({
    studentsCount,
    teachersCount,
    examsCount,
    activePercentage,
    groups = [],
    upcomingExams = []
}) {
    // Show only first 2 groups on dashboard
    const displayedGroups = groups.slice(0, 2);

    return (
        <ResponsableLayout title="Dashboard" activeRoute="dashboard">
           
            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Students"
                    value={studentsCount}
                    icon={Users}
                    color="text-blue-500"
                    bgColor="bg-blue-50"
                />
                <StatCard
                    title="Total Teachers"
                    value={teachersCount}
                    icon={GraduationCap}
                    color="text-green-500"
                    bgColor="bg-green-50"
                />
                <StatCard
                    title="Scheduled Exams"
                    value={examsCount}
                    icon={FileText}
                    color="text-purple-500"
                    bgColor="bg-purple-50"
                />
                <StatCard
                    title="Active Accounts"
                    value={`${activePercentage}%`}
                    icon={LayoutDashboard}
                    color="text-amber-500"
                    bgColor="bg-amber-50"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Groups List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Users className="h-5 w-5" />
                                        Recent Groups
                                    </h2>
                                    <p className="text-blue-100 text-sm mt-1">
                                        Showing {displayedGroups.length} of {groups.length} groups
                                    </p>
                                </div>
                                <Link
                                    href={route('groups.index')}
                                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm"
                                >
                                    View All Groups
                                </Link>
                            </div>
                        </div>

                        {/* Groups List - Only 2 groups */}
                        <div className="divide-y divide-gray-100">
                            {displayedGroups.length > 0 ? (
                                displayedGroups.map((group) => (
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
                                        Groups will appear here once created
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Upcoming Exams */}
                <div>
                    <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Upcoming Exams
                            </h2>
                            <p className="text-emerald-100 text-sm mt-1">
                                Next scheduled examinations
                            </p>
                        </div>
                        
                        <div className="p-4">
                            {upcomingExams.length > 0 ? (
                                <div className="space-y-4">
                                    {upcomingExams.slice(0, 5).map((exam) => (
                                        <div key={exam.id} className="p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {exam.module_name}
                                                    </div>
                                                    <div className="text-sm text-gray-600">
                                                        {exam.group_name}
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 text-xs rounded ${
                                                    exam.is_today 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {exam.is_today ? 'Today' : exam.formatted_date}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <Clock className="h-3 w-3" />
                                                    {exam.time_range}
                                                </div>
                                                <div 
                                                    className="text-blue-600 hover:text-blue-800 text-xs flex items-center gap-1 cursor-pointer"
                                                    onClick={() => window.location.href = route('exams.show', exam.id)}
                                                >
                                                    View details
                                                    <ChevronRight className="h-3 w-3" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {upcomingExams.length > 5 && (
                                        <div className="text-center pt-2">
                                            <Link
                                                href={route('exams.index')}
                                                className="text-sm text-blue-600 hover:text-blue-800"
                                            >
                                                View all {upcomingExams.length} upcoming exams →
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No upcoming exams scheduled</p>
                                    <Link
                                        href={route('exams.create')}
                                        className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        Schedule your first exam
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ResponsableLayout>
    );
}

/* COMPONENTS */
function StatCard({ title, value, icon: Icon, color, bgColor }) {
    return (
        <div className="bg-white rounded-xl shadow border border-gray-200 p-5">
            <div className="flex items-center gap-4">
                <div className={`${bgColor} p-3 rounded-full`}>
                    <Icon className={color} size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );
}