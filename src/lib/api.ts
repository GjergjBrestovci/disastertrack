import axios from 'axios';
import type { EONETResponse, EONETCategoriesResponse } from '../types/eonet';

const api = axios.create({
  baseURL: 'https://eonet.gsfc.nasa.gov/api/v3',
  timeout: 15000,
});

export async function fetchEvents(
  days: number,
  categories: string[]
): Promise<EONETResponse> {
  const params: Record<string, string | number> = {
    status: 'open',
    limit: 500,
  };

  if (days < 365) {
    params.days = days;
  }

  if (categories.length > 0 && categories.length < 12) {
    params.category = categories.join(',');
  }

  const { data } = await api.get<EONETResponse>('/events', { params });
  return data;
}

export async function fetchCategories(): Promise<EONETCategoriesResponse> {
  const { data } = await api.get<EONETCategoriesResponse>('/categories');
  return data;
}
