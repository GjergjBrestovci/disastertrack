import { useEffect, useRef, useCallback } from 'react';
import Globe from 'globe.gl';
import type { NormalizedDisaster } from '../../types/disaster';

interface UseGlobeOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  events: NormalizedDisaster[];
  onPointClick: (event: NormalizedDisaster) => void;
  onPointHover: (event: NormalizedDisaster | null, mousePos: { x: number; y: number }) => void;
}

export function useGlobe({ containerRef, events, onPointClick, onPointHover }: UseGlobeOptions) {
  const globeRef = useRef<ReturnType<typeof Globe> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize globe
  useEffect(() => {
    const container = containerRef.current;
    if (!container || globeRef.current) return;

    const globe = Globe()(container)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
      .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
      .showAtmosphere(true)
      .atmosphereColor('#1E3A5F')
      .atmosphereAltitude(0.15)
      .pointsMerge(false)
      .pointAltitude(0.01)
      .width(container.clientWidth)
      .height(container.clientHeight);

    // Auto-rotation
    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    // Pause rotation on interaction, resume after 3s
    controls.addEventListener('start', () => {
      controls.autoRotate = false;
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    });

    controls.addEventListener('end', () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = setTimeout(() => {
        controls.autoRotate = true;
      }, 3000);
    });

    globeRef.current = globe;

    // Responsive resize
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        globe.width(width).height(height);
      }
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
      // Clean up Three.js renderer
      globe._destructor?.();
      globeRef.current = null;
    };
  }, [containerRef]);

  // Update points data when events change
  useEffect(() => {
    const globe = globeRef.current;
    if (!globe) return;

    globe
      .pointsData(events)
      .pointLat((d: object) => (d as NormalizedDisaster).lat)
      .pointLng((d: object) => (d as NormalizedDisaster).lng)
      .pointColor((d: object) => (d as NormalizedDisaster).color)
      .pointRadius((d: object) => (d as NormalizedDisaster).pinRadius)
      .onPointClick((point: object) => {
        onPointClick(point as NormalizedDisaster);
      })
      .onPointHover((point: object | null, _prev: object | null, ev: MouseEvent) => {
        onPointHover(
          point as NormalizedDisaster | null,
          { x: ev?.clientX ?? 0, y: ev?.clientY ?? 0 },
        );
      });

    // Tsunami ring layer
    const tsunamiEvents = events.filter((d) => d.meta?.tsunami);
    globe
      .ringsData(tsunamiEvents)
      .ringLat((d: object) => (d as NormalizedDisaster).lat)
      .ringLng((d: object) => (d as NormalizedDisaster).lng)
      .ringColor(() => '#00BFFF')
      .ringMaxRadius(3)
      .ringPropagationSpeed(1.5)
      .ringRepeatPeriod(1200);
  }, [events, onPointClick, onPointHover]);

  const flyTo = useCallback((event: NormalizedDisaster) => {
    const globe = globeRef.current;
    if (!globe) return;

    globe.pointOfView(
      { lat: event.lat, lng: event.lng, altitude: 1.5 },
      1000,
    );
  }, []);

  return { flyTo };
}
