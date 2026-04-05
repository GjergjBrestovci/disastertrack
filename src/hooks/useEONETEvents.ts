import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '../lib/api';
import { filterPlottableEvents } from '../lib/utils';
import { normalizeEONET } from '../lib/normalizers';
import type { NormalizedDisaster } from '../types/disaster';

export function useEONETEvents(days: number, categories: string[]) {
  return useQuery({
    queryKey: ['eonet-events', days, categories],
    queryFn: () => fetchEvents(days, categories),
    staleTime: 5 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    select: (data): NormalizedDisaster[] =>
      filterPlottableEvents(data.events)
        .map(normalizeEONET)
        .filter((d): d is NormalizedDisaster => d !== null),
    retry: 2,
  });
}
