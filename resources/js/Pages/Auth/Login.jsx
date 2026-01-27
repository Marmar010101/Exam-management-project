import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link, useForm } from '@inertiajs/react';
import { LogIn, User, Lock } from 'lucide-react';

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

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 font-sans px-4 py-8">
                {/* Conteneur principal */}
                <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl">
                    
                    {/* En-tête avec logo */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="mb-4">
                            <ApplicationLogo className="w-40 h-40 text-blue-500" />
                        </div>
                        <div className="text-center">
                            <h1 className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                Welcome Back
                            </h1>
                            <p className="text-2xl text-gray-600 dark:text-gray-300">
                                Examination Management System
                            </p>
                        </div>
                    </div>

                    {/* Message de statut */}
                    {status && (
                        <div className="mb-6 p-3 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                            <p className="text-lg text-green-600 dark:text-green-400 text-center">
                                {status}
                            </p>
                        </div>
                    )}

                    {/* Formulaire */}
                    <form onSubmit={submit} className="space-y-8">
                        {/* Champ Matricule */}
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <User size={26} className="text-gray-500 dark:text-gray-400 mr-3" />
                                <InputLabel
  htmlFor="Matricule"
  value="Matricule"
  style={{ 
    fontSize: '1rem',  // taille personnalisée
    fontWeight: 'bold',
    color: '#1F2937'   // gris foncé
  }}
/>
                            </div>
                            <TextInput
                                id="matricule"
                                name="matricule"
                                value={data.matricule}
                                className="mt-1 block w-full px-4 py-1 text-lg rounded-md border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all"
                                onChange={e => setData('matricule', e.target.value)}
                                required
                                autoFocus
                                placeholder="Enter your matricule"
                            />
                            <InputError message={errors.matricule} className="mt-1 text-base" />
                        </div>

                        {/* Champ Password */}
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <Lock size={26} className="text-gray-500 dark:text-gray-400 mr-3" />
                                <InputLabel
  htmlFor="password"
  value="Password"
  style={{ 
    fontSize: '1rem',  // taille personnalisée
    fontWeight: 'bold',
    color: '#1F2937'   // gris foncé
  }}
/>
                            </div>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full px-4 py-1 text-lg rounded-md border border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all"
                                onChange={e => setData('password', e.target.value)}
                                required
                                placeholder="Enter your password"
                            />
                            <InputError message={errors.password} className="mt-1 text-base" />
                        </div>

                        {/* Options */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-2">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={e => setData('remember', e.target.checked)}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm text-gray-800 dark:text-gray-200">Remember me</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        {/* Bouton Sign In réduit */}
                        <PrimaryButton
                            className="
                                w-full flex justify-center items-center
                                py-2.5
                                bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                                text-white text-lg font-bold
                                rounded-[35px]
                                shadow-md hover:shadow-lg
                                transform hover:scale-[1.02]
                                transition-all duration-300
                            "
                            disabled={processing}
                        >
                            <LogIn size={20} className="mr-2" />
                            {processing ? 'Signing In...' : 'Sign In'}
                        </PrimaryButton>
                    </form>

                    {/* Lien vers contact */}
                    <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-center text-base text-gray-700 dark:text-gray-300">
                            Don't have an account?{' '}
                            <Link
                                href={route('register')}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold hover:underline"
                            >
                                Contact administrator
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}