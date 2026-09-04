import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FolderTree, Trash2, Edit3, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ConfirmModal } from '../../components/ConfirmModal';

export const AdminCategoriesPage: React.FC = () => {
  const { categories, products, deleteCategory, showToast } = useApp();
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id);
      showToast(`Category "${categoryToDelete.name}" deleted`, 'info');
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Printing Service Categories</h2>
          <p className="text-xs text-slate-500">Commercial press service classifications, paper grades, and packaging lines.</p>
        </div>

        <Link
          to="/admin/categories/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF0038] hover:bg-rose-500 active:scale-98 text-white font-black rounded-xl text-xs shadow-md shadow-rose-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const productCount = products.filter((p) => p.categoryId === cat.id).length;

          return (
            <div
              key={cat.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 group hover:shadow-lg transition-all"
            >
              <div className="space-y-3">
                <div className="h-32 rounded-2xl overflow-hidden bg-slate-100 relative">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 bg-slate-950/80 backdrop-blur-md rounded-full text-white text-[10px] font-bold">
                    {productCount} Products
                  </div>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-[#FF0038] transition-colors">{cat.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{cat.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <Link
                  to={`/products?category=${cat.id}`}
                  className="font-bold text-[#FF0038] hover:text-rose-700 flex items-center gap-1"
                >
                  <span>View Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-1">
                  <Link
                    to={`/admin/categories/edit/${cat.id}`}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors"
                    title="Edit Category"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => setCategoryToDelete({ id: cat.id, name: cat.name })}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-[#FF0038] hover:bg-rose-50 cursor-pointer transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmModal
        isOpen={!!categoryToDelete}
        title="Delete Category"
        message={`Are you sure you want to delete category "${categoryToDelete?.name}"? Products inside this category will remain available.`}
        confirmText="Delete Category"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setCategoryToDelete(null)}
      />
    </div>
  );
};
