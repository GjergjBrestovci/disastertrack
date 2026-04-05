import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { fromDate, toDate, limit } = req.query;

  const params = new URLSearchParams({
    eventlist: 'EQ,TC,FL,VO,DR,WF',
    alertlevel: 'Green;Orange;Red',
    fromDate: String(fromDate || ''),
    toDate: String(toDate || ''),
    limit: String(limit || '100'),
  });

  const url = `https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?${params}`;

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).send(text);
    }

    const data = await response.json();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=600');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Failed to fetch GDACS data', details: String(err) });
  }
}
