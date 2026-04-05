import type { FIRMSPoint, FIRMSCluster } from '../types/disaster';

export function parseFIRMSCSV(csvText: string): FIRMSPoint[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',');
  const results: FIRMSPoint[] = [];

  for (let i = 1; i < lines.length; i++) {
    try {
      const values = lines[i].split(',');
      const row: Record<string, string> = {};
      for (let j = 0; j < headers.length; j++) {
        row[headers[j].trim()] = values[j]?.trim() ?? '';
      }

      const lat = parseFloat(row.latitude);
      const lng = parseFloat(row.longitude);
      const frp = parseFloat(row.frp);
      const confidence = row.confidence;

      if (isNaN(lat) || isNaN(lng) || confidence === 'low' || confidence === 'l') continue;

      results.push({
        lat,
        lng,
        frp: isNaN(frp) ? 0 : frp,
        confidence,
        date: row.acq_date,
        satellite: row.satellite,
      });
    } catch {
      // skip malformed rows
    }
  }

  return results;
}

export function clusterFIRMSPoints(
  points: FIRMSPoint[],
  gridSize = 0.5,
): FIRMSCluster[] {
  const grid = new Map<string, FIRMSPoint[]>();

  for (const p of points) {
    const key = `${Math.round(p.lat / gridSize)},${Math.round(p.lng / gridSize)}`;
    const bucket = grid.get(key);
    if (bucket) {
      bucket.push(p);
    } else {
      grid.set(key, [p]);
    }
  }

  return Array.from(grid.values()).map((cluster) => ({
    lat: cluster.reduce((s, p) => s + p.lat, 0) / cluster.length,
    lng: cluster.reduce((s, p) => s + p.lng, 0) / cluster.length,
    frp: cluster.reduce((s, p) => s + p.frp, 0),
    count: cluster.length,
    date: cluster[0].date,
    satellite: cluster[0].satellite,
    confidence: cluster[0].confidence,
  }));
}
