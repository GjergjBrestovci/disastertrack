export interface EONETGeometry {
  magnitudeValue: number | null;
  magnitudeUnit: string | null;
  date: string;
  type: 'Point' | 'Polygon';
  coordinates: number[];
}

export interface EONETCategory {
  id: string;
  title: string;
}

export interface EONETSource {
  id: string;
  url: string;
}

export interface EONETEvent {
  id: string;
  title: string;
  description: string | null;
  link: string;
  closed: string | null;
  categories: EONETCategory[];
  sources: EONETSource[];
  geometry: EONETGeometry[];
}

export interface EONETResponse {
  title: string;
  description: string;
  link: string;
  events: EONETEvent[];
}

export interface EONETCategoryMeta {
  id: string;
  title: string;
  description: string;
  link: string;
  layers: string;
}

export interface EONETCategoriesResponse {
  title: string;
  description: string;
  link: string;
  categories: EONETCategoryMeta[];
}

export interface CategoryConfig {
  label: string;
  color: string;
  icon: string;
  glowColor: string;
}
