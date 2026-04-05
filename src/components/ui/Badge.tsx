interface BadgeProps {
  label: string;
  icon: string;
  color: string;
}

export function Badge({ label, icon, color }: BadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium border"
      style={{
        borderColor: color,
        backgroundColor: `${color}20`,
        color: color,
      }}
    >
      <span className="text-sm">{icon}</span>
      {label}
    </span>
  );
}
