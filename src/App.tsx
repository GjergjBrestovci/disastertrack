import { useState, useCallback, useRef } from 'react';
import { GlobeContainer } from './components/Globe/GlobeContainer';
import { Sidebar } from './components/Sidebar/Sidebar';
import { EventDetailPanel } from './components/EventPanel/EventDetailPanel';
import { StatsBar } from './components/Stats/StatsBar';
import { useAllDisasters } from './hooks/useAllDisasters';
import type { NormalizedDisaster, DisasterSource } from './types/disaster';

const ALL_SOURCES: DisasterSource[] = ['eonet', 'usgs', 'firms', 'reliefweb'];

export default function App() {
  const [activeCategories, setActiveCategories] = useState<string[]>([]);
  const [activeDays, setActiveDays] = useState(30);
  const [selectedEvent, setSelectedEvent] = useState<NormalizedDisaster | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [enabledSources, setEnabledSources] = useState<ReadonlySet<DisasterSource>>(
    () => new Set(ALL_SOURCES),
  );

  const flyToRef = useRef<((event: NormalizedDisaster) => void) | null>(null);

  const {
    data: events,
    isLoading,
    isRefetching,
    sourceStatuses,
    dataUpdatedAt,
    refetchAll,
  } = useAllDisasters(activeDays, activeCategories, enabledSources);

  const handleToggleSource = useCallback((source: DisasterSource) => {
    setEnabledSources((prev) => {
      const next = new Set(prev);
      if (next.has(source)) {
        next.delete(source);
      } else {
        next.add(source);
      }
      return next;
    });
  }, []);

  const handleToggleCategory = useCallback((categoryId: string) => {
    setActiveCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId],
    );
  }, []);

  const handleSelectAllCategories = useCallback(() => {
    setActiveCategories([]);
  }, []);

  const handleEventSelect = useCallback((event: NormalizedDisaster) => {
    setSelectedEvent(event);
    flyToRef.current?.(event);
    setSidebarOpen(false);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  const handleSetFlyTo = useCallback((fn: (event: NormalizedDisaster) => void) => {
    flyToRef.current = fn;
  }, []);

  const allErrors = sourceStatuses.every((s) => s.isError);

  return (
    <div className="fixed inset-0 bg-bg overflow-hidden">
      <StatsBar
        totalCount={events.length}
        sourceStatuses={sourceStatuses}
        dataUpdatedAt={dataUpdatedAt}
        isRefetching={isRefetching}
        onRefresh={refetchAll}
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
        isError={allErrors}
        selectedEventId={selectedEvent?.id ?? null}
        activeCategories={activeCategories}
        activeDays={activeDays}
        enabledSources={enabledSources}
        sourceStatuses={sourceStatuses}
        onToggleSource={handleToggleSource}
        onToggleCategory={handleToggleCategory}
        onSelectAllCategories={handleSelectAllCategories}
        onChangeDays={setActiveDays}
        onEventSelect={handleEventSelect}
        onRetry={refetchAll}
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
