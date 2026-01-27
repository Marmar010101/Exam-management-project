import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import Notifications from '@/Components/Notifications';
import { Bell, Menu, User } from 'lucide-react';

export default function AuthenticatedLayout({ children, header }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { auth } = usePage().props;
    const user = auth.user;
    const role = user.role;

    // Debug: Afficher le rôle détecté
    console.log('AuthenticatedLayout - User role:', role);
    console.log('AuthenticatedLayout - User:', user);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Mode sombre - amélioré avec synchronisation
    useEffect(() => {
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    // Écouter les changements de mode sombre depuis d'autres composants
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'darkMode') {
                if (e.newValue === 'true') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const getDashboardRoute = () => {
        switch(role) {
            case 'headdepartment':
                return '/HeadDepartment/Dashboard';
            case 'teacher':
                return '/Teacher/Dashboard';
            case 'responsable':
                return '/Responsable/Dashboard';
            case 'student':
                return '/Student/Dashboard';
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
                <header className="
  sticky top-0 z-30
  bg-white/80 dark:bg-gray-800/80
  backdrop-blur-sm
  border-b border-gray-200/50 dark:border-gray-700/50
">


                    <div className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            >
                                <Menu size={24} />
                            </button>
                            
                            <div className="text-xl font-semibold text-black dark:text-white font-inter tracking-tight">
    {header || 'Dashboard'}
</div>

                        </div>

                        <div className="flex items-center space-x-4">
                            <Notifications />
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
  href="/profile"
  className="
    w-10 h-10 flex items-center justify-center
    rounded-full bg-gray-100 dark:bg-gray-700
    hover:bg-gray-200 dark:hover:bg-gray-600
    transition-colors duration-200
  "
>
  <User size={18} className="text-gray-600 dark:text-gray-300" />
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