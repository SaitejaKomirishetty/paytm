import type { ReactNode } from 'react';

export interface CardProps {
    title?: string;
    children: ReactNode;
    className?: string;
}

export const Card = ({ title, children, className = '' }: CardProps) => (
    <div className={`rounded-lg border border-gray-200 p-4 shadow-sm ${className}`}>
        {title ? <h3 className="mb-2 text-lg font-semibold">{title}</h3> : null}
        {children}
    </div>
);
