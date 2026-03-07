import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, ListOrdered, ShieldCheck, LogOut, Settings, HelpCircle, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

const Sidebar: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { userRole, logout } = useAuth();

  const navItems = userRole === 'admin' 
    ? [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: t.nav.dashboard },
        { to: '/admin/deliveries', icon: ListOrdered, label: t.nav.deliveries },
        { to: '/admin/management', icon: ShieldCheck, label: t.nav.admin },
        { to: '/profile', icon: User, label: t.nav.profile },
      ]
    : [
        { to: '/dashboard', icon: LayoutDashboard, label: t.nav.dashboard },
        { to: '/deliveries', icon: ListOrdered, label: t.nav.deliveries },
        { to: '/profile', icon: User, label: t.nav.profile },
      ];

  return (
    <aside className={cn(
      "hidden lg:flex flex-col w-72 bg-white border-gray-100 h-screen sticky top-0 p-8",
      isRTL ? "border-l" : "border-r"
    )}>
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20">
          <span className="text-white font-bold text-2xl italic tracking-tighter">N</span>
        </div>
        <div>
          <h2 className="text-base font-black text-gray-900 leading-tight tracking-tight">Nitro</h2>
          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-[0.15em]">Business Hub</p>
        </div>
      </div>

      <div className="flex-1 space-y-8">
        <div className="space-y-2">
          <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
            {isRTL ? 'القائمة الرئيسية' : 'Main Menu'}
          </p>
          <nav className="space-y-1.5">
            {userRole === 'business' && (
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-create-delivery'))}
                className="w-full flex items-center gap-3 px-4 py-4 mb-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all font-black text-sm active:scale-95 group"
              >
                <PlusCircle size={22} className="group-hover:rotate-90 transition-transform" />
                {t.nav.create}
              </button>
            )}
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm group",
                  isActive 
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20" 
                    : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                )}
              >
                <item.icon size={20} className={cn("transition-transform group-hover:scale-110")} />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="space-y-2">
          <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
            {isRTL ? 'الدعم' : 'Support'}
          </p>
          <nav className="space-y-1.5">
            <NavLink to="/profile" className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all font-bold text-sm group">
              <Settings size={20} className="group-hover:rotate-45 transition-transform" />
              {isRTL ? 'الإعدادات' : 'Settings'}
            </NavLink>
            <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all font-bold text-sm group text-left">
              <HelpCircle size={20} />
              {isRTL ? 'مركز المساعدة' : 'Help Center'}
            </button>
          </nav>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-100">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm group"
        >
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
            <LogOut size={20} />
          </div>
          {isRTL ? 'تسجيل الخروج' : 'Sign Out'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
