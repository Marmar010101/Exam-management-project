import React, { useEffect } from 'react';
import { Link, Head } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome() {
    useEffect(() => {
        const darkMode = localStorage.getItem('darkMode') === 'true';
        document.documentElement.classList.toggle('dark', darkMode);
    }, []);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'darkMode') {
                document.documentElement.classList.toggle('dark', e.newValue === 'true');
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <>
            <Head title="Welcome" />

            {/* Background with subtle sky-blue spots */}
            <div className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center font-[Inter] bg-white dark:bg-gray-900 overflow-hidden">

                {/* Decorative background */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-sky-200/30 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-32 right-32 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 right-1/4 w-60 h-60 bg-sky-100/30 rounded-full blur-2xl"></div>
                </div>

                {/* Logo */}
                <div className="mb-14">
                    <ApplicationLogo className="w-44 h-44 text-blue-500" />
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-6xl font-extrabold text-blue-600 tracking-tight mb-6">
                    Examination Management System
                </h1>

                {/* Subtitle (clearer & professional) */}
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-14 leading-relaxed">
                    A smart and efficient platform designed to manage examinations, schedules,
                    classrooms, and academic workflows with precision.
                </p>

                {/* Sign In Button (wider & stronger) */}
                <Link
    href="/login"
    className="
        bg-blue-600 hover:bg-blue-700
        text-white font-semibold
        w-80 py-5
        rounded-2xl
        shadow-lg hover:shadow-xl
        transition-all duration-300
        text-xl tracking-wide
        transform hover:scale-105
    "
>
    Sign In
</Link>

                {/* Debug message */}
                <div className="mt-10 text-sm text-gray-500 dark:text-gray-400">
                    If you're seeing this page instead of login, please clear your browser cache and cookies.
                </div>

            </div>
        </>
    );
}
