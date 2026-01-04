import { Link, Head } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />

            <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center font-sans">

                {/* Logo */}
                <div className="mb-12">
                    <ApplicationLogo className="w-40 h-40 text-blue-500" />
                </div>
               
                {/* Titre */}
                <h1 className="text-5xl md:text-6xl font-bold text-blue-500 tracking-wide mb-4">
                    Examination Management System
                </h1>

                {/* Sous-titre */}
                <p className="text-lg md:text-xl text-gray-500 max-w-2xl mb-12">
                    A smart and efficient platform for managing exams, schedules, and classrooms
                </p>

                {/* Bouton de connexion */}
                <Link
                    href={route('login')}
                    className="bg-blue-500 text-white font-semibold px-8 py-3 rounded-lg shadow hover:bg-blue-600 transition"
                >
                    Sign In
                </Link>

            </div>
        </>
    );
}