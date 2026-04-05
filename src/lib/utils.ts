import { formatDistanceToNow, format } from 'date-fns';
import type { EONETEvent } from '../types/eonet';
import { CATEGORY_CONFIG } from '../constants/categories';

/**
 * EONET returns GeoJSON coordinates as [longitude, latitude].
 * This extracts lat/lng correctly from the most recent geometry entry.
 */
export function getEventCoords(event: EONETEvent): { lat: number; lng: number } | null {
  const geo = event.geometry[0];
  if (!geo || geo.type !== 'Point' || geo.coordinates.length < 2) return null;
  return {
    lat: geo.coordinates[1],
    lng: geo.coordinates[0],
  };
}

/**
 * Format latitude as a human-readable string (e.g. "37.5°N")
 */
export function formatLat(lat: number): string {
  const dir = lat >= 0 ? 'N' : 'S';
  return `${Math.abs(lat).toFixed(2)}°${dir}`;
}

/**
 * Format longitude as a human-readable string (e.g. "122.1°W")
 */
export function formatLng(lng: number): string {
  const dir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lng).toFixed(2)}°${dir}`;
}

/**
 * Format an ISO date string as a relative time (e.g. "2 hours ago")
 */
export function formatRelativeDate(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
}

/**
 * Format an ISO date string as a full date (e.g. "March 14, 2025")
 */
export function formatFullDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), 'MMMM d, yyyy');
  } catch {
    return dateStr;
  }
}

/**
 * Get category color for an event, with fallback
 */
export function getCategoryColor(event: EONETEvent): string {
  const catId = event.categories[0]?.id;
  return CATEGORY_CONFIG[catId]?.color ?? '#ffffff';
}

/**
 * Get category config for an event, with fallback
 */
export function getCategoryConfig(event: EONETEvent) {
  const catId = event.categories[0]?.id;
  return CATEGORY_CONFIG[catId] ?? {
    label: 'Unknown',
    color: '#ffffff',
    icon: '📍',
    glowColor: 'rgba(255,255,255,0.3)',
  };
}

/**
 * Filter events to only those with plottable Point geometries
 */
export function filterPlottableEvents(events: EONETEvent[]): EONETEvent[] {
  return events.filter(
    (e) => e.geometry.length > 0 && e.geometry[0].type === 'Point'
  );
}

/**
 * Count events by category
 */
export function countByCategory(events: EONETEvent[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const event of events) {
    const catId = event.categories[0]?.id;
    if (catId) {
      counts[catId] = (counts[catId] ?? 0) + 1;
    }
  }
  return counts;
}
