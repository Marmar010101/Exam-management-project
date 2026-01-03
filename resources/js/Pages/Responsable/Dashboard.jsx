import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ResponsableDashboard() {
    return (
        <AuthenticatedLayout header="Tableau de Bord - Responsable">
            <Head title="Dashboard Responsable" />
            
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-xl font-semibold mb-4">Gestion des salles</h3>
                    {/* Contenu spécifique responsable */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}