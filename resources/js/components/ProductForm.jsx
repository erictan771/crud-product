import React, { useState, useEffect } from 'react';

const PRESET_CATEGORIES = ['Electronics', 'Clothing', 'Food & Beverage', 'Home & Living', 'Sports', 'Books', 'Beauty'];

const INITIAL_FORM = { name: '', description: '', price: '', stock: '', category: '', image_url: '' };

// Memindahkan Field keluar dari ProductForm untuk mencegah kehilangan fokus input
const Field = ({ label, name, value, onChange, error, type = 'text', placeholder, as, children }) => (
    <div>
        <label htmlFor={`field-${name}`} className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">{label}</label>
        {as === 'textarea' ? (
            <textarea
                id={`field-${name}`}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                rows={3}
                className={`w-full px-3.5 py-2.5 bg-gray-800 border rounded-xl text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 transition-all resize-none ${error ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-violet-500 focus:ring-violet-500/20'}`}
            />
        ) : as === 'select' ? (
            <select
                id={`field-${name}`}
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full px-3.5 py-2.5 bg-gray-800 border rounded-xl text-sm text-gray-100 focus:outline-none focus:ring-2 transition-all ${error ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-violet-500 focus:ring-violet-500/20'}`}
            >
                {children}
            </select>
        ) : (
            <input
                id={`field-${name}`}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full px-3.5 py-2.5 bg-gray-800 border rounded-xl text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:ring-2 transition-all ${error ? 'border-red-500 focus:ring-red-500/20' : 'border-gray-700 focus:border-violet-500 focus:ring-violet-500/20'}`}
            />
        )}
        {error && <p className="mt-1 text-xs text-red-400">{Array.isArray(error) ? error[0] : error}</p>}
    </div>
);

export default function ProductForm({ product, categories, onSubmit, onClose }) {
    const isEdit = Boolean(product);
    const [form, setForm]     = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Populate form if edit mode
    useEffect(() => {
        if (product) {
            setForm({
                name:        product.name        || '',
                description: product.description || '',
                price:       product.price       || '',
                stock:       product.stock       || '',
                category:    product.category    || '',
                image_url:   product.image_url   || '',
            });
        }
    }, [product]);

    const allCategories = [...new Set([...PRESET_CATEGORIES, ...categories])].sort();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validate = () => {
        const errs = {};
        if (!form.name.trim())        errs.name     = 'Nama produk wajib diisi.';
        if (!form.price || Number(form.price) < 0) errs.price = 'Harga tidak valid.';
        if (form.stock === '' || Number(form.stock) < 0) errs.stock = 'Stok tidak valid.';
        if (!form.category.trim())    errs.category = 'Kategori wajib dipilih.';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setLoading(true);
        try {
            await onSubmit({
                ...form,
                price: parseFloat(form.price),
                stock: parseInt(form.stock, 10),
                image_url: form.image_url || null,
            }, isEdit);
        } catch (err) {
            if (err?.errors) setErrors(err.errors);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}/>

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-gray-900 border border-gray-700/60 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                            {isEdit ? (
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                                </svg>
                            )}
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-white">{isEdit ? 'Edit Produk' : 'Tambah Produk'}</h2>
                            <p className="text-xs text-gray-500">{isEdit ? `ID: #${product.id}` : 'Isi detail produk baru'}</p>
                        </div>
                    </div>
                    <button id="btn-close-form" onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-all">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <form id="form-product" onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
                    <Field 
                        label="Nama Produk" 
                        name="name" 
                        value={form.name} 
                        onChange={handleChange} 
                        error={errors.name} 
                        placeholder="Masukkan nama produk…"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Field 
                            label="Harga (Rp)" 
                            name="price" 
                            type="number" 
                            value={form.price} 
                            onChange={handleChange} 
                            error={errors.price} 
                            placeholder="0"
                        />
                        <Field 
                            label="Stok" 
                            name="stock" 
                            type="number" 
                            value={form.stock} 
                            onChange={handleChange} 
                            error={errors.stock} 
                            placeholder="0"
                        />
                    </div>

                    <Field 
                        label="Kategori" 
                        name="category" 
                        value={form.category} 
                        onChange={handleChange} 
                        error={errors.category} 
                        as="select"
                    >
                        <option value="">-- Pilih Kategori --</option>
                        {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    </Field>

                    <Field 
                        label="URL Gambar (opsional)" 
                        name="image_url" 
                        type="url" 
                        value={form.image_url} 
                        onChange={handleChange} 
                        error={errors.image_url} 
                        placeholder="https://…"
                    />

                    <Field 
                        label="Deskripsi (opsional)" 
                        name="description" 
                        value={form.description} 
                        onChange={handleChange} 
                        error={errors.description} 
                        as="textarea" 
                        placeholder="Deskripsi produk…"
                    />

                    {/* Image preview */}
                    {form.image_url && (
                        <div className="rounded-xl overflow-hidden border border-gray-700 h-32 bg-gray-800">
                            <img src={form.image_url} alt="preview" className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; }}/>
                        </div>
                    )}
                </form>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-800 flex gap-3 justify-end">
                    <button
                        type="button"
                        id="btn-cancel-form"
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-all border border-gray-700"
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        form="form-product"
                        id="btn-submit-form"
                        disabled={loading}
                        className="px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white transition-all shadow-lg hover:shadow-violet-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading && (
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                        )}
                        {loading ? 'Menyimpan…' : isEdit ? 'Simpan Perubahan' : 'Tambah Produk'}
                    </button>
                </div>
            </div>
        </div>
    );
}
