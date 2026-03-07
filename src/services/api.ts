import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nitro_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  r => r,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nitro_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface DeliveryStop {
  id: string;
  delivery_id: string;
  position: number;
  address: string;
  lat?: number;
  lng?: number;
  client_name?: string;
  client_phone?: string;
  status: 'pending' | 'delivered' | 'failed';
}

export interface Delivery {
  id: string;
  business_id: string;
  client_name: string;
  client_phone: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'delivered' | 'denied';
  price: number; // delivery fee in DA, or -1 for unknown
  package_price?: number | null;
  pickup_location: string;
  pickup_lat?: number;
  pickup_lng?: number;
  no_destination: number;
  notes?: string;
  created_at: number;
  updated_at: number;
  business_name?: string;
  business_phone?: string;
  business_email?: string;
  business_photo?: string;
  stops: DeliveryStop[];
}

export interface DeliveryStats {
  total: number;
  delivered: number;
  pending: number;
  in_progress?: number;
  denied?: number;
  refusalRate?: number;
  totalCost?: number;
  revenue?: number;
  businesses?: number;
}

export interface SignupRequest {
  id: string;
  business_name: string;
  email: string;
  phone: string;
  address?: string;
  description?: string;
  website?: string;
  password?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: number;
}

export const authService = {
  login: async (email: string, password: string) => api.post('/auth/login', { email, password }).then(r => r.data),
  me: async () => api.get('/auth/me').then(r => r.data),
  signup: async (data: { businessName: string; email: string; phone: string; password: string; address?: string; description?: string; website?: string }) =>
    api.post('/auth/signup', data).then(r => r.data),
};

export const deliveryService = {
  getAll: async () => api.get<Delivery[]>('/deliveries').then(r => r.data),
  getOne: async (id: string) => api.get<Delivery>(`/deliveries/${id}`).then(r => r.data),
  getStats: async () => api.get<DeliveryStats>('/deliveries/stats').then(r => r.data),
  create: async (data: {
    clientName: string; clientPhone: string;
    pickupLocation: string; pickupLat?: number; pickupLng?: number;
    noDestination?: boolean; notes?: string; packagePrice?: number | null;
    stops: { address: string; lat?: number; lng?: number; clientName?: string; clientPhone?: string }[];
  }) => api.post<Delivery>('/deliveries', data).then(r => r.data),
  updateStatus: async (id: string, status: string) => api.patch<Delivery>(`/deliveries/${id}/status`, { status }).then(r => r.data),
  updateStopStatus: async (deliveryId: string, stopId: string, status: string) =>
    api.patch(`/deliveries/${deliveryId}/stops/${stopId}`, { status }).then(r => r.data),
};

export const adminService = {
  getBusinesses: async () => api.get('/admin/businesses').then(r => r.data),
  setBusinessPrice: async (id: string, fixedPrice: number | null) => api.patch(`/admin/businesses/${id}/price`, { fixedPrice }).then(r => r.data),
  getSignupRequests: async () => api.get<SignupRequest[]>('/admin/signup-requests').then(r => r.data),
  getSignupRequest: async (id: string) => api.get<SignupRequest>(`/admin/signup-requests/${id}`).then(r => r.data),
  handleSignupRequest: async (id: string, action: 'approve' | 'reject', password?: string) =>
    api.patch(`/admin/signup-requests/${id}`, { action, ...(password !== undefined ? { password } : {}) }).then(r => r.data),
  setBusinessPassword: async (id: string, newPassword: string) => api.patch(`/admin/businesses/${id}/password`, { newPassword }).then(r => r.data),
  deleteBusiness: async (id: string) => api.delete(`/admin/businesses/${id}`).then(r => r.data),
  getSettings: async () => api.get('/admin/settings').then(r => r.data),
  updateSettings: async (settings: Record<string, string>) => api.patch('/admin/settings', settings).then(r => r.data),
};

export const profileService = {
  get: async () => api.get('/profile').then(r => r.data),
  update: async (data: { name?: string; phone?: string; photoUrl?: string }) => api.patch('/profile', data).then(r => r.data),
  changePassword: async (currentPassword: string, newPassword: string) => api.patch('/profile/password', { currentPassword, newPassword }).then(r => r.data),
};

export default api;
