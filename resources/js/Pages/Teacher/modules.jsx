import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    BookOpen,
    AlertTriangle
} from 'lucide-react';

export default function TeacherModules({ 
    modules = [],
    exams = [],
    auth = {}
}) {
    const { flash } = usePage().props;

    // Sample data for demonstration
    const sampleModules = [
        {
            id: 1,
            module_name: 'Algorithmique',
            code: 'ALG101',
            specialty: { name: 'Informatique' },
            level: { name: 'L2' },
            semester: 'S3'
        },
        {
            id: 2,
            module_name: 'Systèmes d\'Exploitation',
            code: 'OS101',
            specialty: { name: 'Informatique' },
            level: { name: 'L2' },
            semester: 'S4'
        },
        {
            id: 3,
            module_name: 'Bases de Données',
            code: 'DB101',
            specialty: { name: 'Informatique' },
            level: { name: 'L3' },
            semester: 'S5'
        }
    ];

    const sampleExams = [
        {
            id: 1,
            module: { module_name: 'Algorithmique' },
            exam_type: 'Exam',
            exam_date: '2026-01-30',
            room: { room_name: 'A101' },
            status: 'pending'
        },
        {
            id: 2,
            module: { module_name: 'Systèmes d\'Exploitation' },
            exam_type: 'Control',
            exam_date: '2026-02-05',
            room: { room_name: 'B201' },
            status: 'approved'
        },
        {
            id: 3,
            module: { module_name: 'Bases de Données' },
            exam_type: 'Test_TP',
            exam_date: '2026-02-10',
            room: { room_name: 'C301' },
            status: 'pending'
        }
    ];

    // Use real data if available, otherwise use sample data
    const displayModules = modules.length > 0 ? modules : sampleModules;
    const displayExams = exams.length > 0 ? exams : sampleExams;

    return (
        <AuthenticatedLayout header="My Modules & Exams">
            <Head title="My Modules & Exams" />
            
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Success Message */}
                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                        {flash.success}
                    </div>
                )}

                {/* Demo Notice */}
                {modules.length === 0 && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg">
                        <strong>Mode Démo:</strong> Affichage des exemples de modules et examens
                    </div>
                )}

                {/* Header */}
                <div className="mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Modules & Exams</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">View your modules and associated exams</p>
                    </div>
                </div>

                {/* Modules Grid */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Modules ({displayModules.length})</h3>
                        
                        {displayModules.length === 0 ? (
                            <div className="text-center py-8">
                                <BookOpen className="text-gray-400 dark:text-gray-500 mx-auto mb-3" size={48} />
                                <p className="text-gray-500 dark:text-gray-400">No modules assigned</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {displayModules.map((module) => (
                                    <div key={module.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
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
                                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{module.module_name}</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Code: {module.code}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Speciality: {module.specialty?.name || 'N/A'}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Level: {module.level?.name || 'N/A'}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Credits: {module.credits || '6'}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                <BookOpen className="text-blue-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Modules</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{displayModules.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                <AlertTriangle className="text-green-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Odd Semesters</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {displayModules.filter(m => m.semester % 2 === 1).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                <AlertTriangle className="text-purple-600" size={24} />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Even Semesters</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {displayModules.filter(m => m.semester % 2 === 0).length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Exams Section */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Exams ({displayExams.length})</h3>
                        
                        {displayExams.length === 0 ? (
                            <div className="text-center py-8">
                                <AlertTriangle className="text-gray-400 dark:text-gray-500 mx-auto mb-3" size={48} />
                                <p className="text-gray-500 dark:text-gray-400">No exams scheduled for your modules</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Module
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Room
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {displayExams.map((exam) => (
                                            <tr key={exam.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                    {exam.module?.module_name || 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                        exam.exam_type === 'Exam' ? 'bg-blue-100 text-blue-800' :
                                                        exam.exam_type === 'Control' ? 'bg-green-100 text-green-800' :
                                                        'bg-purple-100 text-purple-800'
                                                    }`}>
                                                        {exam.exam_type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {exam.exam_date || 'Not set'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    {exam.room?.room_name || 'Not assigned'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                        exam.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        exam.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        exam.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {exam.status || 'pending'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
