import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  ArrowRight, Layers, Target, ShieldCheck, FileText, Video,
  BarChart3, CheckCircle2, AlertTriangle, Clock, Users, FolderOpen,
  Camera, Film, Clapperboard, Aperture, Focus, MonitorPlay,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardMockup from "@/components/home/DashboardMockup";
import WorkflowMockup from "@/components/home/WorkflowMockup";
import ProjectTrackerMockup from "@/components/home/ProjectTrackerMockup";
import AssetLibraryMockup from "@/components/home/AssetLibraryMockup";
import TrustedBySlider from "@/components/home/TrustedBySlider";

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
      <section className="section-padding pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
            className="text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-6"
          >
            Communication & Production Operating System
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.08] text-foreground mb-6 text-balance"
          >
            Structured Storytelling for Organizations That Lead.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-10"
          >
            We help communication teams plan, produce, track, and archive content through a structured production system — not chaos.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link to="/start-a-project">
              <Button variant="hero" size="lg">
                Start a Project <ArrowRight className="ml-1" size={16} />
              </Button>
            </Link>
            <Link to="/solutions">
              <Button variant="outline" size="lg" className="font-semibold">
                Explore the Platform
              </Button>
            </Link>
          </motion.div>
        </div>
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
          <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
            className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
            The Ikamba Production System
          </motion.h2>
          <motion.p variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className="text-muted-foreground mb-12 max-w-xl">
            A 4-step governance framework that brings structure, accountability, and visibility to every project.
          </motion.p>
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
