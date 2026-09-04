import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  CreditCard, 
  Star, 
  FolderTree, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Eye, 
  ChevronDown, 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  X, 
  Check, 
  Printer, 
  ArrowLeft, 
  ExternalLink, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Sparkles, 
  IndianRupee, 
  Layers, 
  FileText, 
  Share2, 
  MessageSquare,
  RefreshCw,
  ShieldAlert,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  EyeOff,
  Link as LinkIcon,
  Sliders
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, Order, User, CategoryId, PaymentRecord, ReviewRecord, Category, HeroSlide } from '../types';
import { ConfirmModal } from '../components/ConfirmModal';
import { AdminUserDetailsModal } from '../components/AdminUserDetailsModal';

type AdminTab = 'dashboard' | 'users' | 'products' | 'hero' | 'orders' | 'payments' | 'reviews' | 'categories' | 'settings';

export const AdminPage: React.FC = () => {
  const { 
    orders, 
    updateOrderStatus, 
    deleteOrder,
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    heroSlides,
    addHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    reorderHeroSlides,
    resetHeroSlides,
    refreshHeroSlides,
    users, 
    addUser, 
    updateUser, 
    deleteUser,
    categories, 
    addCategory, 
    updateCategory, 
    deleteCategory,
    payments, 
    updatePaymentStatus,
    reviews, 
    updateReviewStatus, 
    deleteReview, 
    addReview,
    currentUser, 
    logout, 
    showToast,
    isMarathi 
  } = useApp();

  const navigate = useNavigate();

  // Navigation State
  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<User | null>(null);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catFormName, setCatFormName] = useState('');
  const [catFormNameMr, setCatFormNameMr] = useState('');
  const [catFormShortName, setCatFormShortName] = useState('');
  const [catFormDescription, setCatFormDescription] = useState('');
  const [catFormIconName, setCatFormIconName] = useState('Package');
  const [catFormImage, setCatFormImage] = useState('');
  const [catFormImageName, setCatFormImageName] = useState('');
  const [catFormUploading, setCatFormUploading] = useState(false);
  const [catFormFeatured, setCatFormFeatured] = useState(true);
  const catFileInputRef = useRef<HTMLInputElement>(null);
  const [statusDropdownOrderId, setStatusDropdownOrderId] = useState<string | null>(null);
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    variant?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Hero Banner Slide State & Handlers
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [slideTitle1, setSlideTitle1] = useState('');
  const [slideSubtitle, setSlideSubtitle] = useState('');
  const [slideImage, setSlideImage] = useState('');
  const [slideButtonText, setSlideButtonText] = useState('Order Now');
  const [slideProductId, setSlideProductId] = useState('');
  const [slideCategoryLink, setSlideCategoryLink] = useState('/products');
  const [slideTag, setSlideTag] = useState('');
  const [slideBadge, setSlideBadge] = useState('');
  const [slideIsActive, setSlideIsActive] = useState(true);
  const [isUploadingSlideImage, setIsUploadingSlideImage] = useState(false);

  const openCreateSlideModal = () => {
    setEditingSlide(null);
    setSlideTitle1('');
    setSlideSubtitle('');
    setSlideImage('');
    setSlideButtonText('Order Now');
    setSlideProductId('');
    setSlideCategoryLink('/products');
    setSlideTag('');
    setSlideBadge('');
    setSlideIsActive(true);
    setIsSlideModalOpen(true);
  };

  const openEditSlideModal = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setSlideTitle1(slide.title1 || '');
    setSlideSubtitle(slide.subtitle || '');
    setSlideImage(slide.image || '');
    setSlideButtonText(slide.buttonText || 'Order Now');
    setSlideProductId(slide.productId || '');
    setSlideCategoryLink(slide.categoryLink || '/products');
    setSlideTag(slide.tag || '');
    setSlideBadge(slide.badge || '');
    setSlideIsActive(slide.isActive !== false);
    setIsSlideModalOpen(true);
  };

  const handleSaveSlideForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slideImage.trim()) {
      showToast('Please upload or enter a high resolution banner poster image URL', 'error');
      return;
    }

    const payload: Partial<HeroSlide> = {
      title1: slideTitle1.trim() || 'Exclusive Commercial Print Services',
      subtitle: slideSubtitle.trim(),
      image: slideImage.trim(),
      buttonText: slideButtonText.trim() || 'Order Now',
      productId: slideProductId.trim(),
      categoryLink: slideCategoryLink.trim() || '/products',
      tag: slideTag.trim(),
      badge: slideBadge.trim(),
      isActive: slideIsActive
    };

    if (editingSlide) {
      await updateHeroSlide(editingSlide.id, payload);
    } else {
      await addHeroSlide(payload);
    }
    setIsSlideModalOpen(false);
  };

  const handleSlideImageUpload = async (file: File) => {
    setIsUploadingSlideImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setSlideImage(data.url);
          showToast('Banner image uploaded successfully!', 'success');
          setIsUploadingSlideImage(false);
          return;
        }
      }
    } catch (err) {
      console.warn('API upload failed, using local FileReader fallback', err);
    }

    // Fallback to local FileReader
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setSlideImage(e.target.result as string);
        showToast('Banner image loaded successfully!', 'success');
      }
      setIsUploadingSlideImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleMoveSlide = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === heroSlides.length - 1) return;

    const newSlides = [...heroSlides];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIndex];
    newSlides[targetIndex] = temp;

    const orderedIds = newSlides.map(s => s.id);
    await reorderHeroSlides(orderedIds);
    showToast('Banner sequence updated', 'info');
  };

  // Pagination State
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // -------------------------------------------------------------
  // Add / Edit Product Form State (matching Screenshot 2)
  // -------------------------------------------------------------
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<CategoryId>(() => {
    return categories.length > 0 ? categories[0].id : '';
  });
  const [prodSubCategory, setProdSubCategory] = useState('350 GSM Velvet Matte');
  const [prodPrice, setProdPrice] = useState<string>('299');
  const [prodDescription, setProdDescription] = useState(
    'The lifestyle print collection is just what you need to complete a high-end luxury look. CMYK 4-color Heidelberg offset press fidelity.'
  );
  const [prodTags, setProdTags] = useState<string[]>(['Velvet', 'Waterproof', 'Spot UV', 'Offset']);
  const [newTagInput, setNewTagInput] = useState('');
  const [uploadedImages, setUploadedImages] = useState<{ name: string; size: string; progress: number; preview: string }[]>([
    {
      name: 'Luxury_Card_Mockup_01.png',
      size: '482 KB',
      progress: 100,
      preview: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'Luxury_Card_Mockup_02.png',
      size: '512 KB',
      progress: 100,
      preview: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'Gold_Foil_Detail_03.png',
      size: '478 KB',
      progress: 100,
      preview: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&auto=format&fit=crop&q=80'
    },
    {
      name: 'Packaging_Box_Diecut_04.png',
      size: '128 KB',
      progress: 75,
      preview: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80'
    }
  ]);

  // Keep prodCategory pointed strictly at a valid DB category
  useEffect(() => {
    if (!editingProduct && categories.length > 0) {
      if (!prodCategory || !categories.some((c) => c.id === prodCategory)) {
        setProdCategory(categories[0].id);
      }
    }
  }, [categories, editingProduct, prodCategory]);

  // Open Edit Product Modal
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdCategory(prod.categoryId);
    setProdSubCategory(prod.finishes?.[0]?.name || 'Standard');
    setProdPrice(prod.basePrice.toString());
    setProdDescription(prod.description || '');
    setProdTags(prod.tags || ['Popular', 'Offset']);
    setUploadedImages([
      {
        name: `${prod.name.replace(/\s+/g, '_')}_01.png`,
        size: '540 KB',
        progress: 100,
        preview: prod.image
      }
    ]);
    setIsAddProductModalOpen(true);
  };

  // Reset Product Form
  const resetProductForm = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCategory(categories.length > 0 ? categories[0].id : '');
    setProdSubCategory('350 GSM Velvet Matte');
    setProdPrice('299');
    setProdDescription('High quality offset commercial print with crisp finishes.');
    setProdTags(['Velvet', 'Waterproof', 'Offset', 'Spot UV']);
    setNewTagInput('');
  };

  // Category Modal Handlers
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCatFormName('');
    setCatFormNameMr('');
    setCatFormShortName('');
    setCatFormDescription('');
    setCatFormIconName('Package');
    setCatFormImage('');
    setCatFormImageName('');
    setCatFormFeatured(true);
    setIsAddCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setCatFormName(cat.name);
    setCatFormNameMr(cat.nameMr || cat.name);
    setCatFormShortName(cat.shortName || cat.name);
    setCatFormDescription(cat.description || '');
    setCatFormIconName(cat.iconName || 'Package');
    setCatFormImage(cat.image || '');
    setCatFormImageName(cat.name ? `${cat.name.toLowerCase().replace(/\s+/g, '-')}-cover.jpg` : '');
    setCatFormFeatured(cat.featured !== false);
    setIsAddCategoryModalOpen(true);
  };

  const handleProcessCatImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Validation Error: Please select an image file (PNG, JPG, WEBP)', 'error');
      return;
    }
    setCatFormImageName(file.name);
    setCatFormUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      setCatFormImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

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
          setCatFormImage(data.url);
          showToast('Category image uploaded successfully!', 'success');
        }
      }
    } catch (err) {
      console.warn('Fallback to data URL preview:', err);
    } finally {
      setCatFormUploading(false);
    }
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catFormName.trim() || catFormName.trim().length < 2) {
      showToast('Validation Error: Category title must be at least 2 characters', 'error');
      return;
    }
    if (!catFormImage) {
      showToast('Validation Error: Please upload a category cover image', 'error');
      return;
    }

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: catFormName.trim(),
        nameMr: catFormNameMr.trim() || catFormName.trim(),
        shortName: catFormShortName.trim() || catFormName.trim(),
        description: catFormDescription.trim(),
        iconName: catFormIconName,
        featured: catFormFeatured,
        image: catFormImage
      });
      showToast(`Category "${catFormName}" updated successfully!`, 'success');
    } else {
      addCategory({
        name: catFormName.trim(),
        nameMr: catFormNameMr.trim() || catFormName.trim(),
        shortName: catFormShortName.trim() || catFormName.trim(),
        description: catFormDescription.trim(),
        iconName: catFormIconName,
        featured: catFormFeatured,
        image: catFormImage,
        itemCount: 0
      });
      showToast(`Category "${catFormName}" created successfully!`, 'success');
    }
    setIsAddCategoryModalOpen(false);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) {
      showToast('Please enter a product name', 'error');
      return;
    }

    const priceNum = parseFloat(prodPrice) || 299;
    const mainImage = uploadedImages[0]?.preview || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80';

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: prodName,
        categoryId: prodCategory,
        category: categories.find(c => c.id === prodCategory)?.name || 'Print Item',
        basePrice: priceNum,
        description: prodDescription,
        tags: prodTags,
        image: mainImage,
        galleryImages: uploadedImages.map(img => img.preview)
      });
      showToast(`Updated product: ${prodName}`, 'success');
    } else {
      addProduct({
        name: prodName,
        categoryId: prodCategory,
        category: categories.find(c => c.id === prodCategory)?.name || 'Print Item',
        basePrice: priceNum,
        description: prodDescription,
        tags: prodTags,
        image: mainImage,
        galleryImages: uploadedImages.map(img => img.preview)
      });
    }

    setIsAddProductModalOpen(false);
    resetProductForm();
  };

  // Add tag handler
  const handleAddTag = () => {
    if (newTagInput.trim() && !prodTags.includes(newTagInput.trim())) {
      setProdTags([...prodTags, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setProdTags(prodTags.filter(t => t !== tagToRemove));
  };

  // Preset Image Loader
  const handleLoadSampleImages = (type: 'cards' | 'stickers' | 'boxes') => {
    if (type === 'cards') {
      setUploadedImages([
        { name: 'Velvet_Gold_Foil_Card.png', size: '482 KB', progress: 100, preview: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80' },
        { name: 'Embossed_Letterpress_Card.png', size: '612 KB', progress: 100, preview: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=600&auto=format&fit=crop&q=80' }
      ]);
    } else if (type === 'stickers') {
      setUploadedImages([
        { name: 'Diecut_Vinyl_Sticker_Sheet.png', size: '390 KB', progress: 100, preview: 'http://i.pinimg.com/736x/e1/35/8d/e1358d4dbbecea602cb7d686885a9b86.jpg' },
        { name: 'Waterproof_Bottle_Label.png', size: '520 KB', progress: 100, preview: 'https://images.unsplash.com/photo-1572375992501-4b0892d50c69?w=600&auto=format&fit=crop&q=80' }
      ]);
    } else {
      setUploadedImages([
        { name: 'Monocarton_Pharma_Box.png', size: '720 KB', progress: 100, preview: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80' },
        { name: 'Rigid_Gift_Box.png', size: '840 KB', progress: 100, preview: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop&q=80' }
      ]);
    }
  };

  // -------------------------------------------------------------
  // Order Status Color Pill Helper (Exact match to Screenshot 1)
  // -------------------------------------------------------------
  const ORDER_STATUS_MAP: { [key: string]: { label: string; bg: string; text: string; border: string } } = {
    'Pending': { label: 'Pending', bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
    'Order Placed': { label: 'Pending', bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
    'Confirmed': { label: 'Confirmed', bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
    'Pre-flight Art Verified': { label: 'Confirmed', bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200' },
    'Processing': { label: 'Processing', bg: 'bg-sky-100', text: 'text-sky-800', border: 'border-sky-200' },
    'Offset In-Press': { label: 'Processing', bg: 'bg-sky-100', text: 'text-sky-800', border: 'border-sky-200' },
    'Printing in Progress': { label: 'Processing', bg: 'bg-sky-100', text: 'text-sky-800', border: 'border-sky-200' },
    'Picked': { label: 'Picked', bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
    'Lamination & Die-Cut': { label: 'Picked', bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
    'Quality Check & Packed': { label: 'Picked', bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' },
    'Shipped': { label: 'Shipped', bg: 'bg-fuchsia-100', text: 'text-fuchsia-800', border: 'border-fuchsia-200' },
    'Dispatched via Courier': { label: 'Shipped', bg: 'bg-fuchsia-100', text: 'text-fuchsia-800', border: 'border-fuchsia-200' },
    'Dispatched': { label: 'Shipped', bg: 'bg-fuchsia-100', text: 'text-fuchsia-800', border: 'border-fuchsia-200' },
    'Delivered': { label: 'Delivered', bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200' },
    'Cancelled': { label: 'Cancelled', bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-200' }
  };

  const ALL_STATUS_OPTIONS = [
    'Pending',
    'Confirmed',
    'Processing',
    'Picked',
    'Shipped',
    'Delivered',
    'Cancelled'
  ];

  const getStatusBadge = (rawStatus: string) => {
    return ORDER_STATUS_MAP[rawStatus] || {
      label: rawStatus,
      bg: 'bg-slate-100',
      text: 'text-slate-800',
      border: 'border-slate-200'
    };
  };

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(ord => {
      const matchesSearch = 
        ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.customerPhone?.includes(searchQuery) ||
        ord.items?.some(i => i.product.name.toLowerCase().includes(searchQuery.toLowerCase()));

      if (statusFilter === 'All') return matchesSearch;
      
      const badge = getStatusBadge(ord.status);
      return matchesSearch && badge.label.toLowerCase() === statusFilter.toLowerCase();
    });
  }, [orders, searchQuery, statusFilter]);

  // Handle WhatsApp message to customer
  const handleWhatsAppCustomer = (phone?: string, orderNum?: string, status?: string) => {
    showToast(`WhatsApp notice queued for Order #${orderNum} (${status}) to ${phone || 'Customer'}`, 'success');
  };

  return (
    <div className="flex h-screen bg-[#F4F6FB] text-slate-800 font-sans overflow-hidden">
      
      {/* ========================================================= */}
      {/* LEFT SIDEBAR (Matching Screenshot 1: TeesNFleece Dark Style) */}
      {/* ========================================================= */}
      <aside className="w-64 bg-[#111A2E] text-slate-300 flex flex-col justify-between shrink-0 shadow-xl z-20 select-none">
        
        <div className="p-5 space-y-6">
          
          {/* Brand Logo Header */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-xl bg-cyan-600 flex items-center justify-center text-white font-black text-lg shadow-md">
              P
            </div>
            <div>
              <span className="font-extrabold text-white text-base tracking-wide block">
                Proprint
              </span>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                Press Admin OS
              </span>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <nav className="space-y-1">
            
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#1E293B] text-white shadow-inner border-l-4 border-cyan-400 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-[#1E293B] text-white shadow-inner border-l-4 border-cyan-400 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>User</span>
              <span className="ml-auto bg-slate-800 text-[10px] px-1.5 py-0.5 rounded-md font-mono text-slate-400">
                {users.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#1E293B] text-white shadow-inner border-l-4 border-cyan-400 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products</span>
              <span className="ml-auto bg-cyan-500/20 text-cyan-300 text-[10px] px-1.5 py-0.5 rounded-md font-mono">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'hero'
                  ? 'bg-[#1E293B] text-white shadow-inner border-l-4 border-cyan-400 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              <span>Hero Banner Slides</span>
              <span className="ml-auto bg-cyan-500/20 text-cyan-300 text-[10px] px-1.5 py-0.5 rounded-md font-mono">
                {heroSlides.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#1E293B] text-white shadow-inner border-l-4 border-cyan-400 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Orders</span>
              <span className="ml-auto bg-rose-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'payments'
                  ? 'bg-[#1E293B] text-white shadow-inner border-l-4 border-cyan-400 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Payments</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-[#1E293B] text-white shadow-inner border-l-4 border-cyan-400 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>Reviews</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-[#1E293B] text-white shadow-inner border-l-4 border-cyan-400 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>Manage Category</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#1E293B] text-white shadow-inner border-l-4 border-cyan-400 font-extrabold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

          </nav>

        </div>

        {/* Bottom Log Out Section */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <Link
            to="/"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Storefront Live</span>
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-400" />
            <span>Log Out</span>
          </button>
        </div>

      </aside>

      {/* ========================================================= */}
      {/* MAIN ADMIN WORKSPACE                                      */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOP APP BAR (Matching Screenshot 1) */}
        <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between shadow-xs">
          
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              {activeTab === 'orders' && <ShoppingCart className="w-4 h-4" />}
              {activeTab === 'products' && <Package className="w-4 h-4" />}
              {activeTab === 'users' && <Users className="w-4 h-4" />}
              {activeTab === 'dashboard' && <LayoutDashboard className="w-4 h-4" />}
              {activeTab === 'payments' && <CreditCard className="w-4 h-4" />}
              {activeTab === 'reviews' && <Star className="w-4 h-4" />}
              {activeTab === 'categories' && <FolderTree className="w-4 h-4" />}
              {activeTab === 'settings' && <Settings className="w-4 h-4" />}
            </div>
            <h1 className="text-lg font-black text-slate-900 capitalize tracking-tight">
              {activeTab === 'categories' ? 'Manage Category' : activeTab}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Search Input Bar */}
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-4 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-cyan-500 w-64 transition-all"
              />
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Notification Bell */}
            <button 
              onClick={() => showToast('All print operations running on schedule', 'info')}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center relative cursor-pointer transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            {/* Admin Avatar */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center ring-2 ring-slate-200">
                NR
              </div>
              <div className="hidden lg:block text-left">
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  {currentUser?.name || 'Nagesh Rathod'}
                </span>
                <span className="text-[10px] text-cyan-600 font-semibold uppercase">
                  Master Admin
                </span>
              </div>
            </div>

          </div>

        </header>

        {/* MAIN BODY WORKSPACE (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          
          {/* ========================================================= */}
          {/* TAB 1: ORDERS TAB (Exact match to Screenshot 1)          */}
          {/* ========================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              
              {/* Horizontal Status Filter Tabs (Matching Screenshot 1) */}
              <div className="border-b border-slate-200 flex items-center gap-6 overflow-x-auto text-xs font-bold text-slate-500 pb-0.5">
                {['All', 'Pending', 'Confirmed', 'Processing', 'Picked', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      setStatusFilter(st);
                      setCurrentPage(1);
                    }}
                    className={`pb-2.5 whitespace-nowrap cursor-pointer transition-all border-b-2 font-extrabold ${
                      statusFilter === st
                        ? 'border-cyan-500 text-cyan-600'
                        : 'border-transparent hover:text-slate-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Data Table Card */}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-visible">
                
                <div className="overflow-x-auto min-h-[380px]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px] bg-slate-50/50">
                        <th className="py-3.5 px-4 font-bold">Order ID</th>
                        <th className="py-3.5 px-4 font-bold">User</th>
                        <th className="py-3.5 px-4 font-bold">Product</th>
                        <th className="py-3.5 px-4 font-bold text-center">Quantity</th>
                        <th className="py-3.5 px-4 font-bold">Date</th>
                        <th className="py-3.5 px-4 font-bold">Amount</th>
                        <th className="py-3.5 px-4 font-bold">Status</th>
                        <th className="py-3.5 px-4 font-bold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                            No orders found matching this filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((ord) => {
                          const badge = getStatusBadge(ord.status);
                          const primaryItem = ord.items?.[0];
                          const prodNameText = primaryItem?.product?.name || 'Custom Print Job';
                          const qty = primaryItem?.customization?.quantity || primaryItem?.quantity || 100;
                          const amountVal = ord.total || ord.totalAmount || 299;

                          return (
                            <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors group">
                              
                              {/* Order ID */}
                              <td className="py-3.5 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                                #{ord.orderNumber}
                              </td>

                              {/* User */}
                              <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                                {ord.customerName || 'Rafter'}
                              </td>

                              {/* Product */}
                              <td className="py-3.5 px-4 whitespace-nowrap">
                                <div className="font-bold text-slate-900">{prodNameText}</div>
                                <div className="text-[10px] font-mono text-slate-400">#{ord.orderNumber}</div>
                              </td>

                              {/* Quantity */}
                              <td className="py-3.5 px-4 font-semibold text-slate-700 text-center whitespace-nowrap">
                                {qty}
                              </td>

                              {/* Date */}
                              <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                                {ord.createdAt || '10 Mar - 11:00pm'}
                              </td>

                              {/* Amount */}
                              <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                                ₹{amountVal}
                              </td>

                              {/* Status Dropdown Pill (Exact Screenshot 1 Behavior) */}
                              <td className="py-3.5 px-4 whitespace-nowrap relative">
                                <div className="relative inline-block">
                                  <button
                                    onClick={() =>
                                      setStatusDropdownOrderId(
                                        statusDropdownOrderId === ord.id ? null : ord.id
                                      )
                                    }
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${badge.bg} ${badge.text} ${badge.border}`}
                                  >
                                    <span>{badge.label}</span>
                                    <ChevronDown className="w-3 h-3 opacity-60" />
                                  </button>

                                  {/* Floating Dropdown Menu (Exact match to Screenshot 1) */}
                                  {statusDropdownOrderId === ord.id && (
                                    <div className="absolute left-0 top-full mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-200 p-1 z-50 space-y-1 animate-in fade-in zoom-in-95">
                                      {ALL_STATUS_OPTIONS.map((opt) => {
                                        const optBadge = getStatusBadge(opt);
                                        return (
                                          <button
                                            key={opt}
                                            onClick={() => {
                                              updateOrderStatus(ord.id, opt);
                                              setStatusDropdownOrderId(null);
                                            }}
                                            className={`w-full text-left px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${optBadge.bg} ${optBadge.text}`}
                                          >
                                            <span>{opt}</span>
                                            {badge.label === opt && <Check className="w-3 h-3" />}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* Actions (Eye Icon Modal Viewer) */}
                              <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1">
                                  <button
                                    onClick={() => setSelectedOrder(ord)}
                                    title="View Order Details"
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 transition-colors cursor-pointer"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setConfirmModalConfig({
                                        isOpen: true,
                                        title: 'Delete Order',
                                        message: `Are you sure you want to permanently delete order #${ord.orderNumber}?`,
                                        confirmText: 'Delete Order',
                                        variant: 'danger',
                                        onConfirm: () => {
                                          deleteOrder(ord.id);
                                          showToast(`Order #${ord.orderNumber} deleted`, 'info');
                                          setConfirmModalConfig(prev => ({ ...prev, isOpen: false }));
                                        }
                                      });
                                    }}
                                    title="Delete Order"
                                    className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>

                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer & Pagination (Exact match to Screenshot 1) */}
                <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                  
                  <div className="flex items-center gap-2">
                    <span>Showing</span>
                    <select
                      value={pageSize}
                      onChange={(e) => setPageSize(Number(e.target.value))}
                      className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-bold focus:outline-none"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <span>of {orders.length}</span>
                  </div>

                  {/* Pagination Numbers */}
                  <div className="flex items-center gap-1">
                    <button className="px-2 py-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer">
                      ‹
                    </button>
                    <button className="w-7 h-7 rounded-lg bg-cyan-500 text-white font-bold flex items-center justify-center shadow-xs">
                      1
                    </button>
                    <button className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 font-bold flex items-center justify-center cursor-pointer">
                      2
                    </button>
                    <button className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 font-bold flex items-center justify-center cursor-pointer">
                      3
                    </button>
                    <button className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 font-bold flex items-center justify-center cursor-pointer">
                      4
                    </button>
                    <button className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-600 font-bold flex items-center justify-center cursor-pointer">
                      5
                    </button>
                    <button className="px-2 py-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer">
                      ›
                    </button>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: PRODUCTS CRUD TAB                                  */}
          {/* ========================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Commercial Print Inventory</h2>
                  <p className="text-xs text-slate-500">Live products synced to website shop catalog.</p>
                </div>

                <button
                  onClick={() => {
                    resetProductForm();
                    setIsAddProductModalOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>

              {/* Products Table Card */}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px] bg-slate-50/50">
                        <th className="py-3 px-4">Image</th>
                        <th className="py-3 px-4">Product Name</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Price</th>
                        <th className="py-3 px-4">Rating</th>
                        <th className="py-3 px-4">Tags</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map((prod) => (
                        <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{prod.name}</div>
                            <div className="text-[10px] text-slate-400">{prod.tagline || prod.description?.slice(0, 40)}...</div>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-600">
                            {prod.category || prod.categoryId}
                          </td>
                          <td className="py-3 px-4 font-black text-slate-900">
                            ₹{prod.basePrice}
                          </td>
                          <td className="py-3 px-4 text-amber-500 font-bold flex items-center gap-1 mt-2.5">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{prod.rating || 4.9}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {prod.tags?.slice(0, 2).map((t) => (
                                <span key={t} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">
                                  {t}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleOpenEditProduct(prod)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setConfirmModalConfig({
                                    isOpen: true,
                                    title: 'Delete Product',
                                    message: `Are you sure you want to permanently delete "${prod.name}"?`,
                                    confirmText: 'Delete Product',
                                    variant: 'danger',
                                    onConfirm: () => {
                                      deleteProduct(prod.id);
                                      showToast(`Product "${prod.name}" deleted`, 'info');
                                      setConfirmModalConfig(prev => ({ ...prev, isOpen: false }));
                                    }
                                  });
                                }}
                                className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: DASHBOARD METRICS                                  */}
          {/* ========================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Top Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                    <span>Total Orders</span>
                    <ShoppingCart className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{orders.length}</div>
                  <div className="text-[11px] text-emerald-600 font-bold">+18% vs last month</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                    <span>Active Products</span>
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{products.length}</div>
                  <div className="text-[11px] text-blue-600 font-bold">Heidelberg offset ready</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                    <span>Registered Clients</span>
                    <Users className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">{users.length}</div>
                  <div className="text-[11px] text-indigo-600 font-bold">Chh. Sambhajinagar & Pune</div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
                    <span>Gross Revenue</span>
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    ₹{orders.reduce((acc, o) => acc + (o.total || o.totalAmount || 0), 0)}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-bold">UPI & NetBanking settled</div>
                </div>
              </div>

              {/* Quick Short-Cuts */}
              <div className="bg-[#111A2E] text-white p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl border border-slate-800">
                <div>
                  <h3 className="text-lg font-black text-white">Need to upload a new print job catalog item?</h3>
                  <p className="text-xs text-slate-300 mt-1">Use the 2-column Add Product form with full artwork uploads and GSM finishes.</p>
                </div>
                <button
                  onClick={() => {
                    resetProductForm();
                    setIsAddProductModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl text-xs transition-all cursor-pointer shadow-lg"
                >
                  + Add New Product Now
                </button>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: USERS CRUD TAB                                     */}
          {/* ========================================================= */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Client & Corporate User Accounts</h2>
                  <p className="text-xs text-slate-500">Manage registered businesses, GSTIN numbers, and role access.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingUser(null);
                    setIsAddUserModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add User</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px] bg-slate-50/50">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Company</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((u) => (
                      <tr 
                        key={u.id || u.email} 
                        className="hover:bg-rose-50/20 cursor-pointer transition-colors"
                        onClick={() => setSelectedUserForDetails(u)}
                      >
                        <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                          <span>{u.name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({u.addresses?.length || 0} addr)</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{u.email}</td>
                        <td className="py-3 px-4 text-slate-600 font-mono">{u.phone || '—'}</td>
                        <td className="py-3 px-4 text-slate-700 font-medium">{u.companyName || '—'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {u.role || 'customer'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setSelectedUserForDetails(u)}
                              title="View User Profile & Purchase History"
                              className="p-1 rounded text-slate-400 hover:text-slate-900 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setConfirmModalConfig({
                                  isOpen: true,
                                  title: 'Remove User',
                                  message: `Are you sure you want to remove user account ${u.name}?`,
                                  confirmText: 'Remove User',
                                  variant: 'danger',
                                  onConfirm: () => {
                                    deleteUser(u.id || u.email);
                                    showToast(`User ${u.name} removed`, 'info');
                                    setConfirmModalConfig(prev => ({ ...prev, isOpen: false }));
                                  }
                                });
                              }}
                              className="p-1 rounded text-slate-300 hover:text-rose-600 cursor-pointer"
                              title="Remove User"
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
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: PAYMENTS TAB                                       */}
          {/* ========================================================= */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Payment Gateways & GST Invoices</h2>
                <p className="text-xs text-slate-500">Real-time ledger of UPI, Card, and NetBanking transactions.</p>
              </div>

              <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px] bg-slate-50/50">
                      <th className="py-3 px-4">Invoice #</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Method</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">{p.invoiceNumber}</td>
                        <td className="py-3 px-4 font-medium text-slate-900">{p.customerName}</td>
                        <td className="py-3 px-4 font-black text-slate-900">₹{p.amount}</td>
                        <td className="py-3 px-4 font-semibold text-slate-600">{p.method}</td>
                        <td className="py-3 px-4 text-slate-500">{p.date}</td>
                        <td className="py-3 px-4">
                          <select
                            value={p.status}
                            onChange={(e) => updatePaymentStatus(p.id, e.target.value as any)}
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border-none focus:outline-none cursor-pointer"
                          >
                            <option value="Completed">Completed</option>
                            <option value="Pending">Pending</option>
                            <option value="Refunded">Refunded</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: REVIEWS TAB                                        */}
          {/* ========================================================= */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Customer Testimonials & Ratings</h2>
                <p className="text-xs text-slate-500">Approve or hide buyer feedback displayed on storefront.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((r) => (
                  <div key={r.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 text-sm block">{r.customerName}</span>
                        <span className="text-[10px] text-slate-400">{r.productName} • {r.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{r.rating}/5</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 italic">"{r.comment}"</p>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        r.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {r.status}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateReviewStatus(r.id, r.status === 'Approved' ? 'Hidden' : 'Approved')}
                          className="text-xs text-blue-600 font-bold hover:underline cursor-pointer"
                        >
                          {r.status === 'Approved' ? 'Hide' : 'Approve'}
                        </button>
                        <button
                          onClick={() => deleteReview(r.id)}
                          className="text-xs text-rose-500 font-bold hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: HERO BANNER SLIDES (REAL-TIME EDIT & API)           */}
          {/* ========================================================= */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              
              {/* Header with quick actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-900">Hero Section Banner Slides</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Real-Time API Sync
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure the high-impact poster carousel images displayed at the top of the storefront. Changes reflect instantly.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => refreshHeroSlides()}
                    title="Reload from backend API"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync API</span>
                  </button>

                  <button
                    onClick={() => {
                      setConfirmModalConfig({
                        isOpen: true,
                        title: 'Reset Hero Banners',
                        message: 'Reset hero banners back to factory default poster slides?',
                        confirmText: 'Reset Defaults',
                        variant: 'warning',
                        onConfirm: () => {
                          resetHeroSlides();
                          showToast('Hero slides reset to default', 'success');
                          setConfirmModalConfig(prev => ({ ...prev, isOpen: false }));
                        }
                      });
                    }}
                    title="Restore default slides"
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>Reset Defaults</span>
                  </button>

                  <button
                    onClick={openCreateSlideModal}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF0038] hover:bg-[#d9002f] text-white rounded-xl text-xs font-bold shadow-md shadow-rose-500/20 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Add New Banner Slide</span>
                  </button>
                </div>
              </div>

              {/* Live Mini Preview Banner */}
              <div className="bg-slate-950 p-4 sm:p-6 rounded-3xl border border-slate-800 shadow-xl space-y-3">
                <div className="flex items-center justify-between text-white border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold tracking-wide">Live Homepage Banner Preview ({heroSlides.filter(s => s.isActive !== false).length} Active)</span>
                  </div>
                  <Link 
                    to="/" 
                    target="_blank"
                    className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                  >
                    <span>Open Live Store</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {heroSlides.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs">
                    No slides configured. Add your first banner slide to display on the storefront.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {heroSlides.map((slide, idx) => (
                      <div 
                        key={slide.id || idx}
                        className={`relative rounded-xl overflow-hidden border transition-all ${
                          slide.isActive !== false ? 'border-slate-700 ring-1 ring-slate-700/50' : 'border-slate-800 opacity-40 grayscale'
                        }`}
                      >
                        <div className="h-36 w-full bg-slate-900 overflow-hidden relative">
                          <img
                            src={slide.image}
                            alt={slide.title1 || `Slide ${idx + 1}`}
                            className="w-full h-full object-cover object-center"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-mono text-white font-bold">
                            #{idx + 1}
                          </div>
                          {slide.isActive === false && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs font-bold text-rose-300">
                              Inactive (Hidden)
                            </div>
                          )}
                        </div>
                        <div className="p-2.5 bg-slate-900/90 text-white flex items-center justify-between">
                          <div className="truncate pr-2">
                            <div className="text-xs font-bold truncate">{slide.title1 || `Banner Slide #${idx + 1}`}</div>
                            <div className="text-[10px] text-slate-400 truncate">{slide.productId || slide.categoryLink || '/products'}</div>
                          </div>
                          <button
                            onClick={() => openEditSlideModal(slide)}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-[11px] font-bold rounded-md text-cyan-300 shrink-0 cursor-pointer"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Banner Slides Management Table */}
              <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Banner Sequence & Settings</h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {heroSlides.length} total slides ({heroSlides.filter(s => s.isActive !== false).length} live on store)
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px] bg-slate-50/50">
                        <th className="py-3 px-4 w-16 text-center">Order</th>
                        <th className="py-3 px-4 w-28">Preview</th>
                        <th className="py-3 px-4">Banner Details</th>
                        <th className="py-3 px-4">Target Link / Product</th>
                        <th className="py-3 px-4 text-center w-28">Status</th>
                        <th className="py-3 px-4 text-center w-36">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {heroSlides.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                            No hero slides found. Click "+ Add New Banner Slide" or "Reset Defaults".
                          </td>
                        </tr>
                      ) : (
                        heroSlides.map((slide, index) => (
                          <tr key={slide.id || index} className="hover:bg-slate-50/80 transition-colors">
                            
                            {/* Order controls */}
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => handleMoveSlide(index, 'up')}
                                  disabled={index === 0}
                                  title="Move Up"
                                  className={`p-1 rounded-md border ${
                                    index === 0
                                      ? 'text-slate-300 border-slate-200 cursor-not-allowed'
                                      : 'text-slate-600 border-slate-300 hover:bg-slate-100 cursor-pointer'
                                  }`}
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleMoveSlide(index, 'down')}
                                  disabled={index === heroSlides.length - 1}
                                  title="Move Down"
                                  className={`p-1 rounded-md border ${
                                    index === heroSlides.length - 1
                                      ? 'text-slate-300 border-slate-200 cursor-not-allowed'
                                      : 'text-slate-600 border-slate-300 hover:bg-slate-100 cursor-pointer'
                                  }`}
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 font-bold block mt-1">
                                Pos #{index + 1}
                              </span>
                            </td>

                            {/* Thumbnail */}
                            <td className="py-3 px-4">
                              <div className="w-24 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shadow-xs relative">
                                <img
                                  src={slide.image}
                                  alt={slide.title1 || 'Banner'}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            </td>

                            {/* Banner details */}
                            <td className="py-3 px-4">
                              <div className="space-y-0.5 max-w-sm">
                                <div className="font-bold text-slate-900 text-xs">
                                  {slide.title1 || 'Untitled Poster Banner'}
                                </div>
                                {slide.subtitle && (
                                  <div className="text-[11px] text-slate-500 truncate">
                                    {slide.subtitle}
                                  </div>
                                )}
                                <div className="text-[10px] text-slate-400 font-mono truncate max-w-xs" title={slide.image}>
                                  {slide.image}
                                </div>
                              </div>
                            </td>

                            {/* Target link */}
                            <td className="py-3 px-4">
                              <div className="space-y-1">
                                {slide.productId ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-bold text-[10px]">
                                    <Package className="w-3 h-3" />
                                    <span>Product: {slide.productId}</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[10px]">
                                    <LinkIcon className="w-3 h-3" />
                                    <span>Link: {slide.categoryLink || '/products'}</span>
                                  </span>
                                )}
                                {slide.buttonText && (
                                  <div className="text-[10px] text-slate-500 font-medium">
                                    CTA: <span className="font-semibold text-slate-700">"{slide.buttonText}"</span>
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Active Toggle Status */}
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => {
                                  const newActive = slide.isActive === false ? true : false;
                                  updateHeroSlide(slide.id, { isActive: newActive });
                                  showToast(`Slide #${index + 1} marked ${newActive ? 'Active' : 'Inactive'}`, 'info');
                                }}
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
                                    <span>Inactive</span>
                                  </>
                                )}
                              </button>
                            </td>

                            {/* Action Buttons */}
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => openEditSlideModal(slide)}
                                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                                  title="Edit slide"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setConfirmModalConfig({
                                      isOpen: true,
                                      title: 'Remove Banner Slide',
                                      message: `Are you sure you want to remove slide "${slide.title1}"?`,
                                      confirmText: 'Remove Slide',
                                      variant: 'danger',
                                      onConfirm: () => {
                                        deleteHeroSlide(slide.id);
                                        showToast(`Banner slide removed`, 'info');
                                        setConfirmModalConfig(prev => ({ ...prev, isOpen: false }));
                                      }
                                    });
                                  }}
                                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold cursor-pointer"
                                  title="Delete slide"
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

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: MANAGE CATEGORIES TAB                              */}
          {/* ========================================================= */}
          {activeTab === 'categories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Printing Service Categories</h2>
                  <p className="text-xs text-slate-500">Commercial press service classifications, paper grades, and packaging lines ({categories.length} active).</p>
                </div>
                <button
                  onClick={handleOpenAddCategory}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  + Add Category
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categories.map((c) => (
                  <div key={c.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="w-full h-32 overflow-hidden rounded-xl bg-slate-100 relative">
                        <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                        {c.featured && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded-full shadow-xs">
                            Featured
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                        {c.nameMr && <p className="text-[11px] text-slate-500">{c.nameMr}</p>}
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{c.description}</p>
                        <p className="text-[10px] font-semibold text-slate-400 mt-1">{c.itemCount || 0} items listed</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleOpenEditCategory(c)}
                        className="text-xs text-blue-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          setConfirmModalConfig({
                            isOpen: true,
                            title: 'Delete Category',
                            message: `Are you sure you want to remove category "${c.name}"?`,
                            confirmText: 'Delete Category',
                            variant: 'danger',
                            onConfirm: () => {
                              deleteCategory(c.id);
                              showToast(`Category "${c.name}" removed`, 'info');
                              setConfirmModalConfig(prev => ({ ...prev, isOpen: false }));
                            }
                          });
                        }}
                        className="text-xs text-rose-500 font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 8: SETTINGS TAB                                       */}
          {/* ========================================================= */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">Proprint Press Settings</h2>
                <p className="text-xs text-slate-500">Commercial press metadata, coupon codes, and address.</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Commercial Press Name</label>
                  <input
                    type="text"
                    defaultValue="Proprint Commercial Offset Press"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">MIDC Industrial Address</label>
                  <input
                    type="text"
                    defaultValue="Chikalthana MIDC, Chhatrapati Sambhajinagar - 431001"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Active Welcome Discount Coupon</label>
                  <input
                    type="text"
                    defaultValue="NEWUSER (50% Flat Discount)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-rose-600 font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">WhatsApp Desk Number</label>
                  <input
                    type="text"
                    defaultValue="+91 9322126863"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <button
                  onClick={() => showToast('Settings saved successfully!', 'success')}
                  className="mt-2 px-4 py-2 bg-slate-900 text-white font-bold rounded-xl cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

        </main>

      </div>

      {/* ========================================================= */}
      {/* MODAL 1: ADD / EDIT PRODUCT (Exact match to Screenshot 2) */}
      {/* ========================================================= */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full p-6 sm:p-8 space-y-6 my-auto animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2-Column Grid (Exact layout from Screenshot 2) */}
            <form onSubmit={handleSaveProduct} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: ADD IMAGES (lg:col-span-5) */}
              <div className="lg:col-span-5 space-y-4">
                
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 block">Add Images</label>
                  
                  {/* Preset quick loaders for demo */}
                  <div className="flex items-center gap-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => handleLoadSampleImages('cards')}
                      className="text-blue-600 hover:underline cursor-pointer font-bold"
                    >
                      + Cards
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={() => handleLoadSampleImages('stickers')}
                      className="text-blue-600 hover:underline cursor-pointer font-bold"
                    >
                      + Stickers
                    </button>
                  </div>
                </div>

                {/* Drag and drop dotted upload area (Exact match to Screenshot 2) */}
                <div className="border-2 border-dashed border-cyan-400/80 bg-slate-50/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2 hover:bg-cyan-50/20 transition-all cursor-pointer group">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-100/50 flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div className="text-xs text-slate-600">
                    <span className="text-cyan-600 font-bold">Drop your files here, or </span>
                    <span className="text-blue-600 font-bold underline">Browse</span>
                  </div>
                </div>

                {/* Uploaded Images List with progress bars (Exact match to Screenshot 2) */}
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {uploadedImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-100 bg-white shadow-2xs text-xs"
                    >
                      <img
                        src={img.preview}
                        alt={img.name}
                        className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
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

                {uploadedImages.length > 0 && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setUploadedImages([])}
                      className="text-[11px] text-rose-500 hover:underline font-bold cursor-pointer"
                    >
                      Cancel All
                    </button>
                  </div>
                )}

              </div>

              {/* RIGHT COLUMN: FORM FIELDS (lg:col-span-7 - Exact match to Screenshot 2) */}
              <div className="lg:col-span-7 space-y-3.5 text-xs">
                
                {/* Product Name */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Navy Blue Sneakers Shoe or Luxury Velvet Card"
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-blue-500 text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                {/* Category Dropdown - Strictly Database Categories Only */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-700 block">Category <span className="text-[#FF0038]">*</span></label>
                    <span className="text-[10px] text-slate-400 font-medium">({categories.length} from DB)</span>
                  </div>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as CategoryId)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-blue-500 text-xs text-slate-900 focus:outline-none cursor-pointer"
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
                    value={prodSubCategory}
                    onChange={(e) => setProdSubCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-blue-500 text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      required
                      placeholder="299"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-blue-500 text-xs text-slate-900 focus:outline-none font-bold"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Enter print specifications, finishes, turnaround time..."
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 focus:border-blue-500 text-xs text-slate-900 focus:outline-none resize-none"
                  />
                </div>

                {/* Tags (Interactive Chips) */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">Tags</label>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {prodTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-[11px]"
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
                        className="px-2.5 py-1 rounded-lg border border-slate-200 text-[11px] w-24 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Publish Button (Blue button matching Screenshot 2) */}
                <div className="pt-4 text-right">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0D6EFD] hover:bg-blue-600 text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md shadow-blue-500/20 transition-all cursor-pointer active:scale-98"
                  >
                    {editingProduct ? 'Save Changes' : 'Publish Product'}
                  </button>
                </div>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: ORDER DETAILS VIEWER (From Eye action button)    */}
      {/* ========================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-slate-800 text-xs">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono font-bold text-slate-900 text-sm">Order #{selectedOrder.orderNumber}</span>
                <span className="text-[10px] text-slate-400 block">{selectedOrder.createdAt}</span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Customer:</span>
                <span className="font-bold text-slate-900">{selectedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phone:</span>
                <span className="font-mono font-bold text-slate-900">{selectedOrder.customerPhone || '9876543210'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Address:</span>
                <span className="text-slate-800">{selectedOrder.shippingAddress || 'Chikalthana, Chh. Sambhajinagar'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Status Management:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    const newStatus = e.target.value;
                    updateOrderStatus(selectedOrder.id, newStatus);
                    setSelectedOrder({ ...selectedOrder, status: newStatus });
                  }}
                  className="px-3 py-1 rounded-lg border border-slate-300 font-bold text-xs bg-white text-slate-800 cursor-pointer focus:outline-none focus:border-blue-500"
                >
                  {ALL_STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Items Summary */}
            <div className="space-y-2">
              <span className="font-bold text-slate-700 block">Print Items</span>
              {selectedOrder.items?.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <img src={it.product.image} alt={it.product.name} className="w-9 h-9 rounded-lg object-cover" />
                    <div>
                      <div className="font-bold text-slate-900">{it.product.name}</div>
                      <div className="text-[10px] text-slate-400">Qty: {it.customization?.quantity || 100} • {it.customization?.finishId || 'Matte'}</div>
                    </div>
                  </div>
                  <span className="font-black text-slate-900">₹{it.subtotal}</span>
                </div>
              ))}
            </div>

            {/* WhatsApp Notify button */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => handleWhatsAppCustomer(selectedOrder.customerPhone, selectedOrder.orderNumber, selectedOrder.status)}
                className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Send WhatsApp Tracking to Customer</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: ADD USER                                         */}
      {/* ========================================================= */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Add New User / Client</h3>
              <button onClick={() => setIsAddUserModalOpen(false)} className="text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                addUser({
                  name: form.name.value,
                  email: form.email.value,
                  phone: form.phone.value,
                  companyName: form.company.value,
                  role: form.role.value
                });
                setIsAddUserModalOpen(false);
              }}
              className="space-y-3"
            >
              <input name="name" required placeholder="Full Name" className="w-full px-3 py-2 border rounded-xl" />
              <input name="email" type="email" required placeholder="Email address" className="w-full px-3 py-2 border rounded-xl" />
              <input name="phone" required placeholder="Phone Number" className="w-full px-3 py-2 border rounded-xl" />
              <input name="company" placeholder="Company Name" className="w-full px-3 py-2 border rounded-xl" />
              <select name="role" className="w-full px-3 py-2 border rounded-xl">
                <option value="customer">Customer</option>
                <option value="admin">Administrator</option>
              </select>
              <button type="submit" className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl">
                Save User Account
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: ADD / EDIT CATEGORY WITH IMAGE UPLOAD (NO URL)   */}
      {/* ========================================================= */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-xs my-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingCategory ? 'Edit Service Category' : 'Add Service Category'}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {editingCategory ? `Update category details and cover artwork.` : 'Create a new printing service classification.'}
                </p>
              </div>
              <button
                onClick={() => setIsAddCategoryModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category Name (English) <span className="text-[#FF0038]">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rigid Luxury Packaging"
                    value={catFormName}
                    onChange={(e) => setCatFormName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#FF0038] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category Name (मराठी)</label>
                  <input
                    type="text"
                    placeholder="उदा. लक्झरी बॉक्स व पॅकेजिंग"
                    value={catFormNameMr}
                    onChange={(e) => setCatFormNameMr(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#FF0038] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Short Name / Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Packaging"
                    value={catFormShortName}
                    onChange={(e) => setCatFormShortName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#FF0038] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category Icon</label>
                  <select
                    value={catFormIconName}
                    onChange={(e) => setCatFormIconName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white focus:border-[#FF0038] focus:outline-none cursor-pointer"
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
                  rows={2}
                  placeholder="Enter brief description of this print line..."
                  value={catFormDescription}
                  onChange={(e) => setCatFormDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-[#FF0038] focus:outline-none resize-none"
                />
              </div>

              {/* Category Image Upload (No URL input) */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">
                  Category Cover Image <span className="text-[#FF0038]">*</span>
                </label>
                <input
                  type="file"
                  ref={catFileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleProcessCatImageFile(file);
                  }}
                />

                {!catFormImage ? (
                  <div
                    onClick={() => catFileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white shadow-xs border border-slate-200 flex items-center justify-center mx-auto mb-2 text-blue-600">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-slate-800">Click to upload category cover image</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Supports PNG, JPG, WEBP</p>
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-2xl p-3 bg-slate-50 flex items-center gap-3">
                    <img
                      src={catFormImage}
                      alt="Category Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Ready</span>
                      </div>
                      <p className="font-semibold text-slate-800 text-xs truncate">
                        {catFormImageName || 'Category Cover Image'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => catFileInputRef.current?.click()}
                        className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 rounded-lg font-bold text-[11px] hover:bg-slate-100 cursor-pointer"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCatFormImage('');
                          setCatFormImageName('');
                          if (catFileInputRef.current) catFileInputRef.current.value = '';
                        }}
                        className="p-1 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="cat-featured-check"
                  checked={catFormFeatured}
                  onChange={(e) => setCatFormFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="cat-featured-check" className="font-bold text-slate-700 cursor-pointer text-xs">
                  Feature on storefront homepage
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={catFormUploading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md shadow-blue-600/20 cursor-pointer disabled:opacity-50"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 5: ADD / EDIT HERO BANNER SLIDE (REAL-TIME)        */}
      {/* ========================================================= */}
      {isSlideModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 text-xs my-auto animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  {editingSlide ? 'Edit Hero Banner Slide' : 'Add New Hero Banner Slide'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update poster artwork and instant routing for the storefront top carousel.
                </p>
              </div>
              <button
                onClick={() => setIsSlideModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSlideForm} className="space-y-5">
              
              {/* Image Preview & Upload Container */}
              <div className="space-y-3">
                <label className="block font-bold text-slate-800 text-xs">
                  Poster Banner Image (1200x500 or 16:9 Recommended) <span className="text-rose-500">*</span>
                </label>

                {/* Live Image Box */}
                {slideImage && (
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 shadow-inner group">
                    <img
                      src={slideImage}
                      alt="Banner Preview"
                      className="w-full h-full object-cover object-center"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://i.pinimg.com/736x/c6/e3/bb/c6e3bbbd242f377f64021fe55c33b17d.jpg';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-emerald-400 border border-white/10">
                      Live Preview
                    </div>
                  </div>
                )}

                {/* Upload & URL Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* File Drag & Drop / Input */}
                  <label className="border-2 border-dashed border-slate-300 hover:border-cyan-500 bg-slate-50 hover:bg-cyan-50/40 rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors text-center">
                    <Upload className="w-5 h-5 text-cyan-600" />
                    <span className="font-bold text-slate-700 text-xs">
                      {isUploadingSlideImage ? 'Uploading image...' : 'Upload Image File'}
                    </span>
                    <span className="text-[10px] text-slate-400">PNG, JPG, WEBP up to 10MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleSlideImageUpload(file);
                      }}
                    />
                  </label>

                  {/* Direct Image URL input */}
                  <div className="flex flex-col justify-center space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                    <label className="text-[11px] font-bold text-slate-700">Or Paste Image URL</label>
                    <input
                      type="url"
                      value={slideImage}
                      onChange={(e) => setSlideImage(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                    />
                  </div>

                </div>

                {/* Quick Presets */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-400 block">Or select sample HD poster artwork:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Brochure Banner', url: 'https://i.pinimg.com/736x/c6/e3/bb/c6e3bbbd242f377f64021fe55c33b17d.jpg', prod: 'prod-premium-brochure', title: 'Brochure & Catalog Printing' },
                      { label: 'Die Cut Stickers', url: 'https://i.pinimg.com/1200x/d3/0d/ca/d30dcabb85e6a44689838e953c3d78c3.jpg', prod: 'prod-die-cut-sticker-sheet', title: 'Custom Die Cut Stickers' },
                      { label: 'Packaging Boxes', url: 'https://i.pinimg.com/736x/bb/c1/3d/bbc13d8711ec67195aae22fe376e4d40.jpg', prod: 'prod-custom-packaging-box', title: 'Custom Packaging Boxes' },
                      { label: 'Luxury Visiting Cards', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&auto=format&fit=crop&q=80', prod: 'prod-visiting-card-350gsm', title: 'Luxury Foil & Spot UV Visiting Cards' },
                      { label: 'Flyers & Pamphlets', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&auto=format&fit=crop&q=80', prod: 'prod-premium-flyer', title: 'Commercial Marketing Flyers' }
                    ].map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => {
                          setSlideImage(preset.url);
                          setSlideTitle1(preset.title);
                          setSlideProductId(preset.prod);
                          showToast(`Applied preset: ${preset.label}`, 'info');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700 border border-slate-200 cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Title and Tagging */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Slide Title / Description</label>
                  <input
                    type="text"
                    value={slideTitle1}
                    onChange={(e) => setSlideTitle1(e.target.value)}
                    placeholder="e.g. Brochure & Catalog Printing"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tag / Category Label</label>
                  <input
                    type="text"
                    value={slideTag}
                    onChange={(e) => setSlideTag(e.target.value)}
                    placeholder="e.g. Brochures, Stickers, Luxury"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Action Routing Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Link Directly to Product</label>
                  <select
                    value={slideProductId}
                    onChange={(e) => setSlideProductId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="">None (Use Category/Custom Link)</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Or Custom Category URL</label>
                  <input
                    type="text"
                    value={slideCategoryLink}
                    onChange={(e) => setSlideCategoryLink(e.target.value)}
                    placeholder="/products?category=stickers"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Button text & Active Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">CTA Button Label</label>
                  <input
                    type="text"
                    value={slideButtonText}
                    onChange={(e) => setSlideButtonText(e.target.value)}
                    placeholder="e.g. Order Now, Explore Catalog"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={slideIsActive}
                      onChange={(e) => setSlideIsActive(e.target.checked)}
                      className="w-4 h-4 text-cyan-600 rounded cursor-pointer"
                    />
                    <span className="font-bold text-slate-800">
                      Active (Display in Live Storefront)
                    </span>
                  </label>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSlideModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-md cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-cyan-400" />
                  <span>{editingSlide ? 'Save & Sync Changes' : 'Publish New Slide'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* User Details & Purchase History Modal */}
      <AdminUserDetailsModal
        user={selectedUserForDetails}
        orders={orders}
        isOpen={!!selectedUserForDetails}
        onClose={() => setSelectedUserForDetails(null)}
        onUpdateUser={async (updated) => {
          if (updateUser) {
            updateUser(updated.id || updated.email || selectedUserForDetails?.id || '', updated);
          }
          if (selectedUserForDetails) {
            setSelectedUserForDetails({ ...selectedUserForDetails, ...updated });
          }
        }}
        onDeleteUser={(userId) => {
          deleteUser(userId);
          showToast('User removed', 'info');
          setSelectedUserForDetails(null);
        }}
        showToast={showToast}
      />

      {/* Generic Safe Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModalConfig.isOpen}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        confirmText={confirmModalConfig.confirmText}
        variant={confirmModalConfig.variant}
        onConfirm={confirmModalConfig.onConfirm}
        onCancel={() => setConfirmModalConfig(prev => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
};
