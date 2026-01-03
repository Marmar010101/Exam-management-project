import React from 'react';

export default function Test() {
    return (
        <div style={{ 
            padding: '50px',
            backgroundColor: '#4CAF50',
            color: 'white',
            textAlign: 'center',
            minHeight: '100vh'
        }}>
            <h1 style={{ fontSize: '48px' }}>✅ INERTIA WORKS!</h1>
            <p style={{ fontSize: '24px', marginTop: '20px' }}>
                If you can see this green page, Inertia is working correctly.
            </p>
            <a 
                href="/modules" 
                style={{
                    display: 'inline-block',
                    marginTop: '30px',
                    padding: '15px 30px',
                    backgroundColor: 'white',
                    color: '#4CAF50',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    fontSize: '18px',
                    fontWeight: 'bold'
                }}
            >
                Go to Modules Page
            </a>
        </div>
    );
}