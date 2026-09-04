import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Clock, 
  CheckCircle2, 
  Layers, 
  Printer, 
  Palette, 
  Store, 
  Heart, 
  Radio, 
  Briefcase, 
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
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ServiceItem } from '../../types';

export const AdminServicesPage: React.FC = () => {
  const { services, deleteService, showToast } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'branding' | 'printing'>('all');
  const [serviceToDelete, setServiceToDelete] = useState<ServiceItem | null>(null);

  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.badge && service.badge.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const brandingCount = services.filter((s) => s.category === 'branding').length;
  const printingCount = services.filter((s) => s.category === 'printing').length;

  const renderServiceIcon = (iconName: string) => {
    const iconProps = { className: "w-5 h-5 text-white" };
    switch (iconName) {
      case 'Palette': return <Palette {...iconProps} />;
      case 'Store': return <Store {...iconProps} />;
      case 'Heart': return <Heart {...iconProps} />;
      case 'Radio': return <Radio {...iconProps} />;
      case 'Briefcase': return <Briefcase {...iconProps} />;
      case 'Sparkles': return <Sparkles {...iconProps} />;
      case 'Printer': return <Printer {...iconProps} />;
      case 'Layers': return <Layers {...iconProps} />;
      case 'Stamp': return <Stamp {...iconProps} />;
      case 'FileCheck': return <FileCheck {...iconProps} />;
      case 'Tag': return <Tag {...iconProps} />;
      case 'Calendar': return <Calendar {...iconProps} />;
      case 'Package': return <Package {...iconProps} />;
      case 'Scissors': return <Scissors {...iconProps} />;
      case 'Award': return <Award {...iconProps} />;
      case 'Image': return <ImageIcon {...iconProps} />;
      case 'Maximize': return <Maximize {...iconProps} />;
      case 'Shirt': return <Shirt {...iconProps} />;
      case 'Box': return <Box {...iconProps} />;
      default: return <Printer {...iconProps} />;
    }
  };

  const handleDeleteConfirm = () => {
    if (serviceToDelete) {
      deleteService(serviceToDelete.id);
      setServiceToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#FF0038] bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              Commercial Press Directory
            </span>
            <span className="text-xs font-mono font-bold text-slate-400">
              {services.length} Total Services
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-950 tracking-tight mt-1">
            Services & Printing Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Manage your design, branding, digital and offset printing service cards displayed on the storefront.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/admin/services/add"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF0038] hover:bg-rose-500 active:scale-95 text-white text-xs font-extrabold shadow-lg shadow-rose-600/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </Link>
        </div>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl max-w-fit">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              All Capabilities ({services.length})
            </button>

            <button
              onClick={() => setSelectedCategory('branding')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'branding'
                  ? 'bg-[#FF0038] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Design & Branding ({brandingCount})</span>
            </button>

            <button
              onClick={() => setSelectedCategory('printing')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'printing'
                  ? 'bg-[#FF0038] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Printing & Packaging ({printingCount})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, tagline, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF0038]/30 focus:border-[#FF0038]"
            />
          </div>

        </div>
      </div>

      {/* Services Grid / Table */}
      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#FF0038] flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Services Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No service matched your current search query or category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              
              <div className="space-y-3.5">
                
                {/* Header with Icon & Category Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-md ${
                      service.category === 'branding' 
                        ? 'bg-[#FF0038] shadow-rose-600/20' 
                        : 'bg-slate-900 shadow-slate-900/20'
                    }`}>
                      {renderServiceIcon(service.iconName)}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 group-hover:text-[#FF0038] transition-colors leading-tight">
                        {service.name}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400">ID: {service.id}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                      service.category === 'branding'
                        ? 'bg-rose-50 text-[#FF0038] border border-rose-200'
                        : 'bg-slate-100 text-slate-800 border border-slate-200'
                    }`}>
                      {service.category === 'branding' ? 'Branding & Design' : 'Print & Packaging'}
                    </span>
                    {service.badge && (
                      <span className="text-[9px] font-black bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded">
                        {service.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tagline */}
                <div className="text-xs font-bold text-slate-800 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  {service.tagline}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 font-medium">
                  {service.description}
                </p>

                {/* Meta Specs (Turnaround & Min Order) */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#FF0038]" />
                    <span>{service.turnaround}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium justify-end">
                    <Package className="w-3.5 h-3.5 text-slate-400" />
                    <span>Min: <strong className="text-slate-900 font-bold">{service.minOrder}</strong></span>
                  </div>
                </div>

              </div>

              {/* Action Buttons Footer */}
              <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-slate-100">
                <Link
                  to={`/admin/services/edit/${service.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </Link>

                <button
                  onClick={() => setServiceToDelete(service)}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#FF0038] hover:text-rose-700 transition-colors cursor-pointer"
                  title="Delete Service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {serviceToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-[#FF0038] flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">
                Delete Service?
              </h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to remove <strong>"{serviceToDelete.name}"</strong>? It will no longer appear on the website and client quote requests.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setServiceToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-[#FF0038] hover:bg-rose-600 text-white font-extrabold text-xs shadow-md shadow-rose-600/30 transition-colors cursor-pointer"
              >
                Yes, Delete Service
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
