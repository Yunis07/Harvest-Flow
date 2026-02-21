/**
 * Geospatial utilities for Harvest-Log
 * Haversine distance calculation and radius-based filtering
 */

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Calculate distance between two points using Haversine formula
 * @returns Distance in kilometers
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS_KM * c * 10) / 10;
}

/**
 * Filter entities within a given radius from a reference point
 */
export function filterByRadius<T extends { lat: number; lng: number }>(
  items: T[],
  refLat: number,
  refLng: number,
  radiusKm: number
): (T & { distance: number })[] {
  return items
    .map((item) => ({
      ...item,
      distance: haversineDistance(refLat, refLng, item.lat, item.lng),
    }))
    .filter((item) => item.distance <= radiusKm)
    .sort((a, b) => a.distance - b.distance);
}

/** Default nearby radius in km */
export const DEFAULT_RADIUS_KM = 50;
