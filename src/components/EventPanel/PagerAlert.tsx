const ALERT_COLORS: Record<string, string> = {
  green: '#22C55E',
  yellow: '#EAB308',
  orange: '#F97316',
  red: '#EF4444',
};

interface PagerAlertProps {
  level: string;
}

export function PagerAlert({ level }: PagerAlertProps) {
  const color = ALERT_COLORS[level] ?? '#888';

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-md border" style={{ borderColor: color, background: `${color}15` }}>
      <span className="w-3 h-3 rounded-full" style={{ background: color }} />
      <span className="text-xs font-mono font-semibold uppercase" style={{ color }}>
        PAGER: {level}
      </span>
    </div>
  );
}
