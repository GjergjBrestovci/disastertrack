interface FRPRowProps {
  frp?: number;
}

export function FRPRow({ frp }: FRPRowProps) {
  if (frp == null) return null;

  return (
    <div>
      <span className="text-[11px] font-mono font-semibold tracking-widest text-[var(--text-faint)] uppercase block mb-0.5">
        Fire Radiative Power
      </span>
      <span className="text-sm font-mono text-[var(--text)]">
        {frp.toFixed(1)} MW
      </span>
    </div>
  );
}
