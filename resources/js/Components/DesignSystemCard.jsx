import React from 'react';
import { Link } from '@inertiajs/react';

const DesignSystemCard = ({ 
    children, 
    title, 
    description, 
    icon = null, 
    href = null, 
    color = 'blue',
    hover = true,
    className = '',
    padding = 'p-6'
}) => {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        orange: 'bg-orange-100 text-orange-600',
        purple: 'bg-purple-100 text-purple-600',
        red: 'bg-red-100 text-red-600',
        gray: 'bg-gray-100 text-gray-600'
    };
    
    const hoverClasses = hover ? 'hover:shadow-md hover:border-blue-200 transition-all duration-200' : '';
    
    const baseClasses = `bg-white rounded-xl shadow-sm border border-gray-200 ${padding} ${hoverClasses}`;
    
    const CardContent = (
        <>
            {icon && (
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses[color]} mb-4`}>
                    {icon}
                </div>
            )}
            {title && (
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {title}
                </h3>
            )}
            {description && (
                <p className="text-gray-600 mb-4">
                    {description}
                </p>
            )}
            {children}
        </>
    );
    
    const cardClasses = `${baseClasses} ${className}`.trim();
    
    if (href) {
        return (
            <Link href={href} className={cardClasses}>
                {CardContent}
            </Link>
        );
    }
    
    return (
        <div className={cardClasses}>
            {CardContent}
        </div>
    );
};

export default DesignSystemCard;
