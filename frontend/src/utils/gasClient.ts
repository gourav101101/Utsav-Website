/*
 * API client helper for the React app.
 * Usage: set your backend URL in .env as VITE_API_ENDPOINT, for example:
 *   VITE_API_ENDPOINT=http://localhost:4000
 */

export type ApiRow = {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
  description?: string;
  image?: string;
  price?: string;
  category?: string;
  createdAt?: string;
  [key: string]: any;
};

const API_ENDPOINT = (import.meta as any).env?.VITE_API_ENDPOINT || '';

if (!API_ENDPOINT) console.warn('VITE_API_ENDPOINT not set. Please add your backend URL to .env (e.g. VITE_API_ENDPOINT=http://localhost:4000)');

function apiUrl(path = '') {
  if (!API_ENDPOINT) throw new Error('API endpoint not configured');
  return `${API_ENDPOINT.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export async function fetchProducts(): Promise<ApiRow[]> {
  let res: Response;
  try {
    res = await fetch(apiUrl('/api/products'));
  } catch (err: any) {
    throw new Error(err.message || 'Network error fetching products');
  }
  if (!res.ok) throw new Error(`Request failed (${res.status}) while fetching products`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch products');
  return (json.rows || []).map((r: any) => ({ ...r, id: r._id || r.id }));
}

export async function fetchRows(): Promise<ApiRow[]> {
  let res: Response;
  try {
    res = await fetch(apiUrl('/api/inquiries'));
  } catch (err: any) {
    throw new Error(err.message || 'Network error fetching inquiries');
  }
  if (!res.ok) throw new Error(`Request failed (${res.status}) while fetching inquiries`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch rows');
  return json.rows || [];
}

export async function fetchRowById(id: string): Promise<ApiRow | null> {
  // Not implemented on backend yet; fallback to fetching all and finding
  const rows = await fetchRows();
  return rows.find(r => (r._id === id || r.id === id)) || null;
}

export async function addRow(payload: Partial<ApiRow>): Promise<{ id: string }> {
  const headers: any = { 'Content-Type': 'application/json' };
  const envAdmin = (import.meta as any).env?.VITE_ADMIN_KEY || '';
  const sessionAdmin = typeof window !== 'undefined' ? sessionStorage.getItem('UTSAV_ADMIN_KEY') : null;
  if (sessionAdmin) headers['x-admin-key'] = sessionAdmin;
  else if (envAdmin) headers['x-admin-key'] = envAdmin;

  let res: Response;
  try {
    res = await fetch(apiUrl('/api/inquiries'), {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
  } catch (err: any) {
    throw new Error(err.message || 'Network error adding inquiry');
  }
  if (!res.ok) throw new Error(`Request failed (${res.status}) while adding inquiry`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to add row');
  return { id: json.id };
}

export async function createProduct(payload: {
  title: string;
  description?: string;
  image?: string;
  price?: string | number;
  category?: string;
}) : Promise<{ id: string }> {
  const headers: any = { 'Content-Type': 'application/json' };
  const envAdmin = (import.meta as any).env?.VITE_ADMIN_KEY || '';
  const sessionAdmin = typeof window !== 'undefined' ? sessionStorage.getItem('UTSAV_ADMIN_KEY') : null;
  if (sessionAdmin) headers['x-admin-key'] = sessionAdmin;
  else if (envAdmin) headers['x-admin-key'] = envAdmin;

  let res: Response;
  try {
    res = await fetch(apiUrl('/api/products'), {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
  } catch (err: any) {
    throw new Error(err.message || 'Network error creating product');
  }
  if (!res.ok) throw new Error(`Request failed (${res.status}) while creating product`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to create product');
  return { id: json.id };
}

export async function updateProduct(id: string, payload: Partial<ApiRow>) : Promise<{ id: string }> {
  const headers: any = { 'Content-Type': 'application/json' };
  const envAdmin = (import.meta as any).env?.VITE_ADMIN_KEY || '';
  const sessionAdmin = typeof window !== 'undefined' ? sessionStorage.getItem('UTSAV_ADMIN_KEY') : null;
  if (sessionAdmin) headers['x-admin-key'] = sessionAdmin;
  else if (envAdmin) headers['x-admin-key'] = envAdmin;

  let res: Response;
  try {
    res = await fetch(apiUrl(`/api/products/${id}`), {
      method: 'PUT',
      headers,
      body: JSON.stringify(payload),
    });
  } catch (err: any) {
    throw new Error(err.message || 'Network error updating product');
  }
  if (!res.ok) throw new Error(`Request failed (${res.status}) while updating product`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to update product');
  return { id: json.row._id || json.row.id };
}

export async function deleteProduct(id: string) : Promise<void> {
  const headers: any = {};
  const envAdmin = (import.meta as any).env?.VITE_ADMIN_KEY || '';
  const sessionAdmin = typeof window !== 'undefined' ? sessionStorage.getItem('UTSAV_ADMIN_KEY') : null;
  if (sessionAdmin) headers['x-admin-key'] = sessionAdmin;
  else if (envAdmin) headers['x-admin-key'] = envAdmin;

  let res: Response;
  try {
    res = await fetch(apiUrl(`/api/products/${id}`), { method: 'DELETE', headers });
  } catch (err: any) {
    throw new Error(err.message || 'Network error deleting product');
  }
  if (!res.ok) throw new Error(`Request failed (${res.status}) while deleting product`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to delete product');
}

// Categories
export async function fetchCategories(): Promise<ApiRow[]> {
  let res: Response;
  try {
    res = await fetch(apiUrl('/api/categories'));
  } catch (err: any) {
    throw new Error(err.message || 'Network error fetching categories');
  }
  if (!res.ok) throw new Error(`Request failed (${res.status}) while fetching categories`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch categories');
  return json.rows || [];
}

export async function createCategory(payload: { name: string; slug: string; }) : Promise<{ id: string }> {
  const headers: any = { 'Content-Type': 'application/json' };
  const envAdmin = (import.meta as any).env?.VITE_ADMIN_KEY || '';
  const sessionAdmin = typeof window !== 'undefined' ? sessionStorage.getItem('UTSAV_ADMIN_KEY') : null;
  if (sessionAdmin) headers['x-admin-key'] = sessionAdmin;
  else if (envAdmin) headers['x-admin-key'] = envAdmin;

  let res: Response;
  try {
    res = await fetch(apiUrl('/api/categories'), { method: 'POST', headers, body: JSON.stringify(payload) });
  } catch (err: any) {
    throw new Error(err.message || 'Network error creating category');
  }
  if (!res.ok) throw new Error(`Request failed (${res.status}) while creating category`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to create category');
  return { id: json.id };
}

export async function updateCategory(id: string, payload: { name?: string; slug?: string; }) : Promise<{ id: string }> {
  const headers: any = { 'Content-Type': 'application/json' };
  const envAdmin = (import.meta as any).env?.VITE_ADMIN_KEY || '';
  const sessionAdmin = typeof window !== 'undefined' ? sessionStorage.getItem('UTSAV_ADMIN_KEY') : null;
  if (sessionAdmin) headers['x-admin-key'] = sessionAdmin;
  else if (envAdmin) headers['x-admin-key'] = envAdmin;

  let res: Response;
  try {
    res = await fetch(apiUrl(`/api/categories/${id}`), { method: 'PUT', headers, body: JSON.stringify(payload) });
  } catch (err: any) {
    throw new Error(err.message || 'Network error updating category');
  }
  if (!res.ok) throw new Error(`Request failed (${res.status}) while updating category`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to update category');
  return { id: json.row._id || json.row.id };
}

export async function deleteCategory(id: string) : Promise<void> {
  const headers: any = {};
  const envAdmin = (import.meta as any).env?.VITE_ADMIN_KEY || '';
  const sessionAdmin = typeof window !== 'undefined' ? sessionStorage.getItem('UTSAV_ADMIN_KEY') : null;
  if (sessionAdmin) headers['x-admin-key'] = sessionAdmin;
  else if (envAdmin) headers['x-admin-key'] = envAdmin;

  let res: Response;
  try {
    res = await fetch(apiUrl(`/api/categories/${id}`), { method: 'DELETE', headers });
  } catch (err: any) {
    throw new Error(err.message || 'Network error deleting category');
  }
  if (!res.ok) throw new Error(`Request failed (${res.status}) while deleting category`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to delete category');
}
