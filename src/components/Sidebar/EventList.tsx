import { EventListItem } from './EventListItem';
import type { NormalizedDisaster } from '../../types/disaster';

interface EventListProps {
  events: NormalizedDisaster[];
  isLoading: boolean;
  isError: boolean;
  selectedEventId: string | null;
  onEventSelect: (event: NormalizedDisaster) => void;
  onRetry: () => void;
}

export function EventList({
  events,
  isLoading,
  isError,
  selectedEventId,
  onEventSelect,
  onRetry,
}: EventListProps) {
  if (isLoading) {
    return (
      <div className="flex-1 overflow-hidden px-4 py-3 space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="w-2.5 h-2.5 rounded-full mt-1.5 skeleton" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 skeleton w-full" />
              <div className="h-3 skeleton w-3/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <span className="text-2xl mb-2">⚠️</span>
        <p className="text-sm text-[var(--text-muted)] mb-3">
          Failed to load disaster events.
        </p>
        <button
          onClick={onRetry}
          className="px-4 py-2 text-xs font-mono font-medium rounded-md border transition-colors hover:bg-[var(--bg-raised)]"
          style={{ borderColor: 'var(--border)', color: 'var(--teal)' }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <span className="text-2xl mb-2">🌎</span>
        <p className="text-sm text-[var(--text-muted)]">
          No events match your filters.
        </p>
        <p className="text-xs text-[var(--text-faint)] mt-1">
          Try a wider time range or enable more data sources.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-[var(--border)]">
      {events.map((event) => (
        <EventListItem
          key={event.id}
          event={event}
          isActive={event.id === selectedEventId}
          onClick={() => onEventSelect(event)}
        />
      ))}
    </div>
  );
}
