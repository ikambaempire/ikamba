import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Upload } from "lucide-react";

const projectTypes = [
  "Corporate Video",
  "Social Content Campaign",
  "Brand Identity",
  "Annual Report",
  "Documentary",
  "Animation / Motion Graphics",
  "Content Strategy",
  "Other",
];

const budgetRanges = [
  "Under $5,000",
  "$5,000 – $15,000",
  "$15,000 – $50,000",
  "$50,000+",
  "To Be Discussed",
];

const StartAProject = () => {
  const [form, setForm] = useState({
    companyName: "",
    projectTitle: "",
    projectType: "",
    objective: "",
    targetAudience: "",
    keyMessage: "",
    distributionPlan: "",
    timeline: "",
    budgetRange: "",
    approvalContact: "",
    contactEmail: "",
    additionalNotes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Brief submitted successfully. We'll review and respond within 48 hours.");
    setForm({
      companyName: "", projectTitle: "", projectType: "", objective: "",
      targetAudience: "", keyMessage: "", distributionPlan: "", timeline: "",
      budgetRange: "", approvalContact: "", contactEmail: "", additionalNotes: "",
    });
  };

  const field = (label: string, key: keyof typeof form, type: "text" | "textarea" | "select" = "text", options?: string[]) => (
    <div>
      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">{label}</label>
      {type === "textarea" ? (
        <textarea value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required rows={3} className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
      ) : type === "select" && options ? (
        <select value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="">Select...</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} required className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="section-padding pt-32 pb-16 md:pt-40">
        <div className="max-w-3xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-extrabold mb-4">
            Start a Project
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-muted-foreground mb-10">
            Complete this structured brief to help us understand your production needs. We'll respond within 48 hours with a tailored approach.
          </motion.p>

          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {field("Company Name", "companyName")}
              {field("Project Title", "projectTitle")}
            </div>
            {field("Project Type", "projectType", "select", projectTypes)}
            {field("Objective", "objective", "textarea")}
            {field("Target Audience", "targetAudience", "textarea")}
            {field("Key Message", "keyMessage", "textarea")}
            {field("Distribution Plan", "distributionPlan", "textarea")}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {field("Timeline", "timeline")}
              {field("Budget Range", "budgetRange", "select", budgetRanges)}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {field("Approval Contact Name", "approvalContact")}
              {field("Contact Email", "contactEmail")}
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">File Upload (Optional)</label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center text-muted-foreground cursor-pointer hover:border-accent transition-colors">
                <Upload className="mx-auto mb-2" size={20} />
                <p className="text-sm">Drop files here or click to upload</p>
                <p className="text-xs mt-1">Reference materials, briefs, brand guidelines</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Additional Notes (Optional)</label>
              <textarea value={form.additionalNotes} onChange={e => setForm(f => ({ ...f, additionalNotes: e.target.value }))} rows={3} className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            </div>

            <Button type="submit" variant="hero" size="lg">
              Submit Brief <ArrowRight className="ml-1" size={16} />
            </Button>
          </motion.form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default StartAProject;
