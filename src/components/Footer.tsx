import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="gradient-navy text-primary-foreground">
    <div className="max-w-7xl mx-auto section-padding">
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
            <li><a href="#" className="hover:text-primary-foreground transition-colors">Twitter</a></li>
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
