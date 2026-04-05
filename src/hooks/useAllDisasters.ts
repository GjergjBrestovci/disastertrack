import { useMemo } from 'react';
import type { DisasterSource, NormalizedDisaster } from '../types/disaster';
import { useEONETEvents } from './useEONETEvents';
import { useUSGSEarthquakes } from './useUSGSEarthquakes';
import { useFIRMSWildfires } from './useFIRMSWildfires';
import { useReliefWebDisasters } from './useReliefWebDisasters';

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
  const reliefweb = useReliefWebDisasters();

  const allData = useMemo(() => {
    const result: NormalizedDisaster[] = [];
    if (enabledSources.has('eonet') && eonet.data) result.push(...eonet.data);
    if (enabledSources.has('usgs') && usgs.data) result.push(...usgs.data);
    if (enabledSources.has('firms') && firms.data) result.push(...firms.data);
    if (enabledSources.has('reliefweb') && reliefweb.data) result.push(...reliefweb.data);
    return result;
  }, [eonet.data, usgs.data, firms.data, reliefweb.data, enabledSources]);

  const isLoading =
    eonet.isLoading || usgs.isLoading || firms.isLoading || reliefweb.isLoading;

  const isRefetching =
    eonet.isRefetching || usgs.isRefetching || firms.isRefetching || reliefweb.isRefetching;

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
        source: 'reliefweb' as const,
        isLoading: reliefweb.isLoading,
        isError: reliefweb.isError,
        count: reliefweb.data?.length ?? 0,
        refetch: () => { reliefweb.refetch(); },
      },
    ],
    [
      eonet.isLoading, eonet.isError, eonet.data, eonet.refetch,
      usgs.isLoading, usgs.isError, usgs.data, usgs.refetch,
      firms.isLoading, firms.isError, firms.data, firms.refetch,
      reliefweb.isLoading, reliefweb.isError, reliefweb.data, reliefweb.refetch,
    ],
  );

  const dataUpdatedAt = Math.max(
    eonet.dataUpdatedAt ?? 0,
    usgs.dataUpdatedAt ?? 0,
    firms.dataUpdatedAt ?? 0,
    reliefweb.dataUpdatedAt ?? 0,
  );

  const refetchAll = () => {
    eonet.refetch();
    usgs.refetch();
    firms.refetch();
    reliefweb.refetch();
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
