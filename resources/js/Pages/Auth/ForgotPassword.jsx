import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Mail, ArrowLeft, Bell } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 font-sans">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <ApplicationLogo className="w-20 h-20 text-blue-500" />
                    </div>

                    {/* Carte principale */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                        {/* En-tête */}
                        <div className="text-center mb-6">
                            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                                <Mail className="w-8 h-8 text-blue-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                Forgot Your Password?
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                                No problem! Enter your email address below and we'll send a notification to the Head of Department.
                            </p>
                        </div>

                        {/* Message de statut */}
                        {status && (
                            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                <div className="flex items-center">
                                    <Bell className="w-5 h-5 text-green-500 mr-3" />
                                    <p className="text-green-700 dark:text-green-400 text-sm font-medium">{status}</p>
                                </div>
                            </div>
                        )}

                        {/* Formulaire */}
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="email" value="Email Address" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={onHandleChange}
                                    placeholder="Enter your email address"
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="w-5 h-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-blue-700 font-medium">Important Notice</p>
                                        <p className="text-xs text-blue-600 mt-1">
                                            For security reasons, the Head of Department will be notified of this password reset request. 
                                            They will review and approve the reset before you can proceed.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <PrimaryButton
                                className="w-full justify-center py-3 bg-blue-500 text-white hover:bg-blue-600 transition"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending Request...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="w-5 h-5 mr-2" />
                                        Send Reset Request
                                    </>
                                )}
                            </PrimaryButton>
                        </form>

                        {/* Lien de retour */}
                        <div className="mt-6 text-center">
                            <Link
                                href="/login"
                                className="inline-flex items-center text-sm text-blue-500 hover:text-blue-600 hover:underline"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
