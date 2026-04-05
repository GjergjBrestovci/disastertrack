import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { days } = req.query;
  const firmsKey = process.env.FIRMS_MAP_KEY;

  if (!firmsKey) {
    return res.status(500).json({ error: 'FIRMS_MAP_KEY not configured' });
  }

  const firmsDays = Number(days) || 5;
  const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${firmsKey}/VIIRS_SNPP_NRT/world/${firmsDays}`;

  try {
    const response = await fetch(url, {
      headers: { Accept: 'text/csv' },
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).send(text);
    }

    const csv = await response.text();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=300');
    return res.status(200).send(csv);
  } catch (err) {
    return res.status(502).json({ error: 'Failed to fetch FIRMS data', details: String(err) });
  }
}
