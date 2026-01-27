import React, { useEffect } from 'react';

export default function GuestLayout({ children }) {
    useEffect(() => {
        const darkMode = localStorage.getItem('darkMode') === 'true';
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    // Écouter les changements de mode sombre
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

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {children}
        </div>
    );
}