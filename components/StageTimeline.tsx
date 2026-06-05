import type { Stage } from '@/lib/db';

export function StageTimeline({ stages }: { stages: Stage[] }) {
  return (
    <div>
      {stages.map((stage, i) => (
        <StageRow key={stage.id} stage={stage} isLast={i === stages.length - 1} />
      ))}
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
        <div className="flex items-center gap-2 pt-1.5">
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
            <span className="text-xs text-gray-400 ml-auto">{formattedDate}</span>
          )}
        </div>
        {stage.note && (
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{stage.note}</p>
        )}
      </div>
    </div>
  );
}
