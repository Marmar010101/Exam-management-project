import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { CalendarDays, Bell, User, LogOut } from 'lucide-react';
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    FileText,
    BookOpen,
    Settings,
} from 'lucide-react';

export default function ResponsableLayout({ children, title = '', activeRoute = '', auth }) {
    // Get the CSRF token from the page props
    const { csrf_token } = usePage().props;
    
    return (
        <>
            <Head>
                <title>{title ? `${title} - Exam Planning` : 'Exam Planning'}</title>
                <meta name="csrf-token" content={window.csrfToken || ''} />
            </Head>
            <div className="flex min-h-screen bg-gray-50 font-sans">
                {/* STABLE SIDEBAR */}
                <aside className="fixed left-0 top-0 h-screen w-64 bg-white shadow-md border-r border-gray-200 flex flex-col z-10">
                    <div className="p-5 font-semibold text-gray-800 text-lg border-b border-gray-100 bg-gray-50">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <GraduationCap className="text-blue-600" size={18} />
                            </div>
                            <span>Exam Planning</span>
                        </div>
                    </div>
                    <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
                        <SidebarLink 
                            href={route('responsable.dashboard')}
                            label="Dashboard" 
                            icon={LayoutDashboard} 
                            active={activeRoute === 'dashboard'}
                        />
                        <SidebarLink 
                            href={route('groups.index')}  
                            label="Exam Plans" 
                            icon={FileText} 
                            active={activeRoute === 'groups.index'} 
                        />
                        <SidebarLink 
                            href="/exams" 
                            label="Exams" 
                            icon={GraduationCap} 
                            active={activeRoute.startsWith('exams')}
                        />
                        <SidebarLink 
                            href="/invigilation" 
                            label="Invigilation" 
                            icon={Users}
                            active={activeRoute === 'invigilation'}
                        />
                        <SidebarLink 
                            href={route('calendars.index')}
                            label="Calendars" 
                            icon={CalendarDays} 
                            active={activeRoute.startsWith('calendars')}
                        />
                        
                        <div className="pt-4 mt-4 border-t border-gray-100">
                            <SidebarLink 
                                href="/notifications" 
                                label="Notifications" 
                                icon={Bell} 
                                active={activeRoute === 'notifications'}
                            />
                        </div>
                    </nav>
                    
                    {/* Logout at bottom - USING INERTIA LINK FOR CONSISTENCY */}
                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                        <Link 
                            href={route('logout')} 
                            method="post" 
                            as="button"
                            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                        >
                            <LogOut size={16} />
                            <span>Logout</span>
                        </Link>
                    </div>
                </aside>

                {/* MAIN CONTENT WITH HEADER */}
                <div className="flex-1 ml-64">
                    {/* HEADER */}
                    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
                        <div className="px-8 py-4 flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-semibold text-gray-800">
                                    Welcome, Planning Manager!
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    {title || 'Dashboard Overview'}
                                </p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                {/* Notifications */}
                                <button className="relative p-2 rounded-full hover:bg-gray-100 transition">
                                    <Bell size={20} className="text-gray-600" />
                                    <span className="absolute top-1 right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                                        <span className="text-xs font-bold text-white">3</span>
                                    </span>
                                </button>
                                
                                {/* Profile with dropdown */}
                                <div className="relative group">
                                    <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition">
                                        <div className="h-9 w-9 bg-gray-200 rounded-full flex items-center justify-center">
                                            <User size={18} className="text-gray-600" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-gray-700">{auth?.user?.name || 'Profile'}</p>
                                            <p className="text-xs text-gray-500">Planning manager</p>
                                        </div>
                                    </button>
                                    
                                    {/* Dropdown menu */}
                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 hidden group-hover:block z-50">
                                        <Link 
                                            href="/profile" 
                                            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                                        >
                                            <User size={16} className="text-gray-500" />
                                            My Profile
                                        </Link>
                                        
                                        <div className="border-t border-gray-100">
                                            {/* Use the same Inertia Link component */}
                                            <Link 
                                                href={route('logout')} 
                                                method="post" 
                                                as="button"
                                                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 text-left"
                                            >
                                                <LogOut size={16} className="text-gray-500" />
                                                Logout
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* MAIN CONTENT AREA */}
                    <main className="px-2 py-2">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}

function SidebarLink({ href, label, icon: Icon, active = false, badge }) {
    return (
        <Link
            href={href}
            className={`
                flex items-center justify-between gap-3 px-4 py-3 rounded-md text-sm transition relative
                ${active 
                    ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 font-medium" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent"
                }
            `}
        >
            <div className="flex items-center gap-3">
                <Icon size={18} className={active ? "text-blue-600" : "text-gray-500"} />
                <span>{label}</span>
            </div>
            {badge && (
                <span className="h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {badge}
                </span>
            )}
        </Link>
    );
}