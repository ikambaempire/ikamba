import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Target, ShieldCheck, Users, Layers } from "lucide-react";

const values = [
  { icon: Target, title: "Structured by Design", desc: "Every engagement follows a documented production governance framework." },
  { icon: ShieldCheck, title: "Accountability First", desc: "Clear ownership, approval chains, and revision protocols on every project." },
  { icon: Users, title: "Client-Centric Systems", desc: "Private workspaces, transparent tracking, and secure asset delivery." },
  { icon: Layers, title: "Built for Scale", desc: "Systems designed to grow with organizational complexity." },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="section-padding pt-32 pb-16 md:pt-40">
      <div className="max-w-5xl mx-auto">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-4">
          Who We Are
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 text-balance">
          A Communication & Production Systems Partner
        </motion.h1>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-muted-foreground max-w-2xl space-y-4 mb-16">
          <p className="text-lg leading-relaxed">
            Ikamba Empire Ltd is a structured communication and production systems partner serving corporates, NGOs, and institutions.
          </p>
          <p className="leading-relaxed">
            We don't operate like a traditional creative agency. We build production governance systems — frameworks that help communication teams plan, produce, track, and archive content with discipline and accountability.
          </p>
          <p className="leading-relaxed">
            Our approach is rooted in the belief that great organizational storytelling requires structure, not just creativity. Every project follows a documented 4-step production system with clear milestones, approval protocols, and archival procedures.
          </p>
        </motion.div>

        <h2 className="text-2xl font-bold mb-8">Our Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {values.map((v, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-surface-elevated border border-border rounded-lg p-6">
              <v.icon className="text-accent mb-3" size={22} />
              <h3 className="text-base font-bold mb-1">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default About;
