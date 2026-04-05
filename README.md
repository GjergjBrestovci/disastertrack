# 🌍 DisasterTrack

Real-time natural disaster tracking on a 3D globe, powered by multiple data sources: NASA EONET, USGS Earthquakes, NASA FIRMS wildfires, and ReliefWeb humanitarian alerts.

![DisasterTrack Screenshot](screenshot.png)

## What is this?

DisasterTrack plots active natural disaster events — wildfires, severe storms, volcanic eruptions, floods, earthquakes, and more — as color-coded pins on an interactive 3D Earth globe. Spin the globe, click events for details, filter by category and time range, and monitor live updates.

## Tech Stack

- **React 18** + **TypeScript** (strict mode)
- **Vite** — fast dev server and builds
- **globe.gl** — WebGL 3D globe (Three.js under the hood)
- **TanStack Query** — data fetching, caching, background refetch
- **Tailwind CSS v3** — utility-first styling
- **Framer Motion** — panel animations
- **Axios** — HTTP client
- **date-fns** — date formatting

## Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/disastertrack.git
cd disastertrack

# Install dependencies
npm install

# (Optional) Set up NASA FIRMS wildfire data
# Get a free API key at https://firms.modaps.eosdis.nasa.gov/api/area/
cp .env.example .env
# Edit .env and add your FIRMS MAP_KEY
# Without this key, FIRMS data will be silently skipped — everything else works fine.

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

## Features

- **3D Interactive Globe** — rotate, zoom, and explore Earth with smooth controls
- **Live Event Data** — auto-refreshes every 10 minutes from NASA EONET
- **Category Filters** — toggle wildfires, storms, volcanoes, floods, and more
- **Time Range Selector** — view events from the last 7, 30, 60, or 365 days
- **Fly-to on Click** — camera smoothly transitions to selected events
- **Detail Panel** — event info, coordinates, magnitude, sources, and NASA links
- **Hover Tooltips** — quick preview on globe pin hover
- **Responsive** — sidebar collapses to bottom sheet on mobile
- **Dark Space Theme** — night Earth texture with atmospheric glow

## Data Sources

| Source | What it provides | Auth | Refresh interval |
|--------|-----------------|------|-----------------|
| **NASA EONET v3** | Multi-category natural events (storms, volcanoes, ice, etc.) | None | 10 min |
| **USGS Earthquake API** | Earthquakes M2.5+, with magnitude/depth/tsunami flags | None | 5 min |
| **NASA FIRMS** | Active wildfire hotspots from VIIRS satellite | Free API key | 15 min |
| **ReliefWeb** | UN-level humanitarian disaster declarations | None | 60 min |

All requests go directly from the browser — no backend needed. Only FIRMS requires an API key (free, takes 10 seconds to get).

## Project Structure

```
src/
├── components/
│   ├── Globe/          — 3D globe + useGlobe hook
│   ├── Sidebar/        — filters, event list
│   ├── EventPanel/     — event detail slide-in panel
│   ├── Filters/        — category toggle buttons
│   ├── Stats/          — top stats bar
│   └── ui/             — Badge, Spinner, Tooltip
├── hooks/              — React Query data hooks
├── lib/                — API client + utility functions
├── types/              — TypeScript interfaces
├── constants/          — category config (colors, icons)
├── App.tsx             — root layout + state
├── main.tsx            — entry point
└── index.css           — global styles + Tailwind
```

## Attribution

- **NASA EONET** — Earth Observatory Natural Event Tracker, [NASA Goddard Space Flight Center](https://www.nasa.gov/goddard)
- **USGS** — United States Geological Survey [Earthquake Hazards Program](https://earthquake.usgs.gov/)
- **NASA FIRMS** — Fire Information for Resource Management System, [NASA EOSDIS](https://firms.modaps.eosdis.nasa.gov/)
- **ReliefWeb** — [OCHA / United Nations](https://reliefweb.int/)
- Globe imagery from [three-globe](https://github.com/vasturiano/three-globe)

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Ideas for contribution

- Hurricane path visualization (multi-geometry tracks)
- Historical event timeline view
- Satellite imagery overlay via EONET Layers API

## License

MIT — see [LICENSE](LICENSE) for details.
