import React from 'react';
import Modal from './Modal';
import { AlertCircle, HelpCircle, AlertTriangle } from 'lucide-react';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Ya, Hapus',
    cancelText = 'Batal',
    type = 'danger', // 'danger' | 'warning' | 'info'
    loading = false
}) => {
    const getIcon = () => {
        switch (type) {
            case 'danger': return <AlertTriangle className="w-8 h-8 text-red-500" />;
            case 'warning': return <HelpCircle className="w-8 h-8 text-yellow-500" />;
            default: return <AlertCircle className="w-8 h-8 text-blue-500" />;
        }
    };

    const getConfirmColor = () => {
        switch (type) {
            case 'danger': return 'bg-red-600 hover:bg-red-700 shadow-red-200';
            case 'warning': return 'bg-yellow-600 hover:bg-yellow-700 shadow-yellow-200';
            default: return 'bg-primary-600 hover:bg-primary-700 shadow-primary-200';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-sm" showCloseButton={false}>
            <div className="text-center space-y-4">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${type === 'danger' ? 'bg-red-50' : type === 'warning' ? 'bg-yellow-50' : 'bg-blue-50'}`}>
                    {getIcon()}
                </div>

                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                    <p className="text-slate-500 leading-relaxed text-sm">
                        {message}
                    </p>
                </div>

                <div className="flex flex-col gap-2 pt-4">
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-2xl text-white font-bold text-sm shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 ${getConfirmColor()}`}
                    >
                        {loading ? 'Processing...' : confirmText}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="w-full py-3 px-4 rounded-2xl text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all active:scale-[0.98]"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
