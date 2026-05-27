import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight, Calculator, BookOpen, Megaphone, GraduationCap,
  Building2, FileCheck, Receipt, Plane, ShieldCheck, Sparkles,
  CheckCircle2, Phone, TrendingUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Card3D from "@/components/home/Card3D";
import cpcLogo from "@/assets/cpc-logo-full.png";

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const services = [
  { icon: Calculator, title: "Taxation Services", desc: "Tax advisory, compliance support, tax filing, and consultation to keep you fully compliant." },
  { icon: BookOpen, title: "Accounting Services", desc: "Bookkeeping, financial reporting, budgeting, and financial analysis for sound decisions." },
  { icon: Megaphone, title: "Digital Marketing", desc: "Social media management, branding, advertising, and content strategy for growth." },
  { icon: GraduationCap, title: "Professional Training", desc: "Practical training for graduates and professionals in tax, accounting, and business." },
  { icon: Building2, title: "Business Registration", desc: "Company registration, deregistration, and relocation procedures across Rwanda." },
  { icon: Plane, title: "Work Permits & Immigration", desc: "End-to-end guidance through work permit applications and immigration compliance." },
  { icon: Receipt, title: "Billing & Debt Recovery", desc: "Efficient billing systems and structured debt recovery to improve cash flow." },
  { icon: FileCheck, title: "Annual Returns Filing", desc: "Timely preparation and submission of annual returns and statutory compliance." },
];

const values = [
  "Professionalism",
  "Integrity",
  "Trust",
  "Excellence",
  "Accountability",
];

const stats = [
  { value: "10+", label: "Years of Expertise" },
  { value: "8", label: "Service Lines" },
  { value: "100%", label: "Client-Focused" },
  { value: "2025", label: "Established" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero — split layout */}
      <section className="relative pt-24 md:pt-28 pb-16 md:pb-24 overflow-hidden gradient-brand text-white">
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 15% 15%, hsl(var(--accent)) 0%, transparent 35%), radial-gradient(circle at 85% 85%, hsl(var(--brand-teal)) 0%, transparent 35%)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: copy */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-3 py-1 mb-5">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-white/90">Professional · Excellence · Trust</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] mb-5 text-balance">
                Smart Consulting for{" "}
                <span className="text-accent">Compliant, Growing</span>{" "}
                Businesses.
              </h1>

              <p className="text-base sm:text-lg text-white/85 max-w-xl leading-relaxed mb-8">
                Correct Professional Consultants (CPC) Ltd delivers reliable taxation, accounting, business registration, digital marketing, and training services to businesses and individuals in Rwanda and beyond.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link to="/contact">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-lg">
                    <Phone size={16} className="mr-2" /> Get a Free Consultation
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white/20 font-semibold">
                    Explore Our Services <ArrowRight className="ml-2" size={16} />
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-white/70">
                {values.map((v) => (
                  <span key={v} className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-accent" /> {v}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Right: brand card */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="relative">
              <div className="relative bg-white rounded-2xl p-8 md:p-10 shadow-2xl">
                <div className="absolute -top-3 -right-3 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
                  Est. 2025
                </div>
                <img src={cpcLogo} alt="CPC Logo" className="h-16 md:h-20 w-auto mb-6" />
                <p className="text-xs uppercase tracking-[0.2em] font-semibold text-primary mb-2">Head Office</p>
                <p className="text-foreground font-semibold mb-1">Yussa City Center (Makuza Plaza)</p>
                <p className="text-muted-foreground text-sm mb-6">Tower B · 8th Floor · KN 48 St, Nyarugenge, Kigali</p>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <p className="text-2xl md:text-3xl font-extrabold text-primary">{s.value}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -z-10 -bottom-6 -right-6 w-32 h-32 bg-accent/30 rounded-full blur-3xl" />
              <div className="absolute -z-10 -top-6 -left-6 w-32 h-32 bg-brand-teal/40 rounded-full blur-3xl" style={{ background: "hsl(var(--brand-teal) / 0.4)" }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} className="mb-10 text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-accent mb-3">What We Do</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">Eight Pillars of Professional Consulting</h2>
            <p className="text-muted-foreground text-lg">
              From tax filing to digital marketing, we combine deep expertise with a structured, client-focused approach.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((s, i) => (
              <Card3D key={i} className="group">
                <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 1}
                  className="bg-card border border-border rounded-xl p-6 h-full hover:border-primary/40 hover:shadow-[0_10px_30px_hsl(var(--primary)/0.1)] transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                    <s.icon className="text-primary group-hover:text-white" size={22} />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </motion.div>
              </Card3D>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/services">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold">
                See All Services <ArrowRight className="ml-2" size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why CPC */}
      <section className="section-padding gradient-navy text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}>
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-accent mb-3">Why Choose CPC</p>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-5">Built on Experience. Driven by Trust.</h2>
            <p className="text-white/80 text-lg leading-relaxed mb-6">
              Founded in 2025 by Tax Advisor Muhire Jean de Dieu, CPC is the product of nearly a decade of professional experience in business management, sales &amp; marketing, and external tax consultancy.
            </p>
            <p className="text-white/70 leading-relaxed mb-8">
              Our clients trust us because we combine technical accuracy, confidentiality, and timely delivery with a deeply client-focused mindset.
            </p>
            <Link to="/about">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                Read Our Story <ArrowRight className="ml-2" size={16} />
              </Button>
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className="grid grid-cols-2 gap-4">
            {[
              { icon: ShieldCheck, t: "Compliance First", d: "Accurate, audit-ready filings every time." },
              { icon: Sparkles, t: "Excellence", d: "We deliver beyond the minimum required." },
              { icon: TrendingUp, t: "Growth Focus", d: "Strategic advice to scale your business." },
              { icon: CheckCircle2, t: "Integrity", d: "Transparent pricing, honest advice." },
            ].map((b, i) => (
              <div key={i} className="bg-white/10 backdrop-blur border border-white/15 rounded-xl p-5 hover:bg-white/15 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center mb-3">
                  <b.icon className="text-accent" size={18} />
                </div>
                <h4 className="font-bold text-white mb-1">{b.t}</h4>
                <p className="text-xs text-white/70 leading-relaxed">{b.d}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
            className="bg-gradient-to-br from-primary to-[hsl(var(--brand-blue-mid))] rounded-2xl p-10 md:p-16 text-white shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-balance">Ready to Get Your Books, Taxes, or Business in Order?</h2>
            <p className="text-white/85 text-lg mb-8 max-w-2xl mx-auto">
              Speak with a CPC advisor today and discover how we can support your compliance, growth, and sustainability.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold w-full sm:w-auto">
                  <Phone size={16} className="mr-2" /> Book a Consultation
                </Button>
              </Link>
              <a href="tel:+250788506194">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur border-white/40 text-white hover:bg-white/20 font-semibold w-full sm:w-auto">
                  Call +250 788 506 194
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
