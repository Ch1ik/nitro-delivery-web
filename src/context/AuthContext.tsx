import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, adminService, profileService, SignupRequest } from '../services/api';
import { websocketService } from '../services/websocket';

type UserRole = 'admin' | 'business';

interface BusinessProfile {
  name: string;
  phone: string;
  email: string;
  photo_url?: string;
  fixed_price?: number;
}

interface Business extends BusinessProfile {
  id: string;
  email: string;
  total_deliveries?: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  businessId?: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUserRole: (role: UserRole) => void;
  signupRequests: SignupRequest[];
  submitSignupRequest: (request: { businessName: string; email: string; phone: string; password: string; address?: string; description?: string; website?: string }) => Promise<void>;
  approveRequest: (id: string, password?: string) => Promise<void>;
  rejectRequest: (id: string) => Promise<void>;
  setBusinessPassword: (businessId: string, newPassword: string) => Promise<void>;
  deleteBusiness: (businessId: string) => Promise<void>;
  nightTariffEnabled: boolean;
  setNightTariffEnabled: (enabled: boolean) => Promise<void>;
  businessProfile: BusinessProfile;
  updateBusinessProfile: (profile: Partial<BusinessProfile>) => Promise<void>;
  businesses: Business[];
  setBusinessFixedPrice: (id: string, price: number | undefined) => Promise<void>;
  refreshSignupRequests: () => Promise<void>;
  refreshBusinesses: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('business');
  const [businessId, setBusinessId] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [signupRequests, setSignupRequests] = useState<SignupRequest[]>([]);
  const [nightTariffEnabled, setNightTariffState] = useState(false);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>({
    name: 'Nitro Partner', phone: '+213 770 00 00 00', email: 'partner@nitro.dz',
    photo_url: 'https://picsum.photos/seed/business/200/200',
  });
  const [businesses, setBusinesses] = useState<Business[]>([]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (isAuthenticated) {
      websocketService.connect();
      
      if (userRole === 'business' && businessId) {
        websocketService.joinBusiness(businessId);
      } else if (userRole === 'admin') {
        websocketService.joinAdmin();
      }
    } else {
      websocketService.disconnect();
    }

    return () => {
      if (!isAuthenticated) {
        websocketService.disconnect();
      }
    };
  }, [isAuthenticated, userRole, businessId]);

  useEffect(() => {
    const token = localStorage.getItem('nitro_token');
    if (token) {
      authService.me()
        .then(user => {
          setIsAuthenticated(true);
          setUserRole(user.role);
          if (user.role === 'business' && user.profile) {
            setBusinessProfile({ name: user.profile.name, phone: user.profile.phone, email: user.email, photo_url: user.profile.photo_url, fixed_price: user.profile.fixed_price });
            setBusinessId(user.profile.id);
          }
        })
        .catch(() => localStorage.removeItem('nitro_token'))
        .finally(() => setIsLoading(false));
    } else { setIsLoading(false); }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authService.login(email, password);
    localStorage.setItem('nitro_token', data.token);
    setIsAuthenticated(true); setUserRole(data.role);
    const me = await authService.me();
    if (me.role === 'business' && me.profile) {
      setBusinessProfile({ name: me.profile.name, phone: me.profile.phone, email: me.email, photo_url: me.profile.photo_url, fixed_price: me.profile.fixed_price });
      setBusinessId(me.profile.id);
    }
    if (me.role === 'admin') {
      await Promise.all([refreshSignupRequests(), refreshBusinesses()]);
      const settings = await adminService.getSettings();
      setNightTariffState(settings.night_tariff_enabled === 'true');
    }
  };

  const logout = () => {
    localStorage.removeItem('nitro_token');
    setIsAuthenticated(false);
    setUserRole('business');
    setBusinessId(undefined);
    websocketService.disconnect();
  };

  const submitSignupRequest = async (request: { businessName: string; email: string; phone: string; password: string; address?: string; description?: string; website?: string }) => {
    await authService.signup(request);
  };

  const approveRequest = async (id: string, password?: string) => {
    await adminService.handleSignupRequest(id, 'approve', password);
    setSignupRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' as const } : r));
  };

  const setBusinessPassword = async (businessId: string, newPassword: string) => {
    await adminService.setBusinessPassword(businessId, newPassword);
  };

  const deleteBusiness = async (businessId: string) => {
    await adminService.deleteBusiness(businessId);
    setBusinesses(prev => prev.filter(b => b.id !== businessId));
  };

  const rejectRequest = async (id: string) => {
    await adminService.handleSignupRequest(id, 'reject');
    setSignupRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r));
  };

  const setNightTariffEnabled = async (enabled: boolean) => {
    await adminService.updateSettings({ night_tariff_enabled: String(enabled) });
    setNightTariffState(enabled);
  };

  const updateBusinessProfile = async (profile: Partial<BusinessProfile>) => {
    const updated = await profileService.update({ name: profile.name, phone: profile.phone, photoUrl: profile.photo_url });
    setBusinessProfile(prev => ({ ...prev, name: updated.name ?? prev.name, phone: updated.phone ?? prev.phone, photo_url: updated.photo_url ?? prev.photo_url }));
  };

  const setBusinessFixedPrice = async (id: string, price: number | undefined) => {
    await adminService.setBusinessPrice(id, price ?? null);
    setBusinesses(prev => prev.map(b => b.id === id ? { ...b, fixed_price: price } : b));
  };

  const refreshSignupRequests = async () => setSignupRequests(await adminService.getSignupRequests());
  const refreshBusinesses = async () => setBusinesses(await adminService.getBusinesses());

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, businessId, login, logout, setUserRole, signupRequests, submitSignupRequest, approveRequest, rejectRequest, setBusinessPassword, deleteBusiness, nightTariffEnabled, setNightTariffEnabled, businessProfile, updateBusinessProfile, businesses, setBusinessFixedPrice, refreshSignupRequests, refreshBusinesses, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
