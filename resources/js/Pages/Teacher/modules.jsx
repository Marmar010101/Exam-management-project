import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    BookOpen,
    AlertTriangle
} from 'lucide-react';

export default function TeacherModules({ 
    modules = [],
    user = null 
}) {
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout header="Mes Modules">
            <Head title="Mes Modules" />
            
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Success Message */}
                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                        {flash.success}
                    </div>
                )}

                {/* Header */}
                <div className="mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Mes Modules</h2>
                        <p className="text-gray-600 mt-1">Consultez les modules qui vous sont assignés</p>
                    </div>
                </div>

                {/* Modules Grid */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Liste des modules</h3>
                        
                        {modules.length === 0 ? (
                            <div className="text-center py-8">
                                <BookOpen className="text-gray-400 mx-auto mb-3" size={48} />
                                <p className="text-gray-500">Aucun module assigné</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {modules.map((module) => (
                                    <div key={module.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 bg-blue-100 rounded-lg">
                                                <BookOpen className="text-blue-600" size={24} />
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                module.semester % 2 === 1 
                                                    ? 'bg-green-100 text-green-800 border-green-200'
                                                    : 'bg-purple-100 text-purple-800 border-purple-200'
                                            }`}>
                                                S{module.semester}
                                            </span>
                                        </div>
                                        <h4 className="font-semibold text-gray-900 mb-2">{module.name}</h4>
                                        <p className="text-sm text-gray-600 mb-1">Code: {module.code}</p>
                                        <p className="text-sm text-gray-600 mb-1">Spécialité: {module.speciality}</p>
                                        <p className="text-sm text-gray-600 mb-1">Niveau: {module.level}</p>
                                        <p className="text-sm text-gray-500">Crédits: {module.credits || '6'}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <BookOpen className="text-blue-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Modules</p>
                                <p className="text-2xl font-bold text-gray-900">{modules.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <AlertTriangle className="text-green-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Semestres Impairs</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {modules.filter(m => m.semester % 2 === 1).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-lg">
                                <AlertTriangle className="text-purple-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Semestres Pairs</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {modules.filter(m => m.semester % 2 === 0).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
