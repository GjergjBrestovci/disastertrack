import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { GDACSResponse, NormalizedDisaster } from '../types/disaster';
import { normalizeGDACS } from '../lib/normalizers';

async function fetchGDACSDisasters(days: number): Promise<NormalizedDisaster[]> {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);

  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const { data } = await axios.get<GDACSResponse>(
    '/api/gdacs/api/events/geteventlist/SEARCH',
    {
      params: {
        eventlist: 'EQ,TC,FL,VO,DR,WF',
        alertlevel: 'Green;Orange;Red',
        fromDate: fmt(start),
        toDate: fmt(end),
        limit: 100,
      },
      headers: { Accept: 'application/json' },
      timeout: 15000,
    },
  );

  return data.features
    .map(normalizeGDACS)
    .filter((d): d is NormalizedDisaster => d !== null);
}

export function useGDACSDisasters(days: number) {
  return useQuery({
    queryKey: ['gdacs-disasters', days],
    queryFn: () => fetchGDACSDisasters(days),
    staleTime: 30 * 60 * 1000,
    refetchInterval: 60 * 60 * 1000,
    retry: 2,
  });
}
