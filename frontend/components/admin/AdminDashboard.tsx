import React, { useEffect, useState } from 'react';
import { fetchProducts, fetchCategories } from '../../src/utils/apiClient';

const AdminDashboard: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const [p, c] = await Promise.all([fetchProducts(), fetchCategories()]);
                setProducts(p || []);
                setCategories(c || []);
            } catch (err: any) {
                console.error('Failed to load dashboard data', err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Dashboard</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded shadow"><div className="text-sm text-gray-500">Total products</div><div className="text-2xl font-bold">{loading ? '...' : products.length}</div></div>
                <div className="bg-white p-4 rounded shadow"><div className="text-sm text-gray-500">Categories</div><div className="text-2xl font-bold">{loading ? '...' : categories.length}</div></div>
            </div>
        </div>
    );
};

export default AdminDashboard;