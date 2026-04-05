import type { EONETEvent } from '../types/eonet';
import type {
  NormalizedDisaster,
  DisasterCategory,
  USGSFeature,
  FIRMSCluster,
  ReliefWebDisaster,
} from '../types/disaster';
import { getEventCoords, getCategoryColor } from './utils';

// ── EONET category ID → DisasterCategory mapping ───────────────────

const EONET_CATEGORY_MAP: Record<string, DisasterCategory> = {
  wildfires: 'wildfire',
  earthquakes: 'earthquake',
  severeStorms: 'storm',
  floods: 'flood',
  volcanoes: 'volcano',
  drought: 'drought',
  landslides: 'landslide',
  seaLakeIce: 'ice',
  dustHaze: 'dust',
  snow: 'snow',
  tempExtremes: 'temperature',
  manmade: 'manmade',
};

export function normalizeEONET(event: EONETEvent): NormalizedDisaster | null {
  const coords = getEventCoords(event);
  if (!coords) return null;

  const geo = event.geometry[0];
  const catId = event.categories[0]?.id ?? '';
  const category: DisasterCategory = EONET_CATEGORY_MAP[catId] ?? 'other';

  return {
    id: `eonet_${event.id}`,
    source: 'eonet',
    category,
    title: event.title,
    lat: coords.lat,
    lng: coords.lng,
    date: geo?.date ?? '',
    color: getCategoryColor(event),
    pinRadius: catId === 'earthquakes' ? 0.5 : 0.35,
    description: event.description ?? undefined,
    externalUrl: event.link,
    raw: event,
  };
}

// ── USGS ────────────────────────────────────────────────────────────

function getEarthquakeColor(mag: number): string {
  if (mag >= 7.0) return '#FF0000';
  if (mag >= 6.0) return '#FF4500';
  if (mag >= 5.0) return '#FF8C00';
  if (mag >= 4.0) return '#FFA500';
  return '#FFD700';
}

export function normalizeUSGS(feature: USGSFeature): NormalizedDisaster {
  const { properties: p, geometry: g } = feature;
  const mag = p.mag ?? 0;

  return {
    id: `usgs_${feature.id}`,
    source: 'usgs',
    category: 'earthquake',
    title: p.title,
    lat: g.coordinates[1],
    lng: g.coordinates[0],
    date: new Date(p.time).toISOString(),
    color: getEarthquakeColor(mag),
    pinRadius: 0.1 + (mag - 2.5) * 0.12,
    intensity: mag,
    externalUrl: p.url,
    raw: feature,
    meta: {
      magnitude: mag,
      depth: g.coordinates[2],
      alert: p.alert,
      tsunami: p.tsunami === 1,
    },
  };
}

// ── FIRMS ───────────────────────────────────────────────────────────

function getFireColor(frp: number): string {
  if (frp > 500) return '#FF0000';
  if (frp > 200) return '#FF4500';
  if (frp > 100) return '#FF6B00';
  if (frp > 50) return '#FF8C00';
  return '#FFA500';
}

export function normalizeFIRMS(cluster: FIRMSCluster): NormalizedDisaster {
  return {
    id: `firms_${cluster.lat.toFixed(2)}_${cluster.lng.toFixed(2)}`,
    source: 'firms',
    category: 'wildfire',
    title: `Wildfire cluster (${cluster.count} detection${cluster.count > 1 ? 's' : ''})`,
    lat: cluster.lat,
    lng: cluster.lng,
    date: cluster.date ? `${cluster.date}T00:00:00Z` : new Date().toISOString(),
    color: getFireColor(cluster.frp),
    pinRadius: Math.min(0.15 + cluster.count * 0.02, 0.6),
    intensity: cluster.frp,
    raw: cluster,
    meta: {
      frp: cluster.frp,
      fireCount: cluster.count,
    },
  };
}

// ── ReliefWeb ───────────────────────────────────────────────────────

const RELIEFWEB_TYPE_MAP: Record<string, DisasterCategory> = {
  Earthquake: 'earthquake',
  Flood: 'flood',
  'Tropical Cyclone': 'storm',
  Storm: 'storm',
  Volcano: 'volcano',
  Drought: 'drought',
  Wildfire: 'wildfire',
  Landslide: 'landslide',
  'Cold Wave': 'temperature',
  'Heat Wave': 'temperature',
  Epidemic: 'humanitarian',
  'Insect Infestation': 'humanitarian',
  'Complex Emergency': 'humanitarian',
};

export function normalizeReliefWeb(
  disaster: ReliefWebDisaster,
): NormalizedDisaster | null {
  const f = disaster.fields;
  const country = f.country?.[0];
  if (!country?.location) return null;

  const typeName = f.type?.[0]?.name ?? '';
  const category: DisasterCategory = RELIEFWEB_TYPE_MAP[typeName] ?? 'humanitarian';

  return {
    id: `reliefweb_${disaster.id}`,
    source: 'reliefweb',
    category,
    title: f.name,
    lat: country.location.lat,
    lng: country.location.lon,
    date: f.date?.created ?? '',
    color: '#8B5CF6',
    pinRadius: 0.45,
    description: f.description,
    externalUrl: f.url,
    raw: disaster,
    meta: {
      country: country.name,
      disasterType: typeName,
    },
  };
}
