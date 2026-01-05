import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import { Bell, Menu, User } from 'lucide-react';

export default function AuthenticatedLayout({ children, header }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { auth } = usePage().props;
    const user = auth.user;
    const role = user.role;

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Mode sombre
    useEffect(() => {
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const getDashboardRoute = () => {
        switch(role) {
            case 'headdepartment':
                return route('headdepartment.dashboard');
            case 'teacher':
                return route('teacher.dashboard');
            case 'responsable':
                return route('responsable.dashboard');
            case 'student':
                return route('student.dashboard');
            default:
                return '#';
        }
    };

    const roleLabels = {
        headdepartment: 'Head of Department',
        teacher: 'Teacher',
        responsable: 'Responsible',
        student: 'Student',
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 font-sans">
            <Head title={header || 'Dashboard'} />

            {sidebarOpen && (
                <>
                    <div 
                        className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                    <div className="fixed inset-y-0 left-0 z-50 md:hidden">
                        <Sidebar 
                            role={role} 
                            isMobile={true}
                            onClose={() => setSidebarOpen(false)} 
                        />
                    </div>
                </>
            )}

            <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64">
                <Sidebar role={role} />
            </div>

            <div className="md:pl-64 flex flex-col min-h-screen">
                <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            >
                                <Menu size={24} />
                            </button>
                            
                            <div className="text-lg font-semibold text-black dark:text-white">
                                {header || 'Dashboard'}
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg">
                                <Bell size={20} />
                            </button>

                            <div className="flex items-center space-x-3">
                              <div className="text-right hidden md:block">
                                    <p className="text-sm font-medium text-blue-500 dark:text-blue-400">
                                        {roleLabels[role] || role}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {user.matricule}
                                    </p>
                                </div>
                                <Link
                                    href={route('profile.edit')}
                                    className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                                >
                                    <User size={20} className="text-gray-500 dark:text-gray-400" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>

                <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6">
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Examination Management System &copy; {new Date().getFullYear()}
                    </div>
                </footer>
            </div>
        </div>
    );
}