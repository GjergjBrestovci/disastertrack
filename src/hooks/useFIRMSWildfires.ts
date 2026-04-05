import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { NormalizedDisaster } from '../types/disaster';
import { parseFIRMSCSV, clusterFIRMSPoints } from '../lib/firms';
import { normalizeFIRMS } from '../lib/normalizers';

function mapDaysToFIRMS(days: number): number {
  if (days <= 1) return 1;
  if (days <= 2) return 2;
  if (days <= 3) return 3;
  return 5;
}

async function fetchFIRMSWildfires(days: number): Promise<NormalizedDisaster[]> {
  const firmsDays = mapDaysToFIRMS(days);
  const { data } = await axios.get<string>(
    '/api/firms',
    {
      params: { days: firmsDays },
      timeout: 30000,
      responseType: 'text',
    },
  );

  const points = parseFIRMSCSV(data);
  const clusters = clusterFIRMSPoints(points);
  return clusters.map(normalizeFIRMS);
}

export function useFIRMSWildfires(days: number) {
  return useQuery({
    queryKey: ['firms-wildfires', days],
    queryFn: () => fetchFIRMSWildfires(days),
    staleTime: 10 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
    retry: 2,
  });
}
