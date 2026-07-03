import React, { useState, useEffect, useCallback } from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import ConfirmModal from './components/ConfirmModal';
import Toast from './components/Toast';

const API_BASE = '/api/products';

export default function AppRoot() {
    const [products, setProducts] = useState([]);
    const [meta, setMeta]         = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading]   = useState(false);
    const [search, setSearch]     = useState('');
    const [filterCat, setFilterCat] = useState('');
    const [page, setPage]         = useState(1);

    // Modal states
    const [showForm, setShowForm]       = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [toast, setToast]             = useState(null);

    // ── Fetch products ──────────────────────────────────────────────────────────
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page, per_page: 10 });
            if (search)    params.set('search', search);
            if (filterCat) params.set('category', filterCat);

            const res  = await fetch(`${API_BASE}?${params}`);
            const data = await res.json();
            setProducts(data.data);
            setMeta(data);
        } catch (err) {
            showToast('Gagal memuat data produk.', 'error');
        } finally {
            setLoading(false);
        }
    }, [page, search, filterCat]);

    // ── Fetch categories ───────────────────────────────────────────────────────
    const fetchCategories = useCallback(async () => {
        try {
            const res  = await fetch('/api/products-categories');
            const data = await res.json();
            setCategories(data);
        } catch { /* silent */ }
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);
    useEffect(() => { fetchProducts(); },  [fetchProducts]);

    // ── Reset page on search/filter change ────────────────────────────────────
    useEffect(() => { setPage(1); }, [search, filterCat]);

    // ── Toast helper ───────────────────────────────────────────────────────────
    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    // ── Handlers ───────────────────────────────────────────────────────────────
    const handleAdd = () => { setEditProduct(null); setShowForm(true); };
    const handleEdit = (product) => { setEditProduct(product); setShowForm(true); };
    const handleDelete = (product) => setDeleteTarget(product);

    const handleFormSubmit = async (formData, isEdit) => {
        const url    = isEdit ? `${API_BASE}/${editProduct.id}` : API_BASE;
        const method = isEdit ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(formData),
        });

        if (!res.ok) {
            const err = await res.json();
            throw err;
        }

        showToast(isEdit ? 'Produk berhasil diperbarui!' : 'Produk berhasil ditambahkan!');
        setShowForm(false);
        fetchProducts();
        fetchCategories();
    };

    const handleConfirmDelete = async () => {
        try {
            const res = await fetch(`${API_BASE}/${deleteTarget.id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error();
            showToast('Produk berhasil dihapus!');
            fetchProducts();
            fetchCategories();
        } catch {
            showToast('Gagal menghapus produk.', 'error');
        } finally {
            setDeleteTarget(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100">
            {/* ── Header ── */}
            <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-30 shadow-xl">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-white leading-tight">Product Manager</h1>
                            <p className="text-xs text-gray-400">Kelola produk Anda dengan mudah</p>
                        </div>
                    </div>
                    <button
                        id="btn-add-product"
                        onClick={handleAdd}
                        className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-violet-500/25 hover:scale-105 active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                        </svg>
                        Tambah Produk
                    </button>
                </div>
            </header>

            {/* ── Main ── */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                <ProductList
                    products={products}
                    loading={loading}
                    meta={meta}
                    categories={categories}
                    search={search}
                    filterCat={filterCat}
                    page={page}
                    onSearchChange={setSearch}
                    onFilterChange={setFilterCat}
                    onPageChange={setPage}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </main>

            {/* ── Modals ── */}
            {showForm && (
                <ProductForm
                    product={editProduct}
                    categories={categories}
                    onSubmit={handleFormSubmit}
                    onClose={() => setShowForm(false)}
                />
            )}
            {deleteTarget && (
                <ConfirmModal
                    product={deleteTarget}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
            {toast && <Toast message={toast.message} type={toast.type} />}
        </div>
    );
}
