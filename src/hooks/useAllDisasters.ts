import { useMemo } from 'react';
import type { DisasterSource, NormalizedDisaster } from '../types/disaster';
import { useEONETEvents } from './useEONETEvents';
import { useUSGSEarthquakes } from './useUSGSEarthquakes';
import { useFIRMSWildfires } from './useFIRMSWildfires';
import { useGDACSDisasters } from './useGDACSDisasters';

export interface SourceStatus {
  source: DisasterSource;
  isLoading: boolean;
  isError: boolean;
  count: number;
  refetch: () => void;
}

export function useAllDisasters(
  days: number,
  categories: string[],
  enabledSources: ReadonlySet<DisasterSource>,
) {
  const eonet = useEONETEvents(days, categories);
  const usgs = useUSGSEarthquakes(days);
  const firms = useFIRMSWildfires(days);
  const gdacs = useGDACSDisasters(days);

  const allData = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    const cutoffTime = cutoff.getTime();

    const result: NormalizedDisaster[] = [];
    if (enabledSources.has('eonet') && eonet.data) result.push(...eonet.data);
    if (enabledSources.has('usgs') && usgs.data) result.push(...usgs.data);
    if (enabledSources.has('firms') && firms.data) result.push(...firms.data);
    if (enabledSources.has('gdacs') && gdacs.data) result.push(...gdacs.data);

    return result.filter((d) => {
      if (!d.date) return true;
      const t = new Date(d.date).getTime();
      return !isNaN(t) && t >= cutoffTime;
    });
  }, [eonet.data, usgs.data, firms.data, gdacs.data, enabledSources, days]);

  const isLoading =
    eonet.isLoading || usgs.isLoading || firms.isLoading || gdacs.isLoading;

  const isRefetching =
    eonet.isRefetching || usgs.isRefetching || firms.isRefetching || gdacs.isRefetching;

  const sourceStatuses: SourceStatus[] = useMemo(
    () => [
      {
        source: 'eonet' as const,
        isLoading: eonet.isLoading,
        isError: eonet.isError,
        count: eonet.data?.length ?? 0,
        refetch: () => { eonet.refetch(); },
      },
      {
        source: 'usgs' as const,
        isLoading: usgs.isLoading,
        isError: usgs.isError,
        count: usgs.data?.length ?? 0,
        refetch: () => { usgs.refetch(); },
      },
      {
        source: 'firms' as const,
        isLoading: firms.isLoading,
        isError: firms.isError,
        count: firms.data?.length ?? 0,
        refetch: () => { firms.refetch(); },
      },
      {
        source: 'gdacs' as const,
        isLoading: gdacs.isLoading,
        isError: gdacs.isError,
        count: gdacs.data?.length ?? 0,
        refetch: () => { gdacs.refetch(); },
      },
    ],
    [
      eonet.isLoading, eonet.isError, eonet.data, eonet.refetch,
      usgs.isLoading, usgs.isError, usgs.data, usgs.refetch,
      firms.isLoading, firms.isError, firms.data, firms.refetch,
      gdacs.isLoading, gdacs.isError, gdacs.data, gdacs.refetch,
    ],
  );

  const dataUpdatedAt = Math.max(
    eonet.dataUpdatedAt ?? 0,
    usgs.dataUpdatedAt ?? 0,
    firms.dataUpdatedAt ?? 0,
    gdacs.dataUpdatedAt ?? 0,
  );

  const refetchAll = () => {
    eonet.refetch();
    usgs.refetch();
    firms.refetch();
    gdacs.refetch();
  };

  return {
    data: allData,
    isLoading,
    isRefetching,
    sourceStatuses,
    dataUpdatedAt,
    refetchAll,
  };
}
