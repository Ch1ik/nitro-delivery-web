import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Building2, UserPlus, Search, Mail, Phone, DollarSign,
  X, MapPin, Globe, FileText, CheckCircle2, XCircle, Clock, Eye, Lock, KeyRound, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { adminService, SignupRequest } from '../services/api';
import { cn } from '../lib/utils';

// ── Request Detail Modal ──────────────────────────────────────────────────────
const RequestDetailModal: React.FC<{
  request: SignupRequest;
  onApprove: (password?: string) => void;
  onReject: () => void;
  onClose: () => void;
}> = ({ request, onApprove, onReject, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [passwordOverride, setPasswordOverride] = useState(request.password || '');
  React.useEffect(() => { setPasswordOverride(request.password || ''); }, [request.id, request.password]);

  const handle = async (action: 'approve' | 'reject') => {
    setLoading(true);
    try {
      if (action === 'approve') {
        await onApprove(passwordOverride.trim().length >= 6 ? passwordOverride : undefined);
      } else {
        await onReject();
      }
      onClose();
    } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Building2 size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">{request.business_name}</h2>
              <p className="text-blue-200 text-xs font-bold">Signup Request Review</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white"><X size={22} /></button>
        </div>

        {/* Status badge */}
        {request.status !== 'pending' && (
          <div className={cn('px-6 py-2 text-xs font-black uppercase tracking-widest flex items-center gap-2',
            request.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600')}>
            {request.status === 'approved' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
            {request.status === 'approved' ? 'Approved — Account Created' : 'Rejected'}
          </div>
        )}

        {/* Details */}
        <div className="p-6 space-y-3">
          <InfoItem icon={Mail} label="Email" value={request.email} href={`mailto:${request.email}`} />
          <InfoItem icon={Phone} label="Phone" value={request.phone} href={`tel:${request.phone}`} />
          {request.address && <InfoItem icon={MapPin} label="Address" value={request.address} />}
          {request.website && <InfoItem icon={Globe} label="Website" value={request.website} href={request.website} />}
          {request.status === 'pending' && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-black text-amber-700 uppercase tracking-widest">
                <Lock size={12} /> Login password (view / change)
              </div>
              <input type="text" value={passwordOverride} onChange={e => setPasswordOverride(e.target.value)}
                className="w-full bg-white border border-amber-200 rounded-lg px-3 py-2 text-sm font-mono"
                placeholder="Min 6 characters — they will log in with this" />
              {request.password && <p className="text-[10px] text-amber-600 font-bold">Submitted: {request.password}</p>}
            </div>
          )}
          {request.status !== 'pending' && request.password && (
            <div className="p-3 bg-gray-50 rounded-xl">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Password used</span>
              <p className="text-sm font-mono font-bold text-gray-700 mt-0.5">{request.password}</p>
            </div>
          )}
          {request.description && (
            <div className="bg-gray-50 p-4 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest">
                <FileText size={12} /> About the Business
              </div>
              <p className="text-sm text-gray-700 font-medium leading-relaxed">{request.description}</p>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-400 font-bold pt-1">
            <Clock size={12} />
            Submitted {new Date(request.created_at * 1000).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Actions */}
        {request.status === 'pending' && (
          <div className="p-5 border-t border-gray-100 flex gap-3">
            <button onClick={() => handle('reject')} disabled={loading}
              className="flex-1 py-3 bg-white text-red-600 rounded-xl font-black text-sm border-2 border-red-50 hover:bg-red-50 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              <XCircle size={16} /> Reject
            </button>
            <button onClick={() => handle('approve')} disabled={loading}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-black text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              <CheckCircle2 size={16} /> Approve & Create Account
            </button>
          </div>
        )}
        {request.status !== 'pending' && (
          <div className="p-5 border-t border-gray-100">
            <button onClick={onClose} className="w-full py-3 bg-gray-50 text-gray-600 rounded-xl font-black text-sm hover:bg-gray-100 transition-all">
              Close
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const InfoItem: React.FC<{ icon: React.ElementType; label: string; value: string; href?: string }> = ({ icon: Icon, label, value, href }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
    <Icon size={14} className="text-gray-400 shrink-0" />
    <span className="text-xs font-black text-gray-400 w-14 shrink-0">{label}</span>
    {href ? (
      <a href={href} className="text-sm font-bold text-blue-600 hover:underline truncate" target={href.startsWith('http') ? '_blank' : undefined}>{value}</a>
    ) : (
      <span className="text-sm font-bold text-gray-900 truncate">{value}</span>
    )}
  </div>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
// ── Change password modal for a business ─────────────────────────────────────
const ChangePasswordModal: React.FC<{
  businessId: string;
  businessName: string;
  onSave: (businessId: string, newPassword: string) => Promise<void>;
  onClose: () => void;
}> = ({ businessId, businessName, onSave, onClose }) => {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSave(businessId, newPassword);
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 space-y-4">
        <h3 className="text-lg font-black text-gray-900">Change password</h3>
        <p className="text-sm text-gray-500 font-medium">{businessName}</p>
        <div>
          <label className="text-xs font-black text-gray-400 uppercase tracking-widest">New password</label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
            className="w-full mt-1.5 px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 outline-none font-bold text-sm"
            placeholder="Min 6 characters" />
        </div>
        {error && <p className="text-sm font-bold text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl font-black text-sm border-2 border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} disabled={loading} className="flex-1 py-3 rounded-xl font-black text-sm bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60">Save</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AdminManagementPage: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { signupRequests, approveRequest, rejectRequest, businesses, setBusinessFixedPrice, setBusinessPassword, deleteBusiness, refreshSignupRequests, refreshBusinesses } = useAuth();
  const [activeTab, setActiveTab] = useState<'businesses' | 'requests'>('businesses');
  const [searchQuery, setSearchQuery] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<SignupRequest | null>(null);
  const [passwordModalBiz, setPasswordModalBiz] = useState<{ id: string; name: string } | null>(null);
  const [deleteConfirmBiz, setDeleteConfirmBiz] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => { refreshSignupRequests(); refreshBusinesses(); }, []);

  const pendingCount = signupRequests.filter(r => r.status === 'pending').length;

  const filteredBusinesses = (businesses as any[]).filter(b =>
    !searchQuery || b.name?.toLowerCase().includes(searchQuery.toLowerCase()) || b.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRequests = (signupRequests as SignupRequest[]).filter(r =>
    !searchQuery || r.business_name.toLowerCase().includes(searchQuery.toLowerCase()) || r.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSavePrice = async (id: string, value: string) => {
    setSavingId(id);
    try { await setBusinessFixedPrice(id, value === '' ? undefined : parseInt(value)); }
    finally { setSavingId(null); }
  };

  const handleApprove = async (password?: string) => {
    if (!selectedRequest) return;
    await approveRequest(selectedRequest.id, password);
    await refreshSignupRequests();
  };
  const handleReject = async () => {
    if (!selectedRequest) return;
    await rejectRequest(selectedRequest.id);
    await refreshSignupRequests();
  };

  const handleDeleteBusiness = async () => {
    if (!deleteConfirmBiz) return;
    await deleteBusiness(deleteConfirmBiz.id);
    setDeleteConfirmBiz(null);
    await refreshBusinesses();
  };

  return (
    <div className="space-y-8 pb-20">
      <AnimatePresence>
        {selectedRequest && (
          <RequestDetailModal request={selectedRequest} onApprove={handleApprove} onReject={handleReject} onClose={() => setSelectedRequest(null)} />
        )}
        {passwordModalBiz && (
          <ChangePasswordModal businessId={passwordModalBiz.id} businessName={passwordModalBiz.name}
            onSave={setBusinessPassword} onClose={() => setPasswordModalBiz(null)} />
        )}
        {deleteConfirmBiz && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setDeleteConfirmBiz(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={e => e.stopPropagation()}
              className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 space-y-4">
              <h3 className="text-lg font-black text-gray-900">Delete business account?</h3>
              <p className="text-sm text-gray-600 font-medium">This will permanently remove <strong>{deleteConfirmBiz.name}</strong> and their user account. Deliveries history will remain. This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirmBiz(null)} className="flex-1 py-3 rounded-xl font-black text-sm border-2 border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
                <button onClick={handleDeleteBusiness} className="flex-1 py-3 rounded-xl font-black text-sm bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">{t.admin.management}</h1>
          <p className="text-gray-500 font-medium text-sm mt-1">Manage partners and join requests</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border-2 border-gray-50 shadow-sm">
          <button onClick={() => setActiveTab('businesses')}
            className={cn("px-5 py-2.5 rounded-xl text-sm font-black transition-all", activeTab === 'businesses' ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-gray-600")}>
            {t.admin.businesses} <span className="text-xs opacity-70">({filteredBusinesses.length})</span>
          </button>
          <button onClick={() => setActiveTab('requests')}
            className={cn("px-5 py-2.5 rounded-xl text-sm font-black transition-all relative", activeTab === 'requests' ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-gray-600")}>
            {t.admin.signupRequests}
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50">
          <div className="relative max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border-none pl-10 pr-4 py-3.5 rounded-2xl focus:ring-2 focus:ring-blue-500/20 font-bold text-sm outline-none" />
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'businesses' ? (
              <motion.div key="biz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBusinesses.length === 0 ? (
                  <div className="col-span-2 text-center py-16 text-gray-400 font-bold">No businesses found</div>
                ) : filteredBusinesses.map((biz: any) => (
                  <div key={biz.id} className="p-5 bg-gray-50 rounded-[1.5rem] border border-gray-100 hover:border-blue-200 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl">
                        {biz.name?.[0] || 'B'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-gray-900 truncate">{biz.name}</h4>
                        <p className="text-xs text-gray-400 font-bold truncate">{biz.email}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-black text-blue-600">{biz.total_deliveries || 0}</p>
                        <p className="text-[10px] text-gray-400 font-bold">deliveries</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                          <DollarSign size={14} />
                        </div>
                        <span className="text-xs font-bold text-gray-600">Fixed Price</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <input type="number" defaultValue={biz.fixed_price || ''} placeholder="Default"
                          onBlur={e => handleSavePrice(biz.id, e.target.value)}
                          className="w-20 bg-gray-50 border-none px-2 py-1.5 rounded-lg text-right font-black text-blue-600 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none" />
                        <span className="text-xs font-black text-gray-400">DA</span>
                        {savingId === biz.id && <span className="text-[10px] text-green-600 font-black">✓</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <button onClick={() => setPasswordModalBiz({ id: biz.id, name: biz.name })}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-xs border-2 border-blue-100 text-blue-600 hover:bg-blue-50 transition-all">
                        <KeyRound size={14} /> Change password
                      </button>
                      <button onClick={() => setDeleteConfirmBiz({ id: biz.id, name: biz.name })}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-black text-xs border-2 border-red-100 text-red-600 hover:bg-red-50 transition-all">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div key="reqs" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-3">
                {filteredRequests.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300"><UserPlus size={32} /></div>
                    <p className="text-gray-400 font-bold text-sm">No signup requests</p>
                  </div>
                ) : filteredRequests.map((req: SignupRequest) => (
                  <div key={req.id} className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                        <Building2 size={22} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-gray-900 truncate">{req.business_name}</h4>
                          <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-black uppercase',
                            req.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            req.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                            {req.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-0.5">
                          <span className="flex items-center gap-1 text-xs font-bold text-gray-400"><Mail size={11} />{req.email}</span>
                          <span className="flex items-center gap-1 text-xs font-bold text-gray-400"><Phone size={11} />{req.phone}</span>
                        </div>
                        {req.description && <p className="text-xs text-gray-400 mt-1 truncate max-w-xs">{req.description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => setSelectedRequest(req)}
                        className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-blue-600 rounded-xl font-black text-sm border-2 border-blue-50 hover:bg-blue-50 transition-all">
                        <Eye size={14} /> Review
                      </button>
                      {req.status === 'pending' && (
                        <>
                          <button onClick={() => { setSelectedRequest(req); }}
                            className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-black text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
                            Approve
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminManagementPage;
