import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Upload, 
  Check, 
  X, 
  Package, 
  Link as LinkIcon,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HeroSlide } from '../../types';
import { ConfirmModal } from '../../components/ConfirmModal';

// Fast client-side image compression and upload helper
const fastCompressAndUpload = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const resultData = e.target?.result as string;
      const img = new Image();
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas');
          const maxW = 1600;
          const maxH = 800;
          let { width, height } = img;

          if (width > maxW) {
            height = Math.round((height * maxW) / width);
            width = maxW;
          }
          if (height > maxH) {
            width = Math.round((width * maxH) / height);
            height = maxH;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(async (blob) => {
              if (blob) {
                const formData = new FormData();
                formData.append('file', blob, 'hero_banner.webp');
                try {
                  const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                  });
                  if (res.ok) {
                    const data = await res.json();
                    const finalUrl = data.url || data.file?.url;
                    if (finalUrl) {
                      resolve(finalUrl);
                      return;
                    }
                  }
                } catch {
                  // Fallback to data URL
                }
              }
              resolve(resultData);
            }, 'image/webp', 0.85);
            return;
          }
        } catch {
          // Fallback
        }
        resolve(resultData);
      };
      img.onerror = () => resolve(resultData);
      img.src = resultData;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

export const AdminHeroBannersPage: React.FC = () => {
  const { 
    heroSlides, 
    addHeroSlide, 
    updateHeroSlide, 
    deleteHeroSlide, 
    reorderHeroSlides, 
    resetHeroSlides,
    products,
    showToast 
  } = useApp();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [slideTitle, setSlideTitle] = useState('');
  const [slideSubtitle, setSlideSubtitle] = useState('');
  const [slideImage, setSlideImage] = useState('');
  const [slideButtonText, setSlideButtonText] = useState('Order Now');
  const [slideProductId, setSlideProductId] = useState('');
  const [slideCategoryLink, setSlideCategoryLink] = useState('/products');
  const [slideIsActive, setSlideIsActive] = useState(true);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState<HeroSlide | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active Slides
  const activeSlides = heroSlides.filter(s => s.isActive !== false);

  const openCreateModal = () => {
    setEditingSlide(null);
    setSlideTitle('');
    setSlideSubtitle('');
    setSlideImage('');
    setSlideButtonText('Order Now');
    setSlideProductId('');
    setSlideCategoryLink('/products');
    setSlideIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setSlideTitle(slide.title1 || '');
    setSlideSubtitle(slide.subtitle || '');
    setSlideImage(slide.image || '');
    setSlideButtonText(slide.buttonText || 'Order Now');
    setSlideProductId(slide.productId || '');
    setSlideCategoryLink(slide.categoryLink || '/products');
    setSlideIsActive(slide.isActive !== false);
    setIsModalOpen(true);
  };

  const handleFileSelect = async (file: File) => {
    if (!file) return;
    // Fast local preview
    const tempUrl = URL.createObjectURL(file);
    setSlideImage(tempUrl);
    setIsProcessingImage(true);

    const uploadedUrl = await fastCompressAndUpload(file);
    if (uploadedUrl) {
      setSlideImage(uploadedUrl);
    }
    setIsProcessingImage(false);
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideImage.trim()) {
      showToast('Please select or upload a banner image', 'error');
      return;
    }

    const payload: Partial<HeroSlide> = {
      title1: slideTitle.trim() || 'Commercial Printing Services',
      subtitle: slideSubtitle.trim(),
      image: slideImage.trim(),
      buttonText: slideButtonText.trim() || 'Order Now',
      productId: slideProductId.trim(),
      categoryLink: slideCategoryLink.trim() || '/products',
      isActive: slideIsActive
    };

    // Close modal instantly for fast response
    setIsModalOpen(false);

    if (editingSlide) {
      updateHeroSlide(editingSlide.id, payload);
    } else {
      addHeroSlide(payload);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === heroSlides.length - 1) return;

    const newSlides = [...heroSlides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    const orderedIds = newSlides.map(s => s.id);
    reorderHeroSlides(orderedIds);
  };

  const handleToggleActive = (slide: HeroSlide) => {
    const newActive = slide.isActive === false ? true : false;
    updateHeroSlide(slide.id, { isActive: newActive }, true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">Hero Banners Manager</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              {activeSlides.length} Live On Store
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage and update the top banner slideshow displayed on your homepage.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
          >
            <span>View Storefront</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </Link>

          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            title="Reset to default slides"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF0038] hover:bg-rose-500 active:scale-98 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-600/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Banner</span>
          </button>
        </div>
      </div>

      {/* Hero Banner Slides Grid / Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm">
            Active Banner Sequence ({heroSlides.length} Total)
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">
            Use arrows to reorder
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px] bg-slate-50/50">
                <th className="py-3 px-3 w-16 text-center">Order</th>
                <th className="py-3 px-3 w-36">Banner Artwork</th>
                <th className="py-3 px-3">Headline & Destination</th>
                <th className="py-3 px-3 text-center w-24">Status</th>
                <th className="py-3 px-3 text-center w-32">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {heroSlides.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-xs">
                    No banners configured. Click "+ Add Banner" above.
                  </td>
                </tr>
              ) : (
                heroSlides.map((slide, index) => (
                  <tr key={slide.id || index} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Order Controls */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleMove(index, 'up')}
                          disabled={index === 0}
                          title="Move Up"
                          className={`p-1 rounded-md border ${
                            index === 0
                              ? 'text-slate-200 border-slate-100 cursor-not-allowed'
                              : 'text-slate-600 border-slate-200 hover:bg-slate-100 cursor-pointer active:scale-90'
                          }`}
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMove(index, 'down')}
                          disabled={index === heroSlides.length - 1}
                          title="Move Down"
                          className={`p-1 rounded-md border ${
                            index === heroSlides.length - 1
                              ? 'text-slate-200 border-slate-100 cursor-not-allowed'
                              : 'text-slate-600 border-slate-200 hover:bg-slate-100 cursor-pointer active:scale-90'
                          }`}
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold block mt-1">
                        #{index + 1}
                      </span>
                    </td>

                    {/* Banner Thumbnail */}
                    <td className="py-3 px-3">
                      <div className="w-32 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs relative">
                        <img
                          src={slide.image}
                          alt={slide.title1 || 'Banner'}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </td>

                    {/* Headline & Details */}
                    <td className="py-3 px-3">
                      <div className="space-y-1">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm">
                          {slide.title1 || 'Untitled Banner'}
                        </div>
                        {slide.subtitle && (
                          <div className="text-[11px] text-slate-500 line-clamp-1">
                            {slide.subtitle}
                          </div>
                        )}
                        <div className="flex items-center gap-2 pt-0.5">
                          {slide.productId ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-[10px]">
                              <Package className="w-3 h-3" />
                              <span>{products.find(p => p.id === slide.productId)?.name || slide.productId}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 font-semibold text-[10px]">
                              <LinkIcon className="w-3 h-3" />
                              <span>{slide.categoryLink || '/products'}</span>
                            </span>
                          )}
                          {slide.buttonText && (
                            <span className="text-[10px] text-slate-400">
                              CTA: <strong className="text-slate-600">"{slide.buttonText}"</strong>
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Active Visibility Status Toggle */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleToggleActive(slide)}
                        title="Click to toggle visibility"
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                          slide.isActive !== false
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-600 border border-slate-300 hover:bg-slate-300'
                        }`}
                      >
                        {slide.isActive !== false ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Edit & Delete Action Buttons */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(slide)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition-colors flex items-center gap-1"
                          title="Edit banner"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setSlideToDelete(slide)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold cursor-pointer transition-colors"
                          title="Delete banner"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* ========================================================= */}
      {/* ADD / EDIT HERO BANNER MODAL                             */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-5 sm:p-7 space-y-5 shadow-2xl border border-slate-200 text-xs my-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {editingSlide ? 'Edit Banner Slide' : 'Add New Banner Slide'}
                </h3>
                <p className="text-xs text-slate-500">
                  Upload an image or select a sample poster.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="space-y-4">
              
              {/* Image Container with Drag/Drop & Click */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-800 text-xs">
                  Banner Poster Image <span className="text-rose-500">*</span>
                </label>

                {/* Live Preview Box */}
                {slideImage ? (
                  <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 shadow-inner group">
                    <img
                      src={slideImage}
                      alt="Banner Preview"
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-white text-slate-900 font-bold text-xs shadow-md cursor-pointer hover:bg-slate-100"
                      >
                        Replace Image
                      </button>
                    </div>
                    {isProcessingImage && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold">
                        Optimizing & uploading...
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-cyan-500 bg-slate-50 hover:bg-cyan-50/40 rounded-2xl p-6 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors text-center"
                  >
                    <Upload className="w-6 h-6 text-cyan-600" />
                    <span className="font-bold text-slate-700 text-xs">
                      Click to Upload Banner Image
                    </span>
                    <span className="text-[10px] text-slate-400">PNG, JPG, WEBP — automatically optimized</span>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />

                {/* Sample Presets */}
                <div className="pt-1">
                  <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                    Or select a print sample artwork:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Brochures & Catalogs', url: 'https://i.pinimg.com/736x/c6/e3/bb/c6e3bbbd242f377f64021fe55c33b17d.jpg', prod: 'prod-premium-brochure', title: 'Brochure & Catalog Printing' },
                      { label: 'Custom Stickers', url: 'https://i.pinimg.com/1200x/d3/0d/ca/d30dcabb85e6a44689838e953c3d78c3.jpg', prod: 'prod-die-cut-sticker-sheet', title: 'Custom Die Cut Stickers' },
                      { label: 'Packaging Boxes', url: 'https://i.pinimg.com/736x/bb/c1/3d/bbc13d8711ec67195aae22fe376e4d40.jpg', prod: 'prod-custom-packaging-box', title: 'Custom Packaging Boxes' },
                      { label: 'Visiting Cards', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80', prod: 'prod-visiting-card-350gsm', title: 'Luxury Velvet Matte Visiting Cards' },
                      { label: 'Marketing Flyers', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&auto=format&fit=crop&q=80', prod: 'prod-premium-flyer', title: 'Commercial Marketing Flyers' }
                    ].map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => {
                          setSlideImage(preset.url);
                          setSlideTitle(preset.title);
                          setSlideProductId(preset.prod);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 border border-slate-200 cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Banner Headline</label>
                  <input
                    type="text"
                    value={slideTitle}
                    onChange={(e) => setSlideTitle(e.target.value)}
                    placeholder="e.g. Brochure & Catalog Printing"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Subtitle / Offer</label>
                  <input
                    type="text"
                    value={slideSubtitle}
                    onChange={(e) => setSlideSubtitle(e.target.value)}
                    placeholder="e.g. High-definition full color offset print"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Destination & Button */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Link Directly to Product</label>
                  <select
                    value={slideProductId}
                    onChange={(e) => setSlideProductId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="">None (Custom Link)</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">CTA Button Label</label>
                  <input
                    type="text"
                    value={slideButtonText}
                    onChange={(e) => setSlideButtonText(e.target.value)}
                    placeholder="Order Now"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={slideIsActive}
                    onChange={(e) => setSlideIsActive(e.target.checked)}
                    className="w-4 h-4 text-cyan-600 rounded cursor-pointer"
                  />
                  <span className="font-bold text-slate-800">
                    Display in Live Storefront
                  </span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#FF0038] hover:bg-rose-500 text-white font-bold shadow-md cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingSlide ? 'Save Changes' : 'Save Banner'}</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete Slide Confirmation Modal */}
      <ConfirmModal
        isOpen={!!slideToDelete}
        title="Delete Banner Slide"
        message={`Are you sure you want to delete banner slide "${slideToDelete?.title1}"? This slide will no longer be displayed on the homepage.`}
        confirmText="Delete Slide"
        variant="danger"
        onConfirm={() => {
          if (slideToDelete) {
            deleteHeroSlide(slideToDelete.id);
            showToast(`Banner "${slideToDelete.title1}" removed`, 'info');
            setSlideToDelete(null);
          }
        }}
        onCancel={() => setSlideToDelete(null)}
      />

      {/* Reset Defaults Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Reset Hero Banners"
        message="Are you sure you want to reset all homepage hero banners to factory default slides? Any custom banners you created will be replaced."
        confirmText="Reset to Defaults"
        variant="warning"
        onConfirm={() => {
          resetHeroSlides();
          showToast('Hero banners reset to factory defaults', 'success');
          setIsResetConfirmOpen(false);
        }}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

    </div>
  );
};
