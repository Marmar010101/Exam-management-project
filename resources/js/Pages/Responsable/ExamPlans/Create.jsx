import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Calendar,
    Clock,
    Save,
    X,
    ChevronLeft,
    AlertCircle
} from 'lucide-react';

export default function ExamPlansCreate({ groups = [], modules = [], teachers = [], rooms = [], examTypes = [] }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        group_id: '',
        module_id: '',
        teacher_id: '',
        room_id: '',
        exam_type: '',
        exam_date: '',
        start_time: '',
        end_time: '',
        duration_minutes: 60,
        description: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('responsable.exam-plans.store'), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout header="Create Exam Plan - Responsible">
            <Head title="Create Exam Plan - Responsible" />
            
            <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <Link
                            href={route('responsable.exam-plans.index')}
                            className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Back to Exam Plans
                        </Link>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Create New Exam Plan</h1>
                        <p className="text-gray-600 mt-1">Fill in details to create a new exam plan for validation</p>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Group <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.group_id}
                                    onChange={(e) => setData('group_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select Group</option>
                                    {groups.map((group) => (
                                        <option key={group.id} value={group.id}>
                                            {group.name} - {group.level?.name || 'General'} - {group.speciality?.name || 'No Speciality'}
                                        </option>
                                    ))}
                                </select>
                                {errors.group_id && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.group_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Module <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.module_id}
                                    onChange={(e) => setData('module_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select Module</option>
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

                        {/* Assignment Information */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Teacher
                                </label>
                                <select
                                    value={data.teacher_id}
                                    onChange={(e) => setData('teacher_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Teacher (Optional)</option>
                                    {teachers.map((teacher) => (
                                        <option key={teacher.id} value={teacher.id}>
                                            {teacher.first_name} {teacher.last_name} - {teacher.speciality}
                                        </option>
                                    ))}
                                </select>
                                {errors.teacher_id && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.teacher_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Room
                                </label>
                                <select
                                    value={data.room_id}
                                    onChange={(e) => setData('room_id', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Select Room (Optional)</option>
                                    {rooms.map((room) => (
                                        <option key={room.id} value={room.id}>
                                            {room.name} - Capacity: {room.capacity}
                                        </option>
                                    ))}
                                </select>
                                {errors.room_id && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.room_id}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Exam Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.exam_type}
                                    onChange={(e) => setData('exam_type', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select Exam Type</option>
                                    {examTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                {errors.exam_type && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.exam_type}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Schedule Information */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Exam Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={data.exam_date}
                                    onChange={(e) => setData('exam_date', e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.exam_date && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.exam_date}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    value={data.start_time}
                                    onChange={(e) => setData('start_time', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.start_time && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.start_time}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    value={data.end_time}
                                    onChange={(e) => setData('end_time', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.end_time && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.end_time}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Duration (minutes) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.duration_minutes}
                                    onChange={(e) => setData('duration_minutes', e.target.value)}
                                    min="30"
                                    max="240"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.duration_minutes && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.duration_minutes}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Additional information about the exam..."
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" />
                                        {errors.description}
                                    </p>
                                )}
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                            <Link
                                href={route('responsable.exam-plans.index')}
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
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Create Exam Plan
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
