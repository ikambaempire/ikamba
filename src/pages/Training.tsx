import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  GraduationCap, Calculator, BookOpen, Megaphone, Briefcase,
  CheckCircle2, Users, Clock, ArrowRight,
} from "lucide-react";
import Card3D from "@/components/home/Card3D";
import trainImg from "@/assets/people/images_10.jpg.asset.json";

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const courses = [
  {
    icon: Calculator, title: "Taxation Training",
    desc: "Master Rwandan tax compliance: VAT, PAYE, CIT, withholding tax, and tax filing on the RRA portal.",
    audience: "Graduates · Accountants · Business Owners",
  },
  {
    icon: BookOpen, title: "Accounting Bootcamp",
    desc: "Hands-on bookkeeping, financial statements, budgeting, and analysis using modern accounting tools.",
    audience: "Graduates · Junior Accountants",
  },
  {
    icon: Briefcase, title: "Business Management",
    desc: "Practical business management for entrepreneurs: operations, finance basics, and growth strategy.",
    audience: "Entrepreneurs · Managers",
  },
  {
    icon: Megaphone, title: "Digital Marketing",
    desc: "Build a brand online: social media, content, paid ads, and analytics that drive results.",
    audience: "Marketers · Business Owners",
  },
];

const benefits = [
  "Practical, real-world case studies",
  "Trainers with active consulting experience",
  "Certificate of completion",
  "Career & employability guidance",
  "Small classes for personal attention",
  "Affordable rates with group discounts",
];

const Training = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    <section className="pt-28 md:pt-32 pb-12 md:pb-16 gradient-brand text-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs uppercase tracking-[0.2em] font-semibold text-white/80 mb-4">
          CPC Training Academy
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-balance">
          Practical Training for Graduates &amp; Professionals
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-lg text-white/85 max-w-2xl">
          Sharpen your skills in taxation, accounting, business management, and digital marketing — taught by working consultants with real client experience.
        </motion.p>
      </div>
    </section>

    {/* Classroom banner */}
    <section className="relative h-56 md:h-72 overflow-hidden">
      <img src={trainImg.url} alt="Trainer leading a professional classroom session" className="w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/85 to-primary/20" />
      <div className="absolute inset-0 flex items-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
        <p className="text-white text-xl md:text-2xl font-bold max-w-lg">Practical, hands-on training delivered by working professionals.</p>
      </div>
    </section>


    <section className="section-padding">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8 text-foreground">Our Training Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((c, i) => (
            <Card3D key={i} className="group">
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="bg-card border border-border rounded-xl p-7 h-full hover:border-primary/40 hover:shadow-[0_10px_30px_hsl(var(--primary)/0.1)] transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <c.icon className="text-primary" size={22} />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{c.desc}</p>
                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <Users size={14} className="text-accent" />
                  <span className="text-xs text-foreground/70">{c.audience}</span>
                </div>
              </motion.div>
            </Card3D>
          ))}
        </div>
      </div>
    </section>

    <section className="section-padding gradient-navy text-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-accent mb-3">Why Train with CPC</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Skills You Can Use From Day One</h2>
          <p className="text-white/80 text-lg leading-relaxed mb-6">
            Our training programs are designed to bridge the gap between school and the workplace — giving you the practical knowledge employers and clients actually need.
          </p>
          <div className="flex items-center gap-6 text-sm text-white/70 mb-2">
            <span className="flex items-center gap-2"><Clock size={16} className="text-accent" /> Flexible schedules</span>
            <span className="flex items-center gap-2"><GraduationCap size={16} className="text-accent" /> Certified</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {benefits.map((b, i) => (
            <div key={i} className="flex items-start gap-3 bg-white/10 backdrop-blur border border-white/15 rounded-xl p-4">
              <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
              <span className="text-sm text-white/90">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="section-padding bg-background">
      <div className="max-w-4xl mx-auto text-center bg-secondary rounded-2xl p-10">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-3 text-foreground">Ready to enroll?</h2>
        <p className="text-muted-foreground mb-6">Contact our training team to learn about upcoming cohorts, schedules, and pricing.</p>
        <Link to="/contact">
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
            Request Course Info <ArrowRight className="ml-2" size={16} />
          </Button>
        </Link>
      </div>
    </section>

    <Footer />
  </div>
);

export default Training;
