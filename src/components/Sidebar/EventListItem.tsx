import type { EONETEvent } from '../../types/eonet';
import { getCategoryConfig, formatRelativeDate } from '../../lib/utils';

interface EventListItemProps {
  event: EONETEvent;
  isActive: boolean;
  onClick: () => void;
}

export function EventListItem({ event, isActive, onClick }: EventListItemProps) {
  const config = getCategoryConfig(event);
  const date = event.geometry[0]?.date;

  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 flex items-start gap-3 transition-colors duration-100 group"
      style={{
        background: isActive ? 'var(--bg-raised)' : 'transparent',
        borderLeft: isActive ? `2px solid var(--teal)` : '2px solid transparent',
      }}
    >
      <span
        className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
        style={{ background: config.color }}
      />
      <div className="min-w-0 flex-1">
        <div className="text-sm text-[var(--text)] truncate group-hover:text-white transition-colors">
          {event.title}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[11px] font-mono text-[var(--text-faint)]">
            {config.icon} {config.label}
          </span>
          {date && (
            <>
              <span className="text-[var(--text-faint)]">·</span>
              <span className="text-[11px] font-mono text-[var(--text-faint)]">
                {formatRelativeDate(date)}
              </span>
            </>
          )}
        </div>
      </div>
    </button>
  );
}
