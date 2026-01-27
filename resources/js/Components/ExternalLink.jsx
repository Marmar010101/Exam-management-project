import React from 'react';
import { Link } from '@inertiajs/react';

const ExternalLink = ({ href, children, className = '', ...props }) => {
    const handleClick = (e) => {
        // Si c'est un lien externe, forcer l'ouverture dans un nouvel onglet
        if (href && (href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto:'))) {
            e.preventDefault();
            window.open(href, '_blank', 'noopener,noreferrer');
        } else {
            // Laisser Inertia gérer les liens internes
        }
    };

    return (
        <Link
            href={href}
            className={className}
            onClick={handleClick}
            target={href && (href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto:')) ? '_blank' : undefined}
            rel={href && (href.startsWith('http') || href.startsWith('//')) ? 'noopener noreferrer' : undefined}
            {...props}
        >
            {children}
        </Link>
    );
};

export default ExternalLink;
