interface MagnitudeRowProps {
  magnitude?: number;
  depth?: number;
}

export function MagnitudeRow({ magnitude, depth }: MagnitudeRowProps) {
  if (magnitude == null) return null;

  return (
    <div className="space-y-1">
      <div>
        <span className="text-[11px] font-mono font-semibold tracking-widest text-[var(--text-faint)] uppercase block mb-0.5">
          Magnitude
        </span>
        <span className="text-sm font-mono text-[var(--text)]">
          M{magnitude.toFixed(1)}
        </span>
      </div>
      {depth != null && (
        <div>
          <span className="text-[11px] font-mono font-semibold tracking-widest text-[var(--text-faint)] uppercase block mb-0.5">
            Depth
          </span>
          <span className="text-sm font-mono text-[var(--text)]">
            {depth.toFixed(1)} km
          </span>
        </div>
      )}
    </div>
  );
}
