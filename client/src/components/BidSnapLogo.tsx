/**
 * BidSnap Logo Component
 * Design: Sharp, modern SaaS logo with lightning bolt motif
 * Colors: Electric blue primary with gold accent
 */
export function BidSnapLogo({ size = "md", showText = true }: { size?: "sm" | "md" | "lg"; showText?: boolean }) {
  const sizes = {
    sm: { icon: 24, text: "text-lg" },
    md: { icon: 32, text: "text-2xl" },
    lg: { icon: 48, text: "text-4xl" },
  };
  const s = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <div className="relative" style={{ width: s.icon, height: s.icon }}>
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Outer rounded square */}
          <rect x="2" y="2" width="44" height="44" rx="10" fill="url(#logoGrad)" stroke="url(#borderGrad)" strokeWidth="1.5" />
          {/* Lightning bolt / snap icon */}
          <path d="M28 8L16 26h8l-4 14 16-20h-9l5-12z" fill="url(#boltGrad)" />
          {/* Small crosshair dots for "targeting" feel */}
          <circle cx="12" cy="12" r="1.5" fill="#F59E0B" opacity="0.7" />
          <circle cx="36" cy="36" r="1.5" fill="#F59E0B" opacity="0.7" />
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="48" y2="48">
              <stop offset="0%" stopColor="#0B1120" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="borderGrad" x1="0" y1="0" x2="48" y2="48">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>
            <linearGradient id="boltGrad" x1="16" y1="8" x2="36" y2="40">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="50%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {showText && (
        <span className={`${s.text} font-extrabold tracking-tight`}>
          <span className="text-white">Bid</span>
          <span className="text-gradient">Snap</span>
        </span>
      )}
    </div>
  );
}
