import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Eye, 
  ChevronDown, 
  Trash2, 
  Check, 
  Search, 
  Printer, 
  Download, 
  Filter, 
  MessageSquare, 
  FileText,
  AlertCircle,
  CheckCircle2,
  X,
  Phone,
  ArrowRight,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';

export const AdminOrdersPage: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder, showToast } = useApp();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusDropdownOrderId, setStatusDropdownOrderId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Status Change Confirmation Modal State
  const [confirmModalData, setConfirmModalData] = useState<{
    order: Order;
    targetStatus: string;
    sendNotification: boolean;
  } | null>(null);

  // Delete Confirmation Modal State
  const [deleteConfirmOrder, setDeleteConfirmOrder] = useState<Order | null>(null);

  // Status map matching colors
  const ORDER_STATUS_MAP: { [key: string]: { label: string; bg: string; text: string; border: string } } = {
    'Pending': { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
    'Order Placed': { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
    'Confirmed': { label: 'Confirmed', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
    'Processing': { label: 'Processing', bg: 'bg-rose-50', text: 'text-[#FF0038]', border: 'border-rose-200' },
    'Picked': { label: 'Picked', bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-200' },
    'Shipped': { label: 'Shipped', bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
    'Dispatched': { label: 'Shipped', bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
    'Delivered': { label: 'Delivered', bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' },
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

  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchesSearch =
        ord.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ord.customerPhone?.includes(searchQuery);

      const matchesStatus =
        statusFilter === 'All' ||
        ord.status.toLowerCase() === statusFilter.toLowerCase() ||
        (statusFilter === 'Pending' && ord.status === 'Order Placed') ||
        (statusFilter === 'Shipped' && ord.status === 'Dispatched');

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Execute the confirmed status update
  const handleExecuteStatusUpdate = () => {
    if (!confirmModalData) return;
    const { order, targetStatus, sendNotification } = confirmModalData;
    
    updateOrderStatus(order.id, targetStatus);
    
    if (sendNotification) {
      showToast(`Order #${order.orderNumber} updated to ${targetStatus}. WhatsApp notice queued for ${order.customerName}!`, 'success');
    } else {
      showToast(`Order #${order.orderNumber} status changed to ${targetStatus}!`, 'success');
    }

    setConfirmModalData(null);
    setStatusDropdownOrderId(null);
  };

  const handleExecuteDelete = () => {
    if (!deleteConfirmOrder) return;
    deleteOrder(deleteConfirmOrder.id);
    showToast(`Order #${deleteConfirmOrder.orderNumber} deleted successfully.`, 'info');
    setDeleteConfirmOrder(null);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Printing Job Orders Ledger</h2>
          <p className="text-xs text-slate-500">Track and manage jobs from prepress proofing to final delivery.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/orders/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1faa50] text-white text-xs font-black shadow-md shadow-emerald-500/20 transition-all cursor-pointer transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Order (WhatsApp / Walk-in)</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="relative flex-1 sm:max-w-xs">
          <input
            type="text"
            placeholder="Search Order ID, Client, Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF0038]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('Exporting orders ledger to CSV/Excel...', 'info')}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer w-full sm:w-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Horizontal Status Filter Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-4 sm:gap-6 overflow-x-auto text-xs font-bold text-slate-500 pb-0.5 scrollbar-none no-scrollbar">
        {['All', 'Pending', 'Confirmed', 'Processing', 'Picked', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => {
              setStatusFilter(st);
              setCurrentPage(1);
            }}
            className={`pb-2.5 whitespace-nowrap cursor-pointer transition-all border-b-2 font-extrabold text-xs ${
              statusFilter === st
                ? 'border-[#FF0038] text-[#FF0038]'
                : 'border-transparent hover:text-slate-800'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* ========================================================= */}
      {/* MOBILE CARDS VIEW (Clean touch-friendly cards on mobile)   */}
      {/* ========================================================= */}
      <div className="block lg:hidden space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-xs">
            No matching orders found.
          </div>
        ) : (
          filteredOrders.map((ord) => {
            const badge = getStatusBadge(ord.status);
            const firstItem = ord.items?.[0];
            const productName = firstItem?.product?.name || 'Custom Print Job';
            const productImage =
              firstItem?.product?.image ||
              'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80';
            const quantity = firstItem?.customization?.quantity || ord.quantity || 500;

            return (
              <div key={ord.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono font-black text-slate-900 text-sm">
                      #{ord.orderNumber}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{ord.createdAt}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                    {badge.label}
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-1 border-t border-slate-100">
                  <img
                    src={productImage}
                    alt={productName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900 text-xs block truncate">
                        {productName}
                      </span>
                      {(ord.uploadedFileUrl || ord.uploadedFileName) && (
                        <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded text-[9px] font-black shrink-0 border border-emerald-300">
                          FILE ATTACHED
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 block">
                      Qty: <strong>{quantity} pcs</strong> • Total: <strong className="text-[#FF0038]">₹{ord.total || ord.totalAmount}</strong>
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                      Client: {ord.customerName} ({ord.customerPhone})
                    </span>
                  </div>
                </div>

                {/* Mobile Quick Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      // Open status update modal directly
                      setConfirmModalData({
                        order: ord,
                        targetStatus: ord.status === 'Pending' || ord.status === 'Order Placed' ? 'Confirmed' : 'Processing',
                        sendNotification: true
                      });
                    }}
                    className="flex-1 py-2 px-3 bg-[#FF0038] hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
                  >
                    {ord.status === 'Pending' || ord.status === 'Order Placed' ? '✓ Confirm Order' : 'Change Status'}
                  </button>

                  <Link
                    to={`/admin/orders/${ord.id}`}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => setDeleteConfirmOrder(ord)}
                    className="p-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold transition-colors"
                    title="Delete order"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================= */}
      {/* DESKTOP DATA TABLE VIEW                                    */}
      {/* ========================================================= */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-xs border border-slate-200 overflow-visible">
        <div className="overflow-x-auto min-h-[380px]">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px] bg-slate-50/50">
                <th className="py-3.5 px-4 font-bold">Order ID</th>
                <th className="py-3.5 px-4 font-bold">Customer</th>
                <th className="py-3.5 px-4 font-bold">Product Details</th>
                <th className="py-3.5 px-4 font-bold text-center">Quantity</th>
                <th className="py-3.5 px-4 font-bold">Date</th>
                <th className="py-3.5 px-4 font-bold">Amount</th>
                <th className="py-3.5 px-4 font-bold">Status & Confirm</th>
                <th className="py-3.5 px-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-xs">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => {
                  const badge = getStatusBadge(ord.status);
                  const firstItem = ord.items?.[0];
                  const productName = firstItem?.product?.name || 'Custom Print Job';
                  const productImage =
                    firstItem?.product?.image ||
                    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80';
                  const quantity = firstItem?.customization?.quantity || ord.quantity || 500;

                  return (
                    <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors group">
                      
                      {/* Order Number */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        <Link
                          to={`/admin/orders/${ord.id}`}
                          className="hover:underline hover:text-[#FF0038]"
                        >
                          #{ord.orderNumber}
                        </Link>
                      </td>

                      {/* User Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0 border border-slate-200">
                            {ord.customerName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">
                              {ord.customerName}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {ord.customerPhone}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Product Thumbnail & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5 max-w-[220px]">
                          <img
                            src={productImage}
                            alt={productName}
                            className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div className="truncate">
                            <span className="font-bold text-slate-900 block truncate">
                              {productName}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] text-slate-400">
                                {firstItem?.customization?.finishId || '350 GSM Velvet'}
                              </span>
                              {(ord.uploadedFileUrl || ord.uploadedFileName) && (
                                <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded text-[9px] font-black shrink-0 border border-emerald-200">
                                  Artwork
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="py-3.5 px-4 text-center font-bold text-slate-700">
                        {quantity}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                        {ord.createdAt}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 font-black text-slate-900 text-xs">
                        ₹{ord.total || ord.totalAmount}
                      </td>

                      {/* Status Dropdown with Confirm Modal Trigger */}
                      <td className="py-3.5 px-4">
                        <div className="relative inline-block">
                          <button
                            type="button"
                            onClick={() =>
                              setStatusDropdownOrderId(
                                statusDropdownOrderId === ord.id ? null : ord.id
                              )
                            }
                            className={`px-3 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all ${badge.bg} ${badge.text} ${badge.border}`}
                          >
                            <span>{badge.label}</span>
                            <ChevronDown className="w-3 h-3 opacity-60" />
                          </button>

                          {/* Floating Dropdown Menu */}
                          {statusDropdownOrderId === ord.id && (
                            <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-50 space-y-1 animate-in fade-in zoom-in-95">
                              <span className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                Change Status To:
                              </span>
                              {ALL_STATUS_OPTIONS.map((opt) => {
                                const optBadge = getStatusBadge(opt);
                                return (
                                  <button
                                    key={opt}
                                    onClick={() => {
                                      setStatusDropdownOrderId(null);
                                      // Trigger Confirmation Modal Box
                                      setConfirmModalData({
                                        order: ord,
                                        targetStatus: opt,
                                        sendNotification: true
                                      });
                                    }}
                                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${optBadge.bg} ${optBadge.text}`}
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

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            to={`/admin/orders/${ord.id}`}
                            title="View Full Order Details Page"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#FF0038] hover:bg-rose-50 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteConfirmOrder(ord)}
                            title="Delete Order"
                            className="p-1.5 rounded-lg text-slate-300 hover:text-[#FF0038] hover:bg-rose-50 transition-colors cursor-pointer"
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

        {/* Table Footer & Pagination */}
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

          <div className="flex items-center gap-1">
            <button className="px-2 py-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer">
              ‹
            </button>
            <button className="w-7 h-7 rounded-lg bg-[#FF0038] text-white font-bold flex items-center justify-center shadow-xs">
              1
            </button>
            <button className="px-2 py-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer">
              ›
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* ORDER CONFIRM / STATUS CHANGE CONFIRMATION MODAL          */}
      {/* ========================================================= */}
      {confirmModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#FF0038] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Confirm Status Change</h3>
                  <p className="text-xs text-slate-400">Order #{confirmModalData.order.orderNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setConfirmModalData(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Transition Display */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Customer</span>
                <span className="text-xs font-bold text-slate-900">{confirmModalData.order.customerName}</span>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Current</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700 inline-block mt-1">
                    {confirmModalData.order.status}
                  </span>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400" />

                <div className="text-center">
                  <span className="text-[10px] text-[#FF0038] block uppercase font-bold">New Status</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-[#FF0038] border border-rose-200 inline-block mt-1">
                    {confirmModalData.targetStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Notification Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 select-none">
              <input
                type="checkbox"
                checked={confirmModalData.sendNotification}
                onChange={(e) =>
                  setConfirmModalData({
                    ...confirmModalData,
                    sendNotification: e.target.checked
                  })
                }
                className="mt-0.5 rounded text-[#FF0038] focus:ring-[#FF0038] cursor-pointer"
              />
              <span>Send WhatsApp / SMS status notification to customer ({confirmModalData.order.customerPhone || 'Phone'})</span>
            </label>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmModalData(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteStatusUpdate}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#FF0038] hover:bg-rose-600 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-rose-600/20 transition-all cursor-pointer"
              >
                Confirm & Update
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DELETE CONFIRMATION MODAL                                 */}
      {/* ========================================================= */}
      {deleteConfirmOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Delete Order Record?</h3>
                <p className="text-xs text-slate-400">Order #{deleteConfirmOrder.orderNumber}</p>
              </div>
            </div>
            
            <p className="text-xs text-slate-600">
              Are you sure you want to delete this order? This action cannot be undone.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmOrder(null)}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteDelete}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
