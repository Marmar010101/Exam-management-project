import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Send,
    Clock,
    Calendar,
    MapPin,
    AlertCircle,
    ChevronLeft,
    Save
} from 'lucide-react';

export default function TeacherRequestCreate({ modules = [], examTypes = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        type: '',
        title: '',
        description: '',
        date: '',
        time: '',
        room: '',
        urgency: 'normal',
        module_id: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('teacher.requests.store'), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout header="Create Request - Teacher">
            <Head title="Create Request - Teacher" />
            
            <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <Link
                            href={route('teacher.requests.index')}
                            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Back to My Requests
                        </Link>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Create New Request</h1>
                        <p className="text-gray-600 mt-1">Submit a request to the administration</p>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Request Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Request Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select Request Type</option>
                                    <option value="absence">Absence</option>
                                    <option value="room_change">Room Change</option>
                                    <option value="time_change">Time Change</option>
                                    <option value="exam_change">Exam Change</option>
                                    <option value="material_request">Material Request</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.type && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.type}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Urgency Level <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.urgency}
                                    onChange={(e) => setData('urgency', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="low">Low</option>
                                    <option value="normal">Normal</option>
                                    <option value="high">High</option>
                                </select>
                                {errors.urgency && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.urgency}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Title and Module */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Brief title of your request"
                                    required
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Related Module
                                </label>
                                <select
                                    value={data.module_id}
                                    onChange={(e) => setData('module_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Module (Optional)</option>
                                    {modules.map((module) => (
                                        <option key={module.id} value={module.id}>
                                            {module.module_name} ({module.code})
                                        </option>
                                    ))}
                                </select>
                                {errors.module_id && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.module_id}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Provide detailed information about your request..."
                                required
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Schedule Information */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.date && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.date}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Time
                                </label>
                                <input
                                    type="time"
                                    value={data.time}
                                    onChange={(e) => setData('time', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.time && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.time}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Room
                                </label>
                                <input
                                    type="text"
                                    value={data.room}
                                    onChange={(e) => setData('room', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Room number or location"
                                />
                                {errors.room && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.room}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                            <Link
                                href={route('teacher.requests.index')}
                                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50"
                            >
                                {processing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4 mr-2" />
                                        Send Request
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
