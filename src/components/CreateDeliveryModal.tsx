import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Phone, User, Target, CheckCircle2, AlertCircle, Plus, Trash2, FileText, Locate, DollarSign } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { deliveryService } from '../services/api';
import { cn } from '../lib/utils';

// ── Google Maps loader (uses API key from env) ──────────────────────────────
declare global {
  interface Window {
    google: any;
    initGoogleMaps?: () => void;
  }
}

const GMAPS_KEY = (import.meta as any).env?.VITE_GOOGLE_MAPS_KEY || '';

// Distance-based delivery price (DA): 1–5 km 250, 5–7 km 300, 7–9 km 350, 9–10 km 400, 10–15 km 500
function getDeliveryPriceByKm(km: number): number {
  if (km <= 5) return 250;
  if (km <= 7) return 300;
  if (km <= 9) return 350;
  if (km <= 10) return 400;
  return 500;
}
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, {
      headers: { 'Accept-Language': 'en' },
    });
    const data = await res.json();
    return data?.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  } catch {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  }
}

function loadGoogleMaps(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) { resolve(); return; }

    const done = () => { window.initGoogleMaps = undefined; resolve(); };
    const fail = (err: string) => { window.initGoogleMaps = undefined; reject(new Error(err)); };

    window.initGoogleMaps = () => done();

    const existing = document.getElementById('gmaps-script') as HTMLScriptElement | null;
    if (existing) {
      if (window.google?.maps) { done(); return; }
      existing.remove();
    }

    const timeoutId = window.setTimeout(() => fail('Google Maps load timeout. Check your API key and enable Maps JavaScript API & Places API.'), 12000);
    const clearTimeoutOnDone = () => { window.clearTimeout(timeoutId); };

    const s = document.createElement('script');
    s.id = 'gmaps-script';
    s.src = `https://maps.googleapis.com/maps/api/js?key=${GMAPS_KEY}&libraries=places&callback=initGoogleMaps`;
    s.async = true;
    s.onerror = () => {
      clearTimeoutOnDone();
      fail('Failed to load Google Maps script. Check API key and console for errors.');
    };
    document.head.appendChild(s);
    window.initGoogleMaps = () => { clearTimeoutOnDone(); done(); };
  });
}

// ── Map selector component ───────────────────────────────────────────────────
interface MapSelectorProps {
  onSelect: (address: string, lat: number, lng: number) => void;
  onClose: () => void;
  initialAddress?: string;
}

const MapSelector: React.FC<MapSelectorProps> = ({ onSelect, onClose, initialAddress }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapObjRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [address, setAddress] = useState(initialAddress || '');
  const [lat, setLat] = useState(36.3520);
  const [lng, setLng] = useState(6.1844);
  const [mapsLoaded, setMapsLoaded] = useState(!!window.google?.maps);
  const [noKey, setNoKey] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (!GMAPS_KEY) { setNoKey(true); return; }
    loadGoogleMaps()
      .then(() => setMapsLoaded(true))
      .catch((err) => setLoadError(err?.message || 'Failed to load map'));
  }, []);

  useEffect(() => {
    if (!mapsLoaded || !mapRef.current || noKey) return;
    const center = { lat, lng };
    const mapEl = mapRef.current;
    const mapStyles = [
      { featureType: 'poi', stylers: [{ visibility: 'off' }] },
      { featureType: 'transit', stylers: [{ visibility: 'off' }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e8f4f8' }] },
      { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#f5f5f4' }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
      { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
      { featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{ color: '#9ca3af' }] },
    ];
    mapObjRef.current = new window.google.maps.Map(mapEl, {
      center, zoom: 14,
      mapTypeControl: false, streetViewControl: false, fullscreenControl: true, zoomControl: true,
      styles: mapStyles,
      disableDefaultUI: false,
    });
    markerRef.current = new window.google.maps.Marker({
      position: center, map: mapObjRef.current, draggable: true,
    });
    markerRef.current.addListener('dragend', (e: any) => {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();
      setLat(newLat); setLng(newLng);
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat: newLat, lng: newLng } }, (results: any, status: string) => {
        if (status === 'OK' && results[0]) setAddress(results[0].formatted_address);
      });
    });
    mapObjRef.current.addListener('click', (e: any) => {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();
      markerRef.current.setPosition({ lat: newLat, lng: newLng });
      setLat(newLat); setLng(newLng);
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat: newLat, lng: newLng } }, (results: any, status: string) => {
        if (status === 'OK' && results[0]) setAddress(results[0].formatted_address);
      });
    });
    if (searchRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(searchRef.current, {
        componentRestrictions: { country: 'dz' },
      });
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) return;
        const newLat = place.geometry.location.lat();
        const newLng = place.geometry.location.lng();
        setLat(newLat); setLng(newLng);
        setAddress(place.formatted_address || place.name || '');
        mapObjRef.current.setCenter({ lat: newLat, lng: newLng });
        markerRef.current.setPosition({ lat: newLat, lng: newLng });
      });
    }
    const resize = () => mapObjRef.current?.resize?.();
    const t1 = setTimeout(resize, 100);
    const t2 = setTimeout(resize, 500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [mapsLoaded, noKey]);

  const handleMyLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const newLat = pos.coords.latitude;
        const newLng = pos.coords.longitude;
        setLat(newLat);
        setLng(newLng);
        if (window.google?.maps) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat: newLat, lng: newLng } }, (results: any, status: string) => {
            if (status === 'OK' && results[0]) setAddress(results[0].formatted_address);
            else reverseGeocode(newLat, newLng).then(setAddress);
          });
        } else {
          reverseGeocode(newLat, newLng).then(setAddress);
        }
        if (mapObjRef.current) {
          mapObjRef.current.setCenter({ lat: newLat, lng: newLng });
          mapObjRef.current.setZoom(16);
          markerRef.current?.setPosition({ lat: newLat, lng: newLng });
        }
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const manualFallbackMyLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const newLat = pos.coords.latitude;
        const newLng = pos.coords.longitude;
        setLat(newLat);
        setLng(newLng);
        const addr = await reverseGeocode(newLat, newLng);
        setAddress(addr);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const manualFallback = (
    <div className="flex flex-col h-full min-h-0 bg-[#fafbfc]">
      <div className="shrink-0 px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200/80 bg-white/95 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <MapPin size={20} className="text-white sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">Select Location</h3>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium">Enter address or use GPS</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 sm:p-3 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all active:scale-95">
            <X size={22} className="sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center gap-4 sm:gap-6 p-4 sm:p-6 md:p-8">
        {loadError && (
          <div className="w-full max-w-sm px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-800 text-sm font-bold text-center">
            {loadError}
          </div>
        )}
        <button onClick={manualFallbackMyLocation} disabled={locating}
          className="w-full max-w-sm flex items-center justify-center gap-3 py-4 sm:py-4.5 rounded-2xl border-2 border-blue-200 bg-gradient-to-b from-blue-50 to-white text-blue-700 font-black hover:from-blue-100 hover:to-blue-50 hover:border-blue-300 transition-all disabled:opacity-60 shadow-md active:scale-[0.98]">
          <Locate size={22} className={locating ? 'animate-pulse' : ''} />
          {locating ? 'Getting location...' : 'Use My Location'}
        </button>
        <div className="w-full max-w-sm flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Type full address..."
          className="w-full max-w-sm bg-white border-2 border-gray-200 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl font-bold text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm" />
        <button onClick={() => address && onSelect(address, lat, lng)} disabled={!address}
          className="w-full max-w-sm py-4 sm:py-4.5 rounded-2xl bg-gradient-to-b from-blue-600 to-blue-700 text-white font-black text-base shadow-xl shadow-blue-500/30 hover:shadow-blue-500/40 hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:shadow-none active:scale-[0.98]">
          Confirm Location
        </button>
      </div>
    </div>
  );

  if (noKey) return manualFallback;
  if (loadError) return manualFallback;

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden bg-[#fafbfc]">
      {/* Header — compact on mobile, spacious on desktop */}
      <div className="shrink-0 px-3 sm:px-5 py-3 sm:py-4 border-b border-gray-200/80 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <Target size={18} className="text-white sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-black text-gray-900 truncate">Select Location</h3>
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium hidden sm:block">Tap map or search to set pickup</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close"
            className="p-2 sm:p-2.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all active:scale-95 shrink-0">
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <input ref={searchRef} defaultValue={initialAddress} placeholder="Search address in Algeria..."
            className="flex-1 min-w-0 bg-white border-2 border-gray-200 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-bold text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 outline-none transition-all shadow-sm" />
          <button onClick={handleMyLocation} disabled={locating}
            className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black text-xs sm:text-sm hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-60 shadow-lg shadow-blue-500/25 active:scale-[0.98] shrink-0">
            <Locate size={18} className={locating ? 'animate-pulse' : ''} />
            <span className="hidden sm:inline">{locating ? 'Locating...' : 'My Location'}</span>
          </button>
        </div>
      </div>

      {/* Map area — responsive height */}
      <div className="relative flex-1 min-h-[220px] sm:min-h-[280px] md:min-h-[340px] p-3 sm:p-4 flex flex-col">
        {!mapsLoaded && (
          <div className="absolute inset-3 sm:inset-4 flex flex-col items-center justify-center gap-4 rounded-2xl bg-gradient-to-b from-gray-50 to-gray-100/80 border-2 border-dashed border-gray-200">
            <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs sm:text-sm font-bold text-gray-500">Loading map...</p>
            <p className="text-[10px] sm:text-xs text-gray-400 font-medium">Google Maps</p>
          </div>
        )}
        <div
          ref={mapRef}
          className="flex-1 w-full rounded-xl sm:rounded-2xl overflow-hidden border border-gray-200/80 shadow-lg shadow-gray-200/50 ring-1 ring-black/5"
          style={{ minHeight: 220 }}
        />
      </div>

      {/* Footer — address chip + actions */}
      <div className="shrink-0 p-3 sm:p-4 bg-white border-t border-gray-200/80 shadow-[0_-2px_10px_rgba(0,0,0,0.03)] space-y-3">
        {address && (
          <div className="flex items-center gap-2.5 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl border border-gray-100">
            <MapPin size={16} className="text-blue-500 shrink-0" />
            <p className="text-xs sm:text-sm font-bold text-gray-700 truncate flex-1 min-w-0">{address}</p>
          </div>
        )}
        <div className="flex gap-2 sm:gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 sm:py-3.5 rounded-xl border-2 border-gray-200 font-black text-gray-600 text-sm sm:text-base hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98]">
            Cancel
          </button>
          <button onClick={() => address && onSelect(address, lat, lng)} disabled={!address}
            className="flex-1 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-black text-sm sm:text-base shadow-xl shadow-blue-500/25 hover:shadow-blue-500/35 hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:shadow-none active:scale-[0.98]">
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Stop row ─────────────────────────────────────────────────────────────────
interface Stop {
  id: string;
  address: string;
  lat?: number;
  lng?: number;
  clientName: string;
  clientPhone: string;
}

// ── Main Modal ────────────────────────────────────────────────────────────────
const CreateDeliveryModal: React.FC = () => {
  const { t } = useLanguage();
  const { nightTariffEnabled, businessProfile } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [mapTarget, setMapTarget] = useState<'pickup' | number | null>(null);
  const [pickupLocating, setPickupLocating] = useState(false);

  const [pickup, setPickup] = useState({ address: '', lat: 0, lng: 0 });
  const [packagePrice, setPackagePrice] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [noDestination, setNoDestination] = useState(false);
  const [notes, setNotes] = useState('');
  const [stops, setStops] = useState<Stop[]>([
    { id: '1', address: '', lat: 0, lng: 0, clientName: '', clientPhone: '' }
  ]);

  useEffect(() => {
    const handleOpen = () => { setIsOpen(true); resetForm(); };
    window.addEventListener('open-create-delivery', handleOpen);
    return () => window.removeEventListener('open-create-delivery', handleOpen);
  }, []);

  const resetForm = () => {
    setPickup({ address: '', lat: 0, lng: 0 });
    setPackagePrice('');
    setClientName(''); setClientPhone(''); setNoDestination(false); setNotes(''); setError('');
    setStops([{ id: '1', address: '', lat: 0, lng: 0, clientName: '', clientPhone: '' }]);
  };

  const addStop = () => setStops(prev => [...prev, { id: Date.now().toString(), address: '', lat: 0, lng: 0, clientName: '', clientPhone: '' }]);
  const removeStop = (id: string) => setStops(prev => prev.filter(s => s.id !== id));
  const updateStop = (id: string, field: keyof Stop, value: string | number) =>
    setStops(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));

  const handleMapSelect = (address: string, lat: number, lng: number) => {
    if (mapTarget === 'pickup') {
      setPickup({ address, lat, lng });
    } else if (typeof mapTarget === 'number') {
      setStops(prev => prev.map((s, i) => i === mapTarget ? { ...s, address, lat, lng } : s));
    }
    setMapTarget(null);
  };

  const handlePickupMyLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    setPickupLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const address = await reverseGeocode(lat, lng);
        setPickup({ address, lat, lng });
        setPickupLocating(false);
      },
      () => setPickupLocating(false),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const deliveryFeePreview = (): number | null => {
    if (noDestination) return null;
    const firstWithCoords = stops.find(s => s.lat && s.lng);
    if (!firstWithCoords?.lat || !firstWithCoords?.lng || !pickup.lat || !pickup.lng) return null;
    const km = haversineKm(pickup.lat, pickup.lng, firstWithCoords.lat, firstWithCoords.lng);
    return getDeliveryPriceByKm(km);
  };

  const handleConfirm = async () => {
    if (!clientName || !clientPhone || !pickup.address) {
      setError('Please fill in client name, phone, and pickup location');
      return;
    }
    if (!noDestination && stops.some(s => !s.address)) {
      setError('Please fill in all dropoff addresses');
      return;
    }
    setError(''); setIsSubmitting(true);
    try {
      await deliveryService.create({
        clientName, clientPhone,
        pickupLocation: pickup.address, pickupLat: pickup.lat || undefined, pickupLng: pickup.lng || undefined,
        noDestination, notes: notes || undefined,
        packagePrice: packagePrice.trim() ? parseInt(packagePrice, 10) : undefined,
        stops: noDestination ? [] : stops.map(s => ({ address: s.address, lat: s.lat || undefined, lng: s.lng || undefined, clientName: s.clientName || clientName, clientPhone: s.clientPhone || clientPhone })),
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false); setIsOpen(false);
        window.dispatchEvent(new CustomEvent('delivery-created'));
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to create delivery');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6">
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            className="bg-white w-full max-w-3xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] relative">

            {/* Map overlay */}
            <AnimatePresence>
              {mapTarget !== null && (
                <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }}
                  className="absolute inset-0 z-50 bg-white flex flex-col">
                  <MapSelector
                    onSelect={handleMapSelect}
                    onClose={() => setMapTarget(null)}
                    initialAddress={mapTarget === 'pickup' ? pickup.address : stops[mapTarget as number]?.address}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900">{t.create.title}</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={28} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
              {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl font-bold text-sm">
                  <AlertCircle size={16} />{error}
                </div>
              )}

              {/* Package value */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <DollarSign size={12} /> {t.create.packagePrice}
                </label>
                <input type="number" min={0} value={packagePrice} onChange={e => setPackagePrice(e.target.value)}
                  placeholder="0"
                  className="w-full bg-gray-50 border-2 border-gray-50 pl-4 pr-4 py-3.5 rounded-xl focus:bg-white focus:border-blue-600 outline-none font-bold"
                />
              </div>

              {/* Client info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.create.clientName}</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={16} />
                    <input type="text" value={clientName} onChange={e => setClientName(e.target.value)}
                      className="w-full bg-gray-50 border-2 border-gray-50 pl-10 pr-4 py-3.5 rounded-xl focus:bg-white focus:border-blue-600 outline-none font-bold"
                      placeholder={t.create.clientNamePlaceholder} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t.create.clientPhone}</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={16} />
                    <input type="tel" value={clientPhone} onChange={e => setClientPhone(e.target.value)} dir="ltr"
                      className="w-full bg-gray-50 border-2 border-gray-50 pl-10 pr-4 py-3.5 rounded-xl focus:bg-white focus:border-blue-600 outline-none font-bold"
                      placeholder={t.create.clientPhonePlaceholder} />
                  </div>
                </div>
              </div>

              {/* Pickup */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-black">P</span>
                    {t.create.pickup}
                  </label>
                  <div className="flex items-center gap-2">
                    <button onClick={handlePickupMyLocation} disabled={pickupLocating}
                      className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:underline disabled:opacity-60">
                      <Locate size={11} className={pickupLocating ? 'animate-pulse' : ''} /> {t.create.myLocation}
                    </button>
                    <span className="text-gray-300">|</span>
                    <button onClick={() => setMapTarget('pickup')} className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:underline">
                      <Target size={11} /> {t.create.selectOnMap}
                    </button>
                  </div>
                </div>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={16} />
                  <input type="text" value={pickup.address} onChange={e => setPickup({ ...pickup, address: e.target.value })}
                    className="w-full bg-gray-50 border-2 border-gray-50 pl-10 pr-4 py-3.5 rounded-xl focus:bg-white focus:border-blue-600 outline-none font-bold"
                    placeholder={t.create.pickupPlaceholder} />
                </div>
              </div>

              {/* No destination toggle */}
              <div className="flex items-center gap-3 bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                <input type="checkbox" id="noDest" checked={noDestination} onChange={e => setNoDestination(e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-yellow-300 text-yellow-600" />
                <label htmlFor="noDest" className="font-black text-yellow-900 cursor-pointer text-sm">{t.create.noDestination}</label>
              </div>

              {/* Multi-stop dropoffs */}
              {!noDestination && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      Dropoff Points ({stops.length})
                    </label>
                    <button onClick={addStop} className="text-xs font-black text-blue-600 flex items-center gap-1 hover:underline">
                      <Plus size={12} /> Add Stop
                    </button>
                  </div>

                  {stops.map((stop, idx) => (
                    <motion.div key={stop.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 rounded-2xl p-4 space-y-3 border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-black">{idx + 1}</span>
                          <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Stop {idx + 1}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setMapTarget(idx)} className="text-[10px] font-black text-blue-600 flex items-center gap-1 hover:underline">
                            <Target size={11} /> Map
                          </button>
                          {stops.length > 1 && (
                            <button onClick={() => removeStop(stop.id)} className="text-red-400 hover:text-red-600 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400" size={14} />
                        <input type="text" value={stop.address} onChange={e => updateStop(stop.id, 'address', e.target.value)}
                          className="w-full bg-white border-2 border-white pl-9 pr-3 py-3 rounded-xl focus:border-blue-600 outline-none font-bold text-sm"
                          placeholder={t.create.dropoffPlaceholder} />
                      </div>
                      {stops.length > 1 && (
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" value={stop.clientName} onChange={e => updateStop(stop.id, 'clientName', e.target.value)}
                            placeholder="Client name (optional)"
                            className="bg-white border-2 border-white px-3 py-2.5 rounded-xl focus:border-blue-600 outline-none font-bold text-xs" />
                          <input type="tel" value={stop.clientPhone} onChange={e => updateStop(stop.id, 'clientPhone', e.target.value)}
                            placeholder="Phone (optional)" dir="ltr"
                            className="bg-white border-2 border-white px-3 py-2.5 rounded-xl focus:border-blue-600 outline-none font-bold text-xs" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                  <FileText size={12} /> Notes (optional)
                </label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                  placeholder="Special instructions, fragile items, access codes..."
                  className="w-full bg-gray-50 border-2 border-gray-50 px-4 py-3 rounded-xl focus:bg-white focus:border-blue-600 outline-none font-bold text-sm resize-none" />
              </div>

              {/* Price summary */}
              <div className="bg-gray-50 p-5 rounded-2xl space-y-3">
                {packagePrice.trim() && (
                  <div className="flex justify-between text-sm font-bold text-gray-600">
                    <span>{t.create.packagePrice}</span>
                    <span>{parseInt(packagePrice, 10) || 0} DA</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-gray-600">
                  <span>{t.create.deliveryFee}</span>
                  <span className={deliveryFeePreview() == null ? 'text-amber-600' : 'text-blue-600'}>
                    {deliveryFeePreview() != null ? `${deliveryFeePreview()} DA` : t.create.deliveryFeeUnknown}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-gray-400">1–5 km: 250 DA · 5–7 km: 300 DA · 7–9 km: 350 DA · 9–10 km: 400 DA · 10–15 km: 500 DA. No drop-off = unknown.</p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100">
              <button onClick={handleConfirm} disabled={isSuccess || isSubmitting}
                className={cn("w-full py-4 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3",
                  isSuccess ? "bg-green-500 text-white shadow-green-500/30" : "bg-blue-600 text-white shadow-blue-500/30 hover:bg-blue-700 disabled:opacity-60")}>
                {isSuccess ? <><CheckCircle2 size={22} /> Order Placed!</> : isSubmitting ? 'Submitting...' : t.create.confirm}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateDeliveryModal;
