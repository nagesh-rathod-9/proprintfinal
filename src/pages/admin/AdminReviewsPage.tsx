import React, { useState } from 'react';
import { Star, CheckCircle, XCircle, Trash2, MessageSquareQuote, Plus, X, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminReviewsPage: React.FC = () => {
  const { reviews, updateReviewStatus, deleteReview, addReview, showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerRole: '',
    productName: '',
    rating: 5,
    comment: '',
    verifiedBuyer: true,
    status: 'Approved' as 'Approved' | 'Pending',
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.comment.trim()) {
      showToast('Please enter customer name and review comment.', 'error');
      return;
    }

    addReview({
      customerName: formData.customerName.trim(),
      customerRole: formData.customerRole.trim() || 'Verified Client',
      productName: formData.productName.trim() || 'Commercial Printing',
      rating: Number(formData.rating) || 5,
      comment: formData.comment.trim(),
      verifiedBuyer: formData.verifiedBuyer,
      status: formData.status,
      date: 'Just now',
    });

    showToast('Review created successfully! It is now live on the website.', 'success');
    setIsModalOpen(false);
    setFormData({
      customerName: '',
      customerRole: '',
      productName: '',
      rating: 5,
      comment: '',
      verifiedBuyer: true,
      status: 'Approved',
    });
  };

  const approvedCount = reviews.filter((r) => r.status === 'Approved').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Customer Reviews & Testimonials</h2>
          <p className="text-xs text-slate-500">
            {approvedCount} active reviews live on the home page showcase. Only added and approved reviews appear on the website.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-600 text-white font-bold text-xs shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Review</span>
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <MessageSquareQuote className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No Reviews Added Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "Add New Review" to create your first client testimonial and display it on the customer home page.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{rev.customerName}</h3>
                      {rev.verifiedBuyer && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                          Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {rev.productName || 'Order'} {rev.customerRole ? `• ${rev.customerRole}` : ''} • {rev.date}
                    </span>
                  </div>
                  <div className="flex items-center text-amber-400">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    rev.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {rev.status === 'Approved' ? 'Live on Website' : 'Pending Approval'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateReviewStatus(
                        rev.id,
                        rev.status === 'Approved' ? 'Pending' : 'Approved'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] cursor-pointer"
                  >
                    {rev.status === 'Approved' ? 'Unpublish' : 'Approve & Publish'}
                  </button>
                  <button
                    onClick={() => deleteReview(rev.id)}
                    className="p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-base">Add New Customer Review</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer / Business Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g., Rajesh Sharma"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Designation / Role</label>
                  <input
                    type="text"
                    value={formData.customerRole}
                    onChange={(e) => setFormData({ ...formData, customerRole: e.target.value })}
                    placeholder="e.g., Managing Director"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Product Ordered</label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    placeholder="e.g., Luxury Visiting Cards"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Star Rating (1 - 5)</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-rose-500 focus:outline-none bg-white cursor-pointer"
                  >
                    <option value={5}>5 Stars (Exceptional)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Good)</option>
                    <option value={2}>2 Stars (Average)</option>
                    <option value={1}>1 Star (Poor)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Approved' | 'Pending' })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-rose-500 focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="Approved">Approved (Publish Immediately)</option>
                    <option value="Pending">Pending Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Customer Review Comment *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="Describe the print quality, turnaround speed, color accuracy, or customer service..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-rose-500 focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formData.verifiedBuyer}
                  onChange={(e) => setFormData({ ...formData, verifiedBuyer: e.target.checked })}
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-700">Mark as Verified Buyer badge</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  Save & Publish Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
