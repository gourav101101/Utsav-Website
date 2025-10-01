import React, { useEffect, useState } from 'react';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../src/utils/apiClient';
import EditCategoryModal from '../components/ui/EditCategoryModal';
import ConfirmModal from '../components/ui/ConfirmModal';
import { DocumentIcon } from '../components/Icons';

const CategoriesManager: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', slug: '' });
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [editOpen, setEditOpen] = useState(false);
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
    const slug = newCategory.slug || newCategory.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
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

  function handleEditCategory(c: any) {
    setEditingCategory(c);
    setEditOpen(true);
  }

  async function handleEditSave(payload: any) {
    if (!editingCategory) return;
    setEditLoading(true);
    try {
      await updateCategory(editingCategory._id || editingCategory.id, payload);
      setMessage('Category updated');
      setEditOpen(false);
      setEditingCategory(null);
      load();
    } catch (err: any) {
      setMessage(err.message || 'Failed to update category');
    } finally {
      setEditLoading(false);
    }
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

  return (
    <div id="categories" className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold">Categories</h3>
        <button className="bg-primary/80 text-white px-4 py-2 rounded" onClick={() => setShowCreateCategory(s => !s)}>{showCreateCategory ? 'Cancel' : 'Create Category'}</button>
      </div>

      {message && <div className="mb-4 text-sm text-green-600">{message}</div>}

      {showCreateCategory && (
        <form onSubmit={handleCreateCategorySubmit} className="bg-white p-4 rounded shadow mb-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className="p-2 border rounded" placeholder="Name" value={newCategory.name} onChange={e => setNewCategory({ ...newCategory, name: e.target.value })} />
          <input className="p-2 border rounded" placeholder="Slug (optional)" value={newCategory.slug} onChange={e => setNewCategory({ ...newCategory, slug: e.target.value })} />
          <div className="flex justify-end">
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded">Create</button>
          </div>
        </form>
      )}

      {loading ? <div>Loading...</div> : (
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
      )}

      <EditCategoryModal open={editOpen} category={editingCategory} loading={editLoading} onCancel={() => { if (!editLoading) { setEditOpen(false); setEditingCategory(null); } }} onSave={handleEditSave} />

      <ConfirmModal open={!!deleteTarget} title="Delete category" message={`Delete category "${deleteTarget?.name || ''}"?`} loading={deleteLoading} onCancel={() => { if (!deleteLoading) setDeleteTarget(null); }} onConfirm={confirmDelete} />
    </div>
  );
};

export default CategoriesManager;
