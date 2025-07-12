
import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ href, children, className = '', ...props }) => {
    return (
        <Link
            to={href}
            className={`inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${className}`}
            {...props}
        >
            {children}
        </Link>
    );
};

export default Button;
