import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function RoleBasedLayout({ children }) {
  const { auth } = usePage().props;
  const user = auth.user || {};
  const [notifOpen, setNotifOpen] = useState(false);

  // menu par rôle
  const menuByRole = {
    headdepartment: [
      { label: "Dashboard", href: route('headdepartment.dashboard') },
      { label: "Gestion des comptes", href: route('headdepartment.gestion-comptes') },
      { label: "Plans des examens", href: route('headdepartment.examain') },
      { label: "Demandes enseignants", href: route('headdepartment.demande-enseignant') },
      { label: "Modules", href: route('headdepartment.module') },
      { label: "Salles", href: route('headdepartment.salle') },
    ],
    teacher: [
      { label: "Dashboard", href: route('teacher.dashboard') },
    ],
    responsable: [
      { label: "Dashboard", href: route('responsable.dashboard') },
    ],
    student: [
      { label: "Dashboard", href: route('student.dashboard') },
    ],
  };

  const role = user.role || 'student';
  const menuItems = menuByRole[role] || menuByRole['student'];

  // Fonction pour gérer les liens de notification par rôle
  const getNotificationRoute = () => {
    switch(role) {
      case 'headdepartment':
        return route('headdepartment.notifications');
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <ApplicationLogo className="w-10 h-10" />
            <div>
              <div className="text-sm font-semibold">Exam Management</div>
              <div className="text-xs text-gray-500 capitalize">{role}</div>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg transition text-gray-700 hover:bg-gray-50 hover:text-blue-700"
              >
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1">
        {/* HEADER */}
        <header className="w-full border-b bg-white">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-lg font-medium text-gray-800">Tableau de bord</div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications - Affichage conditionnel selon rôle */}
              {(role === 'headdepartment' || getNotificationRoute()) && (
                <div className="relative">
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="relative p-2 rounded-full bg-white border shadow-sm hover:shadow-md transition"
                  >
                    <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs bg-red-500 text-white rounded-full">2</span>
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-lg shadow-xl border z-50">
                      <div className="px-4 py-3 border-b font-medium">Notifications</div>
                      <div className="p-4 text-sm text-gray-600">Aucune notification réelle (mock)</div>
                      <div className="p-2 border-t">
                        <Link 
                          href={getNotificationRoute()} 
                          className="block text-center text-sm text-blue-600 py-2"
                        >
                          Voir toutes
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Profile */}
              <Link href={route('profile.edit')} className="flex items-center gap-3 p-1 rounded-full hover:bg-gray-50 transition">
                <img src={user.avatar || '/images/default-avatar.png'} alt="avatar" className="w-9 h-9 rounded-full object-cover border" />
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-800">
                    {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : 'Utilisateur'}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">{role || ''}</div>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}