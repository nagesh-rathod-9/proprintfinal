import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Plus, 
  Search, 
  Edit3, 
  Check, 
  Package, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  ExternalLink,
  Flame
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

export const AdminBestSellersPage: React.FC = () => {
  const { products, updateProduct, categories, showToast } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'featured' | 'all'>('featured');

  // Best selling products
  const bestSellerProducts = useMemo(() => {
    return products.filter((p) => p.isBestSeller);
  }, [products]);

  // Filtered products based on active tab and search
  const displayedProducts = useMemo(() => {
    const source = activeTab === 'featured' ? bestSellerProducts : products;
    return source.filter((p) => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'all' || p.categoryId === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [activeTab, bestSellerProducts, products, searchQuery, selectedCategory]);

  const handleToggleBestSeller = (product: Product) => {
    const newState = !product.isBestSeller;
    updateProduct(product.id, { isBestSeller: newState });
    showToast(
      newState 
        ? `Added "${product.name}" to Best Selling Products` 
        : `Removed "${product.name}" from Best Selling Products`,
      newState ? 'success' : 'info'
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-black uppercase tracking-wider border border-amber-200 shadow-2xs mb-1">
            <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
            <span>Store Highlights</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Best Selling Products Management
          </h2>
          <p className="text-xs text-slate-500">
            Feature top-demanded print products, edit prices, bulk rates (100, 500, 1000 pcs) and display orders on the front store.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/products/add"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF0038] hover:bg-rose-500 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Product</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-semibold">Active Best Sellers</span>
            <div className="text-2xl font-black text-slate-900">{bestSellerProducts.length}</div>
            <p className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Prominently featured on homepage
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-semibold">Total Catalog Items</span>
            <div className="text-2xl font-black text-slate-900">{products.length}</div>
            <p className="text-[11px] text-slate-500">
              Available to promote as best seller
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-semibold">Bulk Pricing Configured</span>
            <div className="text-2xl font-black text-emerald-600">
              {products.filter(p => p.bulkPrice100 || p.bulkPrice500 || p.bulkPrice1000).length}
            </div>
            <p className="text-[11px] text-emerald-700 font-medium">
              100, 500, 1000 pcs rates active
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs & Search Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        
        {/* Tab Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('featured')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'featured'
                ? 'bg-white text-slate-900 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Featured Best Sellers ({bestSellerProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-slate-500" />
            <span>Browse All Inventory ({products.length})</span>
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF0038]"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-bold focus:outline-none cursor-pointer"
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

      {/* Best Sellers / Products Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        {displayedProducts.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Package className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">No products found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {activeTab === 'featured'
                ? 'No products are currently marked as Best Sellers. Switch to "Browse All Inventory" to mark products with 1 click!'
                : 'No products match your search criteria.'}
            </p>
            {activeTab === 'featured' && (
              <button
                onClick={() => setActiveTab('all')}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
              >
                Browse All Inventory & Select Best Sellers
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Base & Single Price</th>
                  <th className="py-3 px-4">Bulk Tier Rates</th>
                  <th className="py-3 px-4 text-center">Best Seller Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedProducts.map((p) => {
                  const cat = categories.find((c) => c.id === p.categoryId);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      
                      {/* Product Thumbnail & Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100"
                          />
                          <div className="min-w-0 max-w-xs">
                            <span className="font-extrabold text-slate-900 block truncate text-xs">
                              {p.name}
                            </span>
                            <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                              {p.description?.slice(0, 50)}...
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                          {cat?.name || p.category || 'General'}
                        </span>
                      </td>

                      {/* Base & Single Price */}
                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 block">
                            ₹{p.basePrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            Single: {p.singlePrice !== undefined ? `₹${p.singlePrice}` : 'Standard'}
                          </span>
                        </div>
                      </td>

                      {/* Bulk Tier Rates */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 text-[10px]">
                          {p.bulkPrice100 ? (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                              100: ₹{p.bulkPrice100}
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-400">
                              100: -
                            </span>
                          )}

                          {p.bulkPrice500 ? (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                              500: ₹{p.bulkPrice500}
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-400">
                              500: -
                            </span>
                          )}

                          {p.bulkPrice1000 ? (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                              1k: ₹{p.bulkPrice1000}
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-400">
                              1k: -
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Best Seller Status Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleBestSeller(p)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold cursor-pointer transition-all ${
                            p.isBestSeller
                              ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          <Flame className={`w-3.5 h-3.5 ${p.isBestSeller ? 'text-amber-600 fill-amber-600' : 'text-slate-400'}`} />
                          <span>{p.isBestSeller ? 'Best Seller' : 'Mark Best Seller'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/products/edit/${p.id}`}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors inline-flex items-center gap-1 font-bold text-[11px]"
                            title="Edit Product & Prices"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </Link>
                          <Link
                            to={`/product/${p.id}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                            title="Preview on Store"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
