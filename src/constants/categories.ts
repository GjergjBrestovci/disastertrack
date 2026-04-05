import type { CategoryConfig } from '../types/eonet';

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  drought: {
    label: 'Drought',
    color: '#D97706',
    icon: '🏜️',
    glowColor: 'rgba(217,119,6,0.4)',
  },
  dustHaze: {
    label: 'Dust & Haze',
    color: '#92400E',
    icon: '🌫️',
    glowColor: 'rgba(146,64,14,0.4)',
  },
  earthquakes: {
    label: 'Earthquakes',
    color: '#EF4444',
    icon: '⚠️',
    glowColor: 'rgba(239,68,68,0.5)',
  },
  floods: {
    label: 'Floods',
    color: '#3B82F6',
    icon: '🌊',
    glowColor: 'rgba(59,130,246,0.5)',
  },
  landslides: {
    label: 'Landslides',
    color: '#78350F',
    icon: '⛰️',
    glowColor: 'rgba(120,53,15,0.4)',
  },
  manmade: {
    label: 'Manmade',
    color: '#6B7280',
    icon: '🏭',
    glowColor: 'rgba(107,114,128,0.4)',
  },
  seaLakeIce: {
    label: 'Sea & Lake Ice',
    color: '#BAE6FD',
    icon: '🧊',
    glowColor: 'rgba(186,230,253,0.5)',
  },
  severeStorms: {
    label: 'Severe Storms',
    color: '#8B5CF6',
    icon: '🌪️',
    glowColor: 'rgba(139,92,246,0.5)',
  },
  snow: {
    label: 'Snow',
    color: '#E0F2FE',
    icon: '❄️',
    glowColor: 'rgba(224,242,254,0.4)',
  },
  tempExtremes: {
    label: 'Temperature Extremes',
    color: '#F97316',
    icon: '🌡️',
    glowColor: 'rgba(249,115,22,0.5)',
  },
  volcanoes: {
    label: 'Volcanoes',
    color: '#DC2626',
    icon: '🌋',
    glowColor: 'rgba(220,38,38,0.6)',
  },
  wildfires: {
    label: 'Wildfires',
    color: '#FB923C',
    icon: '🔥',
    glowColor: 'rgba(251,146,60,0.6)',
  },
};

export const TIME_RANGES = [
  { label: '7 Days', days: 7 },
  { label: '30 Days', days: 30 },
  { label: '60 Days', days: 60 },
  { label: 'All Time', days: 365 },
] as const;
