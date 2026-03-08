import { Link } from "react-router-dom";

// SVG pattern inspired by Imigongo (Rwandan geometric art) — bold black/white/accent lines
const ImigongoPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="imigongo" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        {/* Diamond / chevron motif */}
        <path d="M40 0 L80 40 L40 80 L0 40 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M40 10 L70 40 L40 70 L10 40 Z" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M40 20 L60 40 L40 60 L20 40 Z" fill="none" stroke="currentColor" strokeWidth="0.75" />
        {/* Cross lines */}
        <line x1="0" y1="0" x2="80" y2="80" stroke="currentColor" strokeWidth="0.5" />
        <line x1="80" y1="0" x2="0" y2="80" stroke="currentColor" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#imigongo)" />
  </svg>
);

// Kente-inspired horizontal band
const KenteBand = () => (
  <div className="w-full h-2 flex overflow-hidden">
    {Array.from({ length: 40 }).map((_, i) => (
      <div
        key={i}
        className="flex-shrink-0 h-full"
        style={{
          width: "2.5%",
          background:
            i % 4 === 0
              ? "hsl(var(--accent))"
              : i % 4 === 1
              ? "hsl(var(--navy-light))"
              : i % 4 === 2
              ? "hsl(var(--accent) / 0.6)"
              : "hsl(var(--primary-foreground) / 0.15)",
        }}
      />
    ))}
  </div>
);

// Adinkra-inspired decorative symbols
const AdinkraSymbol = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 40 40" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    {/* Sankofa-inspired spiral */}
    <circle cx="20" cy="20" r="12" />
    <path d="M20 8 Q32 20 20 32 Q8 20 20 8" />
    <circle cx="20" cy="14" r="2" fill="currentColor" />
  </svg>
);

const Footer = () => (
  <footer className="relative bg-primary text-primary-foreground overflow-hidden">
    {/* Kente-inspired top band */}
    <KenteBand />

    {/* Imigongo background pattern */}
    <ImigongoPattern />

    {/* Accent glow */}
    <div
      className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full pointer-events-none"
      style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.06) 0%, transparent 70%)" }}
    />
    <div
      className="absolute -top-20 -left-20 w-[300px] h-[300px] rounded-full pointer-events-none"
      style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.04) 0%, transparent 70%)" }}
    />

    <div className="relative z-10 max-w-7xl mx-auto section-padding">
      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <p className="font-heading text-2xl font-extrabold tracking-tight">
              IKAMBA<span className="text-accent">.</span>
            </p>
            <AdinkraSymbol className="w-6 h-6 text-accent/40" />
          </div>
          <p className="text-sm text-primary-foreground/60 leading-relaxed mb-6">
            Structured Communication & Production Systems for organizations that lead.
          </p>
          {/* Imigongo-inspired mini art block */}
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="relative w-8 h-8">
                <svg viewBox="0 0 32 32" className="w-full h-full">
                  <rect
                    x="1" y="1" width="30" height="30"
                    fill="none"
                    stroke="hsl(var(--primary-foreground) / 0.15)"
                    strokeWidth="1"
                  />
                  <path
                    d={
                      i % 3 === 0
                        ? "M0 0 L32 32 M32 0 L0 32"
                        : i % 3 === 1
                        ? "M16 0 L32 16 L16 32 L0 16 Z"
                        : "M0 16 L16 0 L32 16 L16 32 Z"
                    }
                    fill="none"
                    stroke={i === 2 ? "hsl(var(--accent) / 0.5)" : "hsl(var(--primary-foreground) / 0.2)"}
                    strokeWidth="1"
                  />
                </svg>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-accent mb-4 flex items-center gap-2">
            <span className="w-4 h-[1px] bg-accent/50" />
            Platform
          </h4>
          <ul className="space-y-3 text-sm text-primary-foreground/70">
            <li><Link to="/solutions" className="hover:text-accent transition-colors">Solutions</Link></li>
            <li><Link to="/platform" className="hover:text-accent transition-colors">Platform</Link></li>
            <li><Link to="/case-studies" className="hover:text-accent transition-colors">Case Studies</Link></li>
            <li><Link to="/insights" className="hover:text-accent transition-colors">Insights</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-accent mb-4 flex items-center gap-2">
            <span className="w-4 h-[1px] bg-accent/50" />
            Company
          </h4>
          <ul className="space-y-3 text-sm text-primary-foreground/70">
            <li><Link to="/about" className="hover:text-accent transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
            <li><Link to="/start-a-project" className="hover:text-accent transition-colors">Start a Project</Link></li>
            <li><Link to="/login" className="hover:text-accent transition-colors">Sign In</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-accent mb-4 flex items-center gap-2">
            <span className="w-4 h-[1px] bg-accent/50" />
            Connect
          </h4>
          <ul className="space-y-3 text-sm text-primary-foreground/70">
            <li><a href="#" className="hover:text-accent transition-colors">LinkedIn</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Twitter / X</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Instagram</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">YouTube</a></li>
          </ul>
        </div>
      </div>

      {/* Geometric divider — Imigongo-inspired zigzag */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-[1px] bg-primary-foreground/10" />
        <svg viewBox="0 0 120 12" className="w-24 h-3 text-accent/30">
          <path d="M0 6 L10 0 L20 6 L30 0 L40 6 L50 0 L60 6 L70 0 L80 6 L90 0 L100 6 L110 0 L120 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0 6 L10 12 L20 6 L30 12 L40 6 L50 12 L60 6 L70 12 L80 6 L90 12 L100 6 L110 12 L120 6" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <div className="flex-1 h-[1px] bg-primary-foreground/10" />
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-primary-foreground/40">
          © {new Date().getFullYear()} Ikamba Empire Ltd. All rights reserved.
        </p>
        <p className="text-xs text-primary-foreground/40 italic">
          Rooted in structure. Inspired by heritage.
        </p>
      </div>
    </div>

    {/* Bottom Kente band */}
    <KenteBand />
  </footer>
);

export default Footer;
