import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import cpcLogo from "@/assets/cpc-logo-full.png";

const Footer = () => (
  <footer className="relative bg-primary text-primary-foreground">
    <div className="absolute inset-0 opacity-10 pointer-events-none"
      style={{ backgroundImage: "radial-gradient(circle at 20% 20%, hsl(var(--accent)) 0%, transparent 40%), radial-gradient(circle at 80% 80%, hsl(var(--brand-teal)) 0%, transparent 40%)" }} />

    <div className="relative z-10 max-w-7xl mx-auto section-padding">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg p-3 inline-block mb-4">
            <img src={cpcLogo} alt="Correct Professional Consultants Ltd" className="h-10 w-auto" />
          </div>
          <p className="text-sm text-primary-foreground/70 leading-relaxed mb-4">
            Professional consulting in taxation, accounting, business management, digital marketing, and training.
          </p>
          <p className="text-xs italic text-accent font-semibold">
            "Professional, Excellence &amp; Trust"
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/50 mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
            <li><Link to="/services" className="hover:text-accent transition-colors">Services</Link></li>
            <li><Link to="/training" className="hover:text-accent transition-colors">Training</Link></li>
            <li><Link to="/about" className="hover:text-accent transition-colors">About</Link></li>
            <li><Link to="/contact" className="hover:text-accent transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/50 mb-4">Connect</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li className="flex items-center gap-2"><Facebook size={14} /> Correct Professional Consultants Ltd</li>
            <li className="flex items-center gap-2"><Instagram size={14} /> Correct Professional Consultants Ltd</li>
            <li className="flex items-center gap-2"><Youtube size={14} /> CPC Ltd TV</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/50 mb-4">Head Office</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-2">
              <MapPin size={14} className="text-accent shrink-0 mt-0.5" />
              <span>KN 48 Street, Nyarugenge<br/>Yussa City Center (Makuza Plaza)<br/>Tower B, 8th Floor, Kigali</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={14} className="text-accent" />
              <span>+250 788 506 194 / +250 781 722 386</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-accent" />
              <span className="break-all">correctprofesionalconsultants@gmail.com</span>
            </li>
          </ul>
          <Link to="/contact" className="block mt-4">
            <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold w-full">
              Get a Free Quote <ArrowRight className="ml-1" size={14} />
            </Button>
          </Link>
        </div>
      </div>

      <div className="border-t border-primary-foreground/15 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-primary-foreground/60">© {new Date().getFullYear()} Correct Professional Consultants Ltd. All rights reserved.</p>
        <p className="text-xs text-primary-foreground/60">Professionalism · Integrity · Excellence</p>
      </div>
    </div>
  </footer>
);

export default Footer;
