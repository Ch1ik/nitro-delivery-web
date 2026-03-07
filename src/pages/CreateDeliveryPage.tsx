import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'motion/react';
import { 
  MapPin, 
  User, 
  Phone, 
  Calendar, 
  Zap, 
  CloudRain, 
  Headphones,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

const CreateDeliveryPage: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [addons, setAddons] = useState({
    scheduled: false,
    priority: false,
    weather: false,
    callOffice: false,
  });

  const basePrice = 450;
  const addonPrices = {
    scheduled: 30,
    priority: 100,
    weather: 200,
    callOffice: 20,
  };

  const totalPrice = basePrice + 
    (addons.scheduled ? addonPrices.scheduled : 0) +
    (addons.priority ? addonPrices.priority : 0) +
    (addons.weather ? addonPrices.weather : 0) +
    (addons.callOffice ? addonPrices.callOffice : 0);

  const toggleAddon = (key: keyof typeof addons) => {
    setAddons(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-6 pb-24 md:pb-6 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900">{t.create.title}</h1>

      {/* Map Placeholder */}
      <div className="relative h-48 w-full bg-gray-100 rounded-3xl overflow-hidden border border-gray-200 shadow-inner">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-400 flex flex-col items-center gap-2">
            <MapPin size={32} className="text-blue-500 animate-bounce" />
            <span className="text-xs font-medium">Interactive Map UI Placeholder</span>
          </div>
        </div>
        {/* Mock Pins */}
        <div className="absolute top-1/4 left-1/3 p-1 bg-white rounded-full shadow-md">
          <div className="w-2 h-2 bg-blue-600 rounded-full" />
        </div>
        <div className="absolute bottom-1/4 right-1/3 p-1 bg-white rounded-full shadow-md">
          <div className="w-2 h-2 bg-yellow-500 rounded-full" />
        </div>
      </div>

      {/* Form Sections */}
      <div className="space-y-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <MapPin size={18} />
            </div>
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">{t.create.pickup}</label>
              <input 
                type="text" 
                placeholder="Select pickup point..."
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-medium text-gray-900"
              />
            </div>
          </div>
          <div className="h-px bg-gray-100 mx-11" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center">
              <MapPin size={18} />
            </div>
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">{t.create.dropoff}</label>
              <input 
                type="text" 
                placeholder="Select drop-off point..."
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-medium text-gray-900"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center">
              <User size={18} />
            </div>
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">{t.create.clientName}</label>
              <input 
                type="text" 
                placeholder="e.g. Ahmed Benali"
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-medium text-gray-900"
              />
            </div>
          </div>
          <div className="h-px bg-gray-100 mx-11" />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-50 text-gray-400 flex items-center justify-center">
              <Phone size={18} />
            </div>
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">{t.create.clientPhone}</label>
              <input 
                type="tel" 
                placeholder="05XX XX XX XX"
                className="w-full bg-transparent border-none p-0 focus:ring-0 text-sm font-medium text-gray-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add-ons */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { key: 'scheduled', label: t.create.scheduled, icon: Calendar, price: 30 },
          { key: 'priority', label: t.create.priority, icon: Zap, price: 100 },
          { key: 'weather', label: t.create.weather, icon: CloudRain, price: 200 },
          { key: 'callOffice', label: t.create.callOffice, icon: Headphones, price: 20 },
        ].map((addon) => (
          <button
            key={addon.key}
            onClick={() => toggleAddon(addon.key as any)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-2xl border transition-all text-left",
              addons[addon.key as keyof typeof addons]
                ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                : "bg-white border-gray-100 text-gray-600 hover:border-blue-200"
            )}
          >
            <addon.icon size={18} className={cn(addons[addon.key as keyof typeof addons] ? "text-white" : "text-blue-500")} />
            <div className="flex-1">
              <p className="text-[10px] font-bold leading-tight">{addon.label}</p>
              <p className={cn("text-[10px] opacity-70", addons[addon.key as keyof typeof addons] ? "text-white" : "text-gray-400")}>
                +{addon.price} DA
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Pricing Breakdown Card */}
      <motion.div 
        layout
        className="bg-blue-50 p-6 rounded-3xl border border-blue-100 space-y-4"
      >
        <h3 className="font-bold text-blue-900 text-sm">{t.create.pricing}</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-blue-800/70">
            <span>{t.create.distancePrice}</span>
            <span>{basePrice} DA</span>
          </div>
          {Object.entries(addons).map(([key, active]) => active && (
            <div key={key} className="flex justify-between text-xs text-blue-800/70">
              <span>{t.create[key as keyof typeof t.create]}</span>
              <span>+{addonPrices[key as keyof typeof addonPrices]} DA</span>
            </div>
          ))}
          <div className="h-px bg-blue-200 my-2" />
          <div className="flex justify-between items-center">
            <span className="font-bold text-blue-900">{t.create.total}</span>
            <span className="text-xl font-black text-blue-600">{totalPrice} DA</span>
          </div>
        </div>
      </motion.div>

      {/* Confirm Button */}
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2">
        {t.create.confirm}
        <ChevronRight size={20} className={cn(isRTL && "rotate-180")} />
      </button>
    </div>
  );
};

export default CreateDeliveryPage;
