import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight, Calculator, BookOpen, Megaphone, GraduationCap,
  Building2, FileCheck, Receipt, Plane, Phone, CheckCircle2,
} from "lucide-react";
import Card3D from "@/components/home/Card3D";
import solImg from "@/assets/people/images_9.jpg.asset.json";

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const services = [
  {
    icon: Calculator, title: "Taxation Services",
    desc: "Tax advisory, compliance support, tax filing, and consultation services to ensure clients meet legal requirements efficiently.",
    items: ["Tax advisory & planning", "VAT, PAYE & CIT filing", "RRA representation", "Tax audit support"],
  },
  {
    icon: BookOpen, title: "Accounting Services",
    desc: "Bookkeeping, financial reporting, budgeting, and financial analysis to support sound business decision-making.",
    items: ["Monthly bookkeeping", "Financial statements", "Budgeting & forecasting", "Management reporting"],
  },
  {
    icon: Megaphone, title: "Digital Marketing",
    desc: "Online marketing solutions including social media management, branding, advertising, and content strategies.",
    items: ["Social media management", "Brand identity", "Paid ad campaigns", "Content strategy"],
  },
  {
    icon: GraduationCap, title: "Professional Training",
    desc: "Practical training for graduates and professionals in taxation, accounting, business management, and digital marketing.",
    items: ["Taxation training", "Accounting bootcamps", "Business management", "Digital marketing courses"],
  },
  {
    icon: Building2, title: "Business Registration & Deregistration",
    desc: "We assist in business registration across Rwanda and support smooth deregistration processes, including relocation procedures.",
    items: ["RDB company registration", "TIN & VAT registration", "Deregistration", "Relocation procedures"],
  },
  {
    icon: Plane, title: "Work Permits & Immigration Support",
    desc: "Guidance through work permit applications and immigration processes to ensure full legal compliance.",
    items: ["Work permit applications", "Residence permits", "Visa support", "Compliance follow-up"],
  },
  {
    icon: Receipt, title: "Billing & Debt Recovery",
    desc: "Improve cash flow through efficient billing systems and structured debt recovery services.",
    items: ["Invoicing setup", "Receivables management", "Debt collection", "Cash flow advisory"],
  },
  {
    icon: FileCheck, title: "Annual Returns Filing",
    desc: "Timely preparation and submission of annual returns and other statutory compliance requirements.",
    items: ["RDB annual returns", "Statutory filings", "Compliance calendar", "Late-filing recovery"],
  },
];

const Services = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <section className="pt-28 md:pt-32 pb-12 md:pb-16 gradient-brand text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs uppercase tracking-[0.2em] font-semibold text-white/80 mb-4">
          Our Services
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-balance">
          Eight Service Lines Built Around Your Business
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-lg text-white/80 max-w-2xl">
          We provide reliable, high-quality consulting in taxation, accounting, business management, digital marketing, and training — all under one roof.
        </motion.p>
      </div>
    </section>

    {/* Humanizing banner */}
    <section className="relative h-56 md:h-72 overflow-hidden">
      <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80" alt="Professional consulting team in discussion" className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent" />
      <div className="absolute inset-0 flex items-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
        <p className="text-white text-xl md:text-2xl font-bold max-w-lg">Real advisors. Real results. Real businesses across Rwanda.</p>
      </div>
    </section>


    <section className="section-padding">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <Card3D key={i} className="group">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="bg-card border border-border rounded-xl p-7 h-full hover:border-primary/40 hover:shadow-[0_10px_30px_hsl(var(--primary)/0.1)] transition-all duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <s.icon className="text-primary" size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1">{s.desc}</p>
                  </div>
                </div>
                <ul className="space-y-2 mt-4 pt-4 border-t border-border">
                  {s.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-sm text-foreground/80">
                      <CheckCircle2 size={14} className="text-accent shrink-0 mt-0.5" /> {it}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </Card3D>
          ))}
        </div>

        <div className="mt-14 text-center bg-secondary rounded-2xl p-10">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3 text-foreground">Not sure which service you need?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">Tell us about your business and our advisors will recommend the best mix of services.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                <Phone size={16} className="mr-2" /> Book a Free Consultation
              </Button>
            </Link>
            <a href="tel:+250788506194">
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold">
                Call +250 788 506 194 <ArrowRight className="ml-2" size={16} />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default Services;
