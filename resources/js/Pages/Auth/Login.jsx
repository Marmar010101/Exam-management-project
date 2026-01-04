import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link, useForm } from '@inertiajs/react';
import { LogIn } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        matricule: '',
        password: '',
        remember: false,
    });

    useEffect(() => () => reset('password'), []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Login" />

            <div className="min-h-screen flex items-center justify-center bg-white font-sans">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
                    <div className="flex justify-center mb-6">
                        <ApplicationLogo className="w-24 h-24 text-blue-500" />
                    </div>

                    <h2 className="text-2xl font-bold text-center text-blue-500 mb-2">
                        Sign in to your account
                    </h2>

                    <p className="text-center text-gray-500 mb-8">
                        Examination Management System
                    </p>

                    {status && (
                        <div className="mb-4 text-sm text-green-500 text-center">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <InputLabel htmlFor="matricule" value="Matricule" />
                            <TextInput
                                id="matricule"
                                name="matricule"
                                value={data.matricule}
                                className="mt-1 block w-full"
                                onChange={e => setData('matricule', e.target.value)}
                                required
                                autoFocus
                            />
                            <InputError message={errors.matricule} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                onChange={e => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center text-sm text-gray-500">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={e => setData('remember', e.target.checked)}
                                />
                                <span className="ml-2">Remember me</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-blue-500 hover:text-blue-600 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <PrimaryButton
                            className="w-full justify-center py-3 bg-blue-500 text-white hover:bg-blue-600 transition"
                            disabled={processing}
                        >
                            <LogIn size={20} className="mr-2" />
                            Sign In
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}