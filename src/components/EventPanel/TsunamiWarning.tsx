export function TsunamiWarning() {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-md border"
      style={{ borderColor: '#00BFFF', background: 'rgba(0,191,255,0.1)' }}
    >
      <span className="text-sm">🌊</span>
      <span className="text-xs font-mono font-semibold uppercase" style={{ color: '#00BFFF' }}>
        Tsunami potential
      </span>
    </div>
  );
}
