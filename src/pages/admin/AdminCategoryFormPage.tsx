import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, UploadCloud, Image as ImageIcon, Trash2, CheckCircle2, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminCategoryFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { categories, addCategory, updateCategory, showToast } = useApp();

  const isEditing = Boolean(id);
  const existingCategory = isEditing ? categories.find((c) => c.id === id) : null;

  const [name, setName] = useState('');
  const [nameMr, setNameMr] = useState('');
  const [shortName, setShortName] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Package');
  const [featured, setFeatured] = useState(true);
  
  // Image Upload State (No URL input)
  const [image, setImage] = useState('');
  const [imageFileName, setImageFileName] = useState('');
  const [imageFileSize, setImageFileSize] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && existingCategory) {
      setName(existingCategory.name);
      setNameMr(existingCategory.nameMr || existingCategory.name);
      setShortName(existingCategory.shortName || existingCategory.name);
      setDescription(existingCategory.description || '');
      setIconName(existingCategory.iconName || 'Package');
      setFeatured(existingCategory.featured !== false);
      setImage(existingCategory.image || '');
      if (existingCategory.image) {
        setImageFileName(`${existingCategory.name.toLowerCase().replace(/\s+/g, '-')}-cover.jpg`);
      }
    }
  }, [isEditing, existingCategory]);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Validation Error: Please select an image file (PNG, JPG, WEBP)', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToast('File size exceeds 10MB limit', 'error');
      return;
    }

    setImageFileName(file.name);
    setImageFileSize(`${(file.size / 1024).toFixed(1)} KB`);
    setIsUploading(true);

    // 1. Instant local preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImage(dataUrl);
    };
    reader.readAsDataURL(file);

    // 2. Upload to server
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.url) {
          setImage(data.url);
          showToast('Category image uploaded successfully!', 'success');
        }
      }
    } catch (err) {
      console.warn('File upload fallback to data URL:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImage('');
    setImageFileName('');
    setImageFileSize('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      showToast('Validation Error: Category title must be at least 2 characters', 'error');
      return;
    }

    if (!image) {
      showToast('Validation Error: Please upload a category image', 'error');
      return;
    }

    if (isEditing && id) {
      updateCategory(id, {
        name: name.trim(),
        nameMr: nameMr.trim() || name.trim(),
        shortName: shortName.trim() || name.trim(),
        description: description.trim(),
        iconName,
        featured,
        image
      });
      showToast(`Category "${name}" updated successfully!`, 'success');
    } else {
      addCategory({
        name: name.trim(),
        nameMr: nameMr.trim() || name.trim(),
        shortName: shortName.trim() || name.trim(),
        description: description.trim(),
        iconName,
        featured,
        image,
        itemCount: 0
      });
      showToast(`Category "${name}" added successfully!`, 'success');
    }

    navigate('/admin/categories');
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/categories"
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {isEditing ? 'Edit Service Category' : 'Add Service Category'}
            </h2>
            <p className="text-xs text-slate-500">
              {isEditing ? `Editing "${name || 'Category'}" details and cover imagery.` : 'Create a new printing service classification.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/categories"
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isUploading}
            className="px-5 py-2 bg-[#FF0038] hover:bg-rose-500 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-rose-600/25 cursor-pointer transition-all disabled:opacity-50 active:scale-95"
          >
            {isEditing ? 'Update Category' : 'Save Category'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs">
          
          {/* Left Column: Metadata & Details (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Category Title (English) <span className="text-[#FF0038]">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rigid Luxury Packaging"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#FF0038]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Category Title (मराठी)</label>
                <input
                  type="text"
                  placeholder="उदा. लक्झरी बॉक्स व पॅकेजिंग"
                  value={nameMr}
                  onChange={(e) => setNameMr(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#FF0038]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Short Name / Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Packaging"
                  value={shortName}
                  onChange={(e) => setShortName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#FF0038]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Display Icon</label>
                <select
                  value={iconName}
                  onChange={(e) => setIconName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#FF0038] bg-white cursor-pointer"
                >
                  <option value="Package">Package (Box / Cartons)</option>
                  <option value="CreditCard">CreditCard (Visiting Cards)</option>
                  <option value="FileText">FileText (Brochures / Reports)</option>
                  <option value="Mail">Mail (Envelopes / Letterheads)</option>
                  <option value="Sparkles">Sparkles (Luxury Invitations)</option>
                  <option value="Printer">Printer (Offset Production)</option>
                  <option value="Tag">Tag (Stickers / Labels)</option>
                  <option value="Folder">Folder (Office Project Files)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Description</label>
              <textarea
                rows={4}
                placeholder="Brief description of this category, paper stocks, and commercial finishing..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#FF0038] resize-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="featured-check"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-[#FF0038] focus:ring-[#FF0038] cursor-pointer"
              />
              <label htmlFor="featured-check" className="font-bold text-slate-700 cursor-pointer text-xs">
                Feature on storefront homepage categories grid
              </label>
            </div>
          </div>

          {/* Right Column: Cover Image & Drag-Drop (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">
                Category Cover Image <span className="text-[#FF0038]">*</span>
              </label>
              <p className="text-[11px] text-slate-400">
                Upload a high-quality product photo or catalog graphic (JPG, PNG, WEBP).
              </p>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {!image ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-[#FF0038] bg-rose-50/50 scale-[1.01]'
                    : 'border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center mx-auto mb-3 text-slate-500">
                  <UploadCloud className="w-6 h-6 text-[#FF0038]" />
                </div>
                <p className="font-bold text-slate-800 text-xs">
                  Click to select image or drag and drop here
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Supports PNG, JPG, JPEG, WEBP up to 10MB
                </p>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 relative shrink-0">
                    <img
                      src={image}
                      alt="Category Preview"
                      className="w-full h-full object-cover"
                    />
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 text-white animate-spin" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Image Ready</span>
                    </div>
                    <p className="font-semibold text-slate-800 truncate text-xs">
                      {imageFileName || 'Uploaded Category Image'}
                    </p>
                    {imageFileSize && (
                      <p className="text-[11px] text-slate-400">{imageFileSize}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg text-xs cursor-pointer transition-colors"
                    >
                      Change
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs cursor-pointer transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 space-y-1">
              <span className="font-bold text-slate-700 block">Catalog Visibility</span>
              <p className="text-[11px] leading-relaxed">
                Categories appear in the storefront navigation drawer, product filters, and commercial print quote selectors.
              </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
