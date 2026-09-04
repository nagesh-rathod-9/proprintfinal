import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Printer, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Truck, 
  User, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  Share2, 
  ChevronDown, 
  Layers, 
  Sparkles, 
  IndianRupee, 
  Download,
  X,
  ArrowRight,
  Copy,
  Check,
  Send
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, updateOrderStatus, showToast } = useApp();

  const order = orders.find(
    (o) => o.id === id || o.orderNumber === id || o.orderNumber === `PRP-${id}`
  );

  const [currentStatus, setCurrentStatus] = useState(order?.status || 'Processing');
  const [confirmStatusModal, setConfirmStatusModal] = useState<{
    targetStatus: string;
    sendNotification: boolean;
  } | null>(null);

  const [clientNoticeModal, setClientNoticeModal] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);

  if (!order) {
    return (
      <div className="bg-white p-8 rounded-3xl text-center space-y-4 border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800">Order Not Found</h2>
        <p className="text-xs text-slate-500">The requested order ID does not exist in the live database.</p>
        <Link to="/admin/orders" className="inline-block px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold">
          ← Back to Orders
        </Link>
      </div>
    );
  }

  const handleConfirmStatusChange = () => {
    if (!confirmStatusModal) return;
    const { targetStatus, sendNotification } = confirmStatusModal;

    setCurrentStatus(targetStatus);
    updateOrderStatus(order.id, targetStatus);

    if (sendNotification) {
      showToast(`Order status updated to: ${targetStatus}. Notification dispatched to ${order.customerName}!`, 'success');
    } else {
      showToast(`Order status updated to: ${targetStatus}`, 'success');
    }

    setConfirmStatusModal(null);
  };

  const notificationMessage = `Hello ${order.customerName}! Update from Proprint Commercial Press: Your order #${order.orderNumber} is marked as "${currentStatus}". Production stage is on schedule. Helpline: +91 9322126863`;

  const handleCopyNotice = () => {
    navigator.clipboard.writeText(notificationMessage);
    setCopiedNotice(true);
    showToast('Customer update message copied!', 'info');
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  return (
    <div className="w-full space-y-6 pb-12">
      
      {/* Top Navigation & Action Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        <div className="flex items-center gap-3">
          <Link
            to="/admin/orders"
            className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-2xs hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Order #{order.orderNumber}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-[#FF0038] border border-rose-200">
                {currentStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500">Placed on {order.createdAt || 'Today'}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => window.print()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Invoice</span>
          </button>

          <button
            onClick={() => setClientNoticeModal(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 cursor-pointer transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Customer Update Pop-up</span>
          </button>
        </div>

      </div>

      {/* Main Grid: Order Details & Production Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT 2 COLS: PRINT ITEMS & SPECS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Items Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Print Job Items & Specifications
            </h3>

            <div className="divide-y divide-slate-100">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-sm">{item.product.name}</h4>
                      <div className="text-xs text-slate-500 space-y-0.5">
                        <p>Quantity: <strong className="text-slate-800">{item.customization?.quantity || 100} units</strong></p>
                        <p>Paper Stock: <span className="font-semibold text-slate-700">{item.customization?.finishId || '350 GSM Velvet Matte'}</span></p>
                        <p>Form Factor: <span className="font-semibold text-slate-700">{item.customization?.sizeId || 'Standard'}</span></p>
                        {item.customization?.specialInstructions && (
                          <p className="text-rose-700 font-medium">Notes: {item.customization.specialInstructions}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-base font-black text-slate-900">₹{item.subtotal}</span>
                    <span className="block text-[10px] text-slate-400">Includes GST</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Job Subtotal</span>
                <span className="font-bold text-slate-800">₹{order.subtotal || order.total}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18% Commercial Offset)</span>
                <span className="font-bold text-slate-800">₹{order.tax || Math.round((order.total || 300) * 0.18)}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Courier Shipping</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-100 text-sm font-black text-slate-900">
                <span>Total Amount Paid</span>
                <span className="text-[#FF0038]">₹{order.total || order.totalAmount}</span>
              </div>
            </div>

          </div>

          {/* Uploaded Artwork, Images & ZIP Files Section */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF0038]" />
                <span>Uploaded Artwork & Production Files</span>
              </h3>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                Live Press Server Storage
              </span>
            </div>

            {order.uploadedFileUrl || order.uploadedFileName || order.items?.some(i => i.customization?.uploadedFileUrl || i.customization?.uploadedFileName) ? (
              <div className="space-y-4">
                {/* Main Order Attachment */}
                {(order.uploadedFileUrl || order.uploadedFileName) && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {order.uploadedIsImage || order.uploadedFileUrl?.match(/\.(jpg|jpeg|png|webp|svg)$/i) ? (
                          <a 
                            href={order.uploadedFileUrl || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="shrink-0 group relative block"
                          >
                            <img
                              src={order.uploadedFileUrl}
                              alt="Customer uploaded artwork"
                              className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border-2 border-rose-300 shadow-xs group-hover:opacity-90 transition-opacity bg-white"
                            />
                            <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                              View Full
                            </div>
                          </a>
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-rose-50 border border-rose-200 flex flex-col items-center justify-center text-[#FF0038] shrink-0">
                            <Layers className="w-7 h-7" />
                            <span className="text-[9px] font-mono font-black mt-0.5">
                              {order.uploadedFileName?.split('.').pop()?.toUpperCase() || 'FILE'}
                            </span>
                          </div>
                        )}

                        <div className="min-w-0 space-y-1">
                          <span className="font-extrabold text-slate-900 text-sm block truncate">
                            {order.uploadedFileName || 'Production Artwork File'}
                          </span>
                          <p className="text-slate-500 text-xs">
                            Path: <code className="bg-slate-200 px-1.5 py-0.5 rounded text-[11px] text-slate-800 font-mono">{order.uploadedFileUrl || '/uploads/' + order.uploadedFileName}</code>
                          </p>
                          <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> High-Resolution Ready for Offset
                          </span>
                        </div>
                      </div>

                      {order.uploadedFileUrl && (
                        <a
                          href={order.uploadedFileUrl}
                          download={order.uploadedFileName || 'artwork'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shrink-0"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download File</span>
                        </a>
                      )}
                    </div>

                    {/* If Image, show full width preview */}
                    {(order.uploadedIsImage || order.uploadedFileUrl?.match(/\.(jpg|jpeg|png|webp|svg)$/i)) && order.uploadedFileUrl && (
                      <div className="pt-2 border-t border-slate-200/80">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Live Image Preview:</span>
                        <div className="bg-white p-2 rounded-xl border border-slate-200 inline-block max-w-full">
                          <img
                            src={order.uploadedFileUrl}
                            alt="Full preview"
                            className="max-h-72 w-auto object-contain rounded-lg shadow-2xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Individual Item Attachments (if any) */}
                {order.items?.map((item, i) => {
                  const custom = item.customization;
                  if (!custom?.uploadedFileUrl && !custom?.uploadedFileName && !custom?.uploadedFilePreview) return null;
                  return (
                    <div key={i} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {custom.uploadedFilePreview || (custom.uploadedFileUrl && custom.uploadedIsImage) ? (
                          <img
                            src={custom.uploadedFilePreview || custom.uploadedFileUrl}
                            alt="Item proof"
                            className="w-12 h-12 rounded-lg object-cover border border-slate-200 bg-white shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                            DOC
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-slate-900 block">{item.product.name} Custom Artwork</span>
                          <span className="text-slate-500 text-[11px]">{custom.uploadedFileName || 'Attached design'}</span>
                        </div>
                      </div>

                      {(custom.uploadedFileUrl || custom.uploadedFilePreview) && (
                        <a
                          href={custom.uploadedFileUrl || custom.uploadedFilePreview}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-lg text-xs font-semibold shrink-0"
                        >
                          View Proof
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  No digital design file was attached by the client for this order.
                </p>
                <p className="text-[11px] text-slate-400">
                  Client requested our in-house DTP studio to prepare artwork or will send via WhatsApp.
                </p>
              </div>
            )}

            {/* Special Instructions Note */}
            {order.notes && (
              <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">Customer Special Instructions:</span>
                <p className="text-xs text-amber-950 font-medium">{order.notes}</p>
              </div>
            )}
          </div>

          {/* Pre-Press & Quality Control Checklist */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Pre-Press Workflow & Checklist
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>300 DPI CMYK Color Separation Passed</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2.5 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bleed Margin & Cutting Edge Verified</span>
              </div>
              <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950 flex items-center gap-2.5 font-semibold">
                <Clock className="w-4 h-4 text-[#FF0038] shrink-0" />
                <span>Heidelberg Speedmaster Offset Run Active</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-2.5 font-semibold">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Thermal Velvet Matte Lamination Scheduled</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT 1 COL: CUSTOMER & STATUS CONTROLLER */}
        <div className="space-y-6">
          
          {/* Quick Status Control Card with Confirmation Trigger */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider">
                Change Order Status
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Requires Confirm</span>
            </div>

            <div className="space-y-2">
              {['Pending', 'Confirmed', 'Processing', 'Picked', 'Shipped', 'Delivered', 'Cancelled'].map((st) => {
                const isActive = currentStatus.toLowerCase() === st.toLowerCase();
                return (
                  <button
                    key={st}
                    onClick={() => {
                      if (!isActive) {
                        setConfirmStatusModal({
                          targetStatus: st,
                          sendNotification: true
                        });
                      }
                    }}
                    className={`w-full py-2.5 px-3.5 rounded-xl font-bold flex items-center justify-between transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0B0F19] text-white shadow-md'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <span>{st}</span>
                    {isActive ? (
                      <CheckCircle2 className="w-4 h-4 text-[#FF0038]" />
                    ) : (
                      <span className="text-[10px] text-slate-400 font-normal">Select</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customer & Shipping Info Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider">
              Client & Dispatch Address
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">{order.customerName || 'Customer'}</span>
                  <span className="text-slate-500">{order.customerEmail || 'client@example.com'}</span>
                  <span className="text-slate-600 font-mono block mt-0.5">{order.customerPhone}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="text-slate-700">
                  <p>{order.shippingAddress || 'Industrial Area, Chikalthana MIDC'}</p>
                  <p>{order.city || 'Chh. Sambhajinagar'} - {order.pincode || '431001'}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Express Courier Surface</span>
                  <span className="font-mono text-[10px] text-[#FF0038] font-bold">
                    Docket #{order.trackingNumber || 'EXP-IN-902148'}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* STATUS CHANGE CONFIRMATION MODAL                          */}
      {/* ========================================================= */}
      {confirmStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#FF0038] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Confirm Status Update</h3>
                  <p className="text-xs text-slate-400">Order #{order.orderNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setConfirmStatusModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Transition Display */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Customer</span>
                <span className="text-xs font-bold text-slate-900">{order.customerName}</span>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Current</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-700 inline-block mt-1">
                    {currentStatus}
                  </span>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400" />

                <div className="text-center">
                  <span className="text-[10px] text-[#FF0038] block uppercase font-bold">New Status</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-[#FF0038] border border-rose-200 inline-block mt-1">
                    {confirmStatusModal.targetStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Notification Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 select-none">
              <input
                type="checkbox"
                checked={confirmStatusModal.sendNotification}
                onChange={(e) =>
                  setConfirmStatusModal({
                    ...confirmStatusModal,
                    sendNotification: e.target.checked
                  })
                }
                className="mt-0.5 rounded text-[#FF0038] focus:ring-[#FF0038] cursor-pointer"
              />
              <span>Send in-app notification to {order.customerPhone || 'Customer Phone'}</span>
            </label>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmStatusModal(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmStatusChange}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#FF0038] hover:bg-rose-600 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-rose-600/20 transition-all cursor-pointer"
              >
                Confirm & Update
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* CUSTOMER UPDATE NOTIFICATION POP-UP MODAL (NO REDIRECT)   */}
      {/* ========================================================= */}
      {clientNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Customer WhatsApp Update</h3>
                  <p className="text-xs text-slate-400">Order #{order.orderNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setClientNoticeModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Customer Destination</label>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-800 flex justify-between items-center">
                <span>{order.customerName}</span>
                <span className="font-mono font-bold text-emerald-700">{order.customerPhone || '+91 9876543210'}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Notification Template Preview</label>
              <div className="bg-emerald-50/60 border border-emerald-200 p-3.5 rounded-2xl text-xs text-emerald-950 font-sans leading-relaxed">
                {notificationMessage}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCopyNotice}
                className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedNotice ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copiedNotice ? 'Copied' : 'Copy Message'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  showToast(`Notification logged for ${order.customerName}!`, 'success');
                  setClientNoticeModal(false);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Mark as Sent</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
