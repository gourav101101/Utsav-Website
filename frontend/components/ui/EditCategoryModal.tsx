import React, { useState, useEffect } from 'react';

type Props = {
  open: boolean;
  category?: any;
  loading?: boolean;
  onCancel: () => void;
  onSave: (payload: any) => Promise<void>;
};

const EditCategoryModal: React.FC<Props> = ({ open, category, loading, onCancel, onSave }) => {
  const [form, setForm] = useState({ name: '', slug: '' });

  useEffect(() => {
    if (category) setForm({ name: category.name || '', slug: category.slug || '' });
  }, [category]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={() => { if (!loading) onCancel(); }}></div>
      <div className="bg-white rounded-lg shadow-lg p-4 z-10 w-full max-w-md mx-4 h-full md:h-auto overflow-auto md:overflow-visible">
        <h4 className="text-lg font-bold mb-4">Edit Category</h4>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Name</label>
            <input className="w-full p-2 border rounded" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Slug</label>
            <input className="w-full p-2 border rounded" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div className="flex flex-col md:flex-row justify-end gap-3 mt-4">
            <button className="px-4 py-3 rounded border w-full md:w-auto text-center" onClick={onCancel} disabled={loading}>Cancel</button>
            <button className="px-4 py-3 rounded bg-primary text-white w-full md:w-auto text-center" onClick={() => onSave(form)} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryModal;
