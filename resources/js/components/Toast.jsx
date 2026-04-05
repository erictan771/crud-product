import React, { useEffect, useState } from 'react';

export default function Toast({ message, type = 'success' }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        const t = setTimeout(() => setVisible(true), 10);
        return () => clearTimeout(t);
    }, []);

    const styles = {
        success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
        error:   'border-red-500/30 bg-red-500/10 text-red-400',
    };

    const icons = {
        success: (
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
        ),
        error: (
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
        ),
    };

    return (
        <div
            id="toast-notification"
            className={`fixed bottom-6 right-6 z-[99] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl text-sm font-medium backdrop-blur max-w-xs transition-all duration-300 ${styles[type]} ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
        >
            {icons[type]}
            <span>{message}</span>
        </div>
    );
}
