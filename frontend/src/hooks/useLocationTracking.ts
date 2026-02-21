import { useEffect, useRef, useState, useCallback } from 'react';

export interface EntityLocation {
  id: string;
  role: 'buyer' | 'seller' | 'transport';
  name: string;
  lat: number;
  lng: number;
  timestamp: number;
}

// Offsets for demo entities — placed near the buyer, not hardcoded cities
const SELLER_OFFSET = { lat: 0.015, lng: 0.025 };
const TRANSPORT_OFFSET = { lat: -0.020, lng: -0.015 };

function makeDemoSeller(buyerLat: number, buyerLng: number): EntityLocation {
  return {
    id: 'seller-demo-001',
    role: 'seller',
    name: 'Priya Sharma',
    lat: buyerLat + SELLER_OFFSET.lat,
    lng: buyerLng + SELLER_OFFSET.lng,
    timestamp: Date.now(),
  };
}

function makeDemoTransport(buyerLat: number, buyerLng: number): EntityLocation {
  return {
    id: 'transporter-demo-001',
    role: 'transport',
    name: 'Amit Singh',
    lat: buyerLat + TRANSPORT_OFFSET.lat,
    lng: buyerLng + TRANSPORT_OFFSET.lng,
    timestamp: Date.now(),
  };
}

export function useLocationTracking() {
  const [buyerLocation, setBuyerLocation] = useState<EntityLocation | null>(null);
  const [sellerLocation, setSellerLocation] = useState<EntityLocation | null>(null);
  const [transportLocation, setTransportLocation] = useState<EntityLocation | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [buyerLocationReady, setBuyerLocationReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const transportIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const initializedRef = useRef(false);

  // Auto-fetch buyer location on mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      // Fallback to a default so the app isn't completely broken
      const fallbackLat = 28.6139;
      const fallbackLng = 77.2090;
      setBuyerLocation({
        id: 'buyer-demo-001',
        role: 'buyer',
        name: 'Rajesh Kumar',
        lat: fallbackLat,
        lng: fallbackLng,
        timestamp: Date.now(),
      });
      setSellerLocation(makeDemoSeller(fallbackLat, fallbackLng));
      setTransportLocation(makeDemoTransport(fallbackLat, fallbackLng));
      setBuyerLocationReady(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setBuyerLocation({
          id: 'buyer-demo-001',
          role: 'buyer',
          name: 'Rajesh Kumar',
          lat: latitude,
          lng: longitude,
          timestamp: Date.now(),
        });
        // Only now place demo entities near the real buyer
        setSellerLocation(makeDemoSeller(latitude, longitude));
        setTransportLocation(makeDemoTransport(latitude, longitude));
        setBuyerLocationReady(true);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setError(err.message);
        // Fallback
        const fallbackLat = 28.6139;
        const fallbackLng = 77.2090;
        setBuyerLocation({
          id: 'buyer-demo-001',
          role: 'buyer',
          name: 'Rajesh Kumar',
          lat: fallbackLat,
          lng: fallbackLng,
          timestamp: Date.now(),
        });
        setSellerLocation(makeDemoSeller(fallbackLat, fallbackLng));
        setTransportLocation(makeDemoTransport(fallbackLat, fallbackLng));
        setBuyerLocationReady(true);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
    );
  }, []);

  // Start continuous GPS watch + transport animation
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    setIsTracking(true);
    setError(null);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setBuyerLocation((prev) => ({
          ...(prev || { id: 'buyer-demo-001', role: 'buyer' as const, name: 'Rajesh Kumar' }),
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          timestamp: Date.now(),
        }));
      },
      (err) => {
        console.warn('Geolocation watch error:', err.message);
        setError(err.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 5000 }
    );

    // Animate transport movement toward seller (demo)
    transportIntervalRef.current = setInterval(() => {
      setTransportLocation((prev) => {
        if (!prev) return prev;
        setSellerLocation((seller) => {
          if (!seller || !prev) return seller;
          const targetLat = seller.lat;
          const targetLng = seller.lng;
          const step = 0.002;
          const dLat = targetLat - prev.lat;
          const dLng = targetLng - prev.lng;
          const dist = Math.sqrt(dLat * dLat + dLng * dLng);
          if (dist < 0.005) return seller; // close enough — don't update
          return seller;
        });
        // Move transport toward seller
        return setTransportTowardSeller(prev);
      });
    }, 3000);
  }, []);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (transportIntervalRef.current) {
      clearInterval(transportIntervalRef.current);
      transportIntervalRef.current = null;
    }
    setIsTracking(false);
  }, []);

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  // Helper: move transport toward current seller location
  function setTransportTowardSeller(transport: EntityLocation): EntityLocation {
    // We need seller location — read it from ref-like state via closure
    // This is called inside setTransportLocation so we read sellerLocation from outer scope
    if (!sellerLocation) return transport;
    const targetLat = sellerLocation.lat;
    const targetLng = sellerLocation.lng;
    const step = 0.002;
    const dLat = targetLat - transport.lat;
    const dLng = targetLng - transport.lng;
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    if (dist < 0.005) return transport; // close enough
    const ratio = step / dist;
    return {
      ...transport,
      lat: transport.lat + dLat * ratio,
      lng: transport.lng + dLng * ratio,
      timestamp: Date.now(),
    };
  }

  return {
    buyerLocation,
    sellerLocation,
    transportLocation,
    isTracking,
    buyerLocationReady,
    error,
    startTracking,
    stopTracking,
  };
}
