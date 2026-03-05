import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

const articles = [
  { title: "Why Most Corporate Videos Fail Before Production Begins", category: "Production Governance", date: "March 2026", excerpt: "The problem isn't production quality — it's the absence of structure before cameras roll." },
  { title: "The Case for Structured Content Systems in Large Organizations", category: "Systems Thinking", date: "February 2026", excerpt: "When every department produces content differently, brand consistency becomes impossible." },
  { title: "From Chaos to Clarity: Building Your First Production Playbook", category: "Operations", date: "January 2026", excerpt: "A practical framework for communication teams ready to move beyond ad-hoc production." },
  { title: "Revision Fatigue: How Undefined Approval Chains Kill Production Timelines", category: "Workflow Design", date: "December 2025", excerpt: "Every undefined approval chain adds days. Here's how to structure revision cycles." },
  { title: "The Archive Problem: Why Organizations Lose Their Own Content", category: "Asset Management", date: "November 2025", excerpt: "Most organizations can't find content they produced six months ago. That's a governance failure." },
];

const Insights = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="section-padding pt-32 pb-16 md:pt-40">
      <div className="max-w-5xl mx-auto">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-4">
          Perspectives
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
          Insights
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-muted-foreground max-w-2xl mb-16">
          Perspectives on structured communication, production systems, and organizational storytelling.
        </motion.p>
        <div className="space-y-6">
          {articles.map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="bg-surface-elevated border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] uppercase tracking-widest text-accent font-semibold">{a.category}</span>
                <span className="text-[10px] text-muted-foreground">{a.date}</span>
              </div>
              <h3 className="text-lg font-bold mb-1">{a.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{a.excerpt}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default Insights;
