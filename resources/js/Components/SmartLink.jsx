import React from 'react';
import { Link } from '@inertiajs/react';

const SmartLink = ({ href, children, className = '', external = false, ...props }) => {
    const handleClick = (e) => {
        // Si c'est un lien externe, forcer l'ouverture dans un nouvel onglet
        if (external || (href && (href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto:')))) {
            e.preventDefault();
            window.open(href, '_blank', 'noopener,noreferrer');
        }
        // Sinon, laisser Inertia gérer la navigation interne
    };

    return (
        <Link
            href={href}
            className={className}
            onClick={handleClick}
            {...props}
        >
            {children}
        </Link>
    );
};

export default SmartLink;
