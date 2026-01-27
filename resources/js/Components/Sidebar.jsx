import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import {
    LayoutDashboard,
    Users,
    Calendar,
    CalendarDays,
    FileText,
    Bell,
    BookOpen,
    Building,
    GraduationCap,
    LogOut,
    FileBarChart
} from 'lucide-react';

export default function Sidebar({ role, isMobile = false, onClose }) {
    const { url } = usePage();
    const [isClicked, setIsClicked] = useState(false);
    
    const normalizedRole = role === 'head_department' ? 'headdepartment' : role;

    const handleLogoutClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Logout button clicked');
        setIsClicked(true);
        
        setTimeout(() => {
            router.post('/logout');
        }, 300);
    };
    
    const menus = {
        headdepartment: [
            { key: 'dashboard', label: 'Dashboard', href: '/HeadDepartment/Dashboard', icon: <LayoutDashboard size={18} /> },
            { key: 'management', label: 'Accounts', href: '/HeadDepartment/AccountManagement/Management', icon: <Users size={18} /> },
            { key: 'planning', label: 'Planning', href: '/HeadDepartment/faculty-schedule', icon: <CalendarDays size={18} /> },
            { key: 'exams', label: 'Exams', href: '/HeadDepartment/Exams', icon: <FileText size={18} /> },
            { key: 'modules', label: 'Modules', href: '/HeadDepartment/Modules', icon: <BookOpen size={18} /> },
            { key: 'salles', label: 'Classrooms', href: '/HeadDepartment/Salles', icon: <Building size={18} /> },
            { key: 'report', label: 'Report', href: '/HeadDepartment/Report', icon: <FileBarChart size={18} /> },
        ],
        responsable: [
            { key: 'dashboard', label: 'Dashboard', href: '/Responsable/Dashboard', icon: <LayoutDashboard size={18} /> },
            { key: 'exam_plans', label: 'Exam Plans', href: '/responsable/exam-plans', icon: <Calendar size={18} /> },
            { key: 'exams', label: 'Exams', href: '/Responsable/Exams', icon: <GraduationCap size={18} /> },
            { key: 'invigilation', label: 'Invigilation', href: '/Responsable/Invigilation/Index', icon: <Users size={18} /> },
            { key: 'teacher_requests', label: 'Teacher Requests', href: '/Responsable/TeacherRequests', icon: <Bell size={18} /> },
            { key: 'report', label: 'Report', href: '/Responsable/Report', icon: <FileBarChart size={18} /> },
        ],
        teacher: [
            { key: 'dashboard', label: 'Dashboard', href: '/Teacher/Dashboard', icon: <LayoutDashboard size={18} /> },
            { key: 'supervision', label: 'Supervision', href: '/Teacher/supervision', icon: <Calendar size={18} /> },
            { key: 'modules', label: 'My Modules', href: '/Teacher/modules', icon: <BookOpen size={18} /> },
            { key: 'requests_alerts', label: 'Requests & Alerts', href: '/Teacher/requests_alerts', icon: <Bell size={18} /> },
            { key: 'report', label: 'Report', href: '/Teacher/Report', icon: <FileBarChart size={18} /> },
        ],
        student: [
            { key: 'dashboard', label: 'Dashboard', href: '/Student/Dashboard', icon: <LayoutDashboard size={18} /> },
            { key: 'my_exams', label: 'My Exams', href: '/Student/MyExams', icon: <FileText size={18} /> },
            { key: 'calendar', label: 'Calendar', href: '/Student/Calendar', icon: <CalendarDays size={18} /> },
            { key: 'report', label: 'Report', href: '/Student/Report', icon: <FileBarChart size={18} /> },
        ],
    };

    const items = menus[normalizedRole] || [];

    const isItemActive = (href) => {
        const currentPath = window.location.pathname;
        return currentPath === href;
    };

    return (
        <aside className={`
  ${isMobile ? 'fixed inset-y-0 left-0 z-50 w-64' : 'w-64'}
  bg-surface dark:bg-gray-800
  min-h-screen flex flex-col
  border-r border-gray-200 dark:border-gray-700
  shadow-sm
`}>

            <div className="p-6">
                <div className="flex items-start space-x-3">
                    <ApplicationLogo className="w-12 h-12 text-blue-500" />
                    <div className="pt-1">
                        <h2 className="text-base font-bold text-blue-500 dark:text-blue-400">Examination System</h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize font-medium mt-1">
                            {normalizedRole === 'headdepartment' ? 'Head of Department' : 
                             normalizedRole === 'teacher' ? 'Teacher' :
                             normalizedRole === 'responsable' ? 'Responsible' : 'Student'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {items.map((item) => {
                    const isActive = isItemActive(item.href);
                    
                    return (
                        <Link
                            key={item.key}
                            href={item.href}
                            onClick={isMobile ? onClose : undefined}
                            className={`group flex items-center px-4 py-2.5 text-sm rounded-xl transition-all duration-200 ${
                                isActive
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 shadow-glow'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <span className={`mr-3 transition-transform duration-200 ${
                                isActive ? 'scale-110 text-blue-600 dark:text-blue-400' : 'text-gray-500'
                            } group-hover:scale-110`}>
                                {item.icon}
                            </span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer - IMPORTANT: Ajouter relative et z-index */}
            <div className="relative z-10 p-4 border-t border-gray-200/40 dark:border-gray-700/40">
                <button 
                    type="button"
                    onClick={handleLogoutClick}
                    className={`w-full flex items-center justify-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 transform cursor-pointer ${
                        isClicked
                            ? 'bg-red-700 text-white font-bold shadow-lg scale-95'
                            : 'bg-gradient-to-r from-red-400 to-red-500 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95'
                    }`}
                >
                    <LogOut size={18} className="mr-2" />
                    Logout
                </button>
            </div>
        </aside>
    );
}