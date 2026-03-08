import { motion } from "framer-motion";

const partners = [
  "United Nations", "African Union", "World Bank", "USAID", "GIZ",
  "Safaricom", "KCB Group", "Equity Bank", "UNDP", "WHO",
  "UNESCO", "UNICEF", "African Development Bank", "Standard Chartered", "Deloitte",
];

const TrustedBySlider = () => {
  return (
    <section className="py-12 bg-background border-y border-border overflow-hidden">
      <p className="text-center text-xs uppercase tracking-[0.2em] font-semibold text-muted-foreground mb-8">
        Trusted by Leading Organizations
      </p>
      <div className="relative">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

        <motion.div
          className="flex gap-12 items-center whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...partners, ...partners].map((name, i) => (
            <div
              key={i}
              className="flex-shrink-0 px-6 py-3 rounded-md border border-border bg-card/50"
            >
              <span className="text-sm font-semibold text-muted-foreground tracking-wide">
                {name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustedBySlider;
