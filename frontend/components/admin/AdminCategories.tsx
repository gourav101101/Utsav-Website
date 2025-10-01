import React, { useEffect, useState } from 'react';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../../src/utils/apiClient';
import ConfirmModal from '../ui/ConfirmModal';
import { DocumentIcon } from '../Icons';

const AdminCategories: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [showCreateCategory, setShowCreateCategory] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', slug: '' });

    // Edit modal state
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any | null>(null);
    const [editLoading, setEditLoading] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => { load(); }, []);

    async function load() {
        setLoading(true);
        try {
            const c = await fetchCategories();
            setCategories(c || []);
        } catch (err: any) {
            setMessage(err.message || 'Failed to load');
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateCategorySubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!newCategory.name) return setMessage('Category name required');
        const slug = newCategory.slug || newCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        try {
            await createCategory({ name: newCategory.name, slug });
            setMessage('Category created');
            setNewCategory({ name: '', slug: '' });
            setShowCreateCategory(false);
            load();
        } catch (err: any) {
            setMessage(err.message || 'Failed to create category');
        }
    }

    async function handleEditCategory(c: any) {
        // Open modal to edit category instead of using prompt boxes
        setEditingCategory({ ...(c || {}), name: c.name || '', slug: c.slug || '' });
        setShowEditModal(true);
    }

    function handleDeleteCategory(c: any) {
        setDeleteTarget(c);
    }

    async function confirmDelete() {
        if (!deleteTarget) return;
        setDeleteLoading(true);
        try {
            await deleteCategory(deleteTarget._id || deleteTarget.id);
            setMessage('Deleted');
            setDeleteTarget(null);
            load();
        } catch (err: any) {
            setMessage(err.message || 'Failed to delete');
        } finally {
            setDeleteLoading(false);
        }
    }

    async function handleEditSave() {
        if (!editingCategory) return;
        if (!editingCategory.name) return setMessage('Category name required');
        setEditLoading(true);
        try {
            // Check for admin key presence (session or env) before sending request
            const sessionAdmin = typeof window !== 'undefined' ? sessionStorage.getItem('UTSAV_ADMIN_KEY') : null;
            const envAdmin = (import.meta as any).env?.VITE_ADMIN_KEY || '';
            console.log('Admin key sources: session=', !!sessionAdmin, 'env=', !!envAdmin);
            if (!sessionAdmin && !envAdmin) {
                setMessage('Admin API key not found in sessionStorage or VITE_ADMIN_KEY. Log in or set VITE_ADMIN_KEY in frontend .env');
                setEditLoading(false);
                return;
            }
            const slug = editingCategory.slug || editingCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            await updateCategory(editingCategory._id || editingCategory.id, { name: editingCategory.name, slug });
            setMessage('Category updated');
            setShowEditModal(false);
            setEditingCategory(null);
            load();
        } catch (err: any) {
            setMessage(err.message || 'Failed to update category');
        } finally {
            setEditLoading(false);
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Categories</h3>
                <button className="bg-primary/80 text-white px-4 py-2 rounded" onClick={() => setShowCreateCategory(s => !s)}>{showCreateCategory ? 'Cancel' : 'Create Category'}</button>
            </div>
            {message && <div className="mb-4 text-sm text-green-600">{message}</div>}

            {showCreateCategory && (
                <form onSubmit={handleCreateCategorySubmit} className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input className="p-2 border rounded" placeholder="Name" value={newCategory.name} onChange={e => setNewCategory({ ...newCategory, name: e.target.value })} />
                    <input className="p-2 border rounded" placeholder="Slug (optional)" value={newCategory.slug} onChange={e => setNewCategory({ ...newCategory, slug: e.target.value })} />
                    <div className="flex justify-end md:col-start-3"><button type="submit" className="bg-primary text-white px-4 py-2 rounded w-full md:w-auto">Create</button></div>
                </form>
            )}

            {/* Edit Category Modal */}
            {showEditModal && editingCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40" onClick={() => { if (!editLoading) { setShowEditModal(false); setEditingCategory(null); } }}></div>
                    <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-full max-w-md">
                        <h4 className="text-lg font-bold mb-4">Edit Category</h4>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Name</label>
                                <input className="w-full p-2 border rounded" value={editingCategory.name} onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">Slug</label>
                                <input className="w-full p-2 border rounded" value={editingCategory.slug} onChange={e => setEditingCategory({ ...editingCategory, slug: e.target.value })} />
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4">
                                <button className="px-4 py-2 rounded border w-full sm:w-auto" onClick={() => { if (!editLoading) { setShowEditModal(false); setEditingCategory(null); } }}>Cancel</button>
                                <button className="px-4 py-2 rounded bg-primary text-white w-full sm:w-auto" onClick={handleEditSave} disabled={editLoading}>{editLoading ? 'Saving...' : 'Save'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div id="categories" className="bg-white p-4 rounded shadow">
                {loading ? <div>Loading...</div> : (
                    <div>
                        <div className="hidden md:block">
                            <ul className="space-y-2">
                                {categories.map(c => (
                                    <li key={c._id || c.id} className="flex justify-between items-center border-b py-2">
                                        <div>
                                            <div className="font-semibold">{c.name}</div>
                                            <div className="text-sm text-gray-600">{c.slug}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button aria-label={`Edit ${c.name}`} title={`Edit ${c.name}`} onClick={() => handleEditCategory(c)} className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700">
                                                <DocumentIcon className="w-4 h-4" />
                                            </button>
                                            <button aria-label={`Delete ${c.name}`} title={`Delete ${c.name}`} onClick={() => handleDeleteCategory(c)} className="flex items-center justify-center w-9 h-9 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700">
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 6v14a2 2 0 002 2h4a2 2 0 002-2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="md:hidden space-y-3">
                            {categories.map(c => (
                                <div key={c._id || c.id} className="border rounded p-3 bg-white shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-semibold">{c.name}</div>
                                            <div className="text-sm text-gray-500">{c.slug}</div>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex gap-2">
                                        <button aria-label={`Edit ${c.name}`} title={`Edit ${c.name}`} onClick={() => handleEditCategory(c)} className="flex-1 py-2 rounded bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700">Edit</button>
                                        <button aria-label={`Delete ${c.name}`} title={`Delete ${c.name}`} onClick={() => handleDeleteCategory(c)} className="flex-1 py-2 rounded bg-red-50 hover:bg-red-100 border border-red-200 text-red-700">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <ConfirmModal open={!!deleteTarget} title="Delete category" message={`Delete category "${deleteTarget?.name || ''}"?`} loading={deleteLoading} onCancel={() => { if (!deleteLoading) setDeleteTarget(null); }} onConfirm={confirmDelete} />
        </div>
    );
};

export default AdminCategories;