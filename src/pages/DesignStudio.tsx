import { useState, useRef } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import {
  Paintbrush,
  Download,
  Loader2,
  Upload,
  Sparkles,
  Image as ImageIcon,
  Wand2,
  RotateCcw,
  ZoomIn,
  Copy,
  ChevronLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const GRAPHIC_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/graphic-generator`;
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

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
  { id: "high", label: "High", desc: "Better detail" },
  { id: "ultra", label: "Ultra", desc: "Hyper-realistic, cinematic" },
];

type GeneratedDesign = {
  images: string[];
  text: string;
};

const DesignStudio = () => {
  // Form state
  const [objective, setObjective] = useState("");
  const [headline, setHeadline] = useState("");
  const [supportingText, setSupportingText] = useState("");
  const [brandTone, setBrandTone] = useState("");
  const [colorPreference, setColorPreference] = useState("");
  const [audience, setAudience] = useState("");
  const [style, setStyle] = useState("cinematic");
  const [format, setFormat] = useState("instagram");
  const [quality, setQuality] = useState("high");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Generation state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedDesign | null>(null);
  const [previewZoom, setPreviewZoom] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.readAsDataURL(file);
    });

  const buildPrompt = () => {
    const selectedStyle = STYLE_PRESETS.find((s) => s.id === style);
    const selectedFormat = FORMAT_SIZES.find((f) => f.id === format);
    const qualityLabel = QUALITY_OPTIONS.find((q) => q.id === quality);

    let prompt = `DESIGN REQUEST:\n`;
    prompt += `Objective: ${objective}\n`;
    if (headline) prompt += `Headline text on graphic: "${headline}"\n`;
    if (supportingText) prompt += `Supporting text: "${supportingText}"\n`;
    if (brandTone) prompt += `Brand tone: ${brandTone}\n`;
    if (colorPreference) prompt += `Color preference: ${colorPreference}\n`;
    if (audience) prompt += `Target audience: ${audience}\n`;
    prompt += `Visual style: ${selectedStyle?.label} — ${selectedStyle?.desc}\n`;
    prompt += `Format: ${selectedFormat?.label} (${selectedFormat?.desc})\n`;
    prompt += `Quality: ${qualityLabel?.label} — ${qualityLabel?.desc}\n`;
    prompt += `\nIMPORTANT DESIGN RULES:\n`;
    prompt += `- Create a COMPLETE, ready-to-use graphic design — NOT just a photo\n`;
    prompt += `- Include all text elements with perfect, legible typography\n`;
    prompt += `- Use professional layout composition with visual hierarchy\n`;
    prompt += `- Apply ${selectedStyle?.label} visual style consistently\n`;
    prompt += `- Hyper-realistic imagery with cinematic lighting and depth\n`;
    prompt += `- Professional color grading and contrast\n`;
    prompt += `- The design should look like it was created by a top creative agency\n`;
    if (quality === "ultra") {
      prompt += `- ULTRA quality: 8K resolution feel, extreme detail, photographic realism\n`;
      prompt += `- Cinematic depth of field, dramatic lighting, HDR contrast\n`;
    }
    return prompt;
  };

  const handleGenerate = async () => {
    if (!objective.trim()) {
      toast({ title: "Enter a design objective", variant: "destructive" });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const prompt = buildPrompt();
      const editImage = logoFile ? await fileToBase64(logoFile) : undefined;

      const resp = await fetch(GRAPHIC_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${KEY}`,
        },
        body: JSON.stringify({ prompt, editImage }),
      });

      if (resp.status === 429) {
        toast({ title: "Rate limit reached. Please wait a moment and try again.", variant: "destructive" });
        setLoading(false);
        return;
      }
      if (resp.status === 402) {
        toast({ title: "Usage limit reached. Please add credits.", variant: "destructive" });
        setLoading(false);
        return;
      }
      if (!resp.ok) throw new Error("Generation failed");

      const data = await resp.json();
      const images = (data.images || []).map((img: any) =>
        typeof img === "string" ? img : img?.image_url?.url || ""
      );
      setResult({ images, text: data.text || "" });
    } catch (e: any) {
      toast({ title: e.message || "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (dataUrl: string, filename: string) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    a.click();
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
    setLogoFile(null);
    setLogoPreview(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-[hsl(213,52%,8%)] text-[hsl(210,40%,95%)] flex flex-col">
      {/* Top bar */}
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

      {/* Main workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT PANEL — Inputs */}
        <aside className="w-full lg:w-80 xl:w-96 border-r border-white/10 overflow-y-auto bg-[hsl(213,52%,9%)] shrink-0">
          <div className="p-5 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[hsl(38,92%,50%)]" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white/70">Design Brief</h2>
            </div>

            {/* Objective */}
            <div className="space-y-1.5">
              <Label className="text-xs text-white/60 uppercase tracking-wider">Design Objective *</Label>
              <Textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="E.g. Premium campaign banner for an NGO climate conference in Kigali with dramatic lighting, cinematic clouds, African landscapes..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 min-h-[100px] text-sm focus-visible:ring-[hsl(38,92%,50%)]"
              />
            </div>

            {/* Headline */}
            <div className="space-y-1.5">
              <Label className="text-xs text-white/60 uppercase tracking-wider">Headline Text</Label>
              <Input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Text to appear on the graphic"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 text-sm focus-visible:ring-[hsl(38,92%,50%)]"
              />
            </div>

            {/* Supporting Text */}
            <div className="space-y-1.5">
              <Label className="text-xs text-white/60 uppercase tracking-wider">Supporting Text</Label>
              <Input
                value={supportingText}
                onChange={(e) => setSupportingText(e.target.value)}
                placeholder="Subtitle, date, CTA, etc."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 text-sm focus-visible:ring-[hsl(38,92%,50%)]"
              />
            </div>

            {/* Brand Tone */}
            <div className="space-y-1.5">
              <Label className="text-xs text-white/60 uppercase tracking-wider">Brand Tone</Label>
              <Input
                value={brandTone}
                onChange={(e) => setBrandTone(e.target.value)}
                placeholder="E.g. bold, elegant, playful, authoritative"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 text-sm focus-visible:ring-[hsl(38,92%,50%)]"
              />
            </div>

            {/* Color Preference */}
            <div className="space-y-1.5">
              <Label className="text-xs text-white/60 uppercase tracking-wider">Color Preference</Label>
              <Input
                value={colorPreference}
                onChange={(e) => setColorPreference(e.target.value)}
                placeholder="E.g. deep blue and gold, earth tones"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 text-sm focus-visible:ring-[hsl(38,92%,50%)]"
              />
            </div>

            {/* Audience */}
            <div className="space-y-1.5">
              <Label className="text-xs text-white/60 uppercase tracking-wider">Target Audience</Label>
              <Input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="E.g. corporate executives, youth, donors"
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 text-sm focus-visible:ring-[hsl(38,92%,50%)]"
              />
            </div>

            {/* Logo Upload */}
            <div className="space-y-1.5">
              <Label className="text-xs text-white/60 uppercase tracking-wider">Upload Logo</Label>
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
                <span className="text-white/50">{logoFile ? logoFile.name : "Click to upload logo"}</span>
              </button>
            </div>
          </div>
        </aside>

        {/* CENTER — Preview Canvas */}
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
                <p className="text-white/50 text-sm animate-pulse">Generating your design...</p>
                <p className="text-white/30 text-xs">This may take 15–30 seconds for ultra quality</p>
              </motion.div>
            ) : result && result.images.length > 0 ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-4xl w-full"
              >
                <div
                  className={`relative group cursor-pointer rounded-lg overflow-hidden shadow-2xl shadow-black/50 border border-white/10 transition-transform duration-300 ${
                    previewZoom ? "scale-100" : ""
                  }`}
                  onClick={() => setPreviewZoom(!previewZoom)}
                >
                  <img
                    src={result.images[0]}
                    alt="Generated design"
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <ZoomIn className="w-8 h-8 text-white" />
                  </div>
                </div>
                {result.text && (
                  <p className="mt-4 text-white/40 text-sm text-center">{result.text}</p>
                )}
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
                  Fill in the brief on the left, choose your style and format on the right, then click Generate.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* RIGHT PANEL — Controls */}
        <aside className="w-full lg:w-72 xl:w-80 border-l border-white/10 overflow-y-auto bg-[hsl(213,52%,9%)] shrink-0">
          <div className="p-5 space-y-6">
            {/* Style Preset */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60">Design Style</h3>
              <div className="grid grid-cols-1 gap-1.5">
                {STYLE_PRESETS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`text-left px-3 py-2.5 rounded-md border transition-all text-sm ${
                      style === s.id
                        ? "border-[hsl(38,92%,50%)] bg-[hsl(38,92%,50%)]/10 text-white"
                        : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
                    }`}
                  >
                    <span className="font-medium block">{s.label}</span>
                    <span className="text-[11px] text-white/40 block mt-0.5">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Format */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60">Format Size</h3>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white text-sm focus:ring-[hsl(38,92%,50%)]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(213,52%,12%)] border-white/10">
                  {FORMAT_SIZES.map((f) => (
                    <SelectItem key={f.id} value={f.id} className="text-white/80 focus:bg-white/10 focus:text-white">
                      {f.label} — {f.desc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quality */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60">Quality</h3>
              <RadioGroup value={quality} onValueChange={setQuality} className="space-y-1.5">
                {QUALITY_OPTIONS.map((q) => (
                  <label
                    key={q.id}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-md border cursor-pointer transition-all text-sm ${
                      quality === q.id
                        ? "border-[hsl(38,92%,50%)] bg-[hsl(38,92%,50%)]/10"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <RadioGroupItem value={q.id} className="border-white/30 text-[hsl(38,92%,50%)]" />
                    <div>
                      <span className="font-medium text-white">{q.label}</span>
                      <span className="text-[11px] text-white/40 ml-2">{q.desc}</span>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>

            {/* Generate Button */}
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
                  Generate Design
                </>
              )}
            </Button>

            {/* Export */}
            {result && result.images.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60">Export</h3>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadImage(result.images[0], `design-${Date.now()}.png`)}
                    className="flex-1 border-white/10 text-white/70 hover:text-white hover:bg-white/10 text-xs"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" /> PNG
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadImage(result.images[0], `design-${Date.now()}.jpg`)}
                    className="flex-1 border-white/10 text-white/70 hover:text-white hover:bg-white/10 text-xs"
                  >
                    <Download className="w-3.5 h-3.5 mr-1" /> JPG
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(result.images[0]);
                    toast({ title: "Image URL copied to clipboard" });
                  }}
                  className="w-full border-white/10 text-white/70 hover:text-white hover:bg-white/10 text-xs"
                >
                  <Copy className="w-3.5 h-3.5 mr-1" /> Copy Image Data
                </Button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DesignStudio;
