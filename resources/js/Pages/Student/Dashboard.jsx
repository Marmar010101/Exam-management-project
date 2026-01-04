import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DesignSystemButton from '@/Components/DesignSystemButton';
import DesignSystemCard from '@/Components/DesignSystemCard';
import { Calendar, BookOpen, Clock, ArrowRight } from 'lucide-react';

export default function StudentDashboard() {
    const { auth } = usePage().props;
    const student = auth.user;

    // Mock data for now
    const stats = {
        totalExams: 12,
        nextExam: {
            module: 'Algorithms and Data Structures',
            date: '15/01/2025',
            time: '09:00',
            room: 'B12'
        },
        modulesCount: 8
    };

    return (
        <AuthenticatedLayout header="Dashboard">
            <Head title="Dashboard - Student" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Welcome message */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 mb-8 text-white">
                        <h1 className="text-2xl font-bold mb-2">
                            Welcome, {student?.name || 'Student'}!
                        </h1>
                        <p className="text-blue-100">
                            Here's a quick overview of your academic situation
                        </p>
                    </div>

                    {/* Statistics cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Total exams card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <BookOpen className="text-blue-600" size={24} />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Exams</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.totalExams}</p>
                                </div>
                            </div>
                        </div>

                        {/* Next exam card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <Clock className="text-orange-600" size={24} />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Next Exam</p>
                                    <p className="text-sm font-bold text-gray-900">{stats.nextExam.module}</p>
                                    <p className="text-xs text-gray-500">{stats.nextExam.date} at {stats.nextExam.time}</p>
                                </div>
                            </div>
                        </div>

                        {/* Enrolled modules card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <BookOpen className="text-green-600" size={24} />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Enrolled Modules</p>
                                    <p className="text-2xl font-bold text-gray-900">{stats.modulesCount}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DesignSystemCard 
                            title="Calendar"
                            description="Check your academic calendar and important dates"
                            color="blue"
                        >
                            <DesignSystemButton 
                                href="/Student/calendar"
                                variant="primary"
                                icon={<Calendar size={20} />}
                                iconPosition="left"
                            >
                                Go to Calendar
                            </DesignSystemButton>
                        </DesignSystemCard>

                        <DesignSystemCard 
                            title="My Exams"
                            description="View the complete list of your exams"
                            color="green"
                        >
                            <DesignSystemButton 
                                href="/Student/my_exams"
                                variant="success"
                                icon={<BookOpen size={20} />}
                                iconPosition="left"
                            >
                                Go to My Exams
                            </DesignSystemButton>
                        </DesignSystemCard>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}