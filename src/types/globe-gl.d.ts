declare module 'globe.gl' {
  import type { Scene, Camera, WebGLRenderer } from 'three';

  interface GlobeControls {
    autoRotate: boolean;
    autoRotateSpeed: number;
    enableDamping: boolean;
    dampingFactor: number;
    addEventListener(event: string, handler: () => void): void;
    removeEventListener(event: string, handler: () => void): void;
  }

  interface GlobeInstance {
    (container: HTMLElement): GlobeInstance;

    // Globe appearance
    globeImageUrl(url: string): GlobeInstance;
    backgroundImageUrl(url: string): GlobeInstance;
    showAtmosphere(show: boolean): GlobeInstance;
    atmosphereColor(color: string): GlobeInstance;
    atmosphereAltitude(alt: number): GlobeInstance;

    // Sizing
    width(w: number): GlobeInstance;
    height(h: number): GlobeInstance;

    // Points layer
    pointsData(data: object[]): GlobeInstance;
    pointLat(fn: string | ((d: object) => number)): GlobeInstance;
    pointLng(fn: string | ((d: object) => number)): GlobeInstance;
    pointColor(fn: string | ((d: object) => string)): GlobeInstance;
    pointAltitude(alt: number | ((d: object) => number)): GlobeInstance;
    pointRadius(radius: number | ((d: object) => number)): GlobeInstance;
    pointsMerge(merge: boolean): GlobeInstance;
    onPointClick(fn: (point: object, event: MouseEvent) => void): GlobeInstance;
    onPointHover(fn: (point: object | null, prevPoint: object | null, event: MouseEvent) => void): GlobeInstance;

    // Rings layer
    ringsData(data: object[]): GlobeInstance;
    ringLat(fn: string | ((d: object) => number)): GlobeInstance;
    ringLng(fn: string | ((d: object) => number)): GlobeInstance;
    ringColor(fn: string | (() => string) | ((d: object) => string)): GlobeInstance;
    ringMaxRadius(r: number | ((d: object) => number)): GlobeInstance;
    ringPropagationSpeed(s: number | ((d: object) => number)): GlobeInstance;
    ringRepeatPeriod(ms: number | ((d: object) => number)): GlobeInstance;

    // Camera
    pointOfView(pov: { lat?: number; lng?: number; altitude?: number }, transitionMs?: number): GlobeInstance;

    // Controls
    controls(): GlobeControls;

    // Three.js internals
    scene(): Scene;
    camera(): Camera;
    renderer(): WebGLRenderer;

    // Cleanup
    _destructor?(): void;
  }

  function Globe(): GlobeInstance;
  export default Globe;
}
