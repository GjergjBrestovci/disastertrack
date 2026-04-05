import type { EONETEvent } from '../../types/eonet';
import { getCategoryConfig, formatRelativeDate } from '../../lib/utils';

interface TooltipProps {
  event: EONETEvent | null;
  position: { x: number; y: number };
}

export function Tooltip({ event, position }: TooltipProps) {
  if (!event) return null;

  const config = getCategoryConfig(event);
  const date = event.geometry[0]?.date;

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
          borderLeft: `3px solid ${config.color}`,
        }}
      >
        <div className="flex items-center gap-1.5 font-medium text-[var(--text)]">
          <span>{config.icon}</span>
          <span className="truncate">{event.title}</span>
        </div>
        {date && (
          <div className="text-xs text-[var(--text-muted)] mt-0.5 font-mono">
            {formatRelativeDate(date)}
          </div>
        )}
      </div>
    </div>
  );
}
