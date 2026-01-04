import React from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
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

export default function Dashboard({
    studentsCount,
    teachersCount,
    examsCount,
    activePercentage,
    groups = [],
    upcomingExams = []
}) {
    const displayedGroups = groups.slice(0, 2);

    return (
        <AuthenticatedLayout header="Tableau de Bord - Responsable">
            <Head title="Dashboard Responsable" />

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Students" value={studentsCount} icon={Users} color="text-blue-500" bgColor="bg-blue-50" />
                <StatCard title="Total Teachers" value={teachersCount} icon={GraduationCap} color="text-green-500" bgColor="bg-green-50" />
                <StatCard title="Scheduled Exams" value={examsCount} icon={FileText} color="text-purple-500" bgColor="bg-purple-50" />
                <StatCard title="Active Accounts" value={`${activePercentage}%`} icon={LayoutDashboard} color="text-amber-500" bgColor="bg-amber-50" />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Groups */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
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
                                    href={route('responsable.dashboard')}
                                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm"
                                >
                                    View All Groups
                                </Link>
                            </div>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {displayedGroups.length ? displayedGroups.map(group => (
                                <div key={group.id} className="p-6 hover:bg-gray-50">
                                    <h3 className="text-lg font-semibold">{group.name}</h3>
                                </div>
                            )) : (
                                <div className="p-8 text-center text-gray-500">
                                    No groups found
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Upcoming Exams */}
                <div>
                    <div className="bg-white rounded-xl shadow border border-gray-200">
                        <div className="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4 text-white">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Upcoming Exams
                            </h2>
                        </div>

                        <div className="p-4">
                            {upcomingExams.length ? upcomingExams.slice(0,5).map(exam => (
                                <div key={exam.id} className="mb-3 p-3 border rounded-lg">
                                    <div className="font-medium">{exam.module_name}</div>
                                    <div className="text-sm text-gray-500">{exam.group_name}</div>
                                </div>
                            )) : (
                                <p className="text-center text-gray-500">No upcoming exams</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}

/* STAT CARD */
function StatCard({ title, value, icon: Icon, color, bgColor }) {
    return (
        <div className="bg-white rounded-xl shadow border p-5">
            <div className="flex items-center gap-4">
                <div className={`${bgColor} p-3 rounded-full`}>
                    <Icon className={color} size={24} />
                </div>
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
            </div>
        </div>
    );
}
