import type { EONETEvent } from './eonet';

// ── Source & Category unions ────────────────────────────────────────

export type DisasterSource = 'eonet' | 'usgs' | 'firms' | 'reliefweb';

export type DisasterCategory =
  | 'wildfire'
  | 'earthquake'
  | 'storm'
  | 'flood'
  | 'volcano'
  | 'drought'
  | 'landslide'
  | 'ice'
  | 'dust'
  | 'snow'
  | 'temperature'
  | 'humanitarian'
  | 'manmade'
  | 'other';

// ── Normalized model ────────────────────────────────────────────────

export interface NormalizedDisaster {
  id: string;
  source: DisasterSource;
  category: DisasterCategory;
  title: string;
  lat: number;
  lng: number;
  date: string; // ISO 8601
  color: string;
  pinRadius: number;
  intensity?: number;
  description?: string;
  externalUrl?: string;
  raw: EONETEvent | USGSFeature | FIRMSCluster | ReliefWebDisaster;
  meta?: {
    magnitude?: number;
    depth?: number;
    alert?: string | null;
    tsunami?: boolean;
    frp?: number;
    fireCount?: number;
    country?: string;
    disasterType?: string;
  };
}

// ── USGS Earthquake types ───────────────────────────────────────────

export interface USGSFeatureProperties {
  mag: number;
  place: string;
  time: number;
  updated: number;
  url: string;
  detail: string;
  status: string;
  type: string;
  title: string;
  alert: string | null;
  tsunami: 0 | 1;
}

export interface USGSFeature {
  type: 'Feature';
  properties: USGSFeatureProperties;
  id: string;
  geometry: {
    type: 'Point';
    coordinates: [number, number, number]; // [lng, lat, depth_km]
  };
}

export interface USGSResponse {
  type: 'FeatureCollection';
  features: USGSFeature[];
  metadata: {
    count: number;
    title: string;
    url: string;
  };
}

// ── NASA FIRMS types ────────────────────────────────────────────────

export interface FIRMSPoint {
  lat: number;
  lng: number;
  frp: number;
  confidence: string;
  date: string;
  satellite: string;
}

export interface FIRMSCluster extends FIRMSPoint {
  count: number;
}

// ── ReliefWeb types ─────────────────────────────────────────────────

export interface ReliefWebDisasterField {
  name: string;
  description?: string;
  date: { created: string };
  type: Array<{ id: number; name: string }>;
  country: Array<{
    id: number;
    name: string;
    location: { lat: number; lon: number };
    iso3: string;
  }>;
  status: string;
  url: string;
}

export interface ReliefWebDisaster {
  id: number;
  fields: ReliefWebDisasterField;
}

export interface ReliefWebResponse {
  data: ReliefWebDisaster[];
  count: number;
  total: number;
}

// ── Source config ────────────────────────────────────────────────────

export interface SourceConfig {
  key: DisasterSource;
  label: string;
  color: string;
  icon: string;
}

export const SOURCE_CONFIGS: SourceConfig[] = [
  { key: 'eonet', label: 'NASA EONET', color: '#2EC4C4', icon: '\u{1F6F0}\uFE0F' },
  { key: 'usgs', label: 'USGS', color: '#EF4444', icon: '\u{1F4E1}' },
  { key: 'firms', label: 'NASA FIRMS', color: '#FF6B00', icon: '\u{1F525}' },
  { key: 'reliefweb', label: 'ReliefWeb', color: '#8B5CF6', icon: '\u{1F198}' },
];
