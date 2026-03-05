import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", organization: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent. We'll be in touch within 24 hours.");
    setForm({ name: "", email: "", organization: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="section-padding pt-32 pb-16 md:pt-40">
        <div className="max-w-5xl mx-auto">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">
            Contact Us
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-lg text-muted-foreground max-w-xl mb-12">
            Have a question about our production systems? We'd love to hear from you.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Name</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Email</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Organization</label>
                  <input value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))} className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5 block">Message</label>
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required rows={5} className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
                </div>
                <Button type="submit" variant="hero">Send Message</Button>
              </form>
            </div>
            <div className="space-y-6">
              <div className="flex gap-3 items-start">
                <Mail className="text-accent shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">Email</p>
                  <p className="text-sm">hello@ikamba.com</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <Phone className="text-accent shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">Phone</p>
                  <p className="text-sm">+254 700 000 000</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <MapPin className="text-accent shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">Location</p>
                  <p className="text-sm">Nairobi, Kenya</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
