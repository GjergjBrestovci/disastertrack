# 🌍 DisasterTrack

Real-time natural disaster tracking on a 3D globe, powered by NASA's [EONET API](https://eonet.gsfc.nasa.gov/).

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

## API

This project uses **NASA's Earth Observatory Natural Event Tracker (EONET) API v3**.

- **Base URL:** `https://eonet.gsfc.nasa.gov/api/v3`
- **Auth:** None required (public API)
- **Docs:** [eonet.gsfc.nasa.gov/docs/v3](https://eonet.gsfc.nasa.gov/docs/v3)

No backend or API keys needed. All requests go directly from the browser to NASA's servers.

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

Data provided by **NASA's Earth Observatory Natural Event Tracker (EONET)**, a service of the [NASA Goddard Space Flight Center](https://www.nasa.gov/goddard). Globe imagery from [three-globe](https://github.com/vasturiano/three-globe).

> EONET metadata is subject to NASA's [disclaimer](https://eonet.gsfc.nasa.gov/what-is-eonet#disclaimer).

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Ideas for contribution

- USGS earthquake API integration for richer seismic data
- Event clustering for dense areas
- Hurricane path visualization (multi-geometry tracks)
- Historical event timeline view
- Satellite imagery overlay via EONET Layers API

## License

MIT — see [LICENSE](LICENSE) for details.
