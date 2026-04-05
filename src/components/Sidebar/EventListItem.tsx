import type { NormalizedDisaster } from '../../types/disaster';
import { SOURCE_CONFIGS } from '../../types/disaster';
import { formatRelativeDate } from '../../lib/utils';

interface EventListItemProps {
  event: NormalizedDisaster;
  isActive: boolean;
  onClick: () => void;
}

export function EventListItem({ event, isActive, onClick }: EventListItemProps) {
  const sourceCfg = SOURCE_CONFIGS.find((s) => s.key === event.source);

  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 flex items-start gap-3 transition-colors duration-100 group"
      style={{
        background: isActive ? 'var(--bg-raised)' : 'transparent',
        borderLeft: isActive ? '2px solid var(--teal)' : '2px solid transparent',
      }}
    >
      <span
        className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
        style={{ background: event.color }}
      />
      <div className="min-w-0 flex-1">
        <div className="text-sm text-[var(--text)] truncate group-hover:text-white transition-colors">
          {event.title}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          {sourceCfg && (
            <span className="text-[10px] font-mono" style={{ color: sourceCfg.color }}>
              {sourceCfg.label}
            </span>
          )}
          {event.date && (
            <>
              <span className="text-[var(--text-faint)]">&middot;</span>
              <span className="text-[11px] font-mono text-[var(--text-faint)]">
                {formatRelativeDate(event.date)}
              </span>
            </>
          )}
        </div>
      </div>
    </button>
  );
}
