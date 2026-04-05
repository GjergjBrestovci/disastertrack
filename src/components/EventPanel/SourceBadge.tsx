import type { DisasterSource } from '../../types/disaster';
import { SOURCE_CONFIGS } from '../../types/disaster';

const SOURCE_LABELS: Record<DisasterSource, string> = {
  eonet: 'NASA EONET',
  usgs: 'USGS Earthquakes',
  firms: 'NASA FIRMS',
  reliefweb: 'ReliefWeb / UN',
};

interface SourceBadgeProps {
  source: DisasterSource;
}

export function SourceBadge({ source }: SourceBadgeProps) {
  const cfg = SOURCE_CONFIGS.find((s) => s.key === source);
  const color = cfg?.color ?? '#888';

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border"
      style={{
        borderColor: color,
        backgroundColor: `${color}20`,
        color,
      }}
    >
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ background: color }}
      />
      {SOURCE_LABELS[source]}
    </span>
  );
}
