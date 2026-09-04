import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Sparkles, 
  Palette, 
  Store, 
  Heart, 
  Radio, 
  Briefcase, 
  Printer, 
  Layers, 
  Stamp, 
  FileCheck, 
  Tag, 
  Calendar, 
  Package, 
  Scissors, 
  Award, 
  Image as ImageIcon, 
  Maximize, 
  Shirt, 
  Box,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ServiceItem } from '../../types';

const AVAILABLE_ICONS = [
  { name: 'Palette', label: 'Palette / Design', icon: Palette },
  { name: 'Printer', label: 'Printer / Press', icon: Printer },
  { name: 'Layers', label: 'Layers / Offset', icon: Layers },
  { name: 'Package', label: 'Package / Box', icon: Package },
  { name: 'Store', label: 'Store / Facade', icon: Store },
  { name: 'Heart', label: 'Heart / Wedding', icon: Heart },
  { name: 'Radio', label: 'Radio / Media', icon: Radio },
  { name: 'Briefcase', label: 'Briefcase / B2B', icon: Briefcase },
  { name: 'Sparkles', label: 'Sparkles / Promo', icon: Sparkles },
  { name: 'Stamp', label: 'Stamp / Screen', icon: Stamp },
  { name: 'FileCheck', label: 'File / Office', icon: FileCheck },
  { name: 'Tag', label: 'Tag / Label', icon: Tag },
  { name: 'Calendar', label: 'Calendar', icon: Calendar },
  { name: 'Scissors', label: 'Scissors / Die Cut', icon: Scissors },
  { name: 'Award', label: 'Award / Foil', icon: Award },
  { name: 'Image', label: 'Image / Vinyl', icon: ImageIcon },
  { name: 'Maximize', label: 'Maximize / Flex', icon: Maximize },
  { name: 'Shirt', label: 'Shirt / Apparel', icon: Shirt },
  { name: 'Box', label: 'Box / Carton', icon: Box },
];

export const AdminServiceFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { services, addService, updateService, showToast } = useApp();

  const isEditing = Boolean(id);
  const existingService = services.find((s) => s.id === id);

  const [formData, setFormData] = useState<Partial<ServiceItem>>({
    id: '',
    name: '',
    category: 'printing',
    tagline: '',
    description: '',
    turnaround: '24 - 48 Hours',
    minOrder: '50 Units',
    iconName: 'Printer',
    badge: ''
  });

  useEffect(() => {
    if (isEditing && existingService) {
      setFormData({
        id: existingService.id,
        name: existingService.name,
        category: existingService.category,
        tagline: existingService.tagline,
        description: existingService.description,
        turnaround: existingService.turnaround,
        minOrder: existingService.minOrder,
        iconName: existingService.iconName || 'Printer',
        badge: existingService.badge || ''
      });
    }
  }, [isEditing, existingService]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (!isEditing && !formData.id) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData((prev) => ({ ...prev, name, id: slug }));
    } else {
      setFormData((prev) => ({ ...prev, name }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      showToast('Please enter a service name', 'error');
      return;
    }

    if (isEditing && id) {
      updateService(id, formData);
      navigate('/admin/services');
    } else {
      const serviceId = formData.id?.trim() || `srv-${Date.now()}`;
      addService({ ...formData, id: serviceId });
      navigate('/admin/services');
    }
  };

  const renderIconComponent = (iconName?: string) => {
    const found = AVAILABLE_ICONS.find((i) => i.name === iconName) || AVAILABLE_ICONS[1];
    const IconComponent = found.icon;
    return <IconComponent className="w-6 h-6 text-white" />;
  };

  return (
    <div className="w-full space-y-6 pb-12">
      
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/services"
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {isEditing ? `Edit Service: ${formData.name}` : 'Create New Service Capability'}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Configure press specifications, turnaround times, and storefront presentation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/services"
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
          >
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#FF0038] hover:bg-rose-500 active:scale-95 text-white text-xs font-black shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Save Changes' : 'Create Service'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Form Inputs Left (8 Cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
          
          {/* Service Name & ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Service Name <span className="text-[#FF0038]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. UV Flatbed Printing"
                value={formData.name || ''}
                onChange={handleNameChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#FF0038]/30 focus:border-[#FF0038] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Service Slug / ID <span className="text-[#FF0038]">*</span>
              </label>
              <input
                type="text"
                required
                disabled={isEditing}
                placeholder="e.g. uv-flatbed-printing"
                value={formData.id || ''}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 disabled:opacity-75 focus:outline-none"
              />
            </div>
          </div>

          {/* Category Toggle (Branding vs Printing) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Service Category <span className="text-[#FF0038]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, category: 'branding' })}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  formData.category === 'branding'
                    ? 'border-[#FF0038] bg-rose-50/70 text-slate-950 ring-2 ring-rose-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-[#FF0038] text-white flex items-center justify-center">
                  <Palette className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Branding, Design & Media</div>
                  <div className="text-[10px] text-slate-500">Logos, Facades, Hoardings & Events</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, category: 'printing' })}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  formData.category === 'printing'
                    ? 'border-[#FF0038] bg-rose-50/70 text-slate-950 ring-2 ring-rose-500/20'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">Printing & Packaging</div>
                  <div className="text-[10px] text-slate-500">Offset, Digital, Boxes & Vinyl</div>
                </div>
              </button>
            </div>
          </div>

          {/* Tagline */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Short Tagline / Highlight
            </label>
            <input
              type="text"
              placeholder="e.g. Ultra-High Definition 2400 DPI Offset Press"
              value={formData.tagline || ''}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#FF0038]/30 focus:border-[#FF0038] focus:outline-none"
            />
          </div>

          {/* Turnaround, Min Order, Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Turnaround Time
              </label>
              <input
                type="text"
                placeholder="e.g. 24 - 48 Hours"
                value={formData.turnaround || ''}
                onChange={(e) => setFormData({ ...formData, turnaround: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#FF0038]/30 focus:border-[#FF0038] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Min Order Quantity
              </label>
              <input
                type="text"
                placeholder="e.g. 100 Pcs"
                value={formData.minOrder || ''}
                onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#FF0038]/30 focus:border-[#FF0038] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Optional Badge
              </label>
              <input
                type="text"
                placeholder="e.g. Express, Bulk Value"
                value={formData.badge || ''}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-[#FF0038]/30 focus:border-[#FF0038] focus:outline-none"
              />
            </div>

          </div>

          {/* Icon Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Service Vector Icon
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
              {AVAILABLE_ICONS.map((item) => {
                const IconComp = item.icon;
                const isSelected = formData.iconName === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, iconName: item.name })}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FF0038] text-white border-[#FF0038] shadow-md shadow-rose-600/30'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <IconComp className="w-4 h-4 mb-1" />
                    <span className="text-[9px] font-bold truncate max-w-full">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Detailed Description & Press Specs
            </label>
            <textarea
              rows={4}
              placeholder="Detail the materials, machines, finishing options, GSM weight, and customer benefits..."
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-[#FF0038]/30 focus:border-[#FF0038] focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/services')}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#FF0038] hover:bg-rose-500 active:scale-95 text-white text-xs font-black shadow-lg shadow-rose-600/30 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Update Service' : 'Publish Service'}</span>
            </button>
          </div>

        </form>

        {/* Live Storefront Preview Card Right (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF0038]">
                Live Store Preview
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Storefront Card</span>
            </div>

            {/* Render Card Preview */}
            <div className="bg-white rounded-2xl p-5 text-slate-900 shadow-md border border-slate-100 space-y-3">
              
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                    formData.category === 'branding'
                      ? 'bg-[#FF0038] shadow-rose-600/30'
                      : 'bg-slate-950 shadow-slate-950/30'
                  }`}>
                    {renderIconComponent(formData.iconName)}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 leading-tight">
                      {formData.name || 'Service Title'}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-bold">
                      {formData.category === 'branding' ? 'Design & Branding' : 'Commercial Printing'}
                    </span>
                  </div>
                </div>

                {formData.badge && (
                  <span className="text-[9px] font-black bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded">
                    {formData.badge}
                  </span>
                )}
              </div>

              <div className="text-xs font-bold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                {formData.tagline || 'Service Tagline and Quick Capability'}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {formData.description || 'Detailed service explanation will appear here for customers browsing your catalog.'}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                <div className="flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#FF0038]" />
                  <span>{formData.turnaround || '24h Turnaround'}</span>
                </div>
                <div className="flex items-center gap-1 font-medium justify-end">
                  <Package className="w-3.5 h-3.5 text-slate-400" />
                  <span>Min: <strong>{formData.minOrder || '1 Unit'}</strong></span>
                </div>
              </div>

              <div className="pt-2">
                <div className="w-full py-2 bg-[#FF0038] text-white text-center rounded-xl text-xs font-extrabold shadow-md shadow-rose-600/20">
                  Request Commercial Quote
                </div>
              </div>

            </div>

            <p className="text-[11px] text-slate-400 text-center font-medium">
              Changes reflect immediately on the Graphic Design & Printing Capabilities showcase.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
