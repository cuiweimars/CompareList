"use client";

interface VennDiagramProps {
  totalA: number;
  totalB: number;
  common: number;
  onlyA: number;
  onlyB: number;
}

export default function VennDiagram({ onlyA, onlyB, common }: VennDiagramProps) {
  const maxVal = Math.max(onlyA, onlyB, common, 1);
  const scale = 55;
  const rA = Math.max(28, Math.sqrt((onlyA + common) / maxVal) * scale);
  const rB = Math.max(28, Math.sqrt((onlyB + common) / maxVal) * scale);
  const overlap = common > 0 ? Math.max(12, (common / maxVal) * 35) : 0;
  const cx1 = 100 - overlap / 2;
  const cx2 = 100 + overlap / 2;
  const cy = 80;

  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
        <span className="text-[10px] uppercase tracking-widest text-text-muted font-medium">
          Visual Overview
        </span>
      </div>
      <svg viewBox="0 0 200 160" className="w-full max-w-[220px] mx-auto">
        <defs>
          <filter id="glow-a">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glow-b">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <linearGradient id="grad-a" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="grad-b" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <circle cx={cx1} cy={cy} r={rA} fill="url(#grad-a)" stroke="#818cf8" strokeWidth={1} strokeOpacity={0.5} filter="url(#glow-a)" className="cursor-pointer hover:opacity-80 transition-opacity" >
          <title>List A: {onlyA} unique, {common} shared</title>
        </circle>
        <circle cx={cx2} cy={cy} r={rB} fill="url(#grad-b)" stroke="#22d3ee" strokeWidth={1} strokeOpacity={0.5} filter="url(#glow-b)" className="cursor-pointer hover:opacity-80 transition-opacity" >
          <title>List B: {onlyB} unique, {common} shared</title>
        </circle>
        {onlyA > 0 && (
          <text x={cx1 - rA / 2.5} y={cy + 4} textAnchor="middle" className="text-[11px] font-bold fill-primary font-[family-name:var(--font-sora)]">
            {onlyA}
          </text>
        )}
        {common > 0 && (
          <text x={(cx1 + cx2) / 2} y={cy + 4} textAnchor="middle" className="text-[11px] font-bold fill-success font-[family-name:var(--font-sora)]">
            {common}
          </text>
        )}
        {onlyB > 0 && (
          <text x={cx2 + rB / 2.5} y={cy + 4} textAnchor="middle" className="text-[11px] font-bold fill-accent font-[family-name:var(--font-sora)]">
            {onlyB}
          </text>
        )}
        <text x={cx1 - rA / 2} y={152} textAnchor="middle" className="text-[7px] fill-text-muted uppercase tracking-wider">List A</text>
        <text x={cx2 + rB / 2} y={152} textAnchor="middle" className="text-[7px] fill-text-muted uppercase tracking-wider">List B</text>
      </svg>
    </div>
  );
}
