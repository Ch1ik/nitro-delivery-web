import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import { LogOut, Bell, User, Search, Menu } from 'lucide-react';
import { cn } from '../lib/utils';

const Header: React.FC = () => {
  const { logout, userRole } = useAuth();
  const { t, isRTL } = useLanguage();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 px-4 sm:px-8 py-3 flex items-center justify-between shadow-sm shadow-black/[0.01]">
      <div className="flex items-center gap-4 lg:gap-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 ring-1 ring-white/20">
            <span className="text-white font-bold text-xl italic tracking-tighter">N</span>
          </div>
          <div className="hidden sm:block">
            <h2 className="text-sm font-extrabold text-gray-900 leading-tight tracking-tight">Nitro</h2>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-[0.1em]">
              {userRole === 'admin' ? (isRTL ? 'لوحة الأدمن' : 'Admin Control') : (isRTL ? 'مركز الأعمال' : 'Business Hub')}
            </p>
          </div>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex items-center bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2 w-64 lg:w-96 group focus-within:ring-2 focus-within:ring-blue-500/10 focus-within:border-blue-500/50 transition-all">
          <Search size={16} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            placeholder={isRTL ? 'بحث عن الطلبات، العملاء...' : 'Search deliveries, clients...'} 
            className={cn("bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-gray-400", isRTL ? 'mr-2' : 'ml-2')}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-6">
        <LanguageSwitcher />
        
        <div className="flex items-center gap-1 sm:gap-3">
          <button className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative group">
            <Bell size={20} className="group-hover:scale-110 transition-transform" />
            <span className={cn("absolute top-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white", isRTL ? 'left-2.5' : 'right-2.5')} />
          </button>
          
          <div className="h-6 w-px bg-gray-100 mx-1 hidden sm:block" />
          
          <div className="flex items-center gap-3 pl-1 sm:pl-3">
            <div className={cn("hidden sm:block", isRTL ? 'text-left' : 'text-right')}>
              <p className="text-xs font-bold text-gray-900">Nitro Business</p>
              <p className="text-[10px] text-gray-400 font-medium">{isRTL ? 'شريك معتمد' : 'Verified Partner'}</p>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-2 p-1 rounded-2xl hover:bg-gray-50 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all">
                <User size={20} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
