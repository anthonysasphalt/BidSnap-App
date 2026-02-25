/**
 * Watermark overlay — appears on every page of the demo
 * "Demo — Powered by BidSnap"
 */
export function Watermark() {
  return (
    <div className="watermark fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Diagonal repeating watermarks */}
      <div className="absolute inset-0 -rotate-12 scale-150">
        {Array.from({ length: 8 }).map((_, row) => (
          <div key={row} className="flex gap-32 mb-32 whitespace-nowrap" style={{ marginLeft: row % 2 === 0 ? 0 : -120 }}>
            {Array.from({ length: 6 }).map((_, col) => (
              <span
                key={col}
                className="text-white/[0.04] text-xl font-bold tracking-widest uppercase select-none"
              >
                Demo — Powered by BidSnap
              </span>
            ))}
          </div>
        ))}
      </div>
      {/* Bottom-right fixed badge */}
      <div className="fixed bottom-4 right-4 z-[10000]">
        <div className="bg-black/60 backdrop-blur-sm border border-white/10 rounded-full px-4 py-1.5 text-xs text-white/50 font-medium tracking-wide">
          Demo — Powered by BidSnap
        </div>
      </div>
    </div>
  );
}
