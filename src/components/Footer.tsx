import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

// Africa map as dots (simplified outline coordinates, normalized 0-100)
const africaDots: [number, number][] = [
  // North Africa outline
  [35,8],[38,6],[42,5],[46,5],[50,4],[54,5],[58,6],[62,5],[66,6],[70,8],
  [72,10],[68,12],[64,14],[60,16],[58,18],[60,20],[62,18],[66,16],[70,14],
  [72,16],[74,18],[74,22],[72,26],[70,28],[72,30],[74,32],[74,36],[72,38],
  [70,40],[68,42],[70,44],[72,46],[74,48],[72,50],[70,52],[68,54],[66,56],
  [64,58],[62,60],[60,62],[58,64],[56,66],[54,68],[52,70],[50,72],[48,74],
  [46,72],[44,70],[42,68],[40,66],[38,68],[36,70],[34,72],[32,74],[30,76],
  [28,74],[26,72],[24,70],[22,68],[24,66],[26,64],[28,62],[26,60],[24,58],
  [22,56],[20,54],[18,52],[20,50],[22,48],[24,46],[22,44],[20,42],[18,40],
  [20,38],[22,36],[24,34],[26,32],[28,30],[26,28],[24,26],[22,24],[24,22],
  [26,20],[28,18],[30,16],[32,14],[34,12],[36,10],
  // Interior fill dots
  [40,15],[45,12],[50,10],[55,12],[60,10],[48,18],[52,16],[56,14],
  [44,22],[48,20],[52,22],[56,20],[60,24],[64,22],[40,26],[44,28],
  [48,26],[52,28],[56,26],[60,28],[64,28],[36,30],[40,32],[44,34],
  [48,32],[52,34],[56,32],[60,34],[64,34],[68,36],[36,36],[40,38],
  [44,40],[48,38],[52,40],[56,38],[60,40],[64,40],[68,42],[32,40],
  [36,42],[40,44],[44,46],[48,44],[52,46],[56,44],[60,46],[64,48],
  [36,48],[40,50],[44,52],[48,50],[52,52],[56,50],[60,52],[64,54],
  [38,54],[42,56],[46,58],[50,56],[54,58],[58,56],[62,58],
  [40,60],[44,62],[48,60],[52,62],[56,60],[42,64],[46,66],[50,64],
  [54,66],[38,66],[34,68],[36,72],[40,70],[44,68],[48,70],
];

// Rwanda map as dots (simplified, normalized 0-100)
const rwandaDots: [number, number][] = [
  // Outline
  [30,15],[35,12],[40,10],[45,8],[50,10],[55,12],[60,14],[65,16],[70,18],
  [72,22],[70,26],[68,30],[66,34],[68,38],[70,42],[72,46],[70,50],
  [68,54],[66,58],[64,62],[62,66],[60,70],[58,74],[56,78],[54,82],
  [50,84],[46,82],[42,80],[38,78],[34,76],[30,74],[28,70],[26,66],
  [24,62],[26,58],[28,54],[26,50],[24,46],[26,42],[28,38],[26,34],
  [28,30],[26,26],[28,22],[30,18],
  // Interior (Lake Kivu area left, hills right)
  [36,20],[42,18],[48,16],[54,18],[60,20],[66,22],
  [34,28],[38,26],[44,24],[50,22],[56,24],[62,26],[68,28],
  [32,36],[36,34],[42,32],[48,30],[54,32],[60,34],[66,36],
  [30,44],[34,42],[40,40],[46,38],[52,40],[58,42],[64,44],
  [32,52],[36,50],[42,48],[48,46],[54,48],[60,50],[66,52],
  [34,60],[38,58],[44,56],[50,54],[56,56],[62,58],
  [36,66],[40,64],[46,62],[52,60],[58,64],[62,62],
  [38,72],[42,70],[48,68],[54,70],[58,68],
  [40,76],[46,74],[52,76],[56,74],
  [44,80],[50,78],
  // Extra fill
  [38,30],[44,36],[50,34],[56,36],[62,30],
  [40,46],[46,44],[52,44],[58,46],
  [36,54],[42,52],[48,52],[54,52],[60,54],
  [44,66],[50,66],[56,62],
];

const DotMap = ({ dots, color }: { dots: [number, number][]; color: string }) => (
  <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet">
    {dots.map(([x, y], i) => (
      <motion.circle
        key={i}
        cx={x}
        cy={y}
        r="0.8"
        fill={color}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 0.6, 0.4, 0.6], scale: 1 }}
        transition={{
          duration: 0.6,
          delay: i * 0.008,
          opacity: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.02 },
        }}
      />
    ))}
  </svg>
);

const Footer = () => {
  const [showRwanda, setShowRwanda] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setShowRwanda((v) => !v), 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="relative bg-primary text-primary-foreground overflow-hidden">
      {/* Animated map background */}
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence mode="wait">
          {showRwanda ? (
            <motion.div
              key="rwanda"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
            >
              <DotMap dots={rwandaDots} color="hsl(var(--accent) / 0.25)" />
            </motion.div>
          ) : (
            <motion.div
              key="africa"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
            >
              <DotMap dots={africaDots} color="hsl(var(--primary-foreground) / 0.12)" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

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
};

export default Footer;
