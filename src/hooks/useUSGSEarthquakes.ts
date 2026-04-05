import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { USGSResponse, NormalizedDisaster } from '../types/disaster';
import { normalizeUSGS } from '../lib/normalizers';

async function fetchUSGSEarthquakes(days: number): Promise<NormalizedDisaster[]> {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);

  const { data } = await axios.get<USGSResponse>(
    'https://earthquake.usgs.gov/fdsnws/event/1/query',
    {
      params: {
        format: 'geojson',
        eventtype: 'earthquake',
        minmagnitude: 2.5,
        orderby: 'time',
        limit: 500,
        starttime: start.toISOString(),
        endtime: end.toISOString(),
      },
      timeout: 15000,
    },
  );

  return data.features.map(normalizeUSGS);
}

export function useUSGSEarthquakes(days: number) {
  return useQuery({
    queryKey: ['usgs-earthquakes', days],
    queryFn: () => fetchUSGSEarthquakes(days),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
    retry: 2,
  });
}
