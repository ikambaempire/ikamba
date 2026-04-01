import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronLeft,
  Copy,
  Download,
  History,
  Image as ImageIcon,
  Layers3,
  Loader2,
  Paintbrush,
  RotateCcw,
  Sparkles,
  Trash2,
  Upload,
  Wand2,
  ZoomIn,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const GRAPHIC_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/graphic-generator`;
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const HISTORY_STORAGE_KEY = "ikamba-design-studio-history";
const HISTORY_LIMIT = 10;

const STYLE_PRESETS = [
  { id: "corporate", label: "Corporate Clean", desc: "Professional, structured, clean typography" },
  { id: "ngo", label: "NGO Storytelling", desc: "Emotive, human-centered, warm tones" },
  { id: "luxury", label: "Luxury Brand", desc: "Elegant, minimal, gold accents, serif fonts" },
  { id: "tech", label: "Tech Modern", desc: "Futuristic, gradients, geometric, sans-serif" },
  { id: "editorial", label: "Editorial Magazine", desc: "Bold typography, editorial grid, cinematic" },
  { id: "cinematic", label: "Cinematic Campaign", desc: "Dramatic lighting, depth of field, epic" },
];

const FORMAT_SIZES = [
  { id: "instagram", label: "Instagram Post", desc: "1080×1080" },
  { id: "linkedin", label: "LinkedIn Banner", desc: "1584×396" },
  { id: "poster", label: "Event Poster", desc: "1080×1920" },
  { id: "hero", label: "Website Hero", desc: "1920×1080" },
  { id: "slide", label: "Slide Cover", desc: "1920×1080" },
  { id: "twitter", label: "Twitter Banner", desc: "1500×500" },
];

const QUALITY_OPTIONS = [
  { id: "standard", label: "Standard", desc: "Fast generation" },
  { id: "high", label: "High", desc: "Sharper detail" },
  { id: "ultra", label: "Ultra", desc: "Premium hyper-realism" },
];

const VARIATION_OPTIONS = [1, 4, 10] as const;

type GeneratedDesign = {
  images: string[];
  text: string;
};

type SavedDesign = {
  id: string;
  createdAt: string;
  objective: string;
  headline: string;
  style: string;
  format: string;
  quality: string;
  variations: number;
  images: string[];
  text: string;
};

const DesignStudio = () => {
  const [objective, setObjective] = useState("");
  const [headline, setHeadline] = useState("");
  const [supportingText, setSupportingText] = useState("");
  const [brandTone, setBrandTone] = useState("");
  const [colorPreference, setColorPreference] = useState("");
  const [audience, setAudience] = useState("");
  const [style, setStyle] = useState("cinematic");
  const [format, setFormat] = useState("instagram");
  const [quality, setQuality] = useState("high");
  const [variations, setVariations] = useState<(typeof VARIATION_OPTIONS)[number]>(4);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedDesign | null>(null);
  const [previewZoom, setPreviewZoom] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [history, setHistory] = useState<SavedDesign[]>([]);

  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored) as SavedDesign[];
      if (Array.isArray(parsed)) setHistory(parsed.slice(0, HISTORY_LIMIT));
    } catch {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    }
  }, []);

  const persistHistory = (items: SavedDesign[]) => {
    const trimmed = items.slice(0, HISTORY_LIMIT);
    setHistory(trimmed);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmed));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read image"));
      reader.readAsDataURL(file);
    });

  const buildPrompt = () => {
    const selectedStyle = STYLE_PRESETS.find((item) => item.id === style);
    const selectedFormat = FORMAT_SIZES.find((item) => item.id === format);
    const qualityLabel = QUALITY_OPTIONS.find((item) => item.id === quality);

    let prompt = `MASTER CREATIVE BRIEF:\n`;
    prompt += `Objective: ${objective}\n`;
    if (headline) prompt += `Primary headline text: "${headline}"\n`;
    if (supportingText) prompt += `Supporting copy: "${supportingText}"\n`;
    if (brandTone) prompt += `Brand tone: ${brandTone}\n`;
    if (colorPreference) prompt += `Preferred palette: ${colorPreference}\n`;
    if (audience) prompt += `Audience: ${audience}\n`;
    prompt += `Style direction: ${selectedStyle?.label} — ${selectedStyle?.desc}\n`;
    prompt += `Output format: ${selectedFormat?.label} (${selectedFormat?.desc})\n`;
    prompt += `Quality target: ${qualityLabel?.label} — ${qualityLabel?.desc}\n`;
    prompt += `Requested variations: ${variations}\n`;
    prompt += `\nNON-NEGOTIABLE ART DIRECTION:\n`;
    prompt += `- Treat this as work from a world-class creative director with 39 years of elite campaign and brand design experience\n`;
    prompt += `- Build a complete, client-ready layout with image treatment, typography, hierarchy, spacing, and premium finishing\n`;
    prompt += `- Make the imagery hyper-realistic with believable lighting, texture, atmosphere, and depth\n`;
    prompt += `- Ensure all text is perfectly readable, professionally typeset, and visually integrated into the composition\n`;
    prompt += `- Avoid generic AI aesthetics, plastic skin, warped text, and flat composition\n`;
    prompt += `- The result must feel like a polished agency campaign, not a rough mockup\n`;

    if (quality === "ultra") {
      prompt += `- Push premium finish: exceptional sharpness, cinematic light shaping, tactile materials, and luxury-grade clarity\n`;
    }

    return prompt;
  };

  const saveCurrentResult = (nextResult: GeneratedDesign) => {
    const entry: SavedDesign = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      objective,
      headline,
      style,
      format,
      quality,
      variations,
      images: nextResult.images,
      text: nextResult.text,
    };

    persistHistory([entry, ...history]);
  };

  const handleGenerate = async () => {
    if (!objective.trim()) {
      toast({ title: "Enter a design objective", variant: "destructive" });
      return;
    }

    setLoading(true);
    setResult(null);
    setSelectedImageIndex(0);

    try {
      const prompt = buildPrompt();
      const editImage = logoFile ? await fileToBase64(logoFile) : undefined;

      const resp = await fetch(GRAPHIC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${KEY}`,
        },
        body: JSON.stringify({ prompt, editImage, quality, count: variations }),
      });

      if (resp.status === 429) {
        toast({ title: "Rate limit reached. Please wait a moment and try again.", variant: "destructive" });
        return;
      }

      if (resp.status === 402) {
        toast({ title: "Usage limit reached. Please add credits.", variant: "destructive" });
        return;
      }

      if (!resp.ok) throw new Error("Generation failed");

      const data = await resp.json();
      const images = (data.images || [])
        .map((img: any) => (typeof img === "string" ? img : img?.image_url?.url || img?.url || ""))
        .filter(Boolean);

      if (!images.length) throw new Error("No graphics were generated");

      const nextResult = {
        images,
        text: data.text || "Your premium graphics are ready.",
      };

      setResult(nextResult);
      saveCurrentResult(nextResult);
      toast({ title: `${images.length} graphics generated and saved to memory` });
    } catch (error: any) {
      toast({ title: error.message || "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    link.click();
  };

  const handleReset = () => {
    setObjective("");
    setHeadline("");
    setSupportingText("");
    setBrandTone("");
    setColorPreference("");
    setAudience("");
    setStyle("cinematic");
    setFormat("instagram");
    setQuality("high");
    setVariations(4);
    setLogoFile(null);
    setLogoPreview(null);
    setResult(null);
    setSelectedImageIndex(0);
  };

  const clearHistory = () => {
    persistHistory([]);
    toast({ title: "Saved graphics cleared" });
  };

  const restoreFromHistory = (item: SavedDesign) => {
    setObjective(item.objective);
    setHeadline(item.headline);
    setStyle(item.style);
    setFormat(item.format);
    setQuality(item.quality);
    setVariations(item.variations as (typeof VARIATION_OPTIONS)[number]);
    setResult({ images: item.images, text: item.text });
    setSelectedImageIndex(0);
    toast({ title: "Saved graphics restored" });
  };

  const selectedImage = result?.images[selectedImageIndex] ?? result?.images[0] ?? null;

  return (
    <div className="min-h-screen bg-[hsl(213,52%,8%)] text-[hsl(210,40%,95%)] flex flex-col">
      <header className="h-14 border-b border-white/10 flex items-center px-4 gap-3 shrink-0 bg-[hsl(213,52%,10%)]">
        <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </Link>
        <div className="h-5 w-px bg-white/20" />
        <div className="flex items-center gap-2">
          <Paintbrush className="w-5 h-5 text-[hsl(38,92%,50%)]" />
          <span className="font-heading font-bold text-lg tracking-tight">AI Design Studio</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
            <History className="w-3.5 h-3.5" />
            {history.length}/{HISTORY_LIMIT} saved
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-white/50 hover:text-white hover:bg-white/10"
          >
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <aside className="w-full lg:w-80 xl:w-96 border-r border-white/10 overflow-y-auto bg-[hsl(213,52%,9%)] shrink-0">
          <div className="p-5 space-y-5">
            <div className="flex items-center justify-between gap-3 mb-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[hsl(38,92%,50%)]" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white/70">Design Brief</h2>
              </div>
              <div className="text-[11px] text-white/35">Memory keeps last 10 generations</div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-white/60 uppercase tracking-wider">Design Objective *</Label>
              <Textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="E.g. Premium campaign banner for an NGO climate conference in Kigali with dramatic lighting, cinematic clouds, African landscapes..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 min-h-[100px] text-sm focus-visible:ring-[hsl(38,92%,50%)]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-white/60 uppercase tracking-wider">Headline Text</Label>
              <Input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Text to appear on the graphic"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 text-sm focus-visible:ring-[hsl(38,92%,50%)]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-white/60 uppercase tracking-wider">Supporting Text</Label>
              <Input
                value={supportingText}
                onChange={(e) => setSupportingText(e.target.value)}
                placeholder="Subtitle, date, CTA, etc."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 text-sm focus-visible:ring-[hsl(38,92%,50%)]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-white/60 uppercase tracking-wider">Brand Tone</Label>
              <Input
                value={brandTone}
                onChange={(e) => setBrandTone(e.target.value)}
                placeholder="E.g. bold, elegant, authoritative"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 text-sm focus-visible:ring-[hsl(38,92%,50%)]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-white/60 uppercase tracking-wider">Color Preference</Label>
              <Input
                value={colorPreference}
                onChange={(e) => setColorPreference(e.target.value)}
                placeholder="E.g. deep blue and gold, earthy neutrals"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 text-sm focus-visible:ring-[hsl(38,92%,50%)]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-white/60 uppercase tracking-wider">Target Audience</Label>
              <Input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="E.g. corporate executives, donors, youth"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 text-sm focus-visible:ring-[hsl(38,92%,50%)]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-white/60 uppercase tracking-wider">Upload Logo / Reference</Label>
              <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              <button
                onClick={() => logoInputRef.current?.click()}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-md border border-dashed border-white/15 bg-white/5 hover:bg-white/10 transition-colors text-sm"
              >
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-8 h-8 object-contain rounded" />
                ) : (
                  <Upload className="w-5 h-5 text-white/30" />
                )}
                <span className="text-white/50">{logoFile ? logoFile.name : "Click to upload reference"}</span>
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex items-center justify-center p-4 lg:p-8 overflow-auto bg-[hsl(213,52%,6%)] relative">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-2 border-[hsl(38,92%,50%)]/30 border-t-[hsl(38,92%,50%)] animate-spin" />
                  <Wand2 className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[hsl(38,92%,50%)]" />
                </div>
                <p className="text-white/50 text-sm animate-pulse">Crafting premium graphics...</p>
                <p className="text-white/30 text-xs">Generating {variations} high-end variation{variations > 1 ? "s" : ""}</p>
              </motion.div>
            ) : selectedImage ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-5xl w-full space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-white/45">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[hsl(38,92%,50%)]" />
                    Premium render ready
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    <Layers3 className="w-3.5 h-3.5" />
                    {result?.images.length} variation{(result?.images.length || 0) > 1 ? "s" : ""}
                  </div>
                </div>

                <div
                  className={`relative group cursor-pointer rounded-lg overflow-hidden shadow-2xl shadow-black/50 border border-white/10 transition-transform duration-300 ${previewZoom ? "scale-100" : ""}`}
                  onClick={() => setPreviewZoom(!previewZoom)}
                >
                  <img src={selectedImage} alt="Generated design" className="w-full h-auto" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <ZoomIn className="w-8 h-8 text-white" />
                  </div>
                </div>

                {result && result.images.length > 1 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                    {result.images.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`rounded-lg overflow-hidden border transition-all ${
                          selectedImageIndex === index
                            ? "border-[hsl(38,92%,50%)] shadow-lg shadow-[hsl(38,92%,50%)]/15"
                            : "border-white/10 opacity-75 hover:opacity-100"
                        }`}
                      >
                        <img src={image} alt={`Generated variation ${index + 1}`} className="aspect-square w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                {result?.text && <p className="text-white/40 text-sm text-center">{result.text}</p>}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 text-center max-w-md"
              >
                <div className="w-24 h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <ImageIcon className="w-10 h-10 text-white/20" />
                </div>
                <h3 className="text-lg font-semibold text-white/40">Your design will appear here</h3>
                <p className="text-sm text-white/25">
                  Build a strong brief, generate up to 10 premium variations, and revisit saved graphics anytime from the memory panel.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <aside className="w-full lg:w-72 xl:w-80 border-l border-white/10 overflow-y-auto bg-[hsl(213,52%,9%)] shrink-0">
          <div className="p-5 space-y-6">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60">Design Style</h3>
              <div className="grid grid-cols-1 gap-1.5">
                {STYLE_PRESETS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setStyle(item.id)}
                    className={`text-left px-3 py-2.5 rounded-md border transition-all text-sm ${
                      style === item.id
                        ? "border-[hsl(38,92%,50%)] bg-[hsl(38,92%,50%)]/10 text-white"
                        : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
                    }`}
                  >
                    <span className="font-medium block">{item.label}</span>
                    <span className="text-[11px] text-white/40 block mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60">Format Size</h3>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white text-sm focus:ring-[hsl(38,92%,50%)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(213,52%,12%)] border-white/10">
                  {FORMAT_SIZES.map((item) => (
                    <SelectItem key={item.id} value={item.id} className="text-white/80 focus:bg-white/10 focus:text-white">
                      {item.label} — {item.desc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60">Quality</h3>
              <RadioGroup value={quality} onValueChange={setQuality} className="space-y-1.5">
                {QUALITY_OPTIONS.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md border cursor-pointer transition-all text-sm ${
                      quality === item.id
                        ? "border-[hsl(38,92%,50%)] bg-[hsl(38,92%,50%)]/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <RadioGroupItem value={item.id} className="border-white/30 text-[hsl(38,92%,50%)]" />
                    <div>
                      <span className="font-medium text-white">{item.label}</span>
                      <span className="text-[11px] text-white/40 ml-2">{item.desc}</span>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60">How many graphics</h3>
              <div className="grid grid-cols-3 gap-2">
                {VARIATION_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setVariations(option)}
                    className={`rounded-md border px-3 py-2 text-sm font-medium transition-all ${
                      variations === option
                        ? "border-[hsl(38,92%,50%)] bg-[hsl(38,92%,50%)]/10 text-white"
                        : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-white/35">Generate 1, 4, or up to 10 polished concepts in one run.</p>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading || !objective.trim()}
              className="w-full h-12 bg-[hsl(38,92%,50%)] hover:bg-[hsl(38,92%,45%)] text-[hsl(213,52%,10%)] font-bold text-sm shadow-lg shadow-[hsl(38,92%,50%)]/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Graphics
                </>
              )}
            </Button>

            {selectedImage && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60">Export</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadImage(selectedImage, `design-${Date.now()}.png`)}
                    className="flex-1 border-white/10 text-white/70 hover:text-white hover:bg-white/10 text-xs"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" /> PNG
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadImage(selectedImage, `design-${Date.now()}.jpg`)}
                    className="flex-1 border-white/10 text-white/70 hover:text-white hover:bg-white/10 text-xs"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" /> JPG
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedImage);
                    toast({ title: "Image data copied to clipboard" });
                  }}
                  className="w-full border-white/10 text-white/70 hover:text-white hover:bg-white/10 text-xs"
                >
                  <Copy className="w-3.5 h-3.5 mr-1" /> Copy Image Data
                </Button>
              </div>
            )}

            <div className="space-y-3 border-t border-white/10 pt-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60">Graphics Memory</h3>
                {history.length > 0 && (
                  <button onClick={clearHistory} className="text-[11px] text-white/35 hover:text-white/70 transition-colors">
                    <Trash2 className="w-3.5 h-3.5 inline mr-1" /> Clear
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-white/35">
                  Generated graphics will be saved here automatically.
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => restoreFromHistory(item)}
                      className="w-full rounded-lg border border-white/10 bg-white/5 p-2 text-left hover:bg-white/10 transition-colors"
                    >
                      <div className="flex gap-3">
                        <img src={item.images[0]} alt={item.headline || item.objective} className="h-16 w-16 rounded-md object-cover shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-medium text-white line-clamp-2">
                            {item.headline || item.objective}
                          </div>
                          <div className="mt-1 text-[11px] text-white/40">
                            {STYLE_PRESETS.find((preset) => preset.id === item.style)?.label || item.style} • {item.variations} graphics
                          </div>
                          <div className="text-[11px] text-white/30 mt-1">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DesignStudio;
