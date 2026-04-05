import { SOURCE_CONFIGS } from '../../types/disaster';
import type { DisasterSource } from '../../types/disaster';
import type { SourceStatus } from '../../hooks/useAllDisasters';

interface SourceFilterProps {
  enabledSources: ReadonlySet<DisasterSource>;
  onToggle: (source: DisasterSource) => void;
  sourceStatuses: SourceStatus[];
}

export function SourceFilter({ enabledSources, onToggle, sourceStatuses }: SourceFilterProps) {
  return (
    <div className="space-y-2.5">
      <h3 className="text-[11px] font-mono font-semibold tracking-widest text-[var(--text-faint)] uppercase">
        Data Sources
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {SOURCE_CONFIGS.map((cfg) => {
          const enabled = enabledSources.has(cfg.key);
          const status = sourceStatuses.find((s) => s.source === cfg.key);
          const hasError = status?.isError ?? false;

          return (
            <button
              key={cfg.key}
              onClick={() => hasError && status ? status.refetch() : onToggle(cfg.key)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all duration-150"
              style={{
                background: enabled ? `${cfg.color}20` : 'transparent',
                border: `1px solid ${enabled ? cfg.color : 'var(--border)'}`,
                color: enabled ? cfg.color : 'var(--text-muted)',
                opacity: enabled ? 1 : 0.5,
              }}
              title={
                hasError
                  ? `Failed to load ${cfg.label} — click to retry`
                  : `Toggle ${cfg.label}`
              }
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: hasError ? '#EF4444' : cfg.color }}
              />
              {hasError ? '\u26A0' : ''} {cfg.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
