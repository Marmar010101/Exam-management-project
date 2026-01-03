import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    Settings, 
    Database, 
    Shield, 
    Bell, 
    Mail, 
    Globe, 
    Clock,
    Users,
    FileText,
    HardDrive,
    Wifi,
    Lock,
    Key,
    Eye,
    Download,
    Upload
} from 'lucide-react';

export default function SystemSettings() {
    return (
        <AuthenticatedLayout header="System Settings">
            <Head title="System Settings" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h2>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">
                                Configure and manage system-wide settings and preferences
                            </p>
                        </div>

                        <div className="p-6 space-y-8">
                            {/* General Settings */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                    <Settings className="mr-2" size={20} />
                                    General Settings
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                System Name
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="Examination Management System"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                System Language
                                            </label>
                                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                <option>English</option>
                                                <option>French</option>
                                                <option>Arabic</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Timezone
                                            </label>
                                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                <option>UTC+0 (London)</option>
                                                <option>UTC+1 (Paris)</option>
                                                <option>UTC+2 (Cairo)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Academic Year
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="2024-2025"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Semester
                                            </label>
                                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                                                <option>Fall Semester</option>
                                                <option>Spring Semester</option>
                                                <option>Summer Semester</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Institution Name
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="University of Sciences"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Security Settings */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                    <Shield className="mr-2" size={20} />
                                    Security Settings
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Require 2FA for all users</p>
                                            </div>
                                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                                                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1"></span>
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">Password Expiry</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Force password change every 90 days</p>
                                            </div>
                                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500">
                                                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">Session Timeout</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Auto-logout after 30 minutes</p>
                                            </div>
                                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500">
                                                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Minimum Password Length
                                            </label>
                                            <input
                                                type="number"
                                                defaultValue="8"
                                                min="6"
                                                max="20"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Maximum Login Attempts
                                            </label>
                                            <input
                                                type="number"
                                                defaultValue="5"
                                                min="3"
                                                max="10"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Account Lockout Duration (minutes)
                                            </label>
                                            <input
                                                type="number"
                                                defaultValue="15"
                                                min="5"
                                                max="60"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notification Settings */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                    <Bell className="mr-2" size={20} />
                                    Notification Settings
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Send email alerts</p>
                                            </div>
                                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500">
                                                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">Exam Reminders</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Notify before exams</p>
                                            </div>
                                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500">
                                                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">System Maintenance</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Alert about maintenance</p>
                                            </div>
                                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500">
                                                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Default Email Address
                                            </label>
                                            <input
                                                type="email"
                                                defaultValue="admin@university.edu"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                SMTP Server
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="smtp.university.edu"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                SMTP Port
                                            </label>
                                            <input
                                                type="number"
                                                defaultValue="587"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Database Settings */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                                    <Database className="mr-2" size={20} />
                                    Database Settings
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Database Host
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="localhost"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Database Name
                                            </label>
                                            <input
                                                type="text"
                                                defaultValue="exam_management"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Connection Timeout (seconds)
                                            </label>
                                            <input
                                                type="number"
                                                defaultValue="30"
                                                min="5"
                                                max="120"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">Auto Backup</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Daily automatic backup</p>
                                            </div>
                                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500">
                                                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">Query Logging</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Log all database queries</p>
                                            </div>
                                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                                                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1"></span>
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">Connection Pooling</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Enable connection pooling</p>
                                            </div>
                                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-500">
                                                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <button className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                                    Cancel
                                </button>
                                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                    Save Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
