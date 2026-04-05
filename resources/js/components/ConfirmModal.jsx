import React from 'react';

export default function ConfirmModal({ product, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel}/>

            {/* Modal */}
            <div className="relative w-full max-w-sm bg-gray-900 border border-gray-700/60 rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-6 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                        </svg>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1">Hapus Produk?</h3>
                    <p className="text-sm text-gray-400 mb-1">Anda akan menghapus produk:</p>
                    <p className="text-sm font-semibold text-red-400 capitalize mb-4">"{product.name}"</p>
                    <p className="text-xs text-gray-500 mb-6">Tindakan ini tidak dapat dibatalkan.</p>

                    <div className="flex gap-3">
                        <button
                            id="btn-cancel-delete"
                            onClick={onCancel}
                            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-200 border border-gray-700 hover:bg-gray-800 transition-all"
                        >
                            Batal
                        </button>
                        <button
                            id="btn-confirm-delete"
                            onClick={onConfirm}
                            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-500 text-white transition-all shadow-lg hover:shadow-red-500/25"
                        >
                            Ya, Hapus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
