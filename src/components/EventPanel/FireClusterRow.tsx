interface FireClusterRowProps {
  count?: number;
}

export function FireClusterRow({ count }: FireClusterRowProps) {
  if (count == null) return null;

  return (
    <div>
      <span className="text-[11px] font-mono font-semibold tracking-widest text-[var(--text-faint)] uppercase block mb-0.5">
        Fire Detections
      </span>
      <span className="text-sm font-mono text-[var(--text)]">
        {count.toLocaleString()} hotspot{count !== 1 ? 's' : ''} in cluster
      </span>
    </div>
  );
}
