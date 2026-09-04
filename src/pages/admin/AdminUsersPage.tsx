import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  User as UserIcon, 
  Shield, 
  Phone, 
  Mail, 
  Trash2, 
  Edit3, 
  Building, 
  Eye, 
  MapPin, 
  Package, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';
import { AdminUserDetailsModal } from '../../components/AdminUserDetailsModal';
import { ConfirmModal } from '../../components/ConfirmModal';

export const AdminUsersPage: React.FC = () => {
  const { users, orders, deleteUser, updateUserProfile, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search) ||
      u.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id);
      showToast(`User ${userToDelete.name} removed successfully`, 'info');
      setUserToDelete(null);
    }
  };

  const getUserOrderCount = (u: User) => {
    return orders.filter(
      (o) =>
        (u.id && o.userId === u.id) ||
        (u.phone && o.customerPhone && o.customerPhone.replace(/\D/g, '').slice(-10) === u.phone.replace(/\D/g, '').slice(-10)) ||
        (u.email && o.customerEmail?.toLowerCase() === u.email.toLowerCase())
    ).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Client & Corporate Profiles</h2>
          <p className="text-xs text-slate-500">Corporate accounts, print clients, designers, and delivery addresses.</p>
        </div>

        <Link
          to="/admin/users/add"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#FF0038] hover:bg-rose-500 active:scale-98 text-white font-black rounded-xl text-xs shadow-md shadow-rose-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Client</span>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by client name, email, phone, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#FF0038]"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          Showing <span className="font-bold text-slate-900">{filtered.length}</span> of {users.length} registered accounts
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[11px] bg-slate-50/50">
                <th className="py-3.5 px-4">Client / User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Phone & Location</th>
                <th className="py-3.5 px-4">Company & GST</th>
                <th className="py-3.5 px-4 text-center">Orders</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((u) => {
                const orderCount = getUserOrderCount(u);
                return (
                  <tr 
                    key={u.id} 
                    className="hover:bg-rose-50/20 transition-colors group cursor-pointer"
                    onClick={() => setSelectedUserForDetails(u)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs group-hover:bg-[#FF0038] transition-colors">
                          {(u.name || 'U').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-[#FF0038] transition-colors flex items-center gap-1.5">
                            <span>{u.name}</span>
                            <ChevronRight className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="text-slate-400 text-[10px]">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          u.role === 'admin'
                            ? 'bg-rose-50 text-[#FF0038] border border-rose-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {(u.role || 'customer').toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-700 font-medium">{u.phone ? `+91 ${u.phone}` : 'No phone'}</div>
                      <div className="text-slate-400 text-[10px] truncate max-w-[160px]">
                        {u.city || 'Chhatrapati Sambhajinagar'} {u.addresses?.length ? `(${u.addresses.length} addr)` : ''}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">{u.companyName || 'Individual'}</div>
                      <div className="font-mono text-slate-400 text-[10px]">{u.gstNumber || u.gstin || 'No GSTIN'}</div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        orderCount > 0 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-50 text-slate-400'
                      }`}>
                        {orderCount} {orderCount === 1 ? 'order' : 'orders'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedUserForDetails(u)}
                          title="View Complete Profile & Purchase History"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => setUserToDelete({ id: u.id || '', name: u.name })}
                            title="Remove User Account"
                            className="p-1.5 rounded-lg text-slate-300 hover:text-[#FF0038] hover:bg-rose-50 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Profile & Purchase History Modal */}
      <AdminUserDetailsModal
        user={selectedUserForDetails}
        orders={orders}
        isOpen={!!selectedUserForDetails}
        onClose={() => setSelectedUserForDetails(null)}
        onUpdateUser={async (updated) => {
          await updateUserProfile(updated);
          // Refresh local selected state
          if (selectedUserForDetails) {
            setSelectedUserForDetails({ ...selectedUserForDetails, ...updated });
          }
        }}
        onDeleteUser={(userId) => {
          if (selectedUserForDetails) {
            setUserToDelete({ id: userId, name: selectedUserForDetails.name });
          }
        }}
        showToast={showToast}
      />

      {/* Delete User Confirmation Modal */}
      <ConfirmModal
        isOpen={!!userToDelete}
        title="Delete User Account"
        message={`Are you sure you want to remove client "${userToDelete?.name}"? All profile associations will be cleared.`}
        confirmText="Remove Account"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setUserToDelete(null)}
      />
    </div>
  );
};
