import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, Search, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import blogFallback from "@/assets/people/images_7.jpg.asset.json";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  category: string | null;
  author: string | null;
  published_at: string | null;
  created_at: string;
}

const FALLBACK_IMAGE = blogFallback.url;

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("id,title,slug,excerpt,cover_image_url,category,author,published_at,created_at")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (data) setPosts(data as BlogPost[]);
      setLoading(false);
    })();
  }, []);

  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean) as string[]))];

  const filtered = posts.filter((p) => {
    const matchCat = category === "All" || p.category === category;
    const matchQuery = !query || p.title.toLowerCase().includes(query.toLowerCase()) || (p.excerpt || "").toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 md:pt-32 pb-12 md:pb-16 gradient-brand text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 15% 15%, hsl(var(--accent)) 0%, transparent 35%), radial-gradient(circle at 85% 85%, hsl(var(--brand-teal)) 0%, transparent 35%)" }} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs uppercase tracking-[0.2em] font-semibold text-white/80 mb-3 flex items-center gap-2">
            <BookOpen size={14} /> Insights
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-extrabold mb-4 max-w-3xl">
            Expert insights on tax, accounting & business growth
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-lg text-white/85 max-w-2xl">
            Practical guidance from the CPC team to help you stay compliant, grow sustainably, and make smarter business decisions.
          </motion.p>
        </div>
      </section>

      {/* Search + Filter */}
      <section className="border-b border-border bg-card/40 backdrop-blur sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles…"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto -mx-1 px-1 scrollbar-hide">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                  category === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="py-20 text-center text-muted-foreground">Loading articles…</div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <BookOpen className="mx-auto mb-4 text-muted-foreground/40" size={48} />
              <h3 className="text-xl font-bold text-foreground mb-2">No articles yet</h3>
              <p className="text-muted-foreground">Check back soon for fresh insights from the CPC team.</p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <Link to={`/blog/${featured.slug}`} className="block group mb-12">
                  <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="aspect-[16/10] overflow-hidden bg-muted">
                      <img
                        src={featured.cover_image_url || FALLBACK_IMAGE}
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="p-6 md:p-10">
                      {featured.category && (
                        <span className="inline-block text-[11px] uppercase tracking-widest font-semibold text-accent mb-3">
                          {featured.category}
                        </span>
                      )}
                      <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className="text-muted-foreground mb-5 line-clamp-3">{featured.excerpt}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-5">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} />
                          {new Date(featured.published_at || featured.created_at).toLocaleDateString("en-US", {
                            year: "numeric", month: "short", day: "numeric",
                          })}
                        </span>
                        {featured.author && <span>· {featured.author}</span>}
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-primary font-semibold text-sm">
                        Read article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </motion.article>
                </Link>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((post, i) => (
                    <Link key={post.id} to={`/blog/${post.slug}`} className="group">
                      <motion.article
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-card border border-border rounded-xl overflow-hidden h-full flex flex-col hover:border-primary/40 hover:shadow-lg transition-all"
                      >
                        <div className="aspect-[16/10] overflow-hidden bg-muted">
                          <img
                            src={post.cover_image_url || FALLBACK_IMAGE}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          {post.category && (
                            <span className="inline-block text-[10px] uppercase tracking-widest font-semibold text-accent mb-2">
                              {post.category}
                            </span>
                          )}
                          <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{post.excerpt}</p>
                          )}
                          <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/60">
                            <span className="flex items-center gap-1.5">
                              <Calendar size={11} />
                              {new Date(post.published_at || post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                            <ArrowRight size={14} className="text-primary group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </motion.article>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
