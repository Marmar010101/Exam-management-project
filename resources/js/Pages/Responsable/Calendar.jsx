import React from 'react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { CalendarDays, ArrowLeft } from 'lucide-react';

export default function Calendar({ exams }) {
    return (
        <AuthenticatedLayout>
            <Head title="Calendar" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <Link
                            href={route('responsable.dashboard')}
                            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Link>
                    </div>

                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <div className="flex items-center mb-6">
                            <CalendarDays className="h-8 w-8 text-blue-600 mr-3" />
                            <h1 className="text-2xl font-bold text-gray-900">Exam Calendar</h1>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h3 className="text-lg font-medium text-blue-900 mb-2">Calendar View</h3>
                            <p className="text-blue-700">
                                This page displays all scheduled exams in a calendar format. 
                                The calendar component will be implemented here with full scheduling capabilities.
                            </p>
                            
                            <div className="mt-4">
                                <h4 className="font-medium text-blue-900">Current Exams ({exams.length})</h4>
                                <div className="mt-2 space-y-2">
                                    {exams.map(exam => (
                                        <div key={exam.id} className="bg-white p-3 rounded border border-blue-200">
                                            <div className="font-medium text-gray-900">{exam.title}</div>
                                            <div className="text-sm text-gray-600">
                                                {new Date(exam.start).toLocaleDateString()} - {exam.extendedProps.group}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Room: {exam.extendedProps.room} | Type: {exam.extendedProps.type}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
