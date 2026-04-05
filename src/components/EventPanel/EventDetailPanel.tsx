import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../ui/Badge';
import type { EONETEvent } from '../../types/eonet';
import {
  getCategoryConfig,
  getEventCoords,
  formatFullDate,
  formatRelativeDate,
  formatLat,
  formatLng,
} from '../../lib/utils';

interface EventDetailPanelProps {
  event: EONETEvent | null;
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

function EventDetailContent({ event, onClose }: { event: EONETEvent; onClose: () => void }) {
  const config = getCategoryConfig(event);
  const coords = getEventCoords(event);
  const geo = event.geometry[0];
  const isActive = event.closed === null;

  return (
    <div className="p-5 space-y-5">
      {/* Close button */}
      <div className="flex items-start justify-between">
        <Badge label={config.label} icon={config.icon} color={config.color} />
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

      {/* Status */}
      <div className="flex items-center gap-2">
        {isActive ? (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold tracking-wide border border-[var(--green-live)]/40"
            style={{ color: 'var(--green-live)', background: 'rgba(34,197,94,0.1)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--green-live)] animate-pulse-live" />
            ACTIVE
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold tracking-wide text-[var(--text-faint)] border border-[var(--border)]"
            style={{ background: 'rgba(58,77,107,0.15)' }}
          >
            CLOSED
          </span>
        )}
      </div>

      <div className="h-px bg-[var(--border)]" />

      {/* Details grid */}
      <div className="space-y-3.5">
        {geo?.date && (
          <DetailRow
            label="Date"
            value={`${formatFullDate(geo.date)} · ${formatRelativeDate(geo.date)}`}
          />
        )}

        {coords && (
          <DetailRow
            label="Coordinates"
            value={`${formatLat(coords.lat)}, ${formatLng(coords.lng)}`}
            mono
          />
        )}

        {geo?.magnitudeValue != null && (
          <DetailRow
            label="Magnitude"
            value={`${geo.magnitudeValue} ${geo.magnitudeUnit ?? ''}`}
            mono
          />
        )}

        {event.closed && (
          <DetailRow
            label="Closed"
            value={formatFullDate(event.closed)}
          />
        )}
      </div>

      {/* Description */}
      {event.description && (
        <>
          <div className="h-px bg-[var(--border)]" />
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            {event.description}
          </p>
        </>
      )}

      <div className="h-px bg-[var(--border)]" />

      {/* Sources */}
      {event.sources.length > 0 && (
        <div className="space-y-2">
          <span className="text-[11px] font-mono font-semibold tracking-widest text-[var(--text-faint)] uppercase">
            Sources
          </span>
          <div className="space-y-1.5">
            {event.sources.map((source) => (
              <a
                key={source.id}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-mono transition-colors group"
                style={{ color: 'var(--teal)' }}
              >
                <span className="group-hover:underline">{source.id}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-50"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* NASA link */}
      <a
        href={event.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-mono font-semibold transition-all duration-200 hover:brightness-110"
        style={{
          background: 'var(--teal-glow)',
          border: '1px solid var(--teal)',
          color: 'var(--teal)',
        }}
      >
        View on NASA EONET
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
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </a>
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
