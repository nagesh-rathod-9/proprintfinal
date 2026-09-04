import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  Sparkles, 
  Info,
  Palette,
  MapPin,
  Tag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PortfolioItem } from '../../types';

export const AdminDesignWorkFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { portfolio, addPortfolioItem, updatePortfolioItem, showToast } = useApp();

  const isEditing = Boolean(id);
  const existingItem = isEditing ? portfolio.find((p) => p.id === id) : null;

  // Form states
  const [title, setTitle] = useState(existingItem?.title || '');
  const [titleMr, setTitleMr] = useState(existingItem?.titleMr || '');
  const [category, setCategory] = useState<string>(existingItem?.category || 'branding');
  const [client, setClient] = useState(existingItem?.client || '');
  const [city, setCity] = useState(existingItem?.city || 'Chhatrapati Sambhajinagar');
  const [cityMr, setCityMr] = useState(existingItem?.cityMr || 'छत्रपती संभाजीनगर');
  const [badge, setBadge] = useState(existingItem?.badge || 'Featured Work');
  const [description, setDescription] = useState(existingItem?.description || '');
  const [descriptionMr, setDescriptionMr] = useState(existingItem?.descriptionMr || '');
  const [aspectRatio, setAspectRatio] = useState<'square' | 'wide' | 'tall'>(existingItem?.aspectRatio || 'square');
  const [imageUrl, setImageUrl] = useState(
    existingItem?.image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80'
  );
  const [deliverables, setDeliverables] = useState<string[]>(
    existingItem?.deliverables || ['Brand Identity', 'Packaging Box', 'Social Media']
  );
  const [newDeliverableInput, setNewDeliverableInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Dropdown category options matching Design Works UI
  const categoryDropdownOptions = [
    { id: 'branding', label: 'Branding & Corporate Identity', labelMr: 'ब्रँडिंग व कॉर्पोरेट ओळख' },
    { id: 'logo', label: 'Logos & Brand Marks', labelMr: 'लोगो डिझाईन' },
    { id: 'packaging', label: 'Packaging, Boxes & Pouches', labelMr: 'उत्पादन पॅकेजिंग व बॉक्सेस' },
    { id: 'social', label: 'Social Media & Digital Creatives', labelMr: 'सोशल मीडिया पोस्ट्स' },
    { id: 'outdoor', label: 'Outdoor Hoardings & Banners', labelMr: 'आऊटडोअर होर्डिंग्स' },
    { id: 'brochure', label: 'Brochures, Catalogs & Booklets', labelMr: 'ब्रोशर्स व कॅटलॉग्ज' },
    { id: 'stationery', label: 'Luxury Visiting Cards & Stationery', labelMr: 'व्हिजिटिंग कार्ड्स व स्टेशनरी' },
  ];

  useEffect(() => {
    if (isEditing && existingItem) {
      setTitle(existingItem.title);
      setTitleMr(existingItem.titleMr || existingItem.title);
      setCategory(existingItem.category);
      setClient(existingItem.client || '');
      setCity(existingItem.city || 'Chhatrapati Sambhajinagar');
      setCityMr(existingItem.cityMr || 'छत्रपती संभाजीनगर');
      setBadge(existingItem.badge || '');
      setDescription(existingItem.description || '');
      setDescriptionMr(existingItem.descriptionMr || '');
      setAspectRatio(existingItem.aspectRatio || 'square');
      setImageUrl(existingItem.image);
      setDeliverables(existingItem.deliverables || ['Brand Identity', 'Vector Design']);
    }
  }, [isEditing, existingItem]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setImageUrl(data.url);
        showToast('Design artwork image uploaded successfully!', 'success');
      } else {
        showToast('Failed to upload image: ' + (data.error || 'Unknown error'), 'error');
      }
    } catch (err: any) {
      showToast('Error uploading image: ' + err.message, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddDeliverable = () => {
    if (newDeliverableInput.trim() && !deliverables.includes(newDeliverableInput.trim())) {
      setDeliverables([...deliverables, newDeliverableInput.trim()]);
      setNewDeliverableInput('');
    }
  };

  const handleRemoveDeliverable = (item: string) => {
    setDeliverables(deliverables.filter((d) => d !== item));
  };

  const handleLoadSampleImage = (type: 'box' | 'logo' | 'social' | 'brochure') => {
    const samples = {
      box: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
      logo: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800&auto=format&fit=crop&q=80',
      social: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      brochure: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'
    };
    setImageUrl(samples[type]);
    showToast(`Loaded ${type} artwork preset`, 'info');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || title.trim().length < 2) {
      showToast('Validation Error: Project title is required', 'error');
      return;
    }

    if (!imageUrl) {
      showToast('Validation Error: Please upload or select a design artwork image', 'error');
      return;
    }

    const selectedCatObj = categoryDropdownOptions.find((c) => c.id === category);
    const categoryLabel = selectedCatObj?.label || category;
    const categoryLabelMr = selectedCatObj?.labelMr || category;

    const payload: Partial<PortfolioItem> = {
      title: title.trim(),
      titleMr: titleMr.trim() || title.trim(),
      category,
      categoryLabel,
      categoryLabelMr,
      client: client.trim() || 'Proprint In-House Studio',
      city: city.trim() || 'Chhatrapati Sambhajinagar',
      cityMr: cityMr.trim() || 'छत्रपती संभाजीनगर',
      image: imageUrl,
      aspectRatio,
      description: description.trim(),
      descriptionMr: descriptionMr.trim() || description.trim(),
      deliverables,
      tags: deliverables,
      badge: badge.trim(),
      badgeMr: badge.trim()
    };

    if (isEditing && existingItem) {
      await updatePortfolioItem(existingItem.id, payload);
      showToast(`Design work "${title}" updated successfully!`, 'success');
      navigate('/admin/design-works');
    } else {
      await addPortfolioItem(payload);
      showToast(`New design work "${title}" added to portfolio!`, 'success');
      navigate('/admin/design-works');
    }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/design-works"
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {isEditing ? `Edit Design Work: ${existingItem?.title}` : 'Add Design Work'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Upload design project mockups, select category, and showcase branding deliverables.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF0038] hover:bg-rose-500 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/25 transition-all cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>{isEditing ? 'Save Work' : 'Publish to Portfolio'}</span>
        </button>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        
        {/* Section 1: Image Upload & Preview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
              <ImageIcon className="w-4 h-4 text-[#FF0038]" />
              <span>Artwork Mockup Image (File Upload)</span>
            </label>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="text-slate-400">Presets:</span>
              <button
                type="button"
                onClick={() => handleLoadSampleImage('box')}
                className="text-[#FF0038] hover:underline font-bold cursor-pointer"
              >
                Packaging Box
              </button>
              <button
                type="button"
                onClick={() => handleLoadSampleImage('logo')}
                className="text-[#FF0038] hover:underline font-bold cursor-pointer"
              >
                Logo
              </button>
              <button
                type="button"
                onClick={() => handleLoadSampleImage('social')}
                className="text-[#FF0038] hover:underline font-bold cursor-pointer"
              >
                Social Post
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Upload Drag/Click Zone */}
            <div className="md:col-span-7">
              <label className="border-2 border-dashed border-rose-300/80 bg-rose-50/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-3 hover:bg-rose-50/50 transition-all cursor-pointer group h-56">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <div className="w-14 h-14 rounded-2xl bg-rose-100/60 flex items-center justify-center text-[#FF0038] group-hover:scale-110 transition-transform">
                  {isUploading ? (
                    <div className="w-7 h-7 border-2 border-[#FF0038] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-7 h-7" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-800 font-bold">
                    {isUploading ? 'Uploading artwork...' : 'Click to Upload High-Res Image from Device'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Supports PNG, JPG, WEBP mockups (Saved live to /uploads)
                  </p>
                </div>
              </label>

              {/* Direct URL input fallback */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] text-slate-400 shrink-0 font-medium">Or Image URL:</span>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-2.5 py-1 text-[11px] rounded-lg bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#FF0038]"
                />
              </div>
            </div>

            {/* Live Artwork Preview */}
            <div className="md:col-span-5 flex flex-col items-center justify-center">
              <div className="w-full h-56 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 relative group shadow-sm flex items-center justify-center">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Artwork Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-slate-400">No image uploaded</span>
                )}
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  Live Preview
                </div>
                {badge && (
                  <div className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                    {badge}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Section 2: Project Details & Category Dropdown */}
        <div className="space-y-4">
          <label className="text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <Palette className="w-4 h-4 text-[#FF0038]" />
            <span>Project Details & Category</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Title (English) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Project Title (English) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Spice Mono-Carton Packaging"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#FF0038] text-xs text-slate-900 focus:outline-none font-bold"
              />
            </div>

            {/* Title (Marathi) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Project Title (मराठी)
              </label>
              <input
                type="text"
                placeholder="e.g. रॉयल स्पाईस पॅकेजिंग बॉक्स डिझाईन"
                value={titleMr}
                onChange={(e) => setTitleMr(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#FF0038] text-xs text-slate-900 focus:outline-none font-marathi font-bold"
              />
            </div>

            {/* Category Dropdown (As explicitly requested by user) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Category (Select from Dropdown) *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#FF0038] text-xs text-slate-900 focus:outline-none font-bold cursor-pointer"
              >
                {categoryDropdownOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label} ({opt.labelMr})
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400">
                Filters matching this category will display this design work on the Home page.
              </p>
            </div>

            {/* Badge */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Badge / Tagline Highlight
              </label>
              <input
                type="text"
                placeholder="e.g. Featured Work, Luxury Gold Foil, Fast Launch"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#FF0038] text-xs text-slate-900 focus:outline-none"
              />
            </div>

            {/* Client Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Client / Brand Name
              </label>
              <input
                type="text"
                placeholder="e.g. Kothari Organic Spices"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#FF0038] text-xs text-slate-900 focus:outline-none"
              />
            </div>

            {/* City */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                City / Location
              </label>
              <input
                type="text"
                placeholder="e.g. Chhatrapati Sambhajinagar"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-[#FF0038] text-xs text-slate-900 focus:outline-none"
              />
            </div>

          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Section 3: Deliverables & Description */}
        <div className="space-y-4">
          
          {/* Deliverables Chips */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Deliverables & Specifications Tags
            </label>
            <div className="flex flex-wrap gap-1.5 items-center">
              {deliverables.map((d, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs"
                >
                  {d}
                  <button
                    type="button"
                    onClick={() => handleRemoveDeliverable(d)}
                    className="hover:text-rose-900 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}

              <div className="inline-flex items-center gap-1">
                <input
                  type="text"
                  placeholder="+ Add Deliverable"
                  value={newDeliverableInput}
                  onChange={(e) => setNewDeliverableInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddDeliverable();
                    }
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg border border-dashed border-slate-300 focus:outline-none focus:border-[#FF0038] w-36"
                />
                <button
                  type="button"
                  onClick={handleAddDeliverable}
                  className="p-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Description (English) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Project Description (English)
            </label>
            <textarea
              rows={3}
              placeholder="Describe the design concept, color palette, packaging dimensions, finishing used..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 focus:border-[#FF0038] text-xs text-slate-900 focus:outline-none resize-none"
            />
          </div>

          {/* Description (Marathi) */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 block">
              Project Description (मराठी)
            </label>
            <textarea
              rows={2}
              placeholder="डिझाईनची वैशिष्ट्ये, वापरलेला रंगसंगती व फिनिशिंग..."
              value={descriptionMr}
              onChange={(e) => setDescriptionMr(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 focus:border-[#FF0038] text-xs text-slate-900 focus:outline-none resize-none font-marathi"
            />
          </div>

        </div>

        {/* Submit Bottom Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link
            to="/admin/design-works"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FF0038] hover:bg-rose-500 active:scale-98 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/25 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{isEditing ? 'Save Changes' : 'Publish Design Work'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
