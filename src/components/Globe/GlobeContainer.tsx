import { useRef, useState, useCallback } from 'react';
import { useGlobe } from './useGlobe';
import { Tooltip } from '../ui/Tooltip';
import { Spinner } from '../ui/Spinner';
import type { NormalizedDisaster } from '../../types/disaster';

interface GlobeContainerProps {
  events: NormalizedDisaster[];
  isLoading: boolean;
  onEventSelect: (event: NormalizedDisaster) => void;
  onFlyToRef: (fn: (event: NormalizedDisaster) => void) => void;
}

export function GlobeContainer({ events, isLoading, onEventSelect, onFlyToRef }: GlobeContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredEvent, setHoveredEvent] = useState<NormalizedDisaster | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handlePointClick = useCallback(
    (event: NormalizedDisaster) => {
      onEventSelect(event);
    },
    [onEventSelect],
  );

  const handlePointHover = useCallback(
    (event: NormalizedDisaster | null, pos: { x: number; y: number }) => {
      setHoveredEvent(event);
      setMousePos(pos);
    },
    [],
  );

  const { flyTo } = useGlobe({
    containerRef,
    events,
    onPointClick: handlePointClick,
    onPointHover: handlePointHover,
  });

  // Expose flyTo to parent
  onFlyToRef(flyTo);

  return (
    <div className="relative w-full h-full globe-container">
      <div ref={containerRef} className="w-full h-full" />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="flex flex-col items-center gap-3">
            <Spinner size={36} />
            <span className="text-sm text-[var(--text-muted)] font-mono">
              Loading events...
            </span>
          </div>
        </div>
      )}

      <Tooltip event={hoveredEvent} position={mousePos} />
    </div>
  );
}
