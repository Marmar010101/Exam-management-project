import React from 'react';
import { Link, usePage } from '@inertiajs/react';
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
    
    // Debug: Afficher le rôle reçu
    console.log('Sidebar - Role reçu:', role);
    
    // Normaliser le rôle pour gérer les deux variantes
    const normalizedRole = role === 'head_department' ? 'headdepartment' : role;
    
    console.log('Sidebar - Normalized role:', normalizedRole);
    
    const menus = {
        headdepartment: [
            { key: 'Dashboard', label: 'Dashboard', route: 'headdepartment.dashboard', icon: <LayoutDashboard size={18} /> },
            { key: 'management', label: 'Accounts', route: 'headdepartment.management', icon: <Users size={18} /> },
            { key: 'exams_planing', label: 'Planning', route: 'headdepartment.exams_planing', icon: <Calendar size={18} /> },
            { key: 'exams', label: 'Exams', route: 'headdepartment.exams', icon: <FileText size={18} /> },
            { key: 'modules', label: 'Modules', route: 'headdepartment.modules', icon: <BookOpen size={18} /> },
            { key: 'salles', label: 'Classrooms', route: 'headdepartment.salles', icon: <Building size={18} /> },
            { key: 'report', label: 'Report', route: 'headdepartment.report', icon: <FileBarChart size={18} /> },
        ],
      responsable: [
        {
            key: 'dashboard',
            label: 'Dashboard',
            route: 'responsable.dashboard',
            icon: <LayoutDashboard size={18} />,
        },
        {
            key: 'exam_plans',
            label: 'Exam Plans',
            route: 'responsable.exam-plans.index',
            icon: <Calendar size={18} />,
        },
        {
            key: 'exams',
            label: 'Exams',
            route: 'responsable.exams',
            icon: <GraduationCap size={18} />,
        },
        {
            key: 'invigilation',
            label: 'Invigilation',
            route: 'responsable.invigilation',
            icon: <Users size={18} />,
        },
        {
            key: 'calendars',
            label: 'Calendars',
            route: 'responsable.planning.calendar',
            icon: <CalendarDays size={18} />,
        },
        {
            key: 'teacher_requests',
            label: 'Teacher Requests',
            route: 'responsable.teacher_requests',
            icon: <Bell size={18} />,
        },
        {
            key: 'report',
            label: 'Report',
            route: 'responsable.report',
            icon: <FileBarChart size={18} />,
        },
    ],

        
        teacher: [
            { key: 'Dashboard', label: 'Dashboard', route: 'teacher.dashboard', icon: <LayoutDashboard size={18} /> },
            { key: 'surveillance', label: 'Surveillance', route: 'teacher.surveillance', icon: <Calendar size={18} /> },
            { key: 'exams', label: 'Exams', route: 'teacher.exams', icon: <FileText size={18} /> },
            { key: 'modules', label: 'Modules', route: 'teacher.modules', icon: <BookOpen size={18} /> },
            { key: 'requests_alerts', label: 'Requests & Alerts', route: 'teacher.requests_alerts', icon: <Bell size={18} /> },
            { key: 'report', label: 'Report', route: 'teacher.report', icon: <FileBarChart size={18} /> },
        ],
        student: [
              { key: 'Dashboard', label: 'Dashboard', route: 'student.dashboard', icon: <LayoutDashboard size={18} /> },
              { key: 'my_exams', label: 'My Exams', route: 'student.my_exams', icon: <FileText size={18} /> },
              { key: 'exam_plans', label: 'Exam Plans', route: 'student.exam-plans.index', icon: <Calendar size={18} /> },
              { key: 'calendar', label: 'Calendar', route: 'student.calendar', icon: <CalendarDays size={18} /> },
              { key: 'report', label: 'Report', route: 'student.report', icon: <FileBarChart size={18} /> },
        ],
            
    };

    console.log('Sidebar - Available menus:', Object.keys(menus));

    const items = menus[normalizedRole] || [];
    
    // Debug: Afficher les items sélectionnés
    console.log('Sidebar - Normalized role:', normalizedRole);
    console.log('Sidebar - Selected items:', items);
    console.log('Sidebar - Items length:', items.length);
    console.log('Sidebar - Available menu keys:', Object.keys(menus));

    const isActive = (routeName) => {
        // Utilise route().current() pour vérifier si la route actuelle correspond
        return route().current(routeName);
        
        // Alternative si la méthode ci-dessus ne fonctionne pas :
        // const currentRoute = window.location.pathname;
        // const routePath = route(routeName);
        // return currentRoute === routePath;
    };

    return (
        <aside className={`${isMobile ? 'fixed inset-y-0 left-0 z-50 w-64' : 'w-64'} bg-white min-h-screen flex flex-col border-r border-gray-200`}>
            <div className="p-6">
                <div className="flex items-start space-x-3">
                    <ApplicationLogo className="w-12 h-12 text-blue-500" />
                    <div className="pt-1">
                        <h2 className="text-base font-bold text-blue-500">Examination System</h2>
                        <p className="text-xs text-gray-500 capitalize font-medium mt-1">
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
                    const currentRoute = route().current();
                    let isActive = false;
                    
                    // Logique de détection plus précise
                    if (item.key === 'Dashboard') {
                        isActive = currentRoute.includes('dashboard');
                    } else if (item.key === 'exams_planing') {
                        isActive = currentRoute.includes('exams_planing');
                    } else if (item.key === 'exams') {
                        isActive = currentRoute.includes('exams') && !currentRoute.includes('exams_planing');
                    } else {
                        isActive = currentRoute.includes(item.key);
                    }
                    
                    return (
                        <Link
                            key={item.key}
                            href={route(item.route)}
                            onClick={isMobile ? onClose : undefined}
                            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                isActive
                                    ? 'bg-blue-100 text-blue-600 font-semibold'  
                                    : 'text-gray-700 hover:bg-gray-50'  
                            }`}
                        >
                            <span className={`mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                                {item.icon}
                            </span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="flex items-center w-full px-3 py-2 text-sm font-bold text-red-700 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                    <LogOut size={18} className="mr-3 text-red-600" />
                    Logout
                </Link>
            </div>
        </aside>
    );
}
