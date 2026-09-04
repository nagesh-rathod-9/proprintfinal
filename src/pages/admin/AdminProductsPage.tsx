import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Star, 
  Layers, 
  Eye, 
  ExternalLink, 
  Filter, 
  CheckCircle2, 
  Package 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ConfirmModal } from '../../components/ConfirmModal';

export const AdminProductsPage: React.FC = () => {
  const { products, deleteProduct, categories, showToast } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id);
      showToast(`Product "${productToDelete.name}" deleted successfully`, 'info');
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Add Product CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Commercial Product Inventory</h2>
          <p className="text-xs text-slate-500">Manage all print products, prices, and paper specs live on the store.</p>
        </div>

        <Link
          to="/admin/products/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF0038] hover:bg-rose-500 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search products by name, tag, GSM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF0038]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-bold focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px] bg-slate-50/50">
                <th className="py-3.5 px-4">Image</th>
                <th className="py-3.5 px-4">Product Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Base Price</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Tags & Finishes</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    <td className="py-3.5 px-4">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                    </td>

                    <td className="py-3.5 px-4">
                      <Link to={`/product/${prod.id}`} className="font-bold text-slate-900 hover:text-[#FF0038] block">
                        {prod.name}
                      </Link>
                      <span className="text-[10px] text-slate-400">
                        {prod.description?.slice(0, 45)}...
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-600">
                      {prod.category || prod.categoryId}
                    </td>

                    <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                      ₹{prod.basePrice}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{prod.rating || 4.9}</span>
                        <span className="text-slate-400 text-[10px]">({prod.reviewsCount || 230})</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {prod.tags?.map((t) => (
                          <span key={t} className="px-2 py-0.5 rounded-md bg-rose-50 text-[#FF0038] text-[10px] font-bold border border-rose-100">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/product/${prod.id}`}
                          title="View on Storefront"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/products/edit/${prod.id}`}
                          title="Edit Product Page"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#FF0038] hover:bg-rose-50 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setProductToDelete({ id: prod.id, name: prod.name })}
                          title="Delete Product"
                          className="p-1.5 rounded-lg text-slate-300 hover:text-[#FF0038] hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!productToDelete}
        title="Delete Product"
        message={`Are you sure you want to permanently delete "${productToDelete?.name}"? This product will no longer appear on the store or in search results.`}
        confirmText="Delete Product"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setProductToDelete(null)}
      />

    </div>
  );
};
