import React, { useState } from 'react';

const CATEGORY_COLORS = {
    'Electronics':     'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Clothing':        'bg-pink-500/20 text-pink-400 border-pink-500/30',
    'Food & Beverage': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'Home & Living':   'bg-teal-500/20 text-teal-400 border-teal-500/30',
    'Sports':          'bg-green-500/20 text-green-400 border-green-500/30',
    'Books':           'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Beauty':          'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

function formatPrice(price) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
}

export default function ProductList({
    products, loading, meta, categories,
    search, filterCat, page,
    onSearchChange, onFilterChange, onPageChange,
    onEdit, onDelete,
}) {
    const [imgErrors, setImgErrors] = useState({});

    const handleImgError = (id) => setImgErrors(prev => ({ ...prev, [id]: true }));

    return (
        <div className="space-y-6">
            {/* ── Stats Bar ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Total Produk', value: meta?.total ?? '–', icon: '📦', color: 'from-violet-600/30 to-indigo-600/30 border-violet-500/20' },
                    { label: 'Halaman',      value: meta ? `${meta.current_page}/${meta.last_page}` : '–', icon: '📄', color: 'from-blue-600/30 to-cyan-600/30 border-blue-500/20' },
                    { label: 'Kategori',     value: categories.length,  icon: '🏷️', color: 'from-emerald-600/30 to-teal-600/30 border-emerald-500/20' },
                    { label: 'Per Halaman',  value: meta?.per_page ?? 10, icon: '📋', color: 'from-rose-600/30 to-pink-600/30 border-rose-500/20' },
                ].map(s => (
                    <div key={s.label} className={`bg-gradient-to-br ${s.color} border rounded-2xl p-4 backdrop-blur`}>
                        <div className="text-2xl mb-1">{s.icon}</div>
                        <div className="text-2xl font-bold text-white">{s.value}</div>
                        <div className="text-xs text-gray-400 mt-1">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Filters ── */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <input
                        id="input-search"
                        type="text"
                        placeholder="Cari nama, kategori, deskripsi…"
                        value={search}
                        onChange={e => onSearchChange(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-800/80 border border-gray-700 rounded-xl text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
                    />
                </div>
                <select
                    id="select-category"
                    value={filterCat}
                    onChange={e => onFilterChange(e.target.value)}
                    className="px-4 py-2.5 bg-gray-800/80 border border-gray-700 rounded-xl text-sm text-gray-100 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all min-w-[180px]"
                >
                    <option value="">Semua Kategori</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* ── Table ── */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-800 bg-gray-800/50">
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Produk</th>
                                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Kategori</th>
                                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Harga</th>
                                <th className="text-center px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Stok</th>
                                <th className="text-center px-5 py-3.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800/70">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-xl bg-gray-800"/><div className="space-y-2"><div className="h-3.5 w-36 bg-gray-800 rounded"/><div className="h-2.5 w-24 bg-gray-800/70 rounded"/></div></div></td>
                                        <td className="px-5 py-4 hidden sm:table-cell"><div className="h-6 w-24 bg-gray-800 rounded-full"/></td>
                                        <td className="px-5 py-4 text-right"><div className="h-3.5 w-20 bg-gray-800 rounded ml-auto"/></td>
                                        <td className="px-5 py-4 hidden md:table-cell"><div className="h-6 w-12 bg-gray-800 rounded-full mx-auto"/></td>
                                        <td className="px-5 py-4"><div className="h-8 w-24 bg-gray-800 rounded-lg mx-auto"/></td>
                                    </tr>
                                ))
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-16 text-center text-gray-500">
                                        <div className="text-5xl mb-3">📭</div>
                                        <p className="font-medium text-gray-400">Tidak ada produk ditemukan</p>
                                        <p className="text-xs mt-1">Coba ubah filter atau tambah produk baru</p>
                                    </td>
                                </tr>
                            ) : products.map(product => (
                                <tr key={product.id} className="hover:bg-gray-800/40 transition-colors group">
                                    {/* Product */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0 ring-1 ring-gray-700 group-hover:ring-violet-500/40 transition-all">
                                                {product.image_url && !imgErrors[product.id] ? (
                                                    <img
                                                        src={product.image_url}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                        onError={() => handleImgError(product.id)}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl">📦</div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white capitalize line-clamp-1">{product.name}</p>
                                                <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{product.description || '–'}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Category */}
                                    <td className="px-5 py-4 hidden sm:table-cell">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${CATEGORY_COLORS[product.category] || 'bg-gray-700/50 text-gray-300 border-gray-600/30'}`}>
                                            {product.category}
                                        </span>
                                    </td>

                                    {/* Price */}
                                    <td className="px-5 py-4 text-right font-semibold text-emerald-400 tabular-nums">
                                        {formatPrice(product.price)}
                                    </td>

                                    {/* Stock */}
                                    <td className="px-5 py-4 hidden md:table-cell text-center">
                                        <span className={`inline-flex items-center justify-center w-10 h-6 rounded-full text-xs font-bold ${product.stock > 10 ? 'bg-emerald-500/20 text-emerald-400' : product.stock > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {product.stock}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                id={`btn-edit-${product.id}`}
                                                onClick={() => onEdit(product)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 rounded-lg text-xs font-medium transition-all duration-150"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                                </svg>
                                                Edit
                                            </button>
                                            <button
                                                id={`btn-delete-${product.id}`}
                                                onClick={() => onDelete(product)}
                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 rounded-lg text-xs font-medium transition-all duration-150"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                                </svg>
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* ── Pagination ── */}
                {meta && meta.last_page > 1 && (
                    <div className="px-5 py-4 border-t border-gray-800 flex items-center justify-between flex-wrap gap-3">
                        <p className="text-xs text-gray-500">
                            Menampilkan <span className="text-gray-300 font-medium">{meta.from}–{meta.to}</span> dari <span className="text-gray-300 font-medium">{meta.total}</span> produk
                        </p>
                        <div className="flex items-center gap-1.5">
                            <button
                                id="btn-prev-page"
                                onClick={() => onPageChange(p => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all border border-gray-700"
                            >
                                ← Prev
                            </button>
                            {[...Array(meta.last_page)].map((_, i) => {
                                const p = i + 1;
                                if (Math.abs(p - page) > 2 && p !== 1 && p !== meta.last_page) return null;
                                return (
                                    <button
                                        key={p}
                                        id={`btn-page-${p}`}
                                        onClick={() => onPageChange(p)}
                                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all border ${p === page ? 'bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-500/20' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border-gray-700'}`}
                                    >
                                        {p}
                                    </button>
                                );
                            })}
                            <button
                                id="btn-next-page"
                                onClick={() => onPageChange(p => Math.min(meta.last_page, p + 1))}
                                disabled={page >= meta.last_page}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all border border-gray-700"
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
