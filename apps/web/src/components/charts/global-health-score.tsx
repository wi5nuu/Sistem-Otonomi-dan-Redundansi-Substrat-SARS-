interface GlobalHealthScoreProps {
  score: number;
}

export function GlobalHealthScore({ score }: GlobalHealthScoreProps) {
  const color = score >= 90 ? 'text-green-400' : score >= 70 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="flex items-center gap-3 rounded-lg border border-sars-800 bg-sars-900 px-4 py-2">
      <div className="text-right">
        <p className="text-xs text-sars-400">Global Health</p>
        <p className={`text-2xl font-bold ${color}`}>{score}</p>
      </div>
      <svg className="h-12 w-12 -rotate-90">
        <circle
          cx="24" cy="24" r="20"
          fill="none" stroke="#1e3a5f" strokeWidth="4"
        />
        <circle
          cx="24" cy="24" r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray={`${2 * Math.PI * 20 * score / 100} ${2 * Math.PI * 20 * (100 - score) / 100}`}
          className={color}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
