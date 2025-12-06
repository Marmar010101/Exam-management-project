import React from 'react';
import { Head, router } from '@inertiajs/react';

export default function Dashboard({ status }) {
    return (
        <div>
            <Head title="HeadDepartment Dashboard" />
            <h1>Welcome to HeadDepartment Dashboard</h1>

            {status && <p>{status}</p>}

          
            <button onClick={() => router.get('/')}>
                Go Home
            </button>
        </div>
    );
}
