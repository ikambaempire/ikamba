import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Film, Video, Image, Megaphone, Users, FileSearch } from "lucide-react";
import Card3D from "@/components/home/Card3D";

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const allSolutions = [
  { icon: Film, title: "Documentary Production", desc: "We produce short documentaries that highlight real stories, community impact, and organizational achievements. From concept through final cut, we manage the entire production process." },
  { icon: Video, title: "Video Production", desc: "Professional video production for campaigns, programs, interviews, and events. Cinematic quality with structured workflows and clear timelines." },
  { icon: Image, title: "Photography for Impact Storytelling", desc: "High-quality photography capturing communities, initiatives, and leadership stories. Images that tell powerful visual narratives." },
  { icon: Megaphone, title: "Campaign Storytelling", desc: "Visual storytelling designed for advocacy campaigns and communication initiatives. Multi-format content that amplifies your message across platforms." },
  { icon: Users, title: "NGO Storytelling", desc: "Specialized storytelling solutions for nonprofit organizations and development partners. We understand the unique needs and sensitivities of impact communication." },
  { icon: FileSearch, title: "Content Strategy", desc: "Strategic communication planning that identifies the right stories, audiences, and formats to maximize organizational impact." },
];

const Solutions = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="section-padding pt-32 pb-16 md:pt-40">
      <div className="max-w-5xl mx-auto">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-4">
          What We Do
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-balance">
          Storytelling & Media Production Solutions
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-lg text-muted-foreground max-w-2xl mb-16">
          Ikamba Media provides storytelling and media production solutions designed for organizations that want to communicate their work clearly and effectively.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {allSolutions.map((s, i) => (
            <Card3D key={i} className="group">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="bg-card border border-border rounded-xl p-8 h-full shadow-[0_2px_12px_hsl(var(--foreground)/0.04)] hover:shadow-[0_12px_40px_hsl(var(--foreground)/0.1)] hover:border-accent/30 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                  <s.icon className="text-accent" size={24} />
                </div>
                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            </Card3D>
          ))}
        </div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={8}
          className="mt-16 text-center">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/start-a-project">
              <Button variant="hero" size="lg">
                Start a Project <ArrowRight className="ml-1" size={16} />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="font-semibold">
                Book Consultation
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
    <Footer />
  </div>
);

export default Solutions;
