import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Industry {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
}

const TrustedIndustriesBar = () => {
  const [items, setItems] = useState<Industry[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from("trusted_industries")
      .select("id,name,logo_url,website_url")
      .eq("active", true)
      .order("sort_order")
      .order("created_at");
    setItems((data as Industry[]) || []);
    setLoaded(true);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("trusted_industries_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "trusted_industries" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  if (!loaded || items.length === 0) return null;

  const isMarquee = items.length > 5;
  const list = isMarquee ? [...items, ...items] : items;

  const Logo = ({ i }: { i: Industry }) => {
    const inner = (
      <div className="bg-white rounded-lg p-3 h-14 sm:h-16 w-28 sm:w-36 flex items-center justify-center shrink-0 border border-border/50 hover:shadow-md transition-shadow">
        <img src={i.logo_url} alt={i.name} className="max-h-full max-w-full object-contain" loading="lazy" />
      </div>
    );
    return i.website_url
      ? <a href={i.website_url} target="_blank" rel="noopener noreferrer" title={i.name}>{inner}</a>
      : <div title={i.name}>{inner}</div>;
  };

  return (
    <section className="bg-muted/40 border-b border-border pt-20 sm:pt-24 pb-5 sm:pb-6" aria-label="Trusted industries">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-muted-foreground text-center mb-4">
          Trusted by industries across Rwanda
        </p>
        {isMarquee ? (
          <div className="relative overflow-hidden">
            <div className="flex gap-6 animate-marquee whitespace-nowrap">
              {list.map((i, idx) => <Logo key={`${i.id}-${idx}`} i={i} />)}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-muted/40 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-muted/40 to-transparent" />
          </div>
        ) : (
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6">
            {items.map(i => <Logo key={i.id} i={i} />)}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrustedIndustriesBar;
