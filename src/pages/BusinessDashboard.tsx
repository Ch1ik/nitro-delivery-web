import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Package, TrendingUp, Clock, CheckCircle2, Plus, MapPin, Settings, Navigation, XCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { deliveryService, DeliveryStats } from '../services/api';
import { websocketService } from '../services/websocket';
import { cn } from '../lib/utils';

const chartData = [
  { name: 'Mon', count: 12 }, { name: 'Tue', count: 18 }, { name: 'Wed', count: 15 },
  { name: 'Thu', count: 22 }, { name: 'Fri', count: 20 }, { name: 'Sat', count: 28 }, { name: 'Sun', count: 14 },
];

const BusinessDashboard: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { businessProfile } = useAuth();
  const [stats, setStats] = useState<DeliveryStats | null>(null);

  useEffect(() => {
    deliveryService.getStats().then(setStats).catch(console.error);
    
    // Set up WebSocket listeners for real-time updates
    const handleDeliveryCreated = () => {
      deliveryService.getStats().then(setStats).catch(console.error);
    };
    
    const handleDeliveryStatusUpdated = () => {
      deliveryService.getStats().then(setStats).catch(console.error);
    };
    
    websocketService.onDeliveryCreated(handleDeliveryCreated);
    websocketService.onDeliveryStatusUpdated(handleDeliveryStatusUpdated);
    
    // Fallback to custom events for compatibility
    const handleCreated = () => deliveryService.getStats().then(setStats).catch(console.error);
    window.addEventListener('delivery-created', handleCreated);
    
    return () => {
      websocketService.off('delivery-created', handleDeliveryCreated);
      websocketService.off('delivery-status-updated', handleDeliveryStatusUpdated);
      window.removeEventListener('delivery-created', handleCreated);
    };
  }, []);

  const refusalDisplay = stats && stats.total != null && stats.denied != null
    ? `${stats.refusalRate ?? Math.round((stats.denied / stats.total) * 100)}%`
    : '—';
  const refusalSub = stats && stats.total != null && stats.denied != null ? `${stats.denied}/${stats.total} refused` : '';
  const statCards = [
    { label: t.dashboard.totalDeliveries, value: stats?.total?.toString() ?? '—', sub: '', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: t.dashboard.completed, value: stats?.delivered?.toString() ?? '—', sub: '', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    { label: t.dashboard.pending, value: stats?.pending?.toString() ?? '—', sub: '', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: t.dashboard.refusalRate, value: refusalDisplay, sub: refusalSub, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-white shadow-xl">
            <img src={businessProfile.photo_url || 'https://picsum.photos/seed/business/200/200'} alt="Business"
              className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">{businessProfile.name}</h1>
            <p className="text-gray-500 font-medium">{isRTL ? 'لوحة تحكم الأعمال • باتنة، الجزائر' : 'Business Dashboard • Batna, Algeria'}</p>
          </div>
        </div>
        <div className="flex items-center justify-center lg:justify-end gap-4">
          <Link to="/profile" className="p-4 bg-white text-gray-400 rounded-2xl border-2 border-gray-50 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm">
            <Settings size={24} />
          </Link>
          <button onClick={() => window.dispatchEvent(new CustomEvent('open-create-delivery'))}
            className="flex-1 sm:flex-none flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-95">
            <Plus size={20} />
            {isRTL ? 'طلب جديد' : 'New Delivery'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-white p-6 sm:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-4">
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
              {stat.sub ? <p className="text-xs font-bold text-gray-400 mt-0.5">{stat.sub}</p> : null}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
        <h3 className="text-2xl font-black text-gray-900 tracking-tight">{t.dashboard.deliveryStats}</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 700 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 700 }} />
              <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
              <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
