import React from 'react';
import { Link } from '@inertiajs/react';

const DesignSystemButton = ({ 
    children, 
    href, 
    onClick, 
    type = 'button', 
    variant = 'primary',
    size = 'md',
    disabled = false,
    className = '',
    icon = null,
    iconPosition = 'left'
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    };
    
    const variantClasses = {
        primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 shadow-sm hover:shadow-md',
        secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500',
        success: 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500 shadow-sm hover:shadow-md',
        warning: 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500 shadow-sm hover:shadow-md',
        danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 shadow-sm hover:shadow-md',
        outline: 'bg-transparent text-blue-600 border border-blue-500 hover:bg-blue-50 focus:ring-blue-500'
    };
    
    const disabledClasses = 'opacity-50 cursor-not-allowed';
    
    const classes = `
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? disabledClasses : ''}
        ${className}
    `.trim();
    
    const iconSpacing = iconPosition === 'left' ? 'mr-2' : 'ml-2';
    
    const content = (
        <>
            {icon && iconPosition === 'left' && <span className={iconSpacing}>{icon}</span>}
            {children}
            {icon && iconPosition === 'right' && <span className={iconSpacing}>{icon}</span>}
        </>
    );
    
    if (href && !disabled) {
        return (
            <Link href={href} className={classes}>
                {content}
            </Link>
        );
    }
    
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={classes}
        >
            {content}
        </button>
    );
};

export default DesignSystemButton;
