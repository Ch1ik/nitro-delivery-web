import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Package, 
  User, 
  ShieldCheck 
} from 'lucide-react';
import { cn } from '../lib/utils';

const MobileNav: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { userRole } = useAuth();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-t border-gray-100 px-6 pb-8 pt-3 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <NavLink 
        to={userRole === 'admin' ? "/admin/dashboard" : "/dashboard"} 
        className={({ isActive }) => cn(
          "flex flex-col items-center gap-1 transition-all",
          isActive ? "text-blue-600 scale-110" : "text-gray-400"
        )}
      >
        <LayoutDashboard size={24} />
        <span className="text-[10px] font-black uppercase tracking-widest">{t.nav.dashboard}</span>
      </NavLink>

      <NavLink 
        to={userRole === 'admin' ? "/admin/deliveries" : "/deliveries"} 
        className={({ isActive }) => cn(
          "flex flex-col items-center gap-1 transition-all",
          isActive ? "text-blue-600 scale-110" : "text-gray-400"
        )}
      >
        <Package size={24} />
        <span className="text-[10px] font-black uppercase tracking-widest">{t.nav.deliveries}</span>
      </NavLink>

      {userRole === 'business' && (
        <div className="relative -top-8">
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-create-delivery'))}
            className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/40 border-4 border-white active:scale-90 transition-transform"
          >
            <PlusCircle size={32} />
          </button>
        </div>
      )}

      <NavLink 
        to="/profile" 
        className={({ isActive }) => cn(
          "flex flex-col items-center gap-1 transition-all",
          isActive ? "text-blue-600 scale-110" : "text-gray-400"
        )}
      >
        <User size={24} />
        <span className="text-[10px] font-black uppercase tracking-widest">{t.nav.profile}</span>
      </NavLink>

      {userRole === 'admin' && (
        <NavLink 
          to="/admin/management" 
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-all",
            isActive ? "text-blue-600 scale-110" : "text-gray-400"
          )}
        >
          <ShieldCheck size={24} />
          <span className="text-[10px] font-black uppercase tracking-widest">{t.nav.admin}</span>
        </NavLink>
      )}
    </div>
  );
};

export default MobileNav;
