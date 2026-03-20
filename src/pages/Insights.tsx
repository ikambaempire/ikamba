import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Card3D from "@/components/home/Card3D";

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const articles = [
  { title: "Why Storytelling Is the Most Powerful Tool for NGO Communication", category: "Storytelling for NGOs", date: "March 2026", excerpt: "Organizations that invest in storytelling build deeper donor relationships and public trust." },
  { title: "The Art of Documentary Storytelling for Development Organizations", category: "Documentary Storytelling", date: "February 2026", excerpt: "How short documentaries can transform how communities and stakeholders understand your work." },
  { title: "Visual Storytelling Strategies for Impact Communication", category: "Impact Communication", date: "January 2026", excerpt: "Combining photography, video, and narrative to create compelling impact reports." },
  { title: "Building a Storytelling Culture Inside Your Organization", category: "Communication Strategy", date: "December 2025", excerpt: "Why every team member should be part of your storytelling process." },
  { title: "Photography as Evidence: Capturing Stories That Build Trust", category: "Visual Storytelling", date: "November 2025", excerpt: "How authentic photography strengthens credibility and connects audiences to your mission." },
];

const Insights = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="section-padding pt-32 pb-16 md:pt-40">
      <div className="max-w-5xl mx-auto">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-4">
          Ideas & Resources
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
          Insights
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-muted-foreground max-w-2xl mb-16">
          Ideas and resources on storytelling and communication for organizations.
        </motion.p>
        <div className="space-y-6">
          {articles.map((a, i) => (
            <Card3D key={i} className="group">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="bg-card border border-border rounded-xl p-6 shadow-[0_2px_12px_hsl(var(--foreground)/0.04)] hover:shadow-[0_12px_40px_hsl(var(--foreground)/0.1)] hover:border-accent/30 transition-all duration-300 cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] uppercase tracking-widest text-accent font-semibold">{a.category}</span>
                  <span className="text-[10px] text-muted-foreground">{a.date}</span>
                </div>
                <h3 className="text-lg font-bold mb-1">{a.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{a.excerpt}</p>
              </motion.div>
            </Card3D>
          ))}
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default Insights;
