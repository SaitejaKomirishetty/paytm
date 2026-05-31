'use client';
import type { ReactNode } from 'react';

export interface ButtonProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
}

export const Button = ({ children, onClick, className = '' }: ButtonProps) => (
    <button
        onClick={onClick}
        className={`rounded-md bg-blue-1000 px-4 py-2 font-medium text-white transition-opacity hover:opacity-90 ${className}`}
    >
        {children}
    </button>
);
