import type { Stage } from '@/lib/db';

// Splits note text on URLs and returns a mix of plain strings and <a> elements
function linkifyNote(text: string): React.ReactNode[] {
  const urlRegex = /https?:\/\/[^\s]+/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <a
        key={match.index}
        href={match[0]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline break-all hover:text-blue-800"
      >
        {match[0]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export function StageTimeline({ stages }: { stages: Stage[] }) {
  return (
    <div>
      {stages.map((stage, i) => (
        <StageRow key={stage.id} stage={stage} isLast={i === stages.length - 1} />
      ))}
    </div>
  );
}

function MfgProgress({
  label,
  completed,
  total,
  unitLabel = 'units',
}: {
  label: string;
  completed: number;
  total: number;
  unitLabel?: string;
}) {
  const pct = Math.min(100, Math.round((completed / total) * 100));
  return (
    <div className="mt-3">
      <div className="flex flex-wrap justify-between items-baseline gap-x-2 gap-y-0.5 mb-1.5">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
        <span className="text-xs font-bold text-gray-700">{completed} / {total} {unitLabel} · {pct}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-3 rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: pct === 100 ? '#22c55e' : '#2563eb',
          }}
        />
      </div>
    </div>
  );
}

function StageRow({ stage, isLast }: { stage: Stage; isLast: boolean }) {
  const isComplete = stage.status === 'complete';
  const isActive = stage.status === 'active';

  const formattedDate = stage.completed_at
    ? new Date(stage.completed_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <div className="flex gap-5">
      {/* Icon + connector */}
      <div className="flex flex-col items-center">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
            isComplete
              ? 'bg-green-500 text-white'
              : isActive
              ? 'bg-blue-600 text-white ring-4 ring-blue-100'
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          {isComplete ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <span className="text-xs font-bold">{stage.id}</span>
          )}
        </div>
        {!isLast && (
          <div className={`w-0.5 flex-1 my-1 min-h-[20px] ${isComplete ? 'bg-green-300' : 'bg-gray-200'}`} />
        )}
      </div>

      {/* Content */}
      <div className={`${isLast ? 'pb-0' : 'pb-7'} flex-1`}>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1.5">
          <span
            className={`font-semibold text-base ${
              isComplete ? 'text-gray-900' : isActive ? 'text-blue-700' : 'text-gray-400'
            }`}
          >
            {stage.name}
          </span>
          {isActive && (
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full">
              In Progress
            </span>
          )}
          {formattedDate && (
            <span className="text-xs text-gray-400 sm:ml-auto">{formattedDate}</span>
          )}
        </div>
        {stage.note && (
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{linkifyNote(stage.note)}</p>
        )}
        {stage.name === 'Shipping' &&
          stage.ship_total != null &&
          stage.ship_total > 0 && (
            <MfgProgress label="Shipping Progress" completed={stage.ship_completed ?? 0} total={stage.ship_total} unitLabel="units shipped" />
          )}
      </div>
    </div>
  );
}
