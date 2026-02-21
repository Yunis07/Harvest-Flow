import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/lib/utils';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  route?: [number, number][];
  className?: string;
  onMarkerClick?: (marker: MapMarker) => void;
  showCurrentLocation?: boolean;
}

export interface MapMarker {
  id: string;
  position: [number, number];
  type: 'seller' | 'buyer' | 'transporter' | 'pickup' | 'delivery';
  title: string;
  description?: string;
  data?: unknown;
}

const MARKER_COLORS: Record<MapMarker['type'], string> = {
  seller: '#10b981', // emerald
  buyer: '#3b82f6', // blue
  transporter: '#f59e0b', // amber
  pickup: '#8b5cf6', // purple
  delivery: '#ef4444', // red
};

export function MapComponent({
  center = [28.6139, 77.2090], // Default: Delhi
  zoom = 11,
  markers = [],
  route,
  className,
  onMarkerClick,
  showCurrentLocation = false,
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: true,
      attributionControl: false,
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Add attribution in bottom right
    L.control.attribution({
      position: 'bottomright',
      prefix: '© OpenStreetMap contributors'
    }).addTo(map);

    // Create layers
    markersLayerRef.current = L.layerGroup().addTo(map);
    
    mapInstanceRef.current = map;

    // Get current location
    if (showCurrentLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          map.setView([latitude, longitude], zoom);
          
          // Add current location marker
          const currentLocationIcon = L.divIcon({
            html: `
              <div class="relative">
                <div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
                <div class="absolute inset-0 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75"></div>
              </div>
            `,
            className: 'current-location-marker',
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          });
          
          L.marker([latitude, longitude], { icon: currentLocationIcon })
            .addTo(map)
            .bindPopup('You are here');
        },
        (err) => {
          console.warn('Geolocation error:', err.message);
        }
      );
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    markers.forEach((marker) => {
      const color = MARKER_COLORS[marker.type];
      
      const customIcon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-8 h-8 rounded-full shadow-lg flex items-center justify-center" style="background-color: ${color}">
              <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                ${getMarkerSvg(marker.type)}
              </svg>
            </div>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent" style="border-top-color: ${color}"></div>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -40],
      });

      const leafletMarker = L.marker(marker.position, { icon: customIcon })
        .addTo(markersLayerRef.current!);

      if (marker.title || marker.description) {
        leafletMarker.bindPopup(`
          <div class="p-2">
            <h3 class="font-semibold text-sm">${marker.title}</h3>
            ${marker.description ? `<p class="text-xs text-gray-600 mt-1">${marker.description}</p>` : ''}
          </div>
        `);
      }

      if (onMarkerClick) {
        leafletMarker.on('click', () => onMarkerClick(marker));
      }
    });
  }, [markers, onMarkerClick]);

  // Update route
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove existing route
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }

    // Add new route
    if (route && route.length > 1) {
      routeLayerRef.current = L.polyline(route, {
        color: '#10b981',
        weight: 4,
        opacity: 0.8,
        dashArray: '10, 10',
      }).addTo(mapInstanceRef.current);

      // Fit bounds to show entire route
      mapInstanceRef.current.fitBounds(routeLayerRef.current.getBounds(), {
        padding: [50, 50],
      });
    }
  }, [route]);

  return (
    <div 
      ref={mapRef} 
      className={cn("w-full h-full min-h-[300px] rounded-xl", className)}
    />
  );
}

function getMarkerSvg(type: MapMarker['type']): string {
  switch (type) {
    case 'seller':
      return '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>';
    case 'buyer':
      return '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>';
    case 'transporter':
      return '<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>';
    case 'pickup':
      return '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="7.5 4.21 12 6.81 16.5 4.21"/><polyline points="7.5 19.79 7.5 14.6 3 12"/><polyline points="21 12 16.5 14.6 16.5 19.79"/>';
    case 'delivery':
      return '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>';
    default:
      return '<circle cx="12" cy="12" r="10"/>';
  }
}
