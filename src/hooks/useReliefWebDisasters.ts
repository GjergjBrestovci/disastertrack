import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { ReliefWebResponse, NormalizedDisaster } from '../types/disaster';
import { normalizeReliefWeb } from '../lib/normalizers';

async function fetchReliefWebDisasters(): Promise<NormalizedDisaster[]> {
  const { data } = await axios.post<ReliefWebResponse>(
    'https://api.reliefweb.int/v1/disasters?appname=disastertrack&preset=external&limit=50',
    {
      fields: {
        include: ['name', 'description', 'date', 'type', 'country', 'status', 'url'],
      },
      filter: {
        field: 'status',
        value: 'alert',
      },
      sort: ['date:desc'],
      limit: 50,
    },
    { timeout: 15000 },
  );

  return data.data
    .map(normalizeReliefWeb)
    .filter((d): d is NormalizedDisaster => d !== null);
}

export function useReliefWebDisasters() {
  return useQuery({
    queryKey: ['reliefweb-disasters'],
    queryFn: fetchReliefWebDisasters,
    staleTime: 30 * 60 * 1000,
    refetchInterval: 60 * 60 * 1000,
    retry: 2,
  });
}
