import { useState, useEffect, useRef } from 'react';
import type { EntityLocation } from './useLocationTracking';

export interface RouteInfo {
  coordinates: [number, number][];
  distance: number; // km
  duration: number; // minutes
}

interface Routes {
  buyerToSeller: RouteInfo | null;
  sellerToTransport: RouteInfo | null;
  buyerToTransport: RouteInfo | null;
}

async function fetchOsrmRoute(
  from: EntityLocation,
  to: EntityLocation
): Promise<RouteInfo | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes?.length) return null;
    const route = data.routes[0];
    const coordinates: [number, number][] = route.geometry.coordinates.map(
      (c: [number, number]) => [c[1], c[0]] // GeoJSON [lng,lat] → Leaflet [lat,lng]
    );
    return {
      coordinates,
      distance: Math.round((route.distance / 1000) * 10) / 10,
      duration: Math.round(route.duration / 60),
    };
  } catch {
    return null;
  }
}

export function useOsrmRoutes(
  buyer: EntityLocation,
  seller: EntityLocation,
  transport: EntityLocation,
  enabled: boolean
) {
  const [routes, setRoutes] = useState<Routes>({
    buyerToSeller: null,
    sellerToTransport: null,
    buyerToTransport: null,
  });
  const [loading, setLoading] = useState(false);
  const lastFetchRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;
    // Throttle: at most every 10 seconds
    const now = Date.now();
    if (now - lastFetchRef.current < 10000) return;
    lastFetchRef.current = now;

    setLoading(true);
    Promise.all([
      fetchOsrmRoute(buyer, seller),
      fetchOsrmRoute(seller, transport),
      fetchOsrmRoute(buyer, transport),
    ]).then(([bs, st, bt]) => {
      setRoutes({
        buyerToSeller: bs,
        sellerToTransport: st,
        buyerToTransport: bt,
      });
      setLoading(false);
    });
  }, [buyer.lat, buyer.lng, transport.lat, transport.lng, seller.lat, seller.lng, enabled]);

  return { routes, loading };
}
