import { useState, useEffect, useCallback } from "react";
import { BidSnapLogo } from "@/components/BidSnapLogo";
import { PasswordGate } from "@/components/PasswordGate";
import { ProtectionLayer } from "@/components/ProtectionLayer";
import { Watermark } from "@/components/Watermark";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Play, Pause, MapPin, Satellite,
  DollarSign, FileText, CheckCircle2, LayoutDashboard, Zap,
  ArrowLeft, Users, TrendingUp, Shield
} from "lucide-react";
import { Link } from "wouter";

const SATELLITE_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/JeB2Dprf4iNsX1sCUil2ah/sandbox/Zsyu4B084VKGFF2JaXEYuH-img-2_1771600451000_na1fn_Ymlkc25hcC1zYXRlbGxpdGUtdmlldw.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSmVCMkRwcmY0aU5zWDFzQ1VpbDJhaC9zYW5kYm94L1pzeXU0QjA4NFZLR0ZGMkphWEVZdUgtaW1nLTJfMTc3MTYwMDQ1MTAwMF9uYTFmbl9ZbWxrYzI1aGNDMXpZWFJsYkd4cGRHVXRkbWxsZHcucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=wELocY0FfoQkl-4VcQZTVxCiu-4UVQbWt2iIapMA1633vRXyX4WlLlfGvv4qKrbLr3kC-7QpQAscy99IK0YPaNW206vrB49Qx0-BhA6jr7gKlX~lDt3y-ujFk7F7I3NcfB7NMmNSvWYmn-EujDNQc6SeeQvKA-4AagdTc8EOSuZIdiTPTSYGtXKx0TqniDYFhyyU0a2iuggzwfFPz5gauUKBoFhErV9BT7uxD25QGn~YF~O5dhNLsv7GRkHsykcuGus-xc6p5ftvoOEjTRVPHlepXwAnpGC~eCy8HPrEwMdYSkYYW7~8O5iFO~jtWN~PVpwdIxOL5M3VOLl1gHGLQw__";

const ADMIN_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/JeB2Dprf4iNsX1sCUil2ah/sandbox/Zsyu4B084VKGFF2JaXEYuH-img-3_1771600445000_na1fn_Ymlkc25hcC1hZG1pbi1kYXNoYm9hcmQ.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSmVCMkRwcmY0aU5zWDFzQ1VpbDJhaC9zYW5kYm94L1pzeXU0QjA4NFZLR0ZGMkphWEVZdUgtaW1nLTNfMTc3MTYwMDQ0NTAwMF9uYTFmbl9ZbWxrYzI1aGNDMWhaRzFwYmkxa1lYTm9ZbTloY21RLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=oVzfJSjyizDadmv2Xn~QKXzJ8w48NCKL9T1v~zQfvoLCZ7jlahJeNSnrUs~wnegV-fL~AAzmTAA4NarrIhIkrgVjLNaAo3gzui4bMYQVw1l3veQjdgQnSTpRKRAq9LSQ0H56V3qNRLykiwEoXu~dj0SWBSjT6fBfKnkWFrVWMe0Gj04wnASYfm72T7C9j1QrWRmiE5TIXz~VkO9s6HAnTX~k7Fd769Rycl3zG-qgUVygfMj6OR6dHZVHk-JJ2kZIfB9TsdG0WCoeKw8RJoeAfUh5QICxrL-GcU33qRf7wvZhTF4NU8gg3Vf1v5~BwJlx-wpeq2KfMmwrHzlj-o~eeQ__";

const HERO_BG = "https://private-us-east-1.manuscdn.com/sessionFile/JeB2Dprf4iNsX1sCUil2ah/sandbox/Zsyu4B084VKGFF2JaXEYuH-img-1_1771600445000_na1fn_Ymlkc25hcC1oZXJvLWJn.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSmVCMkRwcmY0aU5zWDFzQ1VpbDJhaC9zYW5kYm94L1pzeXU0QjA4NFZLR0ZGMkphWEVZdUgtaW1nLTFfMTc3MTYwMDQ0NTAwMF9uYTFmbl9ZbWxrYzI1aGNDMW9aWEp2TFdKbi5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=ECx6XK1Y7Yd6j0nhlAurTvtiEKBMnlXlV3BUF73ustsipF29h-iFej07AAJl~bJQWdnhR66V84ocramkg1~wSDt8dDOmG-4-swCsGlPWNvofN9flHvdv-sX32dawQvgONHRWdIPEjawy1dWyI6V84V4iilyFJkkp8dJdi2sZxv0Qgmm5nBk-Gc9Tj3QTMAGTGK2ZhJzwXDB8UlCIpDNxtZT70vhCXRwgZAMgJHLle-mxnZyqk5HxXI1uJ7AsK2SOOaqAf1MCUwrCrHlSbyaoz5Bkzy4y9q1p~ULm16bPMu0rDR9HJowwLU4oE0wEvcamqZu7XRdPE5GzfSL0t1jpZQ__";

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  iconColor: string;
  content: React.ReactNode;
  callout?: string;
  duration: number; // seconds for auto-advance
}

function WalkthroughContent() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const slides: Slide[] = [
    {
      id: "intro",
      title: "Welcome to BidSnap",
      subtitle: "Instant Pricing for Service Contractors",
      icon: Zap,
      iconColor: "text-primary",
      duration: 6,
      callout: "White-label SaaS platform — your brand, your pricing",
      content: (
        <div className="relative rounded-2xl overflow-hidden border border-border/50 aspect-video">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end pb-12">
            <BidSnapLogo size="lg" />
            <p className="text-white/70 mt-4 text-lg">Instant Pricing for Service Contractors</p>
            <div className="flex gap-4 mt-6">
              {["Sealcoating", "Landscaping", "Roofing", "Painting", "Pressure Washing"].map((s) => (
                <span key={s} className="px-3 py-1 rounded-full bg-white/10 text-white/60 text-xs border border-white/10">{s}</span>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "address",
      title: "Step 1: Address Entry",
      subtitle: "Customer enters their property address",
      icon: MapPin,
      iconColor: "text-blue-400",
      duration: 7,
      callout: "Auto-complete powered by Google Maps — finds any address instantly",
      content: (
        <div className="glass-card rounded-2xl p-8 max-w-lg mx-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold">Enter Your Property Address</h3>
            <p className="text-sm text-muted-foreground mt-1">We'll locate your property using satellite imagery</p>
          </div>
          <div className="space-y-3">
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
              <div className="w-full pl-12 pr-4 py-4 bg-input border border-primary/30 rounded-xl text-foreground text-lg">
                <TypewriterText text="123 Oak Street, Ann Arbor, MI" speed={60} />
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              className="bg-secondary/50 rounded-lg p-3 border border-border/50"
            >
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-medium">Property found</span>
                <span className="text-muted-foreground">— Ann Arbor, MI 48103</span>
              </div>
            </motion.div>
          </div>
        </div>
      ),
    },
    {
      id: "questions",
      title: "Step 2: Qualifying Questions",
      subtitle: "Smart questions filter leads and gather job details",
      icon: CheckCircle2,
      iconColor: "text-green-400",
      duration: 7,
      callout: "Customizable questions per service type — filter out bad leads automatically",
      content: (
        <div className="glass-card rounded-2xl p-8 max-w-lg mx-auto">
          <div className="space-y-4">
            {[
              { q: "How old is your asphalt?", a: "5–10 years", delay: 0 },
              { q: "Overall condition?", a: "Good — minor wear", delay: 0.3 },
              { q: "Any significant cracks?", a: "Hairline cracks only", delay: 0.6 },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: item.delay + 0.5 }}
                className="space-y-2"
              >
                <label className="text-sm font-medium">{item.q}</label>
                <div className="flex items-center gap-2 px-4 py-3 bg-input border border-border rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  <span className="text-sm">{item.a}</span>
                </div>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="flex items-center gap-2 text-xs text-green-400 mt-2"
            >
              <Shield className="w-3 h-3" />
              Lead qualified — proceeding to measurement
            </motion.div>
          </div>
        </div>
      ),
    },
    {
      id: "satellite",
      title: "Step 3: Satellite Measurement",
      subtitle: "AI measures the driveway from satellite imagery",
      icon: Satellite,
      iconColor: "text-amber-400",
      duration: 8,
      callout: "No site visit needed — AI calculates area to within 2% accuracy",
      content: (
        <div className="relative rounded-2xl overflow-hidden border border-border/50 max-w-2xl mx-auto">
          <img src={SATELLITE_IMG} alt="Satellite measurement" className="w-full aspect-video object-cover" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 2, duration: 0.5 }}
              className="bg-black/80 backdrop-blur-sm rounded-xl px-6 py-4 border border-primary/30"
            >
              <div className="text-center">
                <div className="text-xs text-primary font-mono mb-1">MEASUREMENT COMPLETE</div>
                <div className="text-3xl font-extrabold font-mono text-white">2,400 sq ft</div>
                <div className="text-xs text-muted-foreground mt-1">Confidence: 98.2%</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      ),
    },
    {
      id: "pricing",
      title: "Step 4: Instant Price Generated",
      subtitle: "Customer sees their quote in under 60 seconds",
      icon: DollarSign,
      iconColor: "text-green-400",
      duration: 7,
      callout: "Your pricing formula, your margins — fully customizable per service",
      content: (
        <div className="glass-card rounded-2xl p-8 max-w-lg mx-auto text-center glow-border">
          <div className="text-sm text-muted-foreground mb-2">Driveway Sealcoating</div>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          >
            <div className="text-6xl font-extrabold text-gradient font-mono mb-2">$600</div>
          </motion.div>
          <div className="text-sm text-muted-foreground mb-6">Based on 2,400 sq ft measured area</div>
          <div className="grid grid-cols-2 gap-3 text-left">
            {[
              { label: "Surface Area", value: "2,400 sq ft" },
              { label: "Price / sq ft", value: "$0.25" },
              { label: "Condition", value: "Good" },
              { label: "Est. Duration", value: "3–4 hours" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.15 }}
                className="bg-secondary/50 rounded-lg p-3"
              >
                <div className="text-xs text-muted-foreground">{item.label}</div>
                <div className="text-sm font-bold font-mono">{item.value}</div>
              </motion.div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "contract",
      title: "Step 5: Mini Contract Acceptance",
      subtitle: "Customer accepts terms with checkbox confirmation",
      icon: FileText,
      iconColor: "text-purple-400",
      duration: 8,
      callout: "Legally binding mini contract — customizable terms per business",
      content: (
        <div className="glass-card rounded-2xl p-8 max-w-lg mx-auto">
          <div className="bg-secondary/30 rounded-xl p-4 text-sm space-y-2 mb-5 border border-border/50 max-h-32 overflow-hidden">
            <p className="font-semibold text-xs">Anthony's Asphalt — Service Agreement</p>
            <p className="text-muted-foreground text-xs">Professional sealcoating of approximately 2,400 sq ft...</p>
            <p className="text-muted-foreground text-xs">Total Price: $600.00 — Due upon completion...</p>
          </div>
          {[
            { label: "I agree to the terms and conditions", delay: 1 },
            { label: "I confirm the scope of work is accurate", delay: 1.5 },
            { label: "I understand the payment terms ($600)", delay: 2 },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: item.delay }}
              className="flex items-center gap-3 py-2"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: item.delay + 0.3, type: "spring" }}
                className="w-5 h-5 rounded bg-primary flex items-center justify-center shrink-0"
              >
                <CheckCircle2 className="w-3 h-3 text-white" />
              </motion.div>
              <span className="text-sm text-muted-foreground">{item.label}</span>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3 }}
            className="mt-4 w-full py-3 bg-green-600 rounded-xl text-center text-white font-semibold text-sm"
          >
            ✓ Contract Accepted — Deal Closed!
          </motion.div>
        </div>
      ),
    },
    {
      id: "admin",
      title: "Step 6: Admin Panel",
      subtitle: "You see everything — quotes, customers, revenue, analytics",
      icon: LayoutDashboard,
      iconColor: "text-primary",
      duration: 8,
      callout: "Full admin dashboard — manage quotes, customers, pricing models, and more",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: "Total Quotes", value: "247", icon: FileText, color: "text-blue-400" },
              { label: "Accepted", value: "183", icon: CheckCircle2, color: "text-green-400" },
              { label: "Revenue", value: "$91.5K", icon: TrendingUp, color: "text-amber-400" },
              { label: "Customers", value: "156", icon: Users, color: "text-purple-400" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="glass-card rounded-xl p-4"
              >
                <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                <div className="text-xl font-bold font-mono">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="rounded-xl overflow-hidden border border-border/50"
          >
            <img src={ADMIN_IMG} alt="Admin Dashboard" className="w-full" />
          </motion.div>
        </div>
      ),
    },
    {
      id: "cta",
      title: "Ready to Get BidSnap?",
      subtitle: "Your brand. Your pricing. Your customers.",
      icon: Zap,
      iconColor: "text-accent",
      duration: 10,
      content: (
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <BidSnapLogo size="lg" />
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Get your own white-label instant pricing tool. Setup in 48 hours. No coding required.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { value: "24/7", label: "Quote Generation" },
              { value: "< 60s", label: "Time to Quote" },
              { value: "340%", label: "More Leads" },
            ].map((stat) => (
              <div key={stat.label} className="glass-card rounded-xl p-4">
                <div className="text-2xl font-bold text-gradient font-mono">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="glass-card rounded-xl p-6 max-w-md mx-auto glow-border">
            <p className="text-sm font-semibold mb-2">Contact Anthony to get started</p>
            <p className="text-xs text-muted-foreground">Custom setup • Your branding • Your pricing formula</p>
          </div>
        </div>
      ),
    },
  ];

  const goNext = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
    setProgress(0);
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
    setProgress(0);
  }, []);

  // Auto-advance timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = 100 / (slides[currentSlide].duration * 10);
        if (prev + increment >= 100) {
          if (currentSlide < slides.length - 1) {
            goNext();
          } else {
            setIsPlaying(false);
          }
          return 0;
        }
        return prev + increment;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, currentSlide, slides, goNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
      if (e.key === "p") setIsPlaying((p) => !p);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  const slide = slides[currentSlide];

  return (
    <ProtectionLayer>
      <Watermark />
      <div className="min-h-screen flex flex-col bg-background">
        {/* Top bar */}
        <header className="border-b border-border/50 bg-card/80 backdrop-blur-xl shrink-0">
          <div className="container flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <Link href="/">
                <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              </Link>
              <div className="w-px h-6 bg-border" />
              <BidSnapLogo size="sm" />
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                Product Walkthrough
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-mono">
                {currentSlide + 1} / {slides.length}
              </span>
            </div>
          </div>
        </header>

        {/* Slide content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex items-center justify-center p-6 overflow-auto">
            <div className="w-full max-w-4xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  {/* Slide header */}
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-secondary flex items-center justify-center`}>
                      <slide.icon className={`w-6 h-6 ${slide.iconColor}`} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{slide.title}</h2>
                      <p className="text-sm text-muted-foreground">{slide.subtitle}</p>
                    </div>
                  </div>

                  {/* Slide body */}
                  {slide.content}

                  {/* Callout */}
                  {slide.callout && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent/5 border border-accent/20"
                    >
                      <Zap className="w-4 h-4 text-accent shrink-0" />
                      <span className="text-sm text-accent">{slide.callout}</span>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Controls */}
          <div className="border-t border-border/50 bg-card/80 backdrop-blur-xl shrink-0">
            {/* Progress bar */}
            <div className="h-1 bg-secondary">
              <div
                className="h-full bg-primary transition-all duration-100"
                style={{ width: `${((currentSlide / (slides.length - 1)) * 100) + (progress / slides.length)}%` }}
              />
            </div>
            <div className="container flex items-center justify-between py-3">
              <Button
                variant="outline"
                size="sm"
                onClick={goPrev}
                disabled={currentSlide === 0}
                className="gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Button>

              <div className="flex items-center gap-3">
                {/* Slide dots */}
                <div className="flex gap-1.5">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setCurrentSlide(i); setProgress(0); }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentSlide ? "bg-primary w-6" : i < currentSlide ? "bg-primary/40" : "bg-secondary"
                      }`}
                    />
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="gap-1"
                >
                  {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  {isPlaying ? "Pause" : "Auto-play"}
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goNext}
                disabled={currentSlide === slides.length - 1}
                className="gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ProtectionLayer>
  );
}

function TypewriterText({ text, speed = 50 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    setDisplayed("");
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      <span className="animate-pulse text-primary">|</span>
    </span>
  );
}

export default function Walkthrough() {
  return (
    <PasswordGate>
      <WalkthroughContent />
    </PasswordGate>
  );
}
