import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import cpcLogo from "@/assets/cpc-logo-full.png";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Training", href: "/training" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={cpcLogo} alt="Correct Professional Consultants Ltd" className="h-8 sm:h-10 w-auto" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href}>
              <Button
                variant="ghost"
                size="sm"
                className={`text-foreground/70 hover:text-primary hover:bg-primary/5 ${location.pathname === link.href ? "text-primary font-semibold" : ""}`}
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <Link to="/auth-redirect">
              <Button variant="outline" size="sm">Dashboard</Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-foreground/70">
                <LogIn size={14} className="mr-1" /> Login
              </Button>
            </Link>
          )}
          <Link to="/contact">
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              <Phone size={14} className="mr-1.5" /> Get a Quote
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            className="p-2 text-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-6 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className={`block py-2 text-sm font-medium ${location.pathname === link.href ? "text-primary font-semibold" : "text-foreground/80 hover:text-primary"}`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <Link to="/auth-redirect" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full mt-2">Dashboard</Button>
                </Link>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full mt-2">
                    <LogIn size={14} className="mr-1" /> Login
                  </Button>
                </Link>
              )}
              <Link to="/contact" onClick={() => setOpen(false)}>
                <Button className="w-full mt-1 bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                  <Phone size={14} className="mr-1.5" /> Get a Quote
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
