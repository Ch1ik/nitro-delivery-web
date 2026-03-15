import React, { useEffect, useRef, useState } from 'react';
import { Delivery } from '../services/api';

interface GoogleMapProps {
  deliveries?: Delivery[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  showDeliveryRoutes?: boolean;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  deliveries = [], 
  center = { lat: 36.7538, lng: 3.0588 }, // Algiers default
  zoom = 11,
  height = '400px',
  showDeliveryRoutes = true
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        setIsLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.async = true;
      script.defer = true;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap&libraries=geometry`;
      
      window.initMap = () => {
        setIsLoaded(true);
      };

      script.onerror = () => {
        setError('Failed to load Google Maps. Please check your API key.');
      };

      document.head.appendChild(script);
    };

    loadGoogleMaps();

    return () => {
      const script = document.querySelector('script[src*="maps.googleapis.com"]');
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    mapInstanceRef.current = map;

    return () => {
      // Clear markers when component unmounts
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [isLoaded, center, zoom]);

  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const bounds = new window.google.maps.LatLngBounds();

    deliveries.forEach(delivery => {
      // Add pickup marker
      if (delivery.pickup_lat && delivery.pickup_lng) {
        const pickupPosition = { lat: delivery.pickup_lat, lng: delivery.pickup_lng };
        
        const pickupMarker = new window.google.maps.Marker({
          position: pickupPosition,
          map: mapInstanceRef.current,
          title: `Pickup: ${delivery.pickup_location}`,
          label: {
            text: 'P',
            color: 'white',
            fontWeight: 'bold'
          },
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#2563eb',
            fillOpacity: 1,
            strokeColor: 'white',
            strokeWeight: 2
          }
        });

        const pickupInfoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 200px;">
              <h4 style="margin: 0 0 8px 0; color: #1f2937; font-weight: bold;">${delivery.id}</h4>
              <p style="margin: 0 0 4px 0; color: #6b7280;"><strong>Pickup:</strong> ${delivery.pickup_location}</p>
              <p style="margin: 0 0 4px 0; color: #6b7280;"><strong>Client:</strong> ${delivery.client_name}</p>
              <p style="margin: 0 0 4px 0; color: #6b7280;"><strong>Phone:</strong> ${delivery.client_phone}</p>
              <p style="margin: 0; color: #059669;"><strong>Status:</strong> ${delivery.status}</p>
            </div>
          `
        });

        pickupMarker.addListener('click', () => {
          pickupInfoWindow.open(mapInstanceRef.current, pickupMarker);
        });

        markersRef.current.push(pickupMarker);
        bounds.extend(pickupPosition);
      }

      // Add stop markers
      delivery.stops?.forEach((stop, index) => {
        if (stop.lat && stop.lng) {
          const stopPosition = { lat: stop.lat, lng: stop.lng };
          
          const stopMarker = new window.google.maps.Marker({
            position: stopPosition,
            map: mapInstanceRef.current,
            title: `Stop ${index + 1}: ${stop.address}`,
            label: {
              text: `${index + 1}`,
              color: 'white',
              fontWeight: 'bold'
            },
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 6,
              fillColor: stop.status === 'delivered' ? '#10b981' : 
                         stop.status === 'failed' ? '#ef4444' : '#6b7280',
              fillOpacity: 1,
              strokeColor: 'white',
              strokeWeight: 2
            }
          });

          const stopInfoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; max-width: 200px;">
                <h4 style="margin: 0 0 8px 0; color: #1f2937; font-weight: bold;">Stop ${index + 1}</h4>
                <p style="margin: 0 0 4px 0; color: #6b7280;"><strong>Address:</strong> ${stop.address}</p>
                ${stop.client_name ? `<p style="margin: 0 0 4px 0; color: #6b7280;"><strong>Client:</strong> ${stop.client_name}</p>` : ''}
                ${stop.client_phone ? `<p style="margin: 0 0 4px 0; color: #6b7280;"><strong>Phone:</strong> ${stop.client_phone}</p>` : ''}
                <p style="margin: 0; color: ${stop.status === 'delivered' ? '#059669' : stop.status === 'failed' ? '#dc2626' : '#6b7280'};"><strong>Status:</strong> ${stop.status}</p>
              </div>
            `
          });

          stopMarker.addListener('click', () => {
            stopInfoWindow.open(mapInstanceRef.current, stopMarker);
          });

          markersRef.current.push(stopMarker);
          bounds.extend(stopPosition);
        }
      });

      // Draw route if enabled and we have coordinates
      if (showDeliveryRoutes && delivery.pickup_lat && delivery.pickup_lng) {
        const path = [{ lat: delivery.pickup_lat, lng: delivery.pickup_lng }];
        
        delivery.stops?.forEach(stop => {
          if (stop.lat && stop.lng) {
            path.push({ lat: stop.lat, lng: stop.lng });
          }
        });

        if (path.length > 1) {
          const polyline = new window.google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: delivery.status === 'delivered' ? '#10b981' : 
                        delivery.status === 'in_progress' ? '#8b5cf6' : 
                        delivery.status === 'confirmed' ? '#2563eb' : '#6b7280',
            strokeOpacity: 0.8,
            strokeWeight: 3
          });

          polyline.setMap(mapInstanceRef.current);
          markersRef.current.push(polyline);
        }
      }
    });

    // Fit map to show all markers if there are any
    if (deliveries.length > 0 && !bounds.isEmpty()) {
      mapInstanceRef.current.fitBounds(bounds);
    }
  }, [deliveries, isLoaded, showDeliveryRoutes]);

  if (error) {
    return (
      <div 
        className="w-full rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center p-6">
          <div className="text-red-500 text-4xl mb-2">⚠️</div>
          <p className="text-gray-600 font-medium">{error}</p>
          <p className="text-sm text-gray-400 mt-2">Please add a Google Maps API key to your environment variables.</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div 
        className="w-full rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-center"
        style={{ height }}
      >
        <div className="text-center p-6">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-gray-600 font-medium">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef}
      className="w-full rounded-2xl border border-gray-200 overflow-hidden"
      style={{ height }}
    />
  );
};

export default GoogleMap;
