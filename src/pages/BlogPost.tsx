import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Calendar, ArrowLeft, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import postFallback from "@/assets/people/images_7.jpg.asset.json";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  category: string | null;
  author: string | null;
  published_at: string | null;
  created_at: string;
}

const FALLBACK_IMAGE = postFallback.url;

const renderMarkdown = (md: string) => {
  let html = md
    .replace(/\[youtube:([a-zA-Z0-9_-]{11})\]/g,
      '<div class="my-6 aspect-video"><iframe class="w-full h-full rounded-xl" src="https://www.youtube.com/embed/$1" frameborder="0" allowfullscreen></iframe></div>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="rounded-xl my-6 w-full" />')
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-8 mb-3 text-foreground">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-extrabold mt-10 mb-4 text-foreground">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-primary underline hover:text-accent" target="_blank" rel="noopener">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="ml-5 list-disc mb-1">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-5 text-foreground/80 leading-relaxed">');
  return `<p class="mb-5 text-foreground/80 leading-relaxed text-lg">${html}</p>`;
};

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (data) {
        setPost(data as BlogPost);
        const { data: more } = await supabase
          .from("blog_posts")
          .select("id,title,slug,excerpt,cover_image_url,category,author,published_at,created_at,content")
          .eq("published", true)
          .neq("id", (data as BlogPost).id)
          .order("published_at", { ascending: false })
          .limit(3);
        if (more) setRelated(more as BlogPost[]);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20 text-center text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20 text-center max-w-md mx-auto px-6">
          <h1 className="text-2xl font-bold text-foreground mb-3">Article not found</h1>
          <p className="text-muted-foreground mb-6">This article may have been moved or unpublished.</p>
          <Link to="/blog" className="text-primary font-semibold inline-flex items-center gap-2">
            <ArrowLeft size={16} /> Back to all articles
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post.title} — CPC Ltd Insights</title>
        {post.excerpt && <meta name="description" content={post.excerpt} />}
        <meta property="og:title" content={post.title} />
        {post.excerpt && <meta property="og:description" content={post.excerpt} />}
        {post.cover_image_url && <meta property="og:image" content={post.cover_image_url} />}
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`/blog/${post.slug}`} />
      </Helmet>

      <Navbar />

      {/* Cover */}
      <section className="relative pt-20">
        <div className="w-full overflow-hidden bg-muted max-h-[60vh] md:max-h-[70vh]">
          <img src={post.cover_image_url || FALLBACK_IMAGE} alt={post.title} className="w-full h-auto max-h-[60vh] md:max-h-[70vh] object-contain mx-auto" />
        </div>
      </section>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft size={14} /> All articles
        </Link>

        {post.category && (
          <span className="inline-block text-xs uppercase tracking-widest font-semibold text-accent mb-3">
            {post.category}
          </span>
        )}

        <h1 className="text-3xl md:text-5xl font-extrabold text-foreground leading-[1.1] mb-5">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-xl text-muted-foreground leading-relaxed mb-6">{post.excerpt}</p>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground pb-8 mb-8 border-b border-border">
          <span className="flex items-center gap-1.5"><User size={14} /> {post.author || "CPC Ltd"}</span>
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {new Date(post.published_at || post.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>

        <div className="prose-content" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
      </article>

      {related.length > 0 && (
        <section className="border-t border-border bg-muted/30 section-padding">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8">Keep reading</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link key={p.id} to={`/blog/${p.slug}`} className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-[16/10] overflow-hidden bg-muted">
                    <img src={p.cover_image_url || FALLBACK_IMAGE} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    {p.category && <span className="text-[10px] uppercase tracking-widest font-semibold text-accent">{p.category}</span>}
                    <h3 className="font-bold text-foreground mt-1 group-hover:text-primary transition-colors line-clamp-2">{p.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default BlogPostPage;
