'use client';

export function WorldMap() {
  return (
    <div className="relative w-full h-[400px] bg-sars-900/50 rounded-lg border border-sars-800/50 overflow-hidden">
      <div className="absolute top-[30%] left-[15%] w-3 h-3 rounded-full bg-green-500 animate-pulse" title="AMERICAS" />
      <div className="absolute top-[25%] left-[45%] w-3 h-3 rounded-full bg-green-500 animate-pulse" title="EUROPE" />
      <div className="absolute top-[40%] left-[65%] w-3 h-3 rounded-full bg-yellow-500 animate-pulse" title="APAC" />
      <div className="absolute top-[50%] left-[48%] w-3 h-3 rounded-full bg-green-500 animate-pulse" title="AFRICA" />
      <div className="absolute top-[15%] left-[70%] w-3 h-3 rounded-full bg-red-500 animate-pulse" title="ARCTIC" />
      <svg className="w-full h-full opacity-20" viewBox="0 0 800 400">
        <ellipse cx="400" cy="200" rx="350" ry="180" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </svg>
    </div>
  );
}
