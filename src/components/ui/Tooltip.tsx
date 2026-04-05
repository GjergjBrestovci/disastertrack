import type { NormalizedDisaster } from '../../types/disaster';
import { SOURCE_CONFIGS } from '../../types/disaster';
import { formatRelativeDate } from '../../lib/utils';

interface TooltipProps {
  event: NormalizedDisaster | null;
  position: { x: number; y: number };
}

export function Tooltip({ event, position }: TooltipProps) {
  if (!event) return null;

  const sourceCfg = SOURCE_CONFIGS.find((s) => s.key === event.source);

  return (
    <div
      className="fixed z-[100] pointer-events-none tooltip-fade"
      style={{
        left: position.x + 16,
        top: position.y - 8,
        opacity: event ? 1 : 0,
      }}
    >
      <div
        className="px-3 py-2 rounded-lg text-sm max-w-[280px]"
        style={{
          background: 'var(--bg-raised)',
          border: '1px solid var(--border)',
          borderLeft: `3px solid ${event.color}`,
        }}
      >
        <div className="flex items-center gap-1.5 font-medium text-[var(--text)]">
          <span className="truncate">{event.title}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          {event.date && (
            <span className="text-xs text-[var(--text-muted)] font-mono">
              {formatRelativeDate(event.date)}
            </span>
          )}
          {sourceCfg && (
            <>
              <span className="text-[var(--text-faint)]">&middot;</span>
              <span className="text-[10px] font-mono" style={{ color: sourceCfg.color }}>
                {sourceCfg.label}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
