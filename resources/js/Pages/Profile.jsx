import React, { useState, useEffect } from 'react';
import { Head, usePage, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
    User, 
    Mail, 
    Phone, 
    Calendar, 
    MapPin, 
    BookOpen, 
    Award, 
    Settings, 
    Camera, 
    Moon, 
    Sun,
    Lock,
    Eye,
    EyeOff,
    Save,
    X,
    GraduationCap,
    Building,
    LogOut
} from 'lucide-react';

export default function Profile() {
    const { auth, darkMode: initialDarkMode = false } = usePage().props;
    const user = auth.user || {};
    const [darkMode, setDarkMode] = useState(initialDarkMode);
    const [activeTab, setActiveTab] = useState('profile');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
    // États pour les formulaires
    const [profileForm, setProfileForm] = useState({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        date_of_birth: user.date_of_birth || '',
        gender: user.gender || '',
    });

    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    const [photoForm, setPhotoForm] = useState({
        profile_photo: null,
    });

    // Appliquer le mode sombre
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    // Toggle mode sombre
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // Gérer la soumission du profil (désactivé - lecture seule)
    const handleProfileSubmit = (e) => {
        e.preventDefault();
        // Les informations du profil ne sont pas modifiables
        setErrorMessage('Profile information is read-only. Only password and photo can be changed.');
        setTimeout(() => setErrorMessage(''), 3000);
    };
    
    // Reset form (désactivé)
    const handleResetForm = () => {
        // Non applicable en mode lecture seule
    };

    // Gérer la soumission du mot de passe
    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        
        // Utiliser Inertia pour soumettre le formulaire
        router.post(route('profile.password.update'), passwordForm, {
            onSuccess: () => {
                setShowPasswordModal(false);
                setPasswordForm({
                    current_password: '',
                    new_password: '',
                    new_password_confirmation: '',
                });
                setSuccessMessage('Password updated successfully!');
                setErrorMessage('');
                setTimeout(() => setSuccessMessage(''), 3000);
            },
            onError: (errors) => {
                setErrorMessage('Error updating password. Please check your current password.');
                setSuccessMessage('');
                setTimeout(() => setErrorMessage(''), 3000);
            }
        });
    };

    // Gérer le changement de photo
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoForm({ profile_photo: file });
        }
    };
    
    // Reset photo
    const handleResetPhoto = () => {
        setPhotoForm({ profile_photo: null });
        const preview = document.querySelector('#photo-preview');
        if (preview) {
            preview.src = '';
        }
    };

    const handlePhotoSubmit = (e) => {
        e.preventDefault();
        
        // Utiliser Inertia pour soumettre le formulaire
        const formData = new FormData();
        if (photoForm.profile_photo) {
            formData.append('profile_photo', photoForm.profile_photo);
        }
        
        router.post(route('profile.photo.update'), formData, {
            onSuccess: () => {
                setShowPhotoModal(false);
                setPhotoForm({ profile_photo: null });
                setSuccessMessage('Profile photo updated successfully!');
                setErrorMessage('');
                setTimeout(() => setSuccessMessage(''), 3000);
            },
            onError: (errors) => {
                setErrorMessage('Error uploading photo. Please try again.');
                setSuccessMessage('');
                setTimeout(() => setErrorMessage(''), 3000);
            }
        });
    };

    // Rendu des informations spécifiques au rôle
    const renderRoleSpecificInfo = () => {
        switch (user.role) {
            case 'student':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <GraduationCap className="text-blue-500" size={20} />
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Academic Information</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Student ID: {user.matricule || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            case 'teacher':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <BookOpen className="text-green-500" size={20} />
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Academic Information</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Teacher ID: {user.matricule || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            case 'responsable':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <Award className="text-purple-500" size={20} />
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Academic Information</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Responsible ID: {user.matricule || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            case 'headdepartment':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <Building className="text-red-500" size={20} />
                            <div>
                                <p className="text-sm text-gray-500">Role</p>
                                <p className="font-medium">Head of Department</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Building className="text-red-500" size={20} />
                            <div>
                                <p className="text-sm text-gray-500">Department</p>
                                <p className="font-medium">{user.department || 'Computer Science'}</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <AuthenticatedLayout header="Profile">
            <Head title="Profile" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Messages de succès/erreur */}
                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <p className="text-green-700 dark:text-green-400">{successMessage}</p>
                        </div>
                    )}
                    
                    {errorMessage && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-red-700 dark:text-red-400">{errorMessage}</p>
                        </div>
                    )}

                    {/* Toggle Mode Sombre */}
                    <div className="flex justify-end mb-6">
                        <button
                            onClick={toggleDarkMode}
                            className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            {darkMode ? <Sun className="text-yellow-500" size={20} /> : <Moon className="text-gray-600" size={20} />}
                        </button>
                    </div>

                    {/* Navigation par onglets */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="border-b border-gray-200 dark:border-gray-700">
                            <nav className="flex space-x-8 px-6" aria-label="Tabs">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'profile'
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <User size={16} />
                                        <span>Profile</span>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === 'settings'
                                            ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center space-x-2">
                                        <Settings size={16} />
                                        <span>Settings</span>
                                    </div>
                                </button>
                            </nav>
                        </div>

                        {/* Contenu des onglets */}
                        <div className="p-6">
                            {/* Onglet Profil */}
                            {activeTab === 'profile' && (
                                <div className="space-y-6">
                                    {/* En-tête avec photo et informations de base */}
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                                                {user.first_name && user.last_name ? 
                                                    `${user.first_name.charAt(0).toUpperCase()}${user.last_name.charAt(0).toUpperCase()}` : 
                                                    user.name ? user.name.charAt(0).toUpperCase() : 'U'
                                                }
                                            </div>
                                            <button
                                                onClick={() => setShowPhotoModal(true)}
                                                className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                                                title="Change profile photo"
                                            >
                                                <Camera size={14} />
                                            </button>
                                        </div>
                                        <div className="flex-1 text-center sm:text-left">
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {user.first_name && user.last_name ? 
                                                    `${user.first_name} ${user.last_name}` : 
                                                    user.name || 'User Name'
                                                }
                                            </h2>
                                            <p className="text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                                            <div className="mt-2">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                                    Read-only profile
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Informations personnelles (lecture seule) */}
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center space-x-3">
                                                    <Mail className="text-gray-400" size={20} />
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">{user.email}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <Phone className="text-gray-400" size={20} />
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">{user.phone || 'Not specified'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <Calendar className="text-gray-400" size={20} />
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Date of Birth</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">{user.date_of_birth || 'Not specified'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex items-center space-x-3">
                                                    <MapPin className="text-gray-400" size={20} />
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                                                        <p className="font-medium text-gray-900 dark:text-white">{user.address || 'Not specified'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <User className="text-gray-400" size={20} />
                                                    <div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                                                        <p className="font-medium text-gray-900 dark:text-white capitalize">{user.gender || 'Not specified'}</p>
                                                    </div>
                                                </div>
                                                {user.bio && (
                                                    <div className="flex items-start space-x-3">
                                                        <div className="w-5 h-5 mt-0.5 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                                            <span className="text-xs text-gray-600 dark:text-gray-300">i</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">Bio</p>
                                                            <p className="font-medium text-gray-900 dark:text-white">{user.bio}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Informations spécifiques au rôle */}
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Academic Information</h3>
                                        {renderRoleSpecificInfo()}
                                    </div>
                                </div>
                            )}

                            {/* Onglet Paramètres */}
                            {activeTab === 'settings' && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Settings</h3>
                                    
                                    <div className="space-y-4">
                                        {/* Changement de mot de passe */}
                                        <button
                                            onClick={() => setShowPasswordModal(true)}
                                            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Lock className="text-gray-400 dark:text-gray-300" size={20} />
                                                <div className="text-left">
                                                    <p className="font-medium text-gray-900 dark:text-white">Change Password</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Update your account password</p>
                                                </div>
                                            </div>
                                            <span className="text-gray-400 dark:text-gray-300">→</span>
                                        </button>

                                        {/* Changement de photo de profil */}
                                        <button
                                            onClick={() => setShowPhotoModal(true)}
                                            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Camera className="text-gray-400 dark:text-gray-300" size={20} />
                                                <div className="text-left">
                                                    <p className="font-medium text-gray-900 dark:text-white">Change Profile Photo</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Upload a new profile picture</p>
                                                </div>
                                            </div>
                                            <span className="text-gray-400 dark:text-gray-300">→</span>
                                        </button>

                                        {/* Mode sombre */}
                                        <div className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                {darkMode ? <Sun className="text-yellow-500" size={20} /> : <Moon className="text-gray-400 dark:text-gray-300" size={20} />}
                                                <div className="text-left">
                                                    <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {darkMode ? 'Light mode is active' : 'Dark mode is active'}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={toggleDarkMode}
                                                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-gray-300 dark:bg-blue-600"
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                        darkMode ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                                />
                                            </button>
                                        </div>

                                        {/* Déconnexion */}
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <LogOut className="text-red-600 dark:text-red-400" size={20} />
                                                <div className="text-left">
                                                    <p className="font-medium text-red-700 dark:text-red-400">Logout</p>
                                                    <p className="text-sm text-red-600 dark:text-red-400">Sign out of your account</p>
                                                </div>
                                            </div>
                                            <span className="text-red-600 dark:text-red-400">→</span>
                                        </Link>
                                    </div>

                                    {/* Informations de sécurité */}
                                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                        <div className="flex items-start space-x-3">
                                            <Lock className="text-blue-500 dark:text-blue-400 mt-0.5" size={18} />
                                            <div>
                                                <p className="text-sm font-medium text-blue-900 dark:text-blue-400">Security Information</p>
                                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                                                    For security reasons, profile information (name, email, role, etc.) is read-only. 
                                                    Only password and profile photo can be modified by users.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            </div>
                    </div>
                </div>
            </div>

            {/* Modal Changement de mot de passe */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Change Password</h3>
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={passwordForm.current_password}
                                        onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-2.5 text-gray-400"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={passwordForm.new_password}
                                        onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-2.5 text-gray-400"
                                    >
                                        {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.new_password_confirmation}
                                    onChange={(e) => setPasswordForm({...passwordForm, new_password_confirmation: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    <Save size={16} className="inline mr-2" />
                                    Change
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Changement de photo */}
            {showPhotoModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Change Profile Photo</h3>
                            <button
                                onClick={() => setShowPhotoModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handlePhotoSubmit} className="space-y-4">
                            {/* Preview actuel */}
                            <div className="text-center">
                                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                                    {photoForm.profile_photo ? (
                                        <img 
                                            id="photo-preview"
                                            src={URL.createObjectURL(photoForm.profile_photo)} 
                                            alt="Preview" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        user.first_name && user.last_name ? 
                                            `${user.first_name.charAt(0).toUpperCase()}${user.last_name.charAt(0).toUpperCase()}` : 
                                            user.name ? user.name.charAt(0).toUpperCase() : 'U'
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    {photoForm.profile_photo ? 'New Photo Preview' : 'Current Photo'}
                                </p>
                            </div>
                            
                            {/* Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Select a Photo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Allowed formats: JPG, PNG, GIF. Max size: 5MB
                                </p>
                            </div>
                            
                            {/* Actions */}
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={handleResetPhoto}
                                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                >
                                    Reset Photo
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowPhotoModal(false)}
                                    className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                >
                                    <Save size={16} className="inline mr-2" />
                                    Upload
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
