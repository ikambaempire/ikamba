import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, Film, Clapperboard, Aperture, Focus, MonitorPlay } from "lucide-react";

const Footer = () => (
  <footer className="relative bg-primary text-primary-foreground overflow-hidden">
    {/* Floating creative icons — same style as hero */}
    {[
      { Icon: Camera, x: "6%", y: "15%", size: 22, delay: 0.3, dur: 7 },
      { Icon: Film, x: "85%", y: "10%", size: 20, delay: 1, dur: 6 },
      { Icon: Clapperboard, x: "90%", y: "60%", size: 18, delay: 0.6, dur: 8 },
      { Icon: Aperture, x: "4%", y: "70%", size: 16, delay: 1.5, dur: 5.5 },
      { Icon: Focus, x: "75%", y: "80%", size: 16, delay: 2, dur: 6.5 },
      { Icon: MonitorPlay, x: "20%", y: "85%", size: 18, delay: 0.8, dur: 7 },
    ].map(({ Icon, x, y, size, delay, dur }, i) => (
      <motion.div
        key={i}
        className="absolute pointer-events-none text-primary-foreground/10"
        style={{ left: x, top: y }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{
          opacity: [0, 0.5, 0.25, 0.5, 0],
          scale: [0.5, 1, 1.1, 1, 0.5],
          y: [0, -10, 0, 10, 0],
          rotate: [0, 5, -5, 3, 0],
        }}
        transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
      >
        <Icon size={size} />
      </motion.div>
    ))}

    {/* Light streaks */}
    <motion.div
      className="absolute w-[500px] h-[1px] bg-gradient-to-r from-transparent via-accent/15 to-transparent pointer-events-none"
      style={{ top: "35%", left: "-250px", rotate: "-10deg" }}
      animate={{ x: ["-250px", "calc(100vw + 250px)"] }}
      transition={{ duration: 5, delay: 2, repeat: Infinity, repeatDelay: 10, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute w-[300px] h-[1px] bg-gradient-to-r from-transparent via-primary-foreground/8 to-transparent pointer-events-none"
      style={{ top: "65%", left: "-150px", rotate: "-6deg" }}
      animate={{ x: ["-150px", "calc(100vw + 150px)"] }}
      transition={{ duration: 4, delay: 7, repeat: Infinity, repeatDelay: 12, ease: "easeInOut" }}
    />

    {/* Soft glow */}
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
      style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.06) 0%, transparent 70%)" }}
      animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />

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
