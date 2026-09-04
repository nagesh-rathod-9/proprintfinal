import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight, 
  Plus, 
  Clock, 
  Printer, 
  ChevronRight,
  Eye,
  Layers,
  Sparkles,
  Palette,
  Image as ImageIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminDashboardPage: React.FC = () => {
  const { orders, products, users, payments, services, heroSlides } = useApp();

  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || o.totalAmount || 0), 0);
  const pendingOrders = orders.filter((o) => o.status.toLowerCase().includes('pending') || o.status.toLowerCase().includes('order placed'));
  const processingOrders = orders.filter((o) => o.status.toLowerCase().includes('processing') || o.status.toLowerCase().includes('press'));

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-[#1E293B]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#FF0038] bg-white px-2.5 py-0.5 rounded-full shadow-xs">
              Heidelberg Speedmaster Press Center
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Commercial Print Workshop Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium">
            Live press queue, digital pre-flight inspection, and customer dispatch operations for Chh. Sambhajinagar & Pune.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Link
            to="/admin/hero-banners"
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-cyan-300 font-bold rounded-xl text-xs transition-all border border-slate-700 flex items-center gap-1.5"
          >
            <ImageIcon className="w-4 h-4 text-cyan-400" />
            <span>Hero Banners ({heroSlides?.length || 0})</span>
          </Link>
          <Link
            to="/admin/services/add"
            className="px-3.5 py-2.5 bg-neutral-900 hover:bg-black active:scale-95 text-white font-bold rounded-xl text-xs transition-all border border-neutral-700 flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-[#FF0038]" />
            <span>+ Add Service</span>
          </Link>
          <Link
            to="/admin/products/add"
            className="px-4 py-2.5 bg-[#FF0038] hover:bg-rose-500 active:scale-95 text-white font-black rounded-xl text-xs shadow-lg shadow-rose-600/30 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Product</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards 5-Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-[#FF0038]">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{orders.length}</div>
          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% this month
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Catalog Items</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{products.length}</div>
          <div className="text-[11px] text-[#FF0038] font-bold">Offset & Digital stock</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Press Services</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-[#FF0038]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{services.length}</div>
          <Link to="/admin/services" className="text-[11px] text-[#FF0038] hover:underline font-bold block">
            Manage capabilities →
          </Link>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Clients & B2B</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{users.length}</div>
          <div className="text-[11px] text-slate-500 font-bold">Corporate accounts</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Total Revenue</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">₹{totalRevenue.toLocaleString('en-IN')}</div>
          <div className="text-[11px] text-emerald-600 font-bold">UPI & GST settled</div>
        </div>

      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs space-y-4">
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Live Print Orders Queue</h3>
            <p className="text-xs text-slate-500">Real-time status updates from offset and digital pressrooms.</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-[#FF0038] hover:text-rose-700 flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px]">
                <th className="py-3 px-4 font-bold">Order ID</th>
                <th className="py-3 px-4 font-bold">Customer</th>
                <th className="py-3 px-4 font-bold">Product</th>
                <th className="py-3 px-4 font-bold">Amount</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.slice(0, 5).map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    <Link to={`/admin/orders/${ord.id}`} className="hover:underline hover:text-[#FF0038]">
                      #{ord.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{ord.customerName}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{ord.items?.[0]?.product?.name || 'Print Item'}</td>
                  <td className="py-3.5 px-4 font-black text-slate-900">₹{ord.total || ord.totalAmount}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-rose-50 text-[#FF0038] border border-rose-200">
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Link
                      to={`/admin/orders/${ord.id}`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-[#FF0038] hover:bg-rose-50 inline-block transition-colors"
                      title="View Order Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Hero Banner Carousel Quick View */}
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Homepage Hero Banners ({heroSlides?.length || 0})</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Top poster carousel running on storefront homepage.</p>
          </div>
          <Link
            to="/admin/hero-banners"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer w-fit"
          >
            <span>Manage & Edit Banners →</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {heroSlides?.slice(0, 4).map((slide, idx) => (
            <div key={slide.id || idx} className="rounded-xl overflow-hidden bg-slate-800/80 border border-slate-700/80 group relative">
              <div className="h-28 w-full overflow-hidden relative">
                <img
                  src={slide.image}
                  alt={slide.title1}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 bg-black/75 px-2 py-0.5 rounded text-[9px] font-mono font-bold text-white">
                  Slide #{idx + 1}
                </div>
                {slide.isActive === false && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] font-bold text-rose-300">
                    Inactive
                  </div>
                )}
              </div>
              <div className="p-2.5">
                <div className="text-xs font-bold truncate text-white">{slide.title1}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">{slide.productId || slide.categoryLink || '/products'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
