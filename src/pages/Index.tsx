import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight, Layers, Target, ShieldCheck, FileText, Video,
  BarChart3, CheckCircle2, AlertTriangle, Clock, Users, FolderOpen,
  Camera, Film, Clapperboard, Aperture, Focus, MonitorPlay,
  Mic, Headphones, Radio, Tv, Projector, Podcast, ScanLine,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardMockup from "@/components/home/DashboardMockup";
import WorkflowMockup from "@/components/home/WorkflowMockup";
import ProjectTrackerMockup from "@/components/home/ProjectTrackerMockup";
import AssetLibraryMockup from "@/components/home/AssetLibraryMockup";
import TrustedBySlider from "@/components/home/TrustedBySlider";
import heroProductionImg from "@/assets/hero-production.jpg";
import caseStudyCorporateImg from "@/assets/case-study-corporate.jpg";
import caseStudyCampaignImg from "@/assets/case-study-campaign.jpg";
import workflowOverviewImg from "@/assets/workflow-overview.jpg";
import solutionsVideoImg from "@/assets/solutions-video.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const steps = [
  { icon: FileText, title: "Brief & Strategy", desc: "Structured intake, objective alignment, and audience mapping." },
  { icon: Video, title: "Production", desc: "Planned production with assigned teams, timelines, and milestones." },
  { icon: Target, title: "Review & Approval", desc: "Transparent revision cycles with documented feedback loops." },
  { icon: FolderOpen, title: "Delivery & Archive", desc: "Final assets delivered and archived in a structured digital library." },
];

const solutions = [
  { icon: Video, title: "Video & Motion Production", desc: "Corporate films, social content, animations, and campaign visuals." },
  { icon: BarChart3, title: "Content Strategy", desc: "Editorial planning, messaging frameworks, and distribution systems." },
  { icon: Layers, title: "Brand & Identity Systems", desc: "Visual identity governance, brand guidelines, and asset standardization." },
  { icon: ShieldCheck, title: "Production Governance", desc: "Workflow structuring, approval protocols, and archival systems." },
];

const problems = [
  { icon: AlertTriangle, text: "Scattered production files across WhatsApp, email, and personal drives" },
  { icon: Clock, text: "Missed deadlines with no visibility on project status" },
  { icon: Users, text: "Unclear revision cycles — who approved what, and when?" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="section-padding pt-32 pb-24 md:pt-40 md:pb-32 relative overflow-hidden gradient-navy">
        {/* Floating creative icons */}
        {[
          { Icon: Camera, x: "5%", y: "10%", size: 28, delay: 0, dur: 6 },
          { Icon: Film, x: "18%", y: "5%", size: 22, delay: 0.8, dur: 7 },
          { Icon: Clapperboard, x: "32%", y: "14%", size: 24, delay: 0.4, dur: 5.5 },
          { Icon: Video, x: "48%", y: "8%", size: 20, delay: 1.2, dur: 6.5 },
          { Icon: Aperture, x: "62%", y: "12%", size: 28, delay: 0.6, dur: 7.5 },
          { Icon: MonitorPlay, x: "78%", y: "6%", size: 22, delay: 1.5, dur: 6 },
          { Icon: Mic, x: "90%", y: "14%", size: 20, delay: 0.3, dur: 5 },
          { Icon: Focus, x: "7%", y: "38%", size: 22, delay: 1, dur: 8 },
          { Icon: Headphones, x: "20%", y: "48%", size: 24, delay: 0.5, dur: 6 },
          { Icon: Projector, x: "40%", y: "42%", size: 22, delay: 1.8, dur: 7 },
          { Icon: Radio, x: "58%", y: "46%", size: 20, delay: 0.7, dur: 5.5 },
          { Icon: ScanLine, x: "72%", y: "36%", size: 26, delay: 1.3, dur: 6.5 },
          { Icon: Podcast, x: "88%", y: "44%", size: 20, delay: 0.2, dur: 7.5 },
          { Icon: Tv, x: "94%", y: "55%", size: 22, delay: 1.6, dur: 6 },
          { Icon: Camera, x: "10%", y: "72%", size: 24, delay: 0.9, dur: 5.5 },
          { Icon: Film, x: "25%", y: "80%", size: 20, delay: 1.4, dur: 7 },
          { Icon: Clapperboard, x: "42%", y: "68%", size: 26, delay: 0.1, dur: 6 },
          { Icon: Video, x: "56%", y: "76%", size: 22, delay: 2, dur: 8 },
          { Icon: Aperture, x: "70%", y: "70%", size: 24, delay: 0.6, dur: 5 },
          { Icon: MonitorPlay, x: "84%", y: "78%", size: 22, delay: 1.1, dur: 6.5 },
        ].map(({ Icon, x, y, size, delay, dur }, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none text-primary-foreground"
            style={{ left: x, top: y }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 0.15, 0.08, 0.15, 0],
              scale: [0.6, 1, 1.15, 1, 0.6],
              y: [0, -8, 0, 8, 0],
              rotate: [0, 6, -4, 3, 0],
            }}
            transition={{ duration: dur, delay, repeat: Infinity, ease: "easeInOut" }}
          >
            <Icon size={size} strokeWidth={1.5} />
          </motion.div>
        ))}

        {/* Cinematic light streak */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="absolute w-[600px] h-[2px] bg-gradient-to-r from-transparent via-accent/30 to-transparent"
            style={{ top: "30%", left: "-300px", rotate: "-12deg" }}
            animate={{ x: ["-300px", "calc(100vw + 300px)"] }}
            transition={{ duration: 4, delay: 1, repeat: Infinity, repeatDelay: 8, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-[400px] h-[1px] bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent"
            style={{ top: "60%", left: "-200px", rotate: "-8deg" }}
            animate={{ x: ["-200px", "calc(100vw + 200px)"] }}
            transition={{ duration: 3.5, delay: 5, repeat: Infinity, repeatDelay: 10, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Soft radial glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, hsl(var(--accent) / 0.08) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Viewfinder frame accent */}
          <motion.div
            className="hidden md:block absolute -top-6 -left-8 w-16 h-16 border-l-2 border-t-2 border-accent/40 rounded-tl-sm"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
          <motion.div
            className="hidden md:block absolute -bottom-6 -right-8 w-16 h-16 border-r-2 border-b-2 border-accent/40 rounded-br-sm"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          />

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 mb-6"
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-accent"
              animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-primary-foreground/60">
              Communication & Production Operating System
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.08] text-primary-foreground mb-6 text-balance"
          >
            <span>Structured </span>
            <motion.span
              className="inline-block text-accent"
              animate={{ rotateX: [0, 8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              Storytelling
            </motion.span>
            <span> for Organizations That Lead.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl leading-relaxed mb-10"
          >
            We help communication teams plan, produce, track, and archive content through a structured production system — not chaos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link to="/start-a-project">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="hero" size="lg">
                  Start a Project <ArrowRight className="ml-1" size={16} />
                </Button>
              </motion.div>
            </Link>
            <Link to="/solutions">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="outline" size="lg" className="font-semibold border-primary-foreground/30 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                  Explore the Platform
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>

        {/* Hero cinematic image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-6xl mx-auto mt-16 relative z-10"
        >
          <div className="relative rounded-xl overflow-hidden shadow-2xl border border-primary-foreground/10">
            <img
              src={heroProductionImg}
              alt="Professional video production studio with cinematic lighting and RED camera setup"
              className="w-full h-auto object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-primary-foreground/80 text-sm font-medium">
                Enterprise-grade production — structured, governed, delivered.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trusted By */}
      <TrustedBySlider />

      {/* Platform Mockups */}
      <section className="section-padding bg-secondary">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-xs uppercase tracking-[0.2em] font-semibold text-accent mb-3">The Platform</p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Everything Your Production Team Needs
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A single operating system for briefs, workflows, approvals, and asset delivery — built for organizations, not freelancers.
            </p>
          </motion.div>

          <div className="space-y-8">
            <DashboardMockup />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <WorkflowMockup />
              <AssetLibraryMockup />
            </div>
            <ProjectTrackerMockup />
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
            className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            The Problem with Creative Production Today
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className="text-muted-foreground mb-10 max-w-xl">
            Most organizations treat content production as an ad-hoc task. The result? Chaos.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problems.map((item, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 2}
                className="bg-card rounded-lg p-6 border border-border flex gap-4">
                <item.icon className="text-destructive shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-foreground leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Ikamba Production System */}
      <section className="section-padding bg-secondary">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-12">
            <div>
              <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
                className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
                The Ikamba Production System
              </motion.h2>
              <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
                className="text-muted-foreground max-w-xl">
                A 4-step governance framework that brings structure, accountability, and visibility to every project.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-xl overflow-hidden shadow-lg border border-border"
            >
              <img
                src={workflowOverviewImg}
                alt="Organized production workflow with storyboards, brand guidelines, and project management tools"
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </motion.div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 2}
                className="relative bg-card rounded-lg p-6 border border-border group hover:border-accent transition-colors">
                <div className="w-10 h-10 rounded-md bg-accent flex items-center justify-center mb-4">
                  <step.icon className="text-accent-foreground" size={18} />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Step {i + 1}</span>
                <h3 className="text-base font-bold mt-1 mb-2 text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Workspace */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
            className="text-2xl md:text-3xl font-bold mb-3">
            Your Private Client Workspace
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className="text-primary-foreground/60 mb-10 max-w-xl">
            Every client gets a secure, isolated portal with real-time project visibility, structured asset libraries, and documented approval trails.
          </motion.p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: "Secure Access", desc: "Isolated data. Your content stays yours." },
              { icon: BarChart3, title: "Project Tracker", desc: "Real-time status from brief to archive." },
              { icon: FolderOpen, title: "Asset Library", desc: "Organized by campaign, project, and version." },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 2}
                className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-lg p-6">
                <item.icon className="text-accent mb-3" size={22} />
                <h3 className="text-base font-bold mb-1">{item.title}</h3>
                <p className="text-sm text-primary-foreground/60 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Overview */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
            className="text-2xl md:text-3xl font-bold mb-3 text-foreground">Solutions</motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className="text-muted-foreground mb-12 max-w-xl">
            End-to-end production capabilities, governed by structure.
          </motion.p>

          {/* Solutions hero image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-xl overflow-hidden shadow-lg border border-border mb-10"
          >
            <img
              src={solutionsVideoImg}
              alt="Professional video shoot with cinema camera and lighting setup"
              className="w-full h-64 md:h-80 object-cover"
              loading="lazy"
            />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {solutions.map((s, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 2}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                <s.icon className="text-accent mb-3" size={22} />
                <h3 className="text-base font-bold mb-1 text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-8">
            <Link to="/solutions">
              <Button variant="outline" size="sm" className="font-semibold">
                View All Solutions <ArrowRight className="ml-1" size={14} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="section-padding bg-secondary">
        <div className="max-w-5xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
            className="text-2xl md:text-3xl font-bold mb-3 text-foreground">Case Studies</motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className="text-muted-foreground mb-10 max-w-xl">
            How structured production governance transforms organizational communication.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { client: "Regional Bank", type: "Annual Report Production", result: "Delivered 3 weeks early with zero revision overruns." },
              { client: "International NGO", type: "Campaign Content System", result: "80+ assets produced and archived within a unified governance framework." },
            ].map((c, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 2}
                className="bg-card border border-border rounded-lg p-6">
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{c.type}</span>
                <h3 className="text-lg font-bold mt-2 mb-2 text-foreground">{c.client}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.result}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-8">
            <Link to="/case-studies">
              <Button variant="outline" size="sm" className="font-semibold">
                All Case Studies <ArrowRight className="ml-1" size={14} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Insights */}
      <section className="section-padding">
        <div className="max-w-5xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
            className="text-2xl md:text-3xl font-bold mb-3 text-foreground">Insights</motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className="text-muted-foreground mb-10 max-w-xl">
            Perspectives on structured communication, production systems, and organizational storytelling.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Why Most Corporate Videos Fail Before Production Begins", category: "Production Governance" },
              { title: "The Case for Structured Content Systems in Large Organizations", category: "Systems Thinking" },
              { title: "From Chaos to Clarity: Building Your First Production Playbook", category: "Operations" },
            ].map((a, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 2}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer">
                <span className="text-[10px] uppercase tracking-widest text-accent font-semibold">{a.category}</span>
                <h3 className="text-base font-bold mt-2 leading-snug text-foreground">{a.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Ikamba */}
      <section className="section-padding bg-secondary">
        <div className="max-w-5xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
            className="text-2xl md:text-3xl font-bold mb-10 text-foreground">Why Ikamba</motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "We're not a creative agency — we're a production governance partner.",
              "Every project follows a documented 4-step system.",
              "Clients get secure, private workspaces with full project visibility.",
              "Our systems are designed for scale, compliance, and accountability.",
              "Built for communication teams inside organizations, not freelancers.",
              "Enterprise-grade structure, without enterprise-grade complexity.",
            ].map((text, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="flex gap-3 items-start">
                <CheckCircle2 className="text-success shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-foreground leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-primary text-primary-foreground text-center">
        <div className="max-w-3xl mx-auto">
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
            className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Bring Structure to Your Content Production?
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className="text-primary-foreground/60 mb-8 max-w-xl mx-auto">
            Start with a structured brief. We'll handle the rest.
          </motion.p>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}>
            <Link to="/start-a-project">
              <Button variant="hero" size="lg">
                Start a Project <ArrowRight className="ml-1" size={16} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
