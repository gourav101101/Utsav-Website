import React, { useState, useEffect } from 'react';

type Props = {
  open: boolean;
  product?: any;
  categories?: any[];
  loading?: boolean;
  onCancel: () => void;
  onSave: (payload: any) => Promise<void>;
};

const EditProductModal: React.FC<Props> = ({ open, product, categories = [], loading, onCancel, onSave }) => {
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '', image: '', images: [] as string[], inclusions: [] as string[] });

  useEffect(() => {
    if (product) setForm({ title: product.title || '', description: product.description || '', price: product.price || '', category: product.category || '', image: product.image || '', images: product.images || (product.image ? [product.image] : []), inclusions: product.inclusions || [] });
  }, [product]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={() => { if (!loading) onCancel(); }}></div>
      <div className="bg-white rounded-lg shadow-lg p-6 z-10 w-full max-w-2xl max-h-full overflow-y-auto">
        <h4 className="text-lg font-bold mb-4">Edit Product</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Title</label>
            <input className="w-full p-2 border rounded" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Category</label>
            <select className="w-full p-2 border rounded" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c._id || c.id} value={c.slug || c.name}>{c.name}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-1">Description</label>
            <textarea className="w-full p-2 border rounded" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Price</label>
            <input className="w-full p-2 border rounded" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-2">Images</label>
            <div className="space-y-2">
              {form.images.map((img, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-16 h-12 bg-gray-100 rounded overflow-hidden hidden sm:block">
                    <img src={img} alt={`img-${idx}`} className="w-full h-full object-cover" onError={(e:any)=>{e.target.src='/placeholder.png'}}/>
                  </div>
                  <input className="flex-1 p-2 border rounded" value={img} onChange={e => setForm({ ...form, images: form.images.map((x,i)=> i===idx ? e.target.value : x) })} />
                  <button type="button" className="px-3 py-2 sm:py-1 rounded border text-sm" onClick={() => setForm({ ...form, images: form.images.filter((_,i)=>i!==idx) })}>Remove</button>
                </div>
              ))}
              <div>
                <button type="button" className="px-3 py-2 rounded bg-primary text-white" onClick={() => setForm({ ...form, images: [...form.images, ''] })}>Add Image</button>
              </div>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-2">What's Included (inclusions)</label>
            <div className="space-y-2">
              {form.inclusions.map((inc, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input className="flex-1 p-2 border rounded" value={inc} onChange={e => setForm({ ...form, inclusions: form.inclusions.map((x,i)=> i===idx ? e.target.value : x) })} />
                  <button type="button" className="px-3 py-2 sm:py-1 rounded border text-sm" onClick={() => setForm({ ...form, inclusions: form.inclusions.filter((_,i)=>i!==idx) })}>Remove</button>
                </div>
              ))}
              <div>
                <button type="button" className="px-3 py-2 rounded bg-primary text-white" onClick={() => setForm({ ...form, inclusions: [...form.inclusions, ''] })}>Add Inclusion</button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6">
          <button className="px-4 py-3 rounded border w-full md:w-auto text-center" onClick={onCancel} disabled={loading}>Cancel</button>
          <button className="px-4 py-3 rounded bg-primary text-white w-full md:w-auto text-center" onClick={() => {
            const imagesArr = (form.images || []).map((s:string)=>s.trim()).filter(Boolean);
            const incs = (form.inclusions || []).map((s:string)=>s.trim()).filter(Boolean);
            onSave({ title: form.title, description: form.description, price: form.price, category: form.category, images: imagesArr, inclusions: incs });
          }} disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;
