import React from 'react';
import { Link } from '@inertiajs/react';

const ImprovedLink = ({ href, children, className = '', external = false, ...props }) => {
    const handleClick = (e) => {
        if (external || (href && (href.startsWith('http') || href.startsWith('//') || href.startsWith('mailto:')))) {
            e.preventDefault();
            window.open(href, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <Link
            href={href}
            className={className}
            onClick={handleClick}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            {...props}
        >
            {children}
        </Link>
    );
};

export default ImprovedLink;