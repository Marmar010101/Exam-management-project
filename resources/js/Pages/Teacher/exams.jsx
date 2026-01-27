import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Calendar,
    FileText,
    Send,
    AlertTriangle,
    Clock,
    BookOpen
} from 'lucide-react';

export default function TeacherExams({ 
    exams = [],
    user = null 
}) {
    const { flash } = usePage().props;
    const [showDelayModal, setShowDelayModal] = useState(false);
    const [selectedExam, setSelectedExam] = useState(null);

    const handleDelayRequest = (exam) => {
        setSelectedExam(exam);
        setShowDelayModal(true);
    };

    const submitDelayRequest = (e) => {
        e.preventDefault();
        const form = e.target;
        form.submit();
    };

    return (
        <AuthenticatedLayout header="My Exams">
            <Head title="My Exams" />
            
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
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Exams</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">View exams related to your modules</p>
                    </div>
                </div>

                {/* Exams List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Exam List</h3>
                        
                        {exams.length === 0 ? (
                            <div className="text-center py-8">
                                <Calendar className="text-gray-400 dark:text-gray-500 mx-auto mb-3" size={48} />
                                <p className="text-gray-500 dark:text-gray-400">No exams found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
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
                                                Duration
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Group
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Room
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {exams.map((exam) => (
                                            <tr key={exam.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {exam.module}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                                        exam.type === 'normal' 
                                                            ? 'bg-green-100 text-green-800 border-green-200'
                                                            : 'bg-orange-100 text-orange-800 border-orange-200'
                                                    }`}>
                                                        {exam.type === 'normal' ? 'Normal' : 'Rattrapage'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(exam.date).toLocaleDateString('fr-FR')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {exam.duration}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {exam.group}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {exam.room || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button 
                                                        onClick={() => handleDelayRequest(exam)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="Demander changement"
                                                    >
                                                        <Send size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Delay Request Modal */}
                {showDelayModal && selectedExam && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                        <div className="relative top-20 mx-auto p-5 border w-[500px] shadow-lg rounded-xl bg-white">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Demande de changement</h3>
                                <button
                                    onClick={() => setShowDelayModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <AlertTriangle size={20} />
                                </button>
                            </div>

                            <form method="POST" action={route('teacher.requests.store')} onSubmit={submitDelayRequest}>
                                <div className="space-y-4">
                                    <input type="hidden" name="module_id" value={selectedExam.module_id} />
                                    <input type="hidden" name="date" value={selectedExam.date} />
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Type de demande <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="type"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="delay_date">Changement de date</option>
                                            <option value="delay_duration">Changement de durée</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Titre <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            defaultValue={`Demande de modification - ${selectedExam.module}`}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="description"
                                            rows={4}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Veuillez expliquer la raison de votre demande..."
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nouvelle valeur <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="new_duration"
                                            placeholder="ex: 3 heures ou nouvelle date"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Urgence <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="urgency"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="low">Faible</option>
                                            <option value="normal">Normal</option>
                                            <option value="high">Urgent</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowDelayModal(false)}
                                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                                    >
                                        <Send size={16} className="mr-2" />
                                        Envoyer la demande
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
