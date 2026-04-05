import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../lib/api';

export function useEONETCategories() {
  return useQuery({
    queryKey: ['eonet-categories'],
    queryFn: fetchCategories,
    staleTime: 60 * 60 * 1000,
  });
}
