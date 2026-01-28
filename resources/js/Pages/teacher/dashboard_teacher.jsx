import React from 'react';
import { Head } from '@inertiajs/react';
import Layout from './Layout';

export default function EnseignantDashboard({ stats, surveillances }) {
  return (
    <Layout>
      <Head title="Enseignant Dashboard" />

      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold">Welcome back, Dr Benani I.</h1>
            <p className="text-sm text-gray-500">Here's your exam schedule and updates for today.</p>
          </div>
        </div>

        {/* Statistiques */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard title="Grades" value={stats.grades} icon="📊" />
          <StatCard title="Exams this week" value={stats.exams} note="+25%" icon="📝" />
          <StatCard title="Assigned Surveillance" value={stats.surveillance} icon="👀" />
          <StatCard title="Avg Attendance" value={`${stats.attendance}%`} icon="📈" />
        </section>

        {/* Surveillance du jour */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Today's Surveillance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {surveillances.map((s, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm border">
                <div className="font-bold text-blue-700">{s.module}</div>
                <div className="text-sm text-gray-500">{s.time}</div>
                <div className="mt-2 text-sm">👥 {s.group}</div>
                <div className="text-sm">🏫 {s.room}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Calendrier des examens */}
        <section>
          <h2 className="text-lg font-semibold mb-3">My Exams</h2>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="grid grid-cols-5 gap-4 text-center text-sm text-gray-600">
              <div>Sat</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Thu</div>
              <div>Fri</div>
            </div>
            <div className="grid grid-cols-5 gap-4 mt-2 text-center">
              <div className="bg-blue-50 rounded p-2">AM</div>
              <div className="bg-blue-50 rounded p-2">PM</div>
              <div className="bg-blue-50 rounded p-2">AM</div>
              <div className="bg-blue-50 rounded p-2">PM</div>
              <div className="bg-blue-50 rounded p-2">AM</div>
            </div>
          </div>
        </section>

        {/* Disponibilité */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Report available time slots</h2>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
              + Add availability
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
}

// Composant Statistique
function StatCard({ title, value, note, icon }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">{value}</div>
        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-xl">
          {icon}
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-600">{title}</div>
      {note && <div className="text-xs text-gray-400">{note}</div>}
    </div>
  );
}
