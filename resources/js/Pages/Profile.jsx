import React, { useState, useEffect } from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
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
    Shield,
    Users,
    GraduationCap,
    Building
} from 'lucide-react';

export default function Profile() {
    const { auth, darkMode: initialDarkMode = false } = usePage().props;
    const user = auth.user;
    const [darkMode, setDarkMode] = useState(initialDarkMode);
    const [activeTab, setActiveTab] = useState('profile');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isAdmin, setIsAdmin] = useState(user.role === 'headdepartment');

    // États pour les formulaires
    const [profileForm, setProfileForm] = useState({
        name: user.name || '',
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

    // Gérer la soumission du profil
    const handleProfileSubmit = (e) => {
        e.preventDefault();
        console.log('Profile submitted:', profileForm);
    };

    // Gérer la soumission du mot de passe
    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        console.log('Password change submitted:', passwordForm);
        setShowPasswordModal(false);
        setPasswordForm({
            current_password: '',
            new_password: '',
            new_password_confirmation: '',
        });
    };

    // Gérer le changement de photo
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoForm({ profile_photo: file });
        }
    };

    const handlePhotoSubmit = (e) => {
        e.preventDefault();
        console.log('Photo change submitted:', photoForm);
        setShowPhotoModal(false);
        setPhotoForm({ profile_photo: null });
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
                                <p className="text-sm text-gray-500">Level</p>
                                <p className="font-medium">{user.level?.name || 'Not specified'}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <BookOpen className="text-blue-500" size={20} />
                            <div>
                                <p className="text-sm text-gray-500">Specialty</p>
                                <p className="font-medium">{user.speciality?.name || 'Not specified'}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Users className="text-blue-500" size={20} />
                            <div>
                                <p className="text-sm text-gray-500">Group</p>
                                <p className="font-medium">{user.group || 'Not specified'}</p>
                            </div>
                        </div>
                    </div>
                );
            case 'teacher':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <Building className="text-green-500" size={20} />
                            <div>
                                <p className="text-sm text-gray-500">Department</p>
                                <p className="font-medium">{user.department || 'Not specified'}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <BookOpen className="text-green-500" size={20} />
                            <div>
                                <p className="text-sm text-gray-500">Specialty</p>
                                <p className="font-medium">{user.speciality || 'Not specified'}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Award className="text-green-500" size={20} />
                            <div>
                                <p className="text-sm text-gray-500">Grade</p>
                                <p className="font-medium">{user.grade || 'Not specified'}</p>
                            </div>
                        </div>
                    </div>
                );
            case 'responsable':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <Building className="text-purple-500" size={20} />
                            <div>
                                <p className="text-sm text-gray-500">Department</p>
                                <p className="font-medium">{user.department || 'Not specified'}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Shield className="text-purple-500" size={20} />
                            <div>
                                <p className="text-sm text-gray-500">Responsibility</p>
                                <p className="font-medium">{user.responsibility || 'Not specified'}</p>
                            </div>
                        </div>
                    </div>
                );
            case 'headdepartment':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <Shield className="text-red-500" size={20} />
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
                                {isAdmin && (
                                    <button
                                        onClick={() => setActiveTab('admin')}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                            activeTab === 'admin'
                                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <Shield size={16} />
                                            <span>Admin</span>
                                        </div>
                                    </button>
                                )}
                            </nav>
                        </div>

                        {/* Contenu des onglets */}
                        <div className="p-6">
                            {/* Onglet Profil */}
                            {activeTab === 'profile' && (
                                <div className="space-y-6">
                                    {/* Photo de profil */}
                                    <div className="flex items-center space-x-6">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                            </div>
                                            <button
                                                onClick={() => setShowPhotoModal(true)}
                                                className="absolute bottom-0 right-0 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                                            >
                                                <Camera size={14} />
                                            </button>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                                            <p className="text-gray-500 dark:text-gray-400">{user.role}</p>
                                        </div>
                                    </div>

                                    {/* Informations de base */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3">
                                                <Mail className="text-gray-400" size={20} />
                                                <div>
                                                    <p className="text-sm text-gray-500">Email</p>
                                                    <p className="font-medium">{user.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Phone className="text-gray-400" size={20} />
                                                <div>
                                                    <p className="text-sm text-gray-500">Phone</p>
                                                    <p className="font-medium">{user.phone || 'Not specified'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <Calendar className="text-gray-400" size={20} />
                                                <div>
                                                    <p className="text-sm text-gray-500">Date of Birth</p>
                                                    <p className="font-medium">{user.date_of_birth || 'Not specified'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-3">
                                                <MapPin className="text-gray-400" size={20} />
                                                <div>
                                                    <p className="text-sm text-gray-500">Address</p>
                                                    <p className="font-medium">{user.address || 'Not specified'}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <User className="text-gray-400" size={20} />
                                                <div>
                                                    <p className="text-sm text-gray-500">Gender</p>
                                                    <p className="font-medium">{user.gender || 'Not specified'}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Informations spécifiques au rôle */}
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Academic Information</h3>
                                        {renderRoleSpecificInfo()}
                                    </div>

                                    {/* Bio */}
                                    {user.bio && (
                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Biography</h3>
                                            <p className="text-gray-600 dark:text-gray-300">{user.bio}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Onglet Paramètres */}
                            {activeTab === 'settings' && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Settings</h3>
                                    
                                    <div className="space-y-4">
                                        <button
                                            onClick={() => setShowPasswordModal(true)}
                                            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Lock className="text-gray-400" size={20} />
                                                <span className="font-medium">Change Password</span>
                                            </div>
                                            <span className="text-gray-400">→</span>
                                        </button>

                                        <button
                                            onClick={() => setShowPhotoModal(true)}
                                            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Camera className="text-gray-400" size={20} />
                                                <span className="font-medium">Change Profile Photo</span>
                                            </div>
                                            <span className="text-gray-400">→</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Onglet Admin (seulement pour headdepartment) */}
                            {activeTab === 'admin' && isAdmin && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Administration Panel</h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        As an administrator, you can control all user settings and system configurations.
                                    </p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Link
                                            href={route('admin.users-management')}
                                            className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors block"
                                        >
                                            <Users className="text-blue-500 mb-2" size={24} />
                                            <p className="font-medium">User Management</p>
                                        </Link>
                                        <Link
                                            href={route('admin.system-settings')}
                                            className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors block"
                                        >
                                            <Settings className="text-green-500 mb-2" size={24} />
                                            <p className="font-medium">System Settings</p>
                                        </Link>
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
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handlePhotoSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Select a Photo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            
                            {photoForm.profile_photo && (
                                <div className="text-center">
                                    <img
                                        src={URL.createObjectURL(photoForm.profile_photo)}
                                        alt="Preview"
                                        className="w-32 h-32 rounded-full mx-auto object-cover"
                                    />
                                </div>
                            )}
                            
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPhotoModal(false)}
                                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
