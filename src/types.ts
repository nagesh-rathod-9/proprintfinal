export type CategoryId = 
  | 'visiting-cards'
  | 'business-cards'
  | 'letterheads'
  | 'envelopes'
  | 'invitation-cards'
  | 'brochures'
  | 'paper-board-files'
  | 'project-files'
  | 'flyers'
  | 'stickers'
  | 'packaging'
  | 'banners'
  | 'id-cards'
  | 'stationery'
  | 'custom-merch'
  | 'apparel'
  | 'menus'
  | 'all'
  | string;

export type UserRole = 'customer' | 'admin';

export interface UserAddress {
  id: string;
  label: string; // 'Home' | 'Office' | 'Factory' | 'Shop' | 'Warehouse' | string
  name: string;
  phone: string;
  companyName?: string;
  gstNumber?: string;
  addressLine: string;
  city: string;
  state?: string;
  pincode: string;
  isDefault?: boolean;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  role?: UserRole;
  companyName?: string;
  gstNumber?: string;
  gstin?: string;
  address?: string;
  shippingAddress?: string;
  city?: string;
  pincode?: string;
  addresses?: UserAddress[];
  createdAt?: string;
  nameUpdated?: boolean;
  isProfileComplete?: boolean;
}

export interface Category {
  id: CategoryId;
  name: string;
  nameMr?: string;
  shortName?: string;
  iconName: string;
  image: string;
  itemCount: number;
  featured?: boolean;
  description?: string;
}

export interface PaperFinish {
  id: string;
  name: string;
  gsm?: string;
  description?: string;
  priceMultiplier?: number;
}

export interface ProductSize {
  id: string;
  name: string;
  dimension?: string;
  priceMultiplier?: number;
}

export interface QuantityTier {
  quantity: number;
  discountPercentage: number;
  turnaroundDays: number;
}

export interface ProductReview {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedBuyer: boolean;
  helpfulCount: number;
}

export interface Product {
  id: string;
  categoryId: CategoryId;
  category?: string;
  name: string;
  nameMr?: string;
  tagline?: string;
  description?: string;
  descriptionMr?: string;
  badge?: string;
  badgeMr?: string;
  unit?: string;
  tags?: string[];
  basePrice: number;
  originalPrice?: number;
  singlePrice?: number;
  bulkPrice100?: number;
  bulkPrice500?: number;
  bulkPrice1000?: number;
  image: string;
  galleryImages: string[];
  rating: number;
  reviewsCount: number;
  isBestSeller?: boolean;
  isPopular?: boolean;
  minQuantity?: number;
  defaultQuantity?: number;
  quantityOptions: number[];
  sizes: ProductSize[];
  finishes: PaperFinish[];
  cornerOptions?: ('Standard Square' | 'Rounded (6mm)')[];
  features: string[];
  specifications?: { [key: string]: string };
  templateAvailable?: boolean;
  turnaroundDays?: number;
  turnaround?: string;
  quantityTiers?: QuantityTier[];
}

export interface HeroSlide {
  id: string | number;
  title1: string;
  title2?: string;
  highlight?: string;
  subtitle?: string;
  buttonText?: string;
  quoteButtonText?: string;
  theme?: string;
  tag?: string;
  stats?: string;
  badge?: string;
  image: string;
  productId?: string;
  categoryLink?: string;
  typeLabel?: string;
  typeImage?: string;
  displayOrder?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SelectedProductCustomization {
  quantity: number;
  sizeId: string;
  finishId: string;
  corners?: 'Standard Square' | 'Rounded (6mm)';
  paperType?: string;
  paperFinish?: string;
  unit?: string;
  uploadedFileName?: string;
  uploadedFilePreview?: string;
  uploadedFileUrl?: string;
  uploadedFileSize?: number;
  uploadedFileType?: string;
  uploadedIsImage?: boolean;
  customDesignData?: any;
  specialInstructions?: string;
  calculatedPrice: number;
  turnaroundDays?: number;
}

export interface CartItem {
  id?: string;
  cartItemId: string;
  product: Product;
  productName?: string;
  quantity?: number;
  customization: SelectedProductCustomization;
  subtotal: number;
}

export interface OrderTrackStep {
  title: string;
  titleMr?: string;
  description: string;
  date?: string;
  completed: boolean;
  current?: boolean;
}

export type OrderStatus = 
  | 'Order Placed'
  | 'Design Proof Approved'
  | 'Printing in Progress'
  | 'Quality Check'
  | 'Dispatched'
  | 'Delivered';

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  trackingNumber?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  shippingAddress?: string;
  city?: string;
  pincode?: string;
  items: CartItem[];
  subtotal?: number;
  shippingFee?: number;
  tax?: number;
  total?: number;
  totalAmount?: number;
  paymentMethod?: string;
  paymentStatus?: 'Paid' | 'Pending';
  status: OrderStatus | string;
  createdAt: string;
  estimatedDelivery?: string;
  timeline?: OrderTrackStep[];
  notes?: string;
  uploadedFileUrl?: string;
  uploadedFileName?: string;
  uploadedFileSize?: number;
  uploadedFileType?: string;
  uploadedIsImage?: boolean;
}

export type OrderItem = Order;

export interface QuoteRequest {
  id?: string;
  clientName?: string;
  name?: string;
  email?: string;
  phone?: string;
  category?: string;
  productType?: string;
  quantity?: number | string;
  paperGsm?: string;
  finish?: string;
  customSpecs?: string;
  estimatedCost?: number | string;
  serviceRequired?: string;
  estimatedQuantity?: string;
  projectDescription?: string;
  specifications?: string;
  deliveryCity?: string;
  city?: string;
  timeline?: string;
  companyName?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  createdAt?: string;
  status?: 'New' | 'In Review' | 'Contacted' | 'Quoted' | 'Completed' | string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  customerName: string;
  amount: number;
  method: 'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery' | 'NEFT/RTGS';
  status: 'Completed' | 'Pending' | 'Failed' | 'Refunded';
  transactionId: string;
  date: string;
  invoiceNumber: string;
}

export interface ReviewRecord {
  id: string;
  customerName: string;
  customerRole?: string;
  productName: string;
  rating: number;
  comment: string;
  date: string;
  status: 'Approved' | 'Pending' | 'Hidden';
  verifiedBuyer: boolean;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: 'branding' | 'printing';
  tagline: string;
  description: string;
  turnaround: string;
  minOrder: string;
  iconName: string;
  badge?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  titleMr?: string;
  category: 'logo' | 'social' | 'packaging' | 'brochure' | 'outdoor' | 'stationery' | 'branding' | string;
  categoryLabel: string;
  categoryLabelMr?: string;
  client?: string;
  city?: string;
  cityMr?: string;
  image: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape';
  description: string;
  descriptionMr?: string;
  tags?: string[];
  deliverables?: string[];
  deliverablesMr?: string[];
  badge?: string;
  badgeMr?: string;
}

