import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  TrendingUp, 
  Package, 
  Clock, 
  Building2,
  CloudRain,
  Moon,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

const AdminOverviewPage: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { businesses, nightTariffEnabled, setNightTariffEnabled, refreshBusinesses } = useAuth();
  React.useEffect(() => { refreshBusinesses(); }, []);
  const [weatherAlert, setWeatherAlert] = useState(false);

  const stats = [
    { label: t.dashboard.totalRevenue, value: '1.2M DA', change: '+12.5%', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: t.dashboard.activeBusinesses, value: businesses.length.toString(), change: '+3', icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: t.dashboard.pendingDeliveries, value: '156', change: '-8', icon: Package, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: t.dashboard.avgDeliveryTime, value: '24m', change: '-2m', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const chartData = [
    { name: isRTL ? 'الإثنين' : 'Mon', revenue: 45000, deliveries: 120 },
    { name: isRTL ? 'الثلاثاء' : 'Tue', revenue: 52000, deliveries: 145 },
    { name: isRTL ? 'الأربعاء' : 'Wed', revenue: 48000, deliveries: 132 },
    { name: isRTL ? 'الخميس' : 'Thu', revenue: 61000, deliveries: 168 },
    { name: isRTL ? 'الجمعة' : 'Fri', revenue: 55000, deliveries: 154 },
    { name: isRTL ? 'السبت' : 'Sat', revenue: 67000, deliveries: 189 },
    { name: isRTL ? 'الأحد' : 'Sun', revenue: 42000, deliveries: 110 },
  ];

  const statusData = [
    { name: 'Completed', value: 850, color: '#10b981' },
    { name: 'Pending', value: 120, color: '#f59e0b' },
    { name: 'Denied', value: 30, color: '#ef4444' },
  ];

  const businessPerformance = [
    { name: 'Batna Tech', deliveries: 450, growth: '+15%', rating: 4.8 },
    { name: 'Aurès Food', deliveries: 320, growth: '+22%', rating: 4.9 },
    { name: 'Nitro Store', deliveries: 280, growth: '+10%', rating: 4.7 },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">{t.nav.dashboard}</h1>
          <p className="text-gray-500 font-medium">{t.admin.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 sm:gap-4">
          <button 
            onClick={() => setWeatherAlert(!weatherAlert)}
            className={`flex items-center gap-3 px-4 sm:px-6 py-3 rounded-2xl font-black transition-all shadow-lg text-sm sm:text-base ${
              weatherAlert 
                ? 'bg-red-600 text-white shadow-red-500/30' 
                : 'bg-white text-gray-900 border-2 border-gray-100 hover:bg-gray-50'
            }`}
          >
            <CloudRain size={20} className={weatherAlert ? 'animate-bounce' : ''} />
            {t.admin.weatherToggle}
          </button>

          <button 
            onClick={() => setNightTariffEnabled(!nightTariffEnabled).catch(console.error)}
            className={`flex items-center gap-3 px-4 sm:px-6 py-3 rounded-2xl font-black transition-all shadow-lg text-sm sm:text-base ${
              nightTariffEnabled 
                ? 'bg-indigo-600 text-white shadow-indigo-500/30' 
                : 'bg-white text-gray-900 border-2 border-gray-100 hover:bg-gray-50'
            }`}
          >
            <Moon size={20} className={nightTariffEnabled ? 'animate-pulse' : ''} />
            {t.admin.nightTariff}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-4"
          >
            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-end gap-3" dir="ltr">
                <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
                <span className={`text-xs font-black mb-1.5 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{t.dashboard.deliveryStats}</h3>
            <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
              <button className="px-4 py-2 bg-white text-blue-600 rounded-lg text-xs font-black shadow-sm">Revenue</button>
              <button className="px-4 py-2 text-gray-400 text-xs font-black">Deliveries</button>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 700 }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f9fafb' }}
                />
                <Bar dataKey="revenue" fill="#2563eb" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">Status Distribution</h3>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-3xl font-black text-gray-900">1,000</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-bold text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-black text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Business Performance</h3>
            <button className="text-blue-600 text-sm font-black flex items-center gap-1 hover:underline">
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="space-y-6">
            {businessPerformance.map((biz, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm font-black text-blue-600">
                    {biz.name[0]}
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900">{biz.name}</h4>
                    <p className="text-xs font-bold text-gray-400">{biz.deliveries} Deliveries</p>
                  </div>
                </div>
                <div className="text-right" dir="ltr">
                  <p className="text-green-600 font-black">{biz.growth}</p>
                  <p className="text-xs font-bold text-gray-400">Rating: {biz.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 space-y-8">
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">System Health</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-green-50 rounded-3xl border border-green-100 space-y-2">
                <CheckCircle2 className="text-green-600" size={24} />
                <p className="text-xs font-black text-green-900 uppercase tracking-widest">Fleet Active</p>
                <p className="text-2xl font-black text-green-600">98.2%</p>
              </div>
              <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 space-y-2">
                <TrendingUp className="text-blue-600" size={24} />
                <p className="text-xs font-black text-blue-900 uppercase tracking-widest">Avg Speed</p>
                <p className="text-2xl font-black text-blue-600">18 km/h</p>
              </div>
            </div>
            <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-500">Server Latency</span>
                <span className="text-sm font-black text-green-600">42ms</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-[15%]" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-500">Database Load</span>
                <span className="text-sm font-black text-yellow-600">64%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-yellow-500 h-full w-[64%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
