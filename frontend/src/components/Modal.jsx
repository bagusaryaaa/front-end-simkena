import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = 'max-w-md',
    showCloseButton = true
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop with blur and fade-in */}
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Container with scale and fade-in */}
            <div className={`bg-white rounded-3xl shadow-2xl w-full ${maxWidth} overflow-hidden z-10 animate-in zoom-in-95 fade-in duration-300 border border-slate-100`}>
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-white">
                        {title && <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>}
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-slate-600 active:scale-90"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
