import { useState, useCallback, useRef } from 'react';
import { GlobeContainer } from './components/Globe/GlobeContainer';
import { Sidebar } from './components/Sidebar/Sidebar';
import { EventDetailPanel } from './components/EventPanel/EventDetailPanel';
import { StatsBar } from './components/Stats/StatsBar';
import { useEONETEvents } from './hooks/useEONETEvents';
import type { EONETEvent } from './types/eonet';

export default function App() {
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [activeDays, setActiveDays] = useState(30);
  const [selectedEvent, setSelectedEvent] = useState<EONETEvent | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const flyToRef = useRef<((event: EONETEvent) => void) | null>(null);

  const {
    data: events = [],
    isLoading,
    isError,
    dataUpdatedAt,
    isRefetching,
    refetch,
  } = useEONETEvents(activeDays, activeCategories);

  const handleToggleCategory = useCallback((categoryId: string) => {
    setActiveCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  const handleSelectAllCategories = useCallback(() => {
    setActiveCategories([]);
  }, []);

  const handleEventSelect = useCallback((event: EONETEvent) => {
    setSelectedEvent(event);
    flyToRef.current?.(event);
    setSidebarOpen(false);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const handleSetFlyTo = useCallback((fn: (event: EONETEvent) => void) => {
    flyToRef.current = fn;
  }, []);

  return (
    <div className="fixed inset-0 bg-bg overflow-hidden">
      <StatsBar
        events={events}
        dataUpdatedAt={dataUpdatedAt}
        isRefetching={isRefetching}
        onRefresh={() => refetch()}
      />

      {/* Mobile menu toggle */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-[62px] left-3 z-30 md:hidden w-10 h-10 flex items-center justify-center rounded-lg transition-colors"
        style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--border)',
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--text-muted)"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <Sidebar
        events={events}
        isLoading={isLoading}
        isError={isError}
        selectedEventId={selectedEvent?.id ?? null}
        activeCategories={activeCategories}
        activeDays={activeDays}
        onToggleCategory={handleToggleCategory}
        onSelectAllCategories={handleSelectAllCategories}
        onChangeDays={setActiveDays}
        onEventSelect={handleEventSelect}
        onRetry={() => refetch()}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Globe fills remaining space */}
      <main className="fixed top-14 bottom-0 left-0 md:left-[320px] right-0">
        <GlobeContainer
          events={events}
          isLoading={isLoading}
          onEventSelect={handleEventSelect}
          onFlyToRef={handleSetFlyTo}
        />
      </main>

      <EventDetailPanel
        event={selectedEvent}
        onClose={handleCloseDetail}
      />
    </div>
  );
}
