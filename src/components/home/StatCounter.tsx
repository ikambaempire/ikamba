import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface StatCounterProps {
  value: string;
  label: string;
}

// Parse "10+", "100%", "2025", "8" into prefix, number, suffix
const parse = (raw: string) => {
  const match = raw.match(/^(\D*)(\d+(?:\.\d+)?)(\D*)$/);
  if (!match) return { prefix: "", num: NaN, suffix: raw };
  return { prefix: match[1], num: parseFloat(match[2]), suffix: match[3] };
};

const StatCounter = ({ value, label }: StatCounterProps) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const { prefix, num, suffix } = parse(value);
  const isNumeric = !isNaN(num);

  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 1800, bounce: 0 });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (inView && isNumeric) mv.set(num);
  }, [inView, isNumeric, num, mv]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => {
      setDisplay(Number.isInteger(num) ? Math.round(v).toString() : v.toFixed(1));
    });
    return () => unsub();
  }, [spring, num]);

  return (
    <div>
      <p ref={ref} className="text-2xl md:text-3xl font-extrabold text-primary">
        {isNumeric ? `${prefix}${display}${suffix}` : value}
      </p>
      <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
};

export default StatCounter;
