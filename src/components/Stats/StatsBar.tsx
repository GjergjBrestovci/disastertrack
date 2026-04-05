import { formatDistanceToNow } from 'date-fns';
import { SOURCE_CONFIGS } from '../../types/disaster';
import type { SourceStatus } from '../../hooks/useAllDisasters';

interface StatsBarProps {
  totalCount: number;
  sourceStatuses: SourceStatus[];
  dataUpdatedAt: number;
  isRefetching: boolean;
  onRefresh: () => void;
}

export function StatsBar({
  totalCount,
  sourceStatuses,
  dataUpdatedAt,
  isRefetching,
  onRefresh,
}: StatsBarProps) {
  const lastUpdated = dataUpdatedAt
    ? formatDistanceToNow(new Date(dataUpdatedAt), { addSuffix: true })
    : 'never';

  return (
    <header
      className="fixed top-0 left-0 right-0 h-14 z-50 flex items-center px-5 gap-4"
      style={{
        background: 'rgba(8,12,20,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 shrink-0">
        <span className="text-lg">🌍</span>
        <span className="text-sm font-display font-bold tracking-wide text-[var(--text)]">
          DISASTERTRACK
        </span>
      </div>

      {/* Live badge */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span
          className="w-2 h-2 rounded-full animate-pulse-live"
          style={{ background: 'var(--green-live)' }}
        />
        <span className="text-[11px] font-mono font-semibold text-[var(--green-live)] tracking-wider">
          LIVE
        </span>
      </div>

      <div className="w-px h-5 bg-[var(--border)] hidden md:block" />

      {/* Per-source counts */}
      <div className="hidden md:flex items-center gap-3 overflow-x-auto">
        {sourceStatuses.map((status) => {
          const cfg = SOURCE_CONFIGS.find((s) => s.key === status.source);
          if (!cfg) return null;
          return (
            <div key={status.source} className="flex items-center gap-1 shrink-0">
              <span className="text-sm">{cfg.icon}</span>
              <span className="text-[10px] font-mono text-[var(--text-faint)] uppercase">
                {cfg.label}:
              </span>
              <span className="text-xs font-mono font-semibold" style={{ color: cfg.color }}>
                {status.isLoading ? '...' : status.count.toLocaleString()}
              </span>
            </div>
          );
        })}
        <span className="text-xs font-mono text-[var(--text-faint)]">
          {totalCount.toLocaleString()} total
        </span>
      </div>

      {/* Mobile total */}
      <div className="md:hidden text-xs font-mono text-[var(--text-muted)]">
        {totalCount.toLocaleString()} events
      </div>

      <div className="flex-1" />

      {/* Last updated + Refresh */}
      <div className="hidden sm:flex items-center gap-3 shrink-0">
        <span className="text-[11px] font-mono text-[var(--text-faint)]">
          Updated {lastUpdated}
        </span>
        <button
          onClick={onRefresh}
          disabled={isRefetching}
          className="w-8 h-8 flex items-center justify-center rounded-md border transition-colors duration-150 hover:bg-[var(--bg-raised)] disabled:opacity-40"
          style={{ borderColor: 'var(--border)' }}
          title="Refresh data"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={isRefetching ? 'animate-spin' : ''}
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            <polyline points="21 3 21 9 15 9" />
          </svg>
        </button>
      </div>
    </header>
  );
}
