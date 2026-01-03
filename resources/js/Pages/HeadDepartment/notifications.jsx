import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function SallesNotifications() {
  return (
    <AuthenticatedLayout header="SALLESNOTIFICATIONS">
      <Head title="SALLESNOTIFICATIONS" />
      <div className="text-gray-700 text-lg">
        NOTIFICATIONS – page de test
      </div>
    </AuthenticatedLayout>
  );
}
