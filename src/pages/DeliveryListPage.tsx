import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  Package, MapPin, Clock, ChevronRight, Search, ArrowUpDown,
  ChevronDown, Plus, X, Phone, User, Building2, FileText,
  CheckCircle2, Truck, XCircle, AlertCircle, Navigation, Eye, Map
} from 'lucide-react';
import { deliveryService, Delivery } from '../services/api';
import { websocketService } from '../services/websocket';
import GoogleMap from '../components/GoogleMap';
import { NotificationService } from '../components/Notifications';
import { cn } from '../lib/utils';

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType; bg: string; border: string }> = {
  pending:     { label: 'Pending',     color: 'text-yellow-600', icon: Clock,        bg: 'bg-yellow-50',  border: 'border-yellow-100' },
  confirmed:   { label: 'Confirmed',   color: 'text-blue-600',   icon: CheckCircle2, bg: 'bg-blue-50',    border: 'border-blue-100' },
  in_progress: { label: 'In Progress', color: 'text-purple-600', icon: Truck,        bg: 'bg-purple-50',  border: 'border-purple-100' },
  delivered:   { label: 'Delivered',   color: 'text-green-600',  icon: CheckCircle2, bg: 'bg-green-50',   border: 'border-green-100' },
  denied:      { label: 'Denied',      color: 'text-red-600',    icon: XCircle,      bg: 'bg-red-50',     border: 'border-red-100' },
};

// ── Delivery Detail Modal ─────────────────────────────────────────────────────
const DeliveryDetailModal: React.FC<{
  delivery: Delivery;
  isAdmin: boolean;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
  onStopStatusChange?: (deliveryId: string, stopId: string, status: string) => Promise<void>;
}> = ({ delivery, isAdmin, onClose, onStatusChange, onStopStatusChange }) => {
  const [updating, setUpdating] = useState(false);
  const [localDelivery, setLocalDelivery] = useState(delivery);
  const [showMap, setShowMap] = useState(false);
  React.useEffect(() => setLocalDelivery(delivery), [delivery]);
  const d = localDelivery;
  const cfg = STATUS_CONFIG[d.status] || STATUS_CONFIG.pending;
  const StatusIcon = cfg.icon;

  const adminActions = [
    { status: 'confirmed',   label: 'Confirm',     color: 'bg-blue-600 text-white' },
    { status: 'in_progress', label: 'In Progress', color: 'bg-purple-600 text-white' },
    { status: 'delivered',   label: 'Delivered',   color: 'bg-green-600 text-white' },
    { status: 'denied',      label: 'Deny',        color: 'bg-red-600 text-white' },
  ].filter(a => a.status !== d.status);

  const handleAction = async (status: string) => {
    setUpdating(true);
    try { await onStatusChange(d.id, status); }
    finally { setUpdating(false); }
  };

  const handleStopStatusChange = async (stopId: string, status: string) => {
    if (!onStopStatusChange) return;
    await onStopStatusChange(d.id, stopId, status);
    setLocalDelivery(prev => prev ? { ...prev, stops: prev.stops?.map(s => s.id === stopId ? { ...s, status: status as 'pending' | 'delivered' | 'failed' } : s) ?? [] } : prev);
  };

  const formatDate = (ts: number) => new Date(ts * 1000).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Package size={20} /></div>
            <div>
              <h2 className="text-xl font-black text-gray-900">{d.id}</h2>
              <p className="text-xs text-gray-400 font-medium">{formatDate(d.created_at)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn('px-3 py-1.5 rounded-full text-xs font-black border flex items-center gap-1.5', cfg.color, cfg.bg, cfg.border)}>
              <StatusIcon size={12} /> {cfg.label}
            </span>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={22} /></button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Client */}
          <Section title="Client Info">
            <InfoRow icon={User} label="Name" value={d.client_name} />
            <InfoRow icon={Phone} label="Phone" value={d.client_phone} />
          </Section>

          {/* Business (admin only) */}
          {isAdmin && d.business_name && (
            <Section title="Business">
              <InfoRow icon={Building2} label="Name" value={d.business_name} />
              {d.business_email && <InfoRow icon={User} label="Email" value={d.business_email} />}
              {d.business_phone && <InfoRow icon={Phone} label="Phone" value={d.business_phone} />}
            </Section>
          )}

          {/* Route */}
          <Section title="Route">
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-black shrink-0 mt-0.5">P</div>
                <div>
                  <p className="text-xs font-black text-blue-600 uppercase tracking-widest">Pickup</p>
                  <p className="text-sm font-bold text-gray-900">{d.pickup_location}</p>
                </div>
              </div>
              {d.stops?.map((stop, i) => (
                <div key={stop.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className={cn('w-6 h-6 rounded-full text-white text-xs flex items-center justify-center font-black shrink-0 mt-0.5',
                    stop.status === 'delivered' ? 'bg-green-500' : stop.status === 'failed' ? 'bg-red-500' : 'bg-gray-400')}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Stop {i + 1}</p>
                    <p className="text-sm font-bold text-gray-900">{stop.address}</p>
                    {stop.client_name && stop.client_name !== d.client_name && (
                      <p className="text-xs text-gray-400 font-medium mt-0.5">{stop.client_name} · {stop.client_phone}</p>
                    )}
                  </div>
                  {isAdmin && onStopStatusChange && (
                    <select value={stop.status}
                      onChange={async e => { await handleStopStatusChange(stop.id, e.target.value); }}
                      className={cn('text-xs font-black border rounded-lg px-2 py-1 outline-none', 
                        stop.status === 'delivered' ? 'bg-green-50 text-green-600 border-green-100' :
                        stop.status === 'failed' ? 'bg-red-50 text-red-600 border-red-100' :
                        'bg-yellow-50 text-yellow-600 border-yellow-100')}>
                      <option value="pending">Pending</option>
                      <option value="delivered">Delivered</option>
                      <option value="failed">Failed</option>
                    </select>
                  )}
                </div>
              ))}
            </div>
            
            {/* Map Toggle */}
            {(d.pickup_lat && d.pickup_lng) && (
              <div className="mt-4">
                <button
                  onClick={() => setShowMap(!showMap)}
                  className="flex items-center gap-2 text-blue-600 font-black text-sm hover:text-blue-700 transition-colors"
                >
                  <Map size={16} />
                  {showMap ? 'Hide Map' : 'Show Map'}
                </button>
                {showMap && (
                  <div className="mt-3">
                    <GoogleMap 
                      deliveries={[d]} 
                      height="300px"
                      showDeliveryRoutes={true}
                    />
                  </div>
                )}
              </div>
            )}
          </Section>

          {/* Notes */}
          {d.notes && (
            <Section title="Notes">
              <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-xl">
                <FileText size={14} className="text-gray-400 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600 font-medium">{d.notes}</p>
              </div>
            </Section>
          )}

          {/* Pricing */}
          <Section title="Pricing">
            <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl">
              <span className="font-bold text-gray-700">Delivery fee</span>
              <span className={d.price === -1 ? 'text-amber-600 font-black' : 'text-2xl font-black text-blue-600'}>
                {d.price === -1 ? 'Unknown' : `${d.price} DA`}
              </span>
            </div>
            {d.package_price != null && (
              <div className="flex items-center justify-between mt-2 text-sm font-bold text-gray-600">
                <span>Package value</span>
                <span>{d.package_price} DA</span>
              </div>
            )}
          </Section>
        </div>

        {/* Admin actions */}
        {isAdmin && (
          <div className="p-5 border-t border-gray-100">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {adminActions.map(action => (
                <button key={action.status} onClick={() => handleAction(action.status)} disabled={updating}
                  className={cn('flex-1 min-w-[100px] py-2.5 rounded-xl font-black text-sm transition-all disabled:opacity-60 hover:opacity-90 active:scale-95', action.color)}>
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="space-y-2">
    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">{title}</h4>
    {children}
  </div>
);

const InfoRow: React.FC<{ icon: React.ElementType; label: string; value: string }> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
    <Icon size={14} className="text-gray-400 shrink-0" />
    <span className="text-xs text-gray-400 font-bold w-12 shrink-0">{label}</span>
    <span className="text-sm font-bold text-gray-900">{value}</span>
  </div>
);

// ── Main List Page ─────────────────────────────────────────────────────────────
interface DeliveryListPageProps { isAdminView?: boolean; }

const DeliveryListPage: React.FC<DeliveryListPageProps> = ({ isAdminView = false }) => {
  const { t, isRTL } = useLanguage();
  const { userRole } = useAuth();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const loadDeliveries = () => {
    deliveryService.getAll().then(setDeliveries).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDeliveries();
    
    // Set up WebSocket listeners
    const handleDeliveryCreated = (delivery: Delivery) => {
      setDeliveries(prev => [delivery, ...prev]);
      NotificationService.getInstance().deliveryCreated(delivery.id, delivery.client_name);
    };
    
    const handleDeliveryStatusUpdated = (delivery: Delivery) => {
      setDeliveries(prev => prev.map(d => d.id === delivery.id ? { ...delivery, stops: d.stops } : d));
      setSelectedDelivery(prev => prev?.id === delivery.id ? { ...delivery, stops: prev.stops } : prev);
      NotificationService.getInstance().deliveryStatusUpdated(delivery.id, delivery.status);
    };
    
    const handleDriverAssigned = (data: { deliveryId: string; driverId: string; assignment: any }) => {
      // Update delivery with driver info
      setDeliveries(prev => prev.map(d => d.id === data.deliveryId ? { ...d, driver: data.assignment } : d));
      NotificationService.getInstance().driverAssigned(data.deliveryId, data.assignment.driver_name || 'Unknown Driver');
    };
    
    websocketService.onDeliveryCreated(handleDeliveryCreated);
    websocketService.onDeliveryStatusUpdated(handleDeliveryStatusUpdated);
    
    // Listen for driver assignments
    if (typeof window !== 'undefined') {
      window.addEventListener('driver-assigned', (event: any) => {
        handleDriverAssigned(event.detail);
      });
    }
    
    // Fallback to custom events for compatibility
    const handleCreated = () => loadDeliveries();
    window.addEventListener('delivery-created', handleCreated);
    
    return () => {
      websocketService.off('delivery-created', handleDeliveryCreated);
      websocketService.off('delivery-status-updated', handleDeliveryStatusUpdated);
      window.removeEventListener('delivery-created', handleCreated);
      if (typeof window !== 'undefined') {
        window.removeEventListener('driver-assigned', handleDriverAssigned);
      }
    };
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const updated = await deliveryService.updateStatus(id, status);
      setDeliveries(prev => prev.map(d => d.id === id ? { ...updated, stops: d.stops } : d));
      setSelectedDelivery(prev => prev?.id === id ? { ...updated, stops: prev.stops } : prev);
    } catch (err) { console.error(err); }
  };

  const sortedDeliveries = useMemo(() => {
    let filtered = deliveries.filter(d => {
      const matchSearch = searchQuery === '' ||
        d.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.pickup_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.business_name || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = filterStatus === 'all' || d.status === filterStatus;
      return matchSearch && matchStatus;
    });
    return filtered.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'date') cmp = a.created_at - b.created_at;
      else if (sortBy === 'price') {
        const pa = a.price === -1 ? 1e9 : a.price;
        const pb = b.price === -1 ? 1e9 : b.price;
        cmp = pa - pb;
      } else if (sortBy === 'status') cmp = a.status.localeCompare(b.status);
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [deliveries, sortBy, sortOrder, searchQuery, filterStatus]);

  const formatDate = (ts: number) => {
    const date = new Date(ts * 1000);
    const now = new Date();
    const diffH = Math.floor((now.getTime() - date.getTime()) / 3600000);
    if (diffH < 1) return 'Just now';
    if (diffH < 24) return `${diffH}h ago`;
    if (diffH < 48) return `Yesterday`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="space-y-5 pb-24 md:pb-6">
      <AnimatePresence>
        {selectedDelivery && (
          <DeliveryDetailModal
            delivery={selectedDelivery}
            isAdmin={isAdminView && userRole === 'admin'}
            onClose={() => setSelectedDelivery(null)}
            onStatusChange={handleStatusChange}
            onStopStatusChange={isAdminView && userRole === 'admin' ? async (deliveryId, stopId, status) => {
              await deliveryService.updateStopStatus(deliveryId, stopId, status);
              setSelectedDelivery(prev => prev?.id === deliveryId ? { ...prev, stops: prev.stops?.map(s => s.id === stopId ? { ...s, status: status as 'pending' | 'delivered' | 'failed' } : s) ?? [] } : prev);
              setDeliveries(prev => prev.map(d => d.id === deliveryId ? { ...d, stops: d.stops?.map(s => s.id === stopId ? { ...s, status: status as 'pending' | 'delivered' | 'failed' } : s) ?? [] } : d));
            } : undefined}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-bold text-gray-900">{t.list.title}
          <span className="ml-2 text-sm font-bold text-gray-400">({sortedDeliveries.length})</span>
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex bg-white rounded-xl border border-gray-100 p-1">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-black transition-all",
                viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <Package size={16} className="inline mr-1" /> List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={cn(
                "px-3 py-2 rounded-lg text-sm font-black transition-all",
                viewMode === 'map' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              <Map size={16} className="inline mr-1" /> Map
            </button>
          </div>
          
          {userRole === 'business' && (
            <button onClick={() => window.dispatchEvent(new CustomEvent('open-create-delivery'))}
              className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-black text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">
              <Plus size={16} /> {t.nav.create}
            </button>
          )}
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..."
              className="pl-9 pr-4 py-2.5 bg-white rounded-xl border border-gray-100 text-sm font-bold text-gray-600 focus:outline-none focus:border-blue-200 w-36 md:w-48" />
          </div>
          {/* Sort */}
          <div className="relative">
            <button onClick={() => setShowSortMenu(!showSortMenu)}
              className={cn("flex items-center gap-1.5 px-3 py-2.5 bg-white rounded-xl border text-sm font-bold shadow-sm transition-all", showSortMenu ? "border-blue-200 text-blue-600" : "border-gray-100 text-gray-500")}>
              <ArrowUpDown size={14} /><span className="hidden sm:inline">Sort</span><ChevronDown size={12} className={cn("transition-transform", showSortMenu && "rotate-180")} />
            </button>
            <AnimatePresence>
              {showSortMenu && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                  className={cn("absolute top-full mt-2 w-40 bg-white rounded-2xl shadow-2xl border border-gray-100 py-1.5 z-50", isRTL ? "left-0" : "right-0")}>
                  {[{ id: 'date', label: 'Date' }, { id: 'price', label: 'Price' }, { id: 'status', label: 'Status' }].map(opt => (
                    <button key={opt.id} onClick={() => { sortBy === opt.id ? setSortOrder(o => o === 'asc' ? 'desc' : 'asc') : (setSortBy(opt.id as any), setSortOrder('desc')); setShowSortMenu(false); }}
                      className={cn("w-full px-4 py-2.5 text-sm font-bold flex items-center justify-between hover:bg-gray-50", sortBy === opt.id ? "text-blue-600" : "text-gray-600")}>
                      {opt.label}
                      {sortBy === opt.id && <ArrowUpDown size={12} className={cn(sortOrder === 'asc' && "rotate-180")} />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['all', 'pending', 'confirmed', 'in_progress', 'delivered', 'denied'].map(s => {
          const count = s === 'all' ? deliveries.length : deliveries.filter(d => d.status === s).length;
          const cfg = s === 'all' ? null : STATUS_CONFIG[s];
          return (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black whitespace-nowrap border transition-all",
                filterStatus === s
                  ? (cfg ? `${cfg.color} ${cfg.bg} ${cfg.border}` : 'bg-gray-900 text-white border-gray-900')
                  : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200')}>
              {s === 'all' ? 'All' : cfg?.label} <span className="opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* List/Map View */}
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50 h-28 animate-pulse" />)}</div>
      ) : sortedDeliveries.length === 0 ? (
        <div className="text-center py-20 text-gray-400 font-bold">No deliveries found</div>
      ) : (
        <>
          {viewMode === 'map' ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-50 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-black text-gray-900">Live Delivery Tracking</h3>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    <span className="text-gray-600">Pickup</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    <span className="text-gray-600">Pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-600">Delivered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-600">Failed</span>
                  </div>
                </div>
              </div>
              <GoogleMap 
                deliveries={sortedDeliveries} 
                height="600px"
                showDeliveryRoutes={true}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {sortedDeliveries.map((delivery, idx) => {
                const cfg = STATUS_CONFIG[delivery.status] || STATUS_CONFIG.pending;
                const StatusIcon = cfg.icon;
                return (
                  <motion.div key={delivery.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }}
                    onClick={() => setSelectedDelivery(delivery)}
                    className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 cursor-pointer hover:border-blue-100 hover:shadow-md transition-all group active:scale-[0.99]">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          <Package size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-gray-900">{delivery.id}</h4>
                          <p className="text-[10px] text-gray-400 font-medium">{formatDate(delivery.created_at)}</p>
                        </div>
                      </div>
                      <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider flex items-center gap-1", cfg.color, cfg.bg, cfg.border)}>
                        <StatusIcon size={10} /> {cfg.label}
                      </span>
                    </div>
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin size={12} className="text-blue-500 shrink-0" />
                        <span className="truncate">{delivery.pickup_location}</span>
                        {delivery.stops?.length > 0 && (
                          <span className="shrink-0 text-gray-300">→ {delivery.stops.length} stop{delivery.stops.length > 1 ? 's' : ''}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <User size={12} className="text-gray-400 shrink-0" />
                        <span>{delivery.client_name} · {delivery.client_phone}</span>
                      </div>
                      {isAdminView && delivery.business_name && (
                        <div className="flex items-center gap-2 text-xs text-purple-600 font-bold">
                          <Building2 size={12} className="shrink-0" />
                          <span>{delivery.business_name}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <span className={delivery.price === -1 ? 'text-amber-600 font-black text-sm' : 'text-base font-black text-blue-600'}>
                        {delivery.price === -1 ? 'Unknown' : `${delivery.price} DA`}
                      </span>
                      <div className="flex items-center gap-1.5 text-blue-600 text-xs font-bold group-hover:translate-x-1 transition-transform">
                        <Eye size={12} /> View Details
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DeliveryListPage;
