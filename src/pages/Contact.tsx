import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", preferred_date: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("bookings").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      service: form.service || null,
      preferred_date: form.preferred_date || null,
      message: form.message,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Could not submit. Please try again or call us directly.");
      return;
    }
    toast.success("Booking received! A CPC advisor will contact you within 24 hours.");
    setForm({ name: "", email: "", phone: "", service: "", preferred_date: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 md:pt-32 pb-12 md:pb-16 gradient-brand text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs uppercase tracking-[0.2em] font-semibold text-white/80 mb-4">
            Get in Touch
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
            Let's Talk About Your Business
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-lg text-white/85 max-w-xl">
            Whether you need tax advice, accounting support, or business registration — our team is ready to help.
          </motion.p>
        </div>
      </section>

      <section className="section-padding">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-2 text-foreground">Book a Free Consultation</h2>
            <p className="text-muted-foreground mb-6">Fill in the form and a CPC advisor will confirm your booking within 24 hours.</p>
            <form onSubmit={handleSubmit} className="space-y-5 bg-card border border-border rounded-2xl p-6 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Full Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Phone</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Preferred Date</label>
                  <input type="date" value={form.preferred_date} onChange={e => setForm(f => ({ ...f, preferred_date: e.target.value }))} className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Service of Interest</label>
                <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="">Select a service…</option>
                  <option>Taxation Services</option>
                  <option>Accounting Services</option>
                  <option>Digital Marketing</option>
                  <option>Professional Training</option>
                  <option>Business Registration</option>
                  <option>Work Permits & Immigration</option>
                  <option>Billing & Debt Recovery</option>
                  <option>Annual Returns Filing</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">How can we help? *</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required rows={5} className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>
              <Button type="submit" size="lg" disabled={submitting} className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                {submitting ? "Submitting…" : "Submit Booking"}
              </Button>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div className="bg-primary text-primary-foreground rounded-2xl p-6 space-y-5">
              <div className="flex gap-3 items-start">
                <Phone className="text-accent shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-xs uppercase tracking-widest text-primary-foreground/60 font-semibold mb-1">Phone</p>
                  <p className="text-sm">+250 788 506 194</p>
                  <p className="text-sm">+250 781 722 386</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <Mail className="text-accent shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-xs uppercase tracking-widest text-primary-foreground/60 font-semibold mb-1">Email</p>
                  <p className="text-sm break-all">correctprofesionalconsultants@gmail.com</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <MapPin className="text-accent shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-xs uppercase tracking-widest text-primary-foreground/60 font-semibold mb-1">Head Office</p>
                  <p className="text-sm leading-relaxed">KN 48 Street, Nyarugenge<br/>Yussa City Center (Makuza Plaza)<br/>Tower B, 8th Floor, Kigali, Rwanda</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <Clock className="text-accent shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-xs uppercase tracking-widest text-primary-foreground/60 font-semibold mb-1">Hours</p>
                  <p className="text-sm">Mon – Fri · 8:00 – 17:00</p>
                  <p className="text-sm">Sat · 9:00 – 13:00</p>
                </div>
              </div>
            </div>

            <a href="tel:+250788506194" className="block">
              <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                <Phone size={16} className="mr-2" /> Call Now
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
