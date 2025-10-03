import React, { useEffect, useState } from 'react';
import { fetchProducts, fetchCategories, createProduct, updateProduct, deleteProduct } from '../../src/utils/apiClient';
import EditProductModal from '../ui/EditProductModal';
import ConfirmModal from '../ui/ConfirmModal';
import { DocumentIcon } from '../Icons';

const AdminProducts: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [showCreateProduct, setShowCreateProduct] = useState(false);
    const [newProduct, setNewProduct] = useState({ title: '', price: '', category: '', image: '', images: [] as string[], description: '', inclusions: [] as string[] });
    // Modal states
    const [editingProduct, setEditingProduct] = useState<any | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => { load(); }, []);

    async function load() {
        setLoading(true);
        try {
            const [p, c] = await Promise.all([fetchProducts(), fetchCategories()]);
            setProducts(p || []);
            setCategories(c || []);
        } catch (err: any) {
            setMessage(err.message || 'Failed to load');
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateProductSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
            if (!newProduct.title) return setMessage('Title is required');
            try {
                const imagesArr = (newProduct.images || []).map((s:string)=>s.trim()).filter(Boolean);
                const inclusionsArr = (newProduct.inclusions || []).map((s:string)=>s.trim()).filter(Boolean);
                await createProduct({ title: newProduct.title, description: newProduct.description, price: newProduct.price, category: newProduct.category, images: imagesArr, image: imagesArr[0], inclusions: inclusionsArr });
            setMessage('Product created');
                setNewProduct({ title: '', price: '', category: '', image: '', images: [], description: '', inclusions: [] });
            setShowCreateProduct(false);
            load();
        } catch (err: any) {
            setMessage(err.message || 'Failed to create product');
        }
    }

    function handleEditProduct(p: any) {
        setEditingProduct(p);
        setEditOpen(true);
    }

    async function handleEditSave(payload: any) {
        if (!editingProduct) return;
        setEditLoading(true);
        try {
            await updateProduct(editingProduct._id || editingProduct.id, payload);
            setMessage('Updated');
            setEditOpen(false);
            setEditingProduct(null);
            load();
        } catch (err: any) {
            setMessage(err.message || 'Failed to update product');
        } finally {
            setEditLoading(false);
        }
    }

    function handleDeleteProduct(p: any) {
        setDeleteTarget(p);
    }

    async function confirmDelete() {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        try {
            await deleteProduct(deleteTarget._id || deleteTarget.id);
            setMessage('Deleted');
            setDeleteTarget(null);
            load();
        } catch (err: any) {
            setMessage(err.message || 'Failed to delete');
        } finally {
            setDeleteLoading(false);
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Products</h3>
                <button className="bg-primary text-white px-4 py-2 rounded" onClick={() => setShowCreateProduct(s => !s)}>{showCreateProduct ? 'Cancel' : 'Create Product'}</button>
            </div>
            {message && <div className="mb-4 text-sm text-green-600">{message}</div>}

            {showCreateProduct && (
                <form onSubmit={handleCreateProductSubmit} className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input className="col-span-1 md:col-span-2 p-2 border rounded" placeholder="Title" value={newProduct.title} onChange={e => setNewProduct({ ...newProduct, title: e.target.value })} />
                    <textarea className="col-span-1 md:col-span-4 p-2 border rounded" placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                    <input className="p-2 border rounded" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} />
                    <select className="p-2 border rounded" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                        <option value="">Select category</option>
                        {categories.map(c => <option key={c._id || c.id} value={c.slug || c.name}>{c.name}</option>)}
                    </select>
                    <label className="col-span-1 md:col-span-4 text-sm text-gray-700 mb-2">Images</label>
                    <div className="col-span-1 md:col-span-4 space-y-2">
                        {newProduct.images.map((img, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                    <img src={img || '/placeholder.png'} alt={`img-${idx}`} className="w-full h-full object-cover" onError={(e:any)=>{e.target.src='/placeholder.png'}} />
                                </div>
                                <input className="flex-1 p-2 border rounded" value={img} onChange={e => setNewProduct({ ...newProduct, images: newProduct.images.map((x:any,i)=> i===idx ? e.target.value : x) })} />
                                <button type="button" className="px-3 py-2 sm:py-1 rounded border text-sm" onClick={() => setNewProduct({ ...newProduct, images: newProduct.images.filter((_,i)=>i!==idx) })}>Remove</button>
                            </div>
                        ))}
                        <div>
                            <button type="button" className="px-3 py-2 rounded bg-primary text-white" onClick={() => setNewProduct({ ...newProduct, images: [...newProduct.images, ''] })}>Add Image</button>
                        </div>
                    </div>
                                        <label className="col-span-1 md:col-span-4 text-sm text-gray-700 mt-2 mb-2">What's Included (inclusions)</label>
                                        <div className="col-span-1 md:col-span-4 space-y-2">
                                            {newProduct.inclusions.map((inc, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <input className="flex-1 p-2 border rounded" value={inc} onChange={e => setNewProduct({ ...newProduct, inclusions: newProduct.inclusions.map((x,i)=> i===idx ? e.target.value : x) })} />
                                                    <button type="button" className="px-3 py-2 sm:py-1 rounded border text-sm" onClick={() => setNewProduct({ ...newProduct, inclusions: newProduct.inclusions.filter((_,i)=>i!==idx) })}>Remove</button>
                                                </div>
                                            ))}
                                            <div>
                                                <button type="button" className="px-3 py-2 rounded bg-primary text-white" onClick={() => setNewProduct({ ...newProduct, inclusions: [...newProduct.inclusions, ''] })}>Add Inclusion</button>
                                            </div>
                                        </div>
                    <div className="col-span-1 md:col-span-4 flex justify-end">
                        <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Create</button>
                    </div>
                </form>
            )}

            <div id="products" className="bg-white p-4 rounded shadow">
                {loading ? <div>Loading...</div> : (
                    // Desktop: table, Mobile: stacked cards
                    <div>
                        <div className="hidden md:block overflow-x-auto">
                            <table className="min-w-full text-left">
                                <thead><tr className="text-sm text-gray-600 border-b"><th className="p-2">#</th><th className="p-2">Product</th><th className="p-2">Category</th><th className="p-2">Price</th><th className="p-2">Actions</th></tr></thead>
                                <tbody>
                                    {products.map((p, idx) => (
                                        <tr key={p._id || p.id} className="border-b hover:bg-gray-50">
                                            <td className="p-2 align-top">{idx + 1}</td>
                                            <td className="p-2 align-top flex items-center gap-3">
                                                <img src={(p.images && p.images[0]) || p.image || '/placeholder.png'} alt="thumb" className="w-14 h-10 object-cover rounded" />
                                                <div>
                                                    <div className="font-semibold">{p.title}</div>
                                                    <div className="text-sm text-gray-500">{p.description?.slice?.(0, 60)}</div>
                                                </div>
                                            </td>
                                            <td className="p-2 align-top">{p.category}</td>
                                            <td className="p-2 align-top">₹{p.price}</td>
                                            <td className="p-2 align-top">
                                                <div className="flex items-center gap-2">
                                                    <button aria-label={`Edit ${p.title}`} title={`Edit ${p.title}`} onClick={() => handleEditProduct(p)} className="flex items-center justify-center w-9 h-9 rounded-full bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-yellow-800" >
                                                        <DocumentIcon className="w-4 h-4" />
                                                    </button>
                                                    <button aria-label={`Delete ${p.title}`} title={`Delete ${p.title}`} onClick={() => handleDeleteProduct(p)} className="flex items-center justify-center w-9 h-9 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700" >
                                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 6v14a2 2 0 002 2h4a2 2 0 002-2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile card list */}
                        <div className="md:hidden space-y-3">
                            {products.map((p, idx) => (
                                <div key={p._id || p.id} className="border rounded p-3 bg-white shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <img src={(p.images && p.images[0]) || p.image || '/placeholder.png'} alt="thumb" className="w-20 h-14 object-cover rounded" />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start gap-3">
                                                <div>
                                                    <div className="font-semibold">{p.title}</div>
                                                    <div className="text-sm text-gray-500">{p.description?.slice?.(0, 80)}</div>
                                                </div>
                                                <div className="text-sm font-semibold">₹{p.price}</div>
                                            </div>
                                            <div className="mt-3 flex gap-2">
                                                <button aria-label={`Edit ${p.title}`} title={`Edit ${p.title}`} onClick={() => handleEditProduct(p)} className="flex-1 py-2 rounded bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-yellow-800">Edit</button>
                                                <button aria-label={`Delete ${p.title}`} title={`Delete ${p.title}`} onClick={() => handleDeleteProduct(p)} className="flex-1 py-2 rounded bg-red-50 hover:bg-red-100 border border-red-200 text-red-700">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Edit product modal */}
            <EditProductModal open={editOpen} product={editingProduct} categories={categories} loading={editLoading} onCancel={() => { if (!editLoading) { setEditOpen(false); setEditingProduct(null); } }} onSave={handleEditSave} />

            {/* Confirm delete modal */}
            <ConfirmModal open={!!deleteTarget} title="Delete product" message={`Delete product "${deleteTarget?.title || ''}"?`} loading={deleteLoading} onCancel={() => { if (!deleteLoading) setDeleteTarget(null); }} onConfirm={confirmDelete} />
        </div>
    );
};

export default AdminProducts;