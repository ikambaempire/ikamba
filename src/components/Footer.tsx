import { Link } from "react-router-dom";

const ImigongoPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.05] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="imigongo" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M40 0 L80 40 L40 80 L0 40 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M40 15 L65 40 L40 65 L15 40 Z" fill="none" stroke="currentColor" strokeWidth="0.75" />
        <line x1="0" y1="0" x2="80" y2="80" stroke="currentColor" strokeWidth="0.4" />
        <line x1="80" y1="0" x2="0" y2="80" stroke="currentColor" strokeWidth="0.4" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#imigongo)" />
  </svg>
);

const Footer = () => (
  <footer className="relative bg-primary text-primary-foreground overflow-hidden">
    <ImigongoPattern />

    <div className="relative z-10 max-w-7xl mx-auto section-padding">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div className="md:col-span-1">
          <p className="font-heading text-xl font-extrabold tracking-tight mb-3">
            IKAMBA<span className="text-accent">.</span>
          </p>
          <p className="text-sm text-primary-foreground/60 leading-relaxed">
            Structured Communication & Production Systems for organizations that lead.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/40 mb-4">Platform</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/solutions" className="hover:text-primary-foreground transition-colors">Solutions</Link></li>
            <li><Link to="/platform" className="hover:text-primary-foreground transition-colors">Platform</Link></li>
            <li><Link to="/case-studies" className="hover:text-primary-foreground transition-colors">Case Studies</Link></li>
            <li><Link to="/insights" className="hover:text-primary-foreground transition-colors">Insights</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/40 mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/about" className="hover:text-primary-foreground transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-primary-foreground transition-colors">Contact</Link></li>
            <li><Link to="/start-a-project" className="hover:text-primary-foreground transition-colors">Start a Project</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/40 mb-4">Connect</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><a href="#" className="hover:text-primary-foreground transition-colors">LinkedIn</a></li>
            <li><a href="#" className="hover:text-primary-foreground transition-colors">Twitter / X</a></li>
            <li><a href="#" className="hover:text-primary-foreground transition-colors">Instagram</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-primary-foreground/40">© {new Date().getFullYear()} Ikamba Empire Ltd. All rights reserved.</p>
        <p className="text-xs text-primary-foreground/40">Structured production governance.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
