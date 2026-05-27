import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight, Target, Eye, ShieldCheck, Award, Handshake, Sparkles, Users,
} from "lucide-react";
import Card3D from "@/components/home/Card3D";

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const values = [
  { icon: Award, title: "Professionalism", desc: "We uphold the highest professional standards in every engagement." },
  { icon: ShieldCheck, title: "Integrity", desc: "Honest, transparent, and ethical advice — always." },
  { icon: Handshake, title: "Trust", desc: "Confidentiality and reliability are at the core of our relationships." },
  { icon: Sparkles, title: "Excellence", desc: "We deliver work that exceeds client expectations." },
  { icon: Users, title: "Accountability", desc: "We take ownership of outcomes and timelines." },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <section className="pt-28 md:pt-32 pb-12 md:pb-16 gradient-brand text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs uppercase tracking-[0.2em] font-semibold text-white/80 mb-4">
          About CPC Ltd
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 text-balance">
          A Professional Consulting Firm Built on Experience and Trust
        </motion.h1>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-white/85 max-w-3xl space-y-4">
          <p className="text-lg leading-relaxed">
            Correct Professional Consultants (CPC) Ltd is a professional consulting firm established in 2025 by Tax Advisor Muhire Jean de Dieu.
          </p>
          <p className="leading-relaxed">
            The company was founded to provide reliable and high-quality services in taxation, accounting, business management, digital marketing, and professional training for businesses and individuals — built on extensive professional experience gained over many years.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="section-padding">
      <div className="max-w-6xl mx-auto">
        {/* Mission / Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
            className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-10 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
              <Target className="text-accent" size={22} />
            </div>
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-primary-foreground/60 mb-2">Our Mission</p>
            <p className="text-lg md:text-xl font-bold leading-relaxed">
              To provide professional, efficient, and client-focused services that support business compliance, growth, and sustainability.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className="bg-card border border-border rounded-2xl p-8 md:p-10 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Eye className="text-primary" size={22} />
            </div>
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-2">Our Vision</p>
            <p className="text-lg md:text-xl font-bold leading-relaxed text-foreground">
              To become a leading professional consulting firm delivering reliable, innovative, and high-quality business solutions in Rwanda and beyond.
            </p>
          </motion.div>
        </div>

        {/* History */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
          className="mb-16">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-accent mb-3">Our Story</p>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6 text-foreground">From Tax Advisor to Trusted Consulting Firm</h2>
          <div className="space-y-4 text-foreground/80 leading-relaxed max-w-3xl">
            <p>
              Our founder began his professional journey in <span className="font-semibold text-primary">2016</span> in business management, later working as a Sales and Marketing Officer until <span className="font-semibold text-primary">2019</span>.
            </p>
            <p>
              From <span className="font-semibold text-primary">2019 to 2025</span>, he worked as an External Tax Consultant for various companies, where he developed strong expertise and earned client trust through professionalism and quality service delivery.
            </p>
            <p>
              Due to increasing client confidence and demand, <span className="font-semibold text-primary">Correct Professional Consultants (CPC) was established in 2025</span> to provide structured, reliable, and professional consulting services.
            </p>
          </div>
        </motion.div>

        {/* Core Values */}
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-foreground">Our Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {values.map((v, i) => (
            <Card3D key={i} className="group">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 1}
                className="bg-card border border-border rounded-xl p-6 h-full hover:border-primary/40 hover:shadow-[0_10px_30px_hsl(var(--primary)/0.08)] transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center mb-4">
                  <v.icon className="text-accent" size={20} />
                </div>
                <h3 className="text-base font-bold mb-1 text-foreground">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </motion.div>
            </Card3D>
          ))}
        </div>
      </div>
    </section>

    {/* What guides our service */}
    <section className="section-padding gradient-navy text-white">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs uppercase tracking-[0.2em] font-semibold text-accent mb-3">How We Work</p>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-10 max-w-2xl">Quality, Collaboration, and Innovation in Every Engagement</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { t: "Quality in Service Delivery", d: "Accuracy, reliability, confidentiality, and timely delivery on every engagement." },
            { t: "Efficient Collaboration", d: "Strong teamwork and trusted relationships with clients and partners." },
            { t: "Professionalism & Excellence", d: "High standards, ethical conduct, and continuous improvement." },
            { t: "Creative Innovation", d: "Modern technology and smart processes to deliver faster, better solutions." },
          ].map((b, i) => (
            <div key={i} className="bg-white/10 backdrop-blur border border-white/15 rounded-xl p-6 hover:bg-white/15 transition-colors">
              <h3 className="font-bold text-lg mb-2 text-accent">{b.t}</h3>
              <p className="text-white/80 leading-relaxed">{b.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/contact">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
              Work With Us <ArrowRight className="ml-2" size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </section>

    <Footer />
  </div>
);

export default About;
