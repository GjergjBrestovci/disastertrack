import { SourceFilter } from './SourceFilter';
import { CategoryFilter } from '../Filters/CategoryFilter';
import { EventList } from './EventList';
import { TIME_RANGES } from '../../constants/categories';
import type { NormalizedDisaster, DisasterSource } from '../../types/disaster';
import type { SourceStatus } from '../../hooks/useAllDisasters';

interface SidebarProps {
  events: NormalizedDisaster[];
  isLoading: boolean;
  isError: boolean;
  selectedEventId: string | null;
  activeCategories: string[];
  activeDays: number;
  enabledSources: ReadonlySet<DisasterSource>;
  sourceStatuses: SourceStatus[];
  onToggleSource: (source: DisasterSource) => void;
  onToggleCategory: (categoryId: string) => void;
  onSelectAllCategories: () => void;
  onChangeDays: (days: number) => void;
  onEventSelect: (event: NormalizedDisaster) => void;
  onRetry: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  events,
  isLoading,
  isError,
  selectedEventId,
  activeCategories,
  activeDays,
  enabledSources,
  sourceStatuses,
  onToggleSource,
  onToggleCategory,
  onSelectAllCategories,
  onChangeDays,
  onEventSelect,
  onRetry,
  isOpen,
  onClose,
}: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-14 left-0 bottom-0 w-[320px] z-40 flex flex-col
          transition-transform duration-300 ease-out
          md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          background: 'var(--bg-panel)',
          backdropFilter: 'blur(16px)',
          borderRight: '1px solid var(--border)',
        }}
      >
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:hidden w-8 h-8 flex items-center justify-center rounded-md text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-raised)] transition-colors"
        >
          ✕
        </button>

        {/* Filters section */}
        <div className="p-4 space-y-4 border-b border-[var(--border)]">
          <SourceFilter
            enabledSources={enabledSources}
            onToggle={onToggleSource}
            sourceStatuses={sourceStatuses}
          />

          <CategoryFilter
            activeCategories={activeCategories}
            onToggle={onToggleCategory}
            onSelectAll={onSelectAllCategories}
          />

          {/* Time range */}
          <div className="space-y-2">
            <h3 className="text-[11px] font-mono font-semibold tracking-widest text-[var(--text-faint)] uppercase">
              Time Range
            </h3>
            <div className="flex gap-1.5">
              {TIME_RANGES.map(({ label, days }) => (
                <button
                  key={days}
                  onClick={() => onChangeDays(days)}
                  className="px-2.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all duration-150"
                  style={{
                    background: activeDays === days ? 'var(--teal-glow)' : 'transparent',
                    border: `1px solid ${activeDays === days ? 'var(--teal)' : 'var(--border)'}`,
                    color: activeDays === days ? 'var(--teal)' : 'var(--text-muted)',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Event count */}
        <div className="px-4 py-2.5 border-b border-[var(--border)] flex items-center justify-between">
          <span className="text-[11px] font-mono font-semibold tracking-widest text-[var(--text-faint)] uppercase">
            Events
          </span>
          <span className="text-[11px] font-mono font-medium text-[var(--text-muted)]">
            {isLoading ? '...' : events.length.toLocaleString()}
          </span>
        </div>

        {/* Event list */}
        <EventList
          events={events}
          isLoading={isLoading}
          isError={isError}
          selectedEventId={selectedEventId}
          onEventSelect={onEventSelect}
          onRetry={onRetry}
        />
      </aside>
    </>
  );
}
