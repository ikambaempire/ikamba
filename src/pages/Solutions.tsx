import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Video, BarChart3, Layers, ShieldCheck, Megaphone, FileSearch } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const allSolutions = [
  { icon: Video, title: "Video & Motion Production", desc: "Corporate films, social content, animations, explainers, and campaign visuals — all produced through a structured workflow with documented milestones." },
  { icon: BarChart3, title: "Content Strategy & Planning", desc: "Editorial calendars, messaging frameworks, audience mapping, and distribution systems designed for internal communication teams." },
  { icon: Layers, title: "Brand & Identity Systems", desc: "Visual identity governance, brand guideline development, template systems, and asset standardization across departments." },
  { icon: ShieldCheck, title: "Production Governance", desc: "Workflow structuring, approval protocols, revision management, and archival systems that create operational discipline." },
  { icon: Megaphone, title: "Campaign Production", desc: "End-to-end campaign execution from brief through multi-format delivery, with structured timelines and approval checkpoints." },
  { icon: FileSearch, title: "Content Audit & Archival", desc: "Systematic review, categorization, and structured archival of existing organizational content assets." },
];

const Solutions = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="section-padding pt-32 pb-16 md:pt-40">
      <div className="max-w-5xl mx-auto">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-4">
          What We Do
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-balance">
          Solutions Built for Structured Production
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-muted-foreground max-w-2xl mb-16">
          Every solution we offer follows a governed production framework — from intake to archive.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {allSolutions.map((s, i) => (
            <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="bg-surface-elevated border border-border rounded-lg p-8 hover:shadow-md transition-shadow">
              <s.icon className="text-accent mb-4" size={24} />
              <h3 className="text-lg font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default Solutions;
