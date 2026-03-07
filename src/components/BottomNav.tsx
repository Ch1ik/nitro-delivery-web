import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, ListOrdered, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

const BottomNav: React.FC = () => {
  const { t } = useLanguage();
  const { userRole } = useAuth();

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: t.nav.dashboard },
    { to: '/create', icon: PlusCircle, label: t.nav.create },
    { to: '/deliveries', icon: ListOrdered, label: t.nav.deliveries },
  ];

  if (userRole === 'admin') {
    navItems.push({ to: '/admin', icon: ShieldCheck, label: t.nav.admin });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-around items-center md:hidden z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => cn(
            "flex flex-col items-center gap-1 transition-colors",
            isActive ? "text-blue-600" : "text-gray-400"
          )}
        >
          <item.icon size={24} />
          <span className="text-[10px] font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
