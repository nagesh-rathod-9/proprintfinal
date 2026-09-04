import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Palette, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  Sparkles,
  ExternalLink,
  Tag,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ConfirmModal } from '../../components/ConfirmModal';
import { PortfolioItem } from '../../types';

export const AdminDesignWorksPage: React.FC = () => {
  const { portfolio, deletePortfolioItem, showToast } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [itemToDelete, setItemToDelete] = useState<PortfolioItem | null>(null);

  const categoryOptions = [
    { id: 'all', label: 'All Categories' },
    { id: 'branding', label: 'Branding & Identity' },
    { id: 'logo', label: 'Logos & Brand Marks' },
    { id: 'packaging', label: 'Packaging & Boxes' },
    { id: 'social', label: 'Social Media Creatives' },
    { id: 'outdoor', label: 'Outdoor Hoardings' },
    { id: 'brochure', label: 'Brochures & Catalogs' },
    { id: 'stationery', label: 'Luxury Visiting Cards' }
  ];

  const filteredItems = useMemo(() => {
    return (portfolio || []).filter((item) => {
      const matchesSearch = 
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.client?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [portfolio, searchQuery, selectedCategory]);

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      await deletePortfolioItem(itemToDelete.id);
      showToast(`Design work "${itemToDelete.title}" removed successfully`, 'info');
      setItemToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-black uppercase tracking-wider border border-rose-200 shadow-2xs mb-1">
            <Palette className="w-3.5 h-3.5" />
            <span>Creative Showcase</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Design Works & Portfolio Catalog
          </h2>
          <p className="text-xs text-slate-500">
            Manage your graphic design showcases, client projects, packaging mockups, and uploaded high-res visuals.
          </p>
        </div>

        <Link
          to="/admin/design-works/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF0038] hover:bg-rose-500 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Design Work</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by title, client, city or tag..."
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
            {categoryOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Design Works Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Palette className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-700">No design works found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add your agency's creative packaging, logos, and print artwork to display on the storefront.
            </p>
            <Link
              to="/admin/design-works/add"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF0038] text-white text-xs font-bold hover:bg-rose-500 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Design Work</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Artwork & Project</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Client & City</th>
                  <th className="py-3 px-4">Deliverables & Tags</th>
                  <th className="py-3 px-4">Badge</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* Artwork Preview & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-100 shadow-2xs"
                        />
                        <div className="min-w-0 max-w-xs">
                          <span className="font-extrabold text-slate-900 block truncate text-xs">
                            {item.title}
                          </span>
                          {item.titleMr && item.titleMr !== item.title && (
                            <span className="text-[11px] text-slate-500 block truncate font-marathi">
                              {item.titleMr}
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400 block truncate mt-0.5">
                            {item.description?.slice(0, 45)}...
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-100 text-[11px] font-bold">
                        {item.categoryLabel || item.category}
                      </span>
                    </td>

                    {/* Client & City */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 block">
                          {item.client || 'Proprint In-House'}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {item.city || 'Chhatrapati Sambhajinagar'}
                        </span>
                      </div>
                    </td>

                    {/* Deliverables / Tags */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(item.deliverables || item.tags || []).slice(0, 3).map((d, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-medium">
                            {d}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Badge */}
                    <td className="py-3 px-4">
                      {item.badge ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-extrabold">
                          {item.badge}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">-</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/design-works/edit/${item.id}`}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors inline-flex items-center gap-1 font-bold text-[11px]"
                          title="Edit Design Work"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => setItemToDelete(item)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                          title="Delete Design Work"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <ConfirmModal
          isOpen={Boolean(itemToDelete)}
          title="Delete Design Work"
          message={`Are you sure you want to delete "${itemToDelete.title}"? This artwork will be permanently removed from your online portfolio.`}
          confirmText="Yes, Delete Work"
          confirmColor="danger"
          onConfirm={handleConfirmDelete}
          onClose={() => setItemToDelete(null)}
        />
      )}

    </div>
  );
};
