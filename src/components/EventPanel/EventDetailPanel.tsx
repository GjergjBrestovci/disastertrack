import { motion, AnimatePresence } from 'framer-motion';
import { SourceBadge } from './SourceBadge';
import { PagerAlert } from './PagerAlert';
import { MagnitudeRow } from './MagnitudeRow';
import { FRPRow } from './FRPRow';
import { FireClusterRow } from './FireClusterRow';
import { TsunamiWarning } from './TsunamiWarning';
import type { NormalizedDisaster } from '../../types/disaster';
import { formatFullDate, formatRelativeDate, formatLat, formatLng } from '../../lib/utils';

interface EventDetailPanelProps {
  event: NormalizedDisaster | null;
  onClose: () => void;
}

export function EventDetailPanel({ event, onClose }: EventDetailPanelProps) {
  return (
    <AnimatePresence>
      {event && (
        <motion.aside
          key={event.id}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-14 right-0 bottom-0 w-[380px] z-40 flex flex-col overflow-y-auto custom-scrollbar"
          style={{
            background: 'var(--bg-panel)',
            backdropFilter: 'blur(16px)',
            borderLeft: '1px solid var(--border)',
          }}
        >
          <EventDetailContent event={event} onClose={onClose} />
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function EventDetailContent({ event, onClose }: { event: NormalizedDisaster; onClose: () => void }) {
  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <SourceBadge source={event.source} />
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-md text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-raised)] transition-colors -mt-1 -mr-1"
        >
          ✕
        </button>
      </div>

      {/* Title */}
      <h2 className="text-xl font-display font-bold text-[var(--text)] leading-tight">
        {event.title}
      </h2>

      <div className="h-px bg-[var(--border)]" />

      {/* Common details */}
      <div className="space-y-3.5">
        {event.date && (
          <DetailRow
            label="Date"
            value={`${formatFullDate(event.date)} \u00B7 ${formatRelativeDate(event.date)}`}
          />
        )}

        <DetailRow
          label="Coordinates"
          value={`${formatLat(event.lat)}, ${formatLng(event.lng)}`}
          mono
        />

        {/* USGS-specific */}
        {event.source === 'usgs' && (
          <>
            <MagnitudeRow magnitude={event.meta?.magnitude} depth={event.meta?.depth} />
            {event.meta?.tsunami && <TsunamiWarning />}
            {event.meta?.alert && <PagerAlert level={event.meta.alert} />}
          </>
        )}

        {/* FIRMS-specific */}
        {event.source === 'firms' && (
          <>
            <FRPRow frp={event.meta?.frp} />
            <FireClusterRow count={event.meta?.fireCount} />
          </>
        )}

        {/* GDACS-specific */}
        {event.source === 'gdacs' && (
          <>
            {event.meta?.alertLevel && (
              <DetailRow label="Alert Level" value={event.meta.alertLevel} />
            )}
            {event.meta?.severity && (
              <DetailRow label="Severity" value={event.meta.severity} />
            )}
            {event.meta?.country && (
              <DetailRow label="Country" value={event.meta.country} />
            )}
          </>
        )}
      </div>

      {/* Description */}
      {event.description && (
        <>
          <div className="h-px bg-[var(--border)]" />
          <p className="text-sm text-[var(--text-muted)] leading-relaxed line-clamp-6">
            {event.description}
          </p>
        </>
      )}

      {/* External link */}
      {event.externalUrl && (
        <>
          <div className="h-px bg-[var(--border)]" />
          <a
            href={event.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-mono font-semibold transition-all duration-200 hover:brightness-110"
            style={{
              background: 'var(--teal-glow)',
              border: '1px solid var(--teal)',
              color: 'var(--teal)',
            }}
          >
            View Details
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </>
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <span className="text-[11px] font-mono font-semibold tracking-widest text-[var(--text-faint)] uppercase block mb-0.5">
        {label}
      </span>
      <span
        className={`text-sm text-[var(--text)] ${mono ? 'font-mono' : ''}`}
      >
        {value}
      </span>
    </div>
  );
}
