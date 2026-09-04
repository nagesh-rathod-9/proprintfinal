import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Trash2, 
  X, 
  Plus, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  Sparkles, 
  Info 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CategoryId, Product } from '../../types';

export const AdminProductFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, categories, showToast } = useApp();

  const isEditing = Boolean(id);
  const existingProduct = isEditing ? products.find((p) => p.id === id) : null;

  // Form State
  const [name, setName] = useState(existingProduct?.name || '');
  const [categoryId, setCategoryId] = useState<CategoryId>(() => {
    if (existingProduct?.categoryId) return existingProduct.categoryId;
    return categories.length > 0 ? categories[0].id : '';
  });
  const [subCategory, setSubCategory] = useState(
    existingProduct?.finishes?.[0]?.name || '350 GSM Velvet Matte'
  );
  const [price, setPrice] = useState<string>(
    existingProduct ? existingProduct.basePrice.toString() : '299'
  );
  const [singlePrice, setSinglePrice] = useState<string>(
    existingProduct?.singlePrice !== undefined ? existingProduct.singlePrice.toString() : ''
  );
  const [bulkPrice100, setBulkPrice100] = useState<string>(
    existingProduct?.bulkPrice100 !== undefined ? existingProduct.bulkPrice100.toString() : ''
  );
  const [bulkPrice500, setBulkPrice500] = useState<string>(
    existingProduct?.bulkPrice500 !== undefined ? existingProduct.bulkPrice500.toString() : ''
  );
  const [bulkPrice1000, setBulkPrice1000] = useState<string>(
    existingProduct?.bulkPrice1000 !== undefined ? existingProduct.bulkPrice1000.toString() : ''
  );
  const [isBestSeller, setIsBestSeller] = useState<boolean>(
    existingProduct?.isBestSeller ?? false
  );
  const [minQty, setMinQty] = useState<string>(
    existingProduct ? existingProduct.minQuantity.toString() : '100'
  );
  const [turnaround, setTurnaround] = useState<string>(
    existingProduct?.specifications?.['Turnaround'] || '24-48 Hours'
  );
  const [description, setDescription] = useState(
    existingProduct?.description ||
      'Heidelberg 4-color offset press fidelity with European high-density board.'
  );
  const [tags, setTags] = useState<string[]>(
    existingProduct?.tags || ['Offset', 'Premium', 'Fast Dispatch']
  );
  const [newTagInput, setNewTagInput] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Uploaded Images State
  const [uploadedImages, setUploadedImages] = useState<
    { name: string; size: string; progress: number; preview: string }[]
  >(() => {
    if (existingProduct) {
      return [
        {
          name: `${existingProduct.name.replace(/\s+/g, '_')}_01.png`,
          size: '482 KB',
          progress: 100,
          preview: existingProduct.image
        }
      ];
    }
    return [
      {
        name: 'Luxury_Card_Mockup_01.png',
        size: '482 KB',
        progress: 100,
        preview: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'
      }
    ];
  });

  useEffect(() => {
    if (isEditing && existingProduct) {
      setName(existingProduct.name);
      setCategoryId(existingProduct.categoryId);
      setPrice(existingProduct.basePrice.toString());
      setSinglePrice(existingProduct.singlePrice !== undefined ? existingProduct.singlePrice.toString() : '');
      setBulkPrice100(existingProduct.bulkPrice100 !== undefined ? existingProduct.bulkPrice100.toString() : '');
      setBulkPrice500(existingProduct.bulkPrice500 !== undefined ? existingProduct.bulkPrice500.toString() : '');
      setBulkPrice1000(existingProduct.bulkPrice1000 !== undefined ? existingProduct.bulkPrice1000.toString() : '');
      setIsBestSeller(existingProduct.isBestSeller ?? false);
      setMinQty(existingProduct.minQuantity.toString());
      setDescription(existingProduct.description);
      setTags(existingProduct.tags || ['Offset', 'Premium']);
      if (existingProduct.specifications?.['Turnaround']) {
        setTurnaround(existingProduct.specifications['Turnaround']);
      }
      setUploadedImages([
        {
          name: `${existingProduct.name.replace(/\s+/g, '_')}_01.png`,
          size: '482 KB',
          progress: 100,
          preview: existingProduct.image
        }
      ]);
    } else if (!isEditing && categories.length > 0) {
      // Keep category pointing strictly to an existing database category
      if (!categoryId || !categories.some((c) => c.id === categoryId)) {
        setCategoryId(categories[0].id);
      }
    }
  }, [isEditing, existingProduct, categories, categoryId]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setUploadedImages([
          {
            name: file.name,
            size: `${(file.size / 1024).toFixed(0)} KB`,
            progress: 100,
            preview: data.url
          },
          ...uploadedImages
        ]);
        showToast('Image uploaded successfully!', 'success');
      } else {
        showToast('Failed to upload image', 'error');
      }
    } catch (err: any) {
      showToast('Error uploading image: ' + err.message, 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleLoadSampleImages = (type: 'cards' | 'stickers' | 'boxes' | 'files') => {
    if (type === 'cards') {
      setUploadedImages([
        {
          name: 'Visiting_Card_Matte_01.png',
          size: '412 KB',
          progress: 100,
          preview: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'
        }
      ]);
    } else if (type === 'files') {
      setUploadedImages([
        {
          name: 'Project_File_Mockup_01.png',
          size: '480 KB',
          progress: 100,
          preview: 'https://i.pinimg.com/736x/55/d7/5b/55d75bcfad0da6b4df44d19c9fe953b8.jpg'
        }
      ]);
    } else if (type === 'stickers') {
      setUploadedImages([
        {
          name: 'DieCut_Vinyl_Roll_01.png',
          size: '340 KB',
          progress: 100,
          preview: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=600&auto=format&fit=crop&q=80'
        }
      ]);
    } else {
      setUploadedImages([
        {
          name: 'Rigid_Box_Mailer_01.png',
          size: '580 KB',
          progress: 100,
          preview: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'
        }
      ]);
    }
    showToast('Loaded sample print assets', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!name.trim() || name.trim().length < 3) {
      showToast('Validation Error: Product name must be at least 3 characters', 'error');
      return;
    }

    if (!categoryId) {
      showToast('Validation Error: Please select a valid Category', 'error');
      return;
    }

    const basePriceNum = parseFloat(price);
    if (isNaN(basePriceNum) || basePriceNum <= 0) {
      showToast('Validation Error: Base Price must be a valid positive number', 'error');
      return;
    }

    const minQtyNum = parseInt(minQty);
    if (isNaN(minQtyNum) || minQtyNum <= 0) {
      showToast('Validation Error: Minimum quantity must be a positive integer', 'error');
      return;
    }

    if (!description.trim() || description.trim().length < 10) {
      showToast('Validation Error: Description must be at least 10 characters', 'error');
      return;
    }

    const mainImage = uploadedImages[0]?.preview || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80';

    const singlePriceNum = singlePrice.trim() ? parseFloat(singlePrice) : undefined;
    const bulkPrice100Num = bulkPrice100.trim() ? parseFloat(bulkPrice100) : undefined;
    const bulkPrice500Num = bulkPrice500.trim() ? parseFloat(bulkPrice500) : undefined;
    const bulkPrice1000Num = bulkPrice1000.trim() ? parseFloat(bulkPrice1000) : undefined;

    if (isEditing && existingProduct) {
      updateProduct(existingProduct.id, {
        name: name.trim(),
        categoryId,
        basePrice: Math.round(basePriceNum),
        singlePrice: singlePriceNum,
        bulkPrice100: bulkPrice100Num,
        bulkPrice500: bulkPrice500Num,
        bulkPrice1000: bulkPrice1000Num,
        isBestSeller,
        minQuantity: minQtyNum,
        description: description.trim(),
        tags,
        image: mainImage,
        specifications: {
          ...existingProduct.specifications,
          'Turnaround': turnaround,
          'Stock / Subcategory': subCategory
        }
      });
      showToast(`Product "${name}" updated successfully!`, 'success');
      navigate('/admin/products');
    } else {
      addProduct({
        name: name.trim(),
        categoryId,
        basePrice: Math.round(basePriceNum),
        singlePrice: singlePriceNum,
        bulkPrice100: bulkPrice100Num,
        bulkPrice500: bulkPrice500Num,
        bulkPrice1000: bulkPrice1000Num,
        isBestSeller,
        minQuantity: minQtyNum,
        defaultQuantity: minQtyNum,
        description: description.trim(),
        tags,
        image: mainImage,
        rating: 5.0,
        reviewsCount: 1,
        features: ['Heidelberg Offset Quality', 'Custom Finishing & Die-Cut'],
        specifications: {
          'Turnaround': turnaround,
          'Stock / Subcategory': subCategory
        }
      });
      showToast(`New Product "${name}" published successfully!`, 'success');
      navigate('/admin/products');
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Top Header with Back Navigation */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {isEditing ? `Edit Product: ${existingProduct?.name}` : 'Add Product'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Configure print product specs, pricing, mockups, and tags.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs transition-colors"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-[#FF0038] hover:bg-rose-500 active:scale-98 text-white font-extrabold rounded-xl text-xs shadow-md shadow-rose-600/30 transition-all cursor-pointer"
          >
            {isEditing ? 'Save Product' : 'Publish Product'}
          </button>
        </div>
      </div>

      {/* Main 2-Column Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: ADD IMAGES (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 block">Add Images</label>
              
              {/* Preset quick loaders */}
              <div className="flex items-center gap-1.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => handleLoadSampleImages('cards')}
                  className="text-[#FF0038] hover:underline cursor-pointer font-bold"
                >
                  + Cards
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => handleLoadSampleImages('stickers')}
                  className="text-[#FF0038] hover:underline cursor-pointer font-bold"
                >
                  + Stickers
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => handleLoadSampleImages('boxes')}
                  className="text-[#FF0038] hover:underline cursor-pointer font-bold"
                >
                  + Boxes
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => handleLoadSampleImages('files')}
                  className="text-[#FF0038] hover:underline cursor-pointer font-bold"
                >
                  + Files
                </button>
              </div>
            </div>

            {/* Dotted Upload Drag Zone with Native File Input */}
            <label className="border-2 border-dashed border-rose-300/80 bg-rose-50/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 hover:bg-rose-50/50 transition-all cursor-pointer group block">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploadingImage}
              />
              <div className="w-12 h-12 rounded-2xl bg-rose-100/60 flex items-center justify-center text-[#FF0038] group-hover:scale-110 transition-transform">
                {isUploadingImage ? (
                  <div className="w-6 h-6 border-2 border-[#FF0038] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ImageIcon className="w-6 h-6" />
                )}
              </div>
              <div className="text-xs text-slate-600">
                <span className="text-slate-800 font-bold">
                  {isUploadingImage ? 'Uploading image...' : 'Click to Upload from Device, or '}
                </span>
                <span className="text-[#FF0038] font-bold underline">Browse File</span>
              </div>
              <p className="text-[10px] text-slate-400">PNG, JPG, WEBP up to 50MB</p>
            </label>

            {/* Uploaded Files List with Progress Bars */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {uploadedImages.map((img, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-white shadow-2xs text-xs"
                >
                  <img
                    src={img.preview}
                    alt={img.name}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 truncate text-[11px]">
                        {img.name}
                      </span>
                    </div>
                    
                    {img.progress < 100 ? (
                      <div className="space-y-1 mt-1">
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-500 h-1.5 rounded-full transition-all"
                            style={{ width: `${img.progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] text-slate-400">
                          <span>{img.progress}% done</span>
                          <span>128KB/sec</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 block">{img.size}</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setUploadedImages(uploadedImages.filter((_, i) => i !== idx))
                    }
                    className="text-slate-300 hover:text-rose-500 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT COLUMN: FORM INPUTS (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-4 text-xs">
            
            {/* Product Name */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Product Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Luxury Velvet Visiting Card"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#FF0038] text-xs text-slate-900 focus:outline-none"
              />
            </div>

            {/* Category Dropdown - Only show categories existing in DB */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 block">Category <span className="text-[#FF0038]">*</span></label>
                <span className="text-[10px] text-slate-400 font-medium">({categories.length} from Database)</span>
              </div>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value as CategoryId)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#FF0038] text-xs text-slate-900 focus:outline-none cursor-pointer"
              >
                {categories.length === 0 ? (
                  <option value="" disabled>No categories found in database</option>
                ) : (
                  categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.nameMr ? `(${c.nameMr})` : ''}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Sub Category */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Sub Category / Paper GSM</label>
              <input
                type="text"
                placeholder="e.g. 350 GSM Velvet Matte, Mono Carton Box, Vinyl Sheet"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#FF0038] text-xs text-slate-900 focus:outline-none"
              />
            </div>

            {/* Price, Min Qty and Turnaround 3-Column Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Base Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    required
                    placeholder="299"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#FF0038] text-xs text-slate-900 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Min Quantity (Pcs)</label>
                <input
                  type="number"
                  required
                  placeholder="100"
                  value={minQty}
                  onChange={(e) => setMinQty(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#FF0038] text-xs text-slate-900 focus:outline-none font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Dispatch Time</label>
                <input
                  type="text"
                  placeholder="e.g. 24 Hours / 1 Day"
                  value={turnaround}
                  onChange={(e) => setTurnaround(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#FF0038] text-xs text-slate-900 focus:outline-none font-bold"
                />
              </div>
            </div>

            {/* Single Price & Bulk Pricing Options (100, 500, 1000) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF0038]" />
                    Single & Bulk Tier Pricing Strategy
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Set specific prices for single units, 100 units, 500 units, and 1,000 units. When customer selects these quantities, this exact rate applies automatically.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">Single Unit Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="e.g. 10"
                      value={singlePrice}
                      onChange={(e) => setSinglePrice(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-white border border-slate-200 focus:border-[#FF0038] text-xs text-slate-900 focus:outline-none font-bold"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">For 1 sample/pc</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">100 Qty Bulk Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      placeholder="e.g. 350"
                      value={bulkPrice100}
                      onChange={(e) => setBulkPrice100(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-white border border-slate-200 focus:border-[#FF0038] text-xs text-slate-900 focus:outline-none font-bold"
                    />
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium">Applied at 100 qty</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">500 Qty Bulk Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      placeholder="e.g. 1200"
                      value={bulkPrice500}
                      onChange={(e) => setBulkPrice500(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-white border border-slate-200 focus:border-[#FF0038] text-xs text-slate-900 focus:outline-none font-bold"
                    />
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium">Applied at 500 qty</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 block">1,000 Qty Bulk Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      placeholder="e.g. 1999"
                      value={bulkPrice1000}
                      onChange={(e) => setBulkPrice1000(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-white border border-slate-200 focus:border-[#FF0038] text-xs text-slate-900 focus:outline-none font-bold"
                    />
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium">Applied at 1000+ qty</span>
                </div>
              </div>
            </div>

            {/* Best Seller Featured Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
              <div className="space-y-0.5">
                <span className="font-extrabold text-amber-950 text-xs flex items-center gap-1.5">
                  ⭐ Mark as Best Selling Product
                </span>
                <p className="text-[11px] text-amber-800">
                  Feature this product on the Best Sellers showcase and the Best Selling Admin tab.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBestSeller}
                  onChange={(e) => setIsBestSeller(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF0038]"></div>
              </label>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Description</label>
              <textarea
                rows={3}
                placeholder="Enter print specifications, finishes, turnaround time..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 focus:border-[#FF0038] text-xs text-slate-900 focus:outline-none resize-none"
              />
            </div>

            {/* Tags (Interactive Red Chips) */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">Tags</label>
              <div className="flex flex-wrap gap-1.5 items-center">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#FF0038] text-white font-bold text-[11px] shadow-xs"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-rose-200 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                <div className="inline-flex items-center gap-1">
                  <input
                    type="text"
                    placeholder="+ Add Tag"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] w-24 focus:outline-none focus:border-[#FF0038]"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Primary Publish Button */}
            <div className="pt-4 text-right">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#FF0038] hover:bg-rose-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-rose-600/30 transition-all cursor-pointer active:scale-98"
              >
                {isEditing ? 'Save Changes' : 'Publish Product'}
              </button>
            </div>

          </div>

        </form>
      </div>

    </div>
  );
};
