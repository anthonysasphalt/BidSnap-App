import { useState, useEffect, useRef, useCallback } from "react";
import { BidSnapLogo } from "@/components/BidSnapLogo";
import { ProtectionLayer } from "@/components/ProtectionLayer";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Play, Shield, Lock, AlertTriangle, Eye, Clock,
  ChevronRight, ChevronLeft, Zap, MapPin, Satellite,
  DollarSign, FileText, CheckCircle2, LayoutDashboard, Pause
} from "lucide-react";
import { useParams } from "wouter";

const MAX_VIEWS = 3;
const EXPIRY_HOURS = 48;

interface ViewerData {
  email: string;
  views: number;
  firstView: number;
  token: string;
}

function getViewerData(token: string): ViewerData | null {
  try {
    const data = localStorage.getItem(`bidsnap_viewer_${token}`);
    if (!data || data === "undefined") return null;
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse viewer data:", e);
    return null;
  }
}

function setViewerData(token: string, data: ViewerData | null) {
  if (!data) {
    localStorage.removeItem(`bidsnap_viewer_${token}`);
    return;
  }
  try {
    localStorage.setItem(`bidsnap_viewer_${token}`, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save viewer data:", e);
  }
}

function isExpired(data: ViewerData): boolean {
  const elapsed = Date.now() - data.firstView;
  return elapsed > EXPIRY_HOURS * 60 * 60 * 1000;
}

function isMaxViews(data: ViewerData): boolean {
  return data.views >= MAX_VIEWS;
}

// The "video" is actually an animated slide presentation rendered in-browser
// This prevents any download/capture of actual video files

const SATELLITE_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/JeB2Dprf4iNsX1sCUil2ah/sandbox/Zsyu4B084VKGFF2JaXEYuH-img-2_1771600451000_na1fn_Ymlkc25hcC1zYXRlbGxpdGUtdmlldw.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSmVCMkRwcmY0aU5zWDFzQ1VpbDJhaC9zYW5kYm94L1pzeXU0QjA4NFZLR0ZGMkphWEVZdUgtaW1nLTJfMTc3MTYwMDQ1MTAwMF9uYTFmbl9ZbWxrYzI1aGNDMXpZWFJsYkd4cGRHVXRkbWxsZHcucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=wELocY0FfoQkl-4VcQZTVxCiu-4UVQbWt2iIapMA1633vRXyX4WlLlfGvv4qKrbLr3kC-7QpQAscy99IK0YPaNW206vrB49Qx0-BhA6jr7gKlX~lDt3y-ujFk7F7I3NcfB7NMmNSvWYmn-EujDNQc6SeeQvKA-4AagdTc8EOSuZIdiTPTSYGtXKx0TqniDYFhyyU0a2iuggzwfFPz5gauUKBoFhErV9BT7uxD25QGn~YF~O5dhNLsv7GRkHsykcuGus-xc6p5ftvoOEjTRVPHlepXwAnpGC~eCy8HPrEwMdYSkYYW7~8O5iFO~jtWN~PVpwdIxOL5M3VOLl1gHGLQw__";

const ADMIN_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/JeB2Dprf4iNsX1sCUil2ah/sandbox/Zsyu4B084VKGFF2JaXEYuH-img-3_1771600445000_na1fn_Ymlkc25hcC1hZG1pbi1kYXNoYm9hcmQ.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSmVCMkRwcmY0aU5zWDFzQ1VpbDJhaC9zYW5kYm94L1pzeXU0QjA4NFZLR0ZGMkphWEVZdUgtaW1nLTNfMTc3MTYwMDQ0NTAwMF9uYTFmbl9ZbWxrYzI1aGNDMWhaRzFwYmkxa1lYTm9ZbTloY21RLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=oVzfJSjyizDadmv2Xn~QKXzJ8w48NCKL9T1v~zQfvoLCZ7jlahJeNSnrUs~wnegV-fL~AAzmTAA4NarrIhIkrgVjLNaAo3gzui4bMYQVw1l3veQjdgQnSTpRKRAq9LSQ0H56V3qNRLykiwEoXu~dj0SWBSjT6fBfKnkWFrVWMe0Gj04wnASYfm72T7C9j1QrWRmiE5TIXz~VkO9s6HAnTX~k7Fd769Rycl3zG-qgUVygfMj6OR6dHZVHk-JJ2kZIfB9TsdG0WCoeKw8RJoeAfUh5QICxrL-GcU33qRf7wvZhTF4NU8gg3Vf1v5~BwJlx-wpeq2KfMmwrHzlj-o~eeQ__";

interface VideoSlide {
  id: string;
  duration: number;
  render: () => React.ReactNode;
}

function SecureVideoPlayer({ email, token }: { email: string; token: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const slides: VideoSlide[] = [
    {
      id: "intro",
      duration: 5,
      render: () => (
        <div className="flex flex-col items-center justify-center h-full gap-6">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
            <BidSnapLogo size="lg" />
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-xl text-white/70">
            Instant Pricing for Service Contractors
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-sm text-white/40">
            Product Demo • Confidential
          </motion.div>
        </div>
      ),
    },
    {
      id: "problem",
      duration: 6,
      render: () => (
        <div className="flex flex-col items-center justify-center h-full gap-6 px-12">
          <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl font-bold text-white text-center">
            The Problem
          </motion.h2>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="max-w-lg text-center space-y-4">
            <p className="text-white/60 text-lg">Contractors waste hours driving to job sites just to give estimates.</p>
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { icon: Clock, label: "2+ hours per estimate", color: "text-red-400" },
                { icon: DollarSign, label: "$50+ in gas & time", color: "text-red-400" },
                { icon: AlertTriangle, label: "50% no-show rate", color: "text-red-400" },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + i * 0.3 }} className="flex flex-col items-center gap-2">
                  <item.icon className={`w-8 h-8 ${item.color}`} />
                  <span className="text-xs text-white/50">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      ),
    },
    {
      id: "step1",
      duration: 6,
      render: () => (
        <div className="flex flex-col items-center justify-center h-full gap-4 px-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center">
            <MapPin className="w-8 h-8 text-blue-400" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-2xl font-bold text-white">
            Step 1: Customer Enters Address
          </motion.h2>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="bg-white/5 border border-white/10 rounded-xl px-6 py-4 flex items-center gap-3 max-w-md w-full">
            <MapPin className="w-5 h-5 text-blue-400" />
            <span className="text-white">123 Oak Street, Ann Arbor, MI</span>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle2 className="w-4 h-4" /> Property located instantly
          </motion.div>
        </div>
      ),
    },
    {
      id: "step2",
      duration: 6,
      render: () => (
        <div className="flex flex-col items-center justify-center h-full gap-4 px-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-2xl font-bold text-white">
            Step 2: Qualifying Questions
          </motion.h2>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="space-y-3 max-w-sm w-full">
            {["Asphalt age: 5–10 years", "Condition: Good", "Cracks: Hairline only"].map((q, i) => (
              <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8 + i * 0.4 }}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-3">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span className="text-white/80 text-sm">{q}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      ),
    },
    {
      id: "step3",
      duration: 7,
      render: () => (
        <div className="flex flex-col items-center justify-center h-full gap-4 px-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center">
            <Satellite className="w-8 h-8 text-amber-400" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-2xl font-bold text-white">
            Step 3: Satellite Measurement
          </motion.h2>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}
            className="relative rounded-xl overflow-hidden border border-white/10 max-w-lg w-full">
            <img src={SATELLITE_IMG} alt="" className="w-full aspect-video object-cover" />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 rounded-lg px-4 py-2 border border-blue-500/30">
              <span className="text-blue-400 font-mono font-bold">2,400 sq ft detected</span>
            </motion.div>
          </motion.div>
        </div>
      ),
    },
    {
      id: "step4",
      duration: 6,
      render: () => (
        <div className="flex flex-col items-center justify-center h-full gap-4 px-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-green-400" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-2xl font-bold text-white">
            Step 4: Instant Price
          </motion.h2>
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.8, type: "spring" }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <div className="text-sm text-white/40 mb-2">Driveway Sealcoating</div>
            <div className="text-6xl font-extrabold text-gradient font-mono">$600</div>
            <div className="text-sm text-white/40 mt-2">2,400 sq ft • $0.25/sq ft</div>
          </motion.div>
        </div>
      ),
    },
    {
      id: "step5",
      duration: 6,
      render: () => (
        <div className="flex flex-col items-center justify-center h-full gap-4 px-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center">
            <FileText className="w-8 h-8 text-purple-400" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-2xl font-bold text-white">
            Step 5: Contract Accepted
          </motion.h2>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="space-y-2 max-w-sm w-full">
            {["Terms accepted", "Scope confirmed", "Payment agreed"].map((item, i) => (
              <motion.div key={i} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8 + i * 0.3 }}
                className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-3">
                <div className="w-5 h-5 rounded bg-green-500 flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
                <span className="text-white/80 text-sm">{item}</span>
              </motion.div>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }}
            className="bg-green-500/20 border border-green-500/30 rounded-xl px-6 py-3 text-green-400 font-semibold">
            Deal Closed — No Site Visit Needed
          </motion.div>
        </div>
      ),
    },
    {
      id: "admin",
      duration: 7,
      render: () => (
        <div className="flex flex-col items-center justify-center h-full gap-4 px-8">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center">
            <LayoutDashboard className="w-8 h-8 text-blue-400" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-2xl font-bold text-white">
            Admin Dashboard
          </motion.h2>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="rounded-xl overflow-hidden border border-white/10 max-w-2xl w-full">
            <img src={ADMIN_IMG} alt="" className="w-full" />
          </motion.div>
        </div>
      ),
    },
    {
      id: "cta",
      duration: 8,
      render: () => (
        <div className="flex flex-col items-center justify-center h-full gap-6">
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <BidSnapLogo size="lg" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-3xl font-bold text-white text-center">
            Ready to Get BidSnap?
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-white/50 text-center max-w-md">
            Your brand. Your pricing. Your customers. Setup in 48 hours.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="text-sm text-white/40">
            Contact Anthony for access
          </motion.div>
        </div>
      ),
    },
  ];

  const totalDuration = slides.reduce((sum, s) => sum + s.duration, 0);

  const goNext = useCallback(() => {
    setCurrentSlide((prev) => {
      if (prev >= slides.length - 1) {
        setIsPlaying(false);
        return prev;
      }
      return prev + 1;
    });
  }, [slides.length]);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    let elapsed = 0;
    const slideDuration = slides[currentSlide].duration * 1000;

    timerRef.current = setInterval(() => {
      elapsed += 100;
      setProgress(elapsed / slideDuration * 100);
      if (elapsed >= slideDuration) {
        goNext();
        elapsed = 0;
        setProgress(0);
      }
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentSlide, slides, goNext]);

  const handlePlay = () => {
    if (!hasStarted) {
      setHasStarted(true);
    }
    setIsPlaying(!isPlaying);
  };

  // Increment view count when playback starts
  useEffect(() => {
    if (hasStarted) {
      const data = getViewerData(token);
      if (data) {
        data.views += 1;
        setViewerData(token, data);
      }
    }
  }, [hasStarted, token]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden select-none" style={{ userSelect: "none" }}>
      {/* Video content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[currentSlide].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-gradient-to-br from-[#0B1120] to-[#111827]"
        >
          {slides[currentSlide].render()}
        </motion.div>
      </AnimatePresence>

      {/* Email watermark overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 -rotate-[20deg] scale-150">
          {Array.from({ length: 5 }).map((_, row) => (
            <div key={row} className="flex gap-24 mb-24 whitespace-nowrap" style={{ marginLeft: row % 2 === 0 ? 0 : -80 }}>
              {Array.from({ length: 4 }).map((_, col) => (
                <span key={col} className="text-white/[0.06] text-sm font-mono select-none">
                  {email}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Screenshot prevention overlay */}
      <div className="absolute inset-0 pointer-events-none z-30" style={{
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.003) 2px, rgba(0,0,0,0.003) 4px)",
      }} />

      {/* Play/pause overlay */}
      {!hasStarted && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 cursor-pointer" onClick={handlePlay}>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center"
          >
            <Play className="w-8 h-8 text-primary ml-1" />
          </motion.div>
        </div>
      )}

      {/* Controls bar */}
      <div className="absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black/80 to-transparent pt-8 pb-3 px-4">
        {/* Progress bar */}
        <div className="h-1 bg-white/10 rounded-full mb-3 cursor-pointer" onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pct = (e.clientX - rect.left) / rect.width;
          const targetSlide = Math.floor(pct * slides.length);
          setCurrentSlide(Math.max(0, Math.min(targetSlide, slides.length - 1)));
          setProgress(0);
        }}>
          <div
            className="h-full bg-primary rounded-full transition-all duration-100"
            style={{ width: `${((currentSlide + progress / 100) / slides.length) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={handlePlay} className="text-white/80 hover:text-white transition-colors">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button onClick={() => { setCurrentSlide(Math.max(0, currentSlide - 1)); setProgress(0); }} className="text-white/60 hover:text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => { goNext(); setProgress(0); }} className="text-white/60 hover:text-white transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
            <span className="text-white/40 text-xs font-mono">{currentSlide + 1}/{slides.length}</span>
          </div>
          <div className="flex items-center gap-2 text-white/40 text-xs">
            <Shield className="w-3 h-3" />
            <span>Secure viewing • {email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SecurePlayer() {
  const params = useParams<{ token: string }>();
  const token = params.token || "demo";
  const [state, setState] = useState<"loading" | "email" | "playing" | "expired">("loading");
  const [email, setEmail] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [viewerData, setViewerDataState] = useState<ViewerData | null>(null);

  useEffect(() => {
    const data = getViewerData(token);
    if (data) {
      if (isExpired(data) || isMaxViews(data)) {
        setState("expired");
      } else {
        setEmail(data.email);
        setViewerDataState(data);
        setState("playing");
      }
    } else {
      setState("email");
    }
  }, [token]);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.includes("@")) return;

    const data: ViewerData = {
      email: emailInput,
      views: 0,
      firstView: Date.now(),
      token,
    };
    setViewerData(token, data);
    setEmail(emailInput);
    setViewerDataState(data);
    setState("playing");
  };

  if (state === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1120]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (state === "expired") {
    return (
      <ProtectionLayer>
        <div className="min-h-screen flex items-center justify-center bg-[#0B1120]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-4 text-center space-y-6"
          >
            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">This Demo Has Expired</h1>
            <p className="text-white/50">
              This secure demo link is no longer active. It may have reached its view limit or time expiration.
            </p>
            <div className="glass-card rounded-xl p-6">
              <p className="text-sm text-white/70 mb-2">Need access?</p>
              <p className="text-lg font-semibold text-white">Contact Anthony for a new link</p>
            </div>
            <BidSnapLogo size="sm" />
          </motion.div>
        </div>
      </ProtectionLayer>
    );
  }

  if (state === "email") {
    return (
      <ProtectionLayer>
        <div className="min-h-screen flex items-center justify-center bg-[#0B1120]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-4 w-full"
          >
            <div className="glass-card rounded-2xl p-8 glow-border">
              <div className="flex flex-col items-center mb-8">
                <BidSnapLogo size="lg" />
                <p className="text-muted-foreground mt-3 text-sm">Secure Demo Viewer</p>
              </div>

              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
              </div>

              <p className="text-center text-sm text-muted-foreground mb-6">
                Enter your email address to access this secure demo. Your viewing session is tracked and limited.
              </p>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  autoFocus
                  required
                />
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3">
                  <Eye className="w-4 h-4 mr-2" /> Access Demo
                </Button>
              </form>

              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-3 h-3" /> Limited to {MAX_VIEWS} views
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" /> Expires after {EXPIRY_HOURS} hours
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="w-3 h-3" /> Watermarked with your email
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </ProtectionLayer>
    );
  }

  // Playing state
  return (
    <ProtectionLayer>
      <div className="min-h-screen bg-[#0B1120] flex flex-col">
        {/* Header */}
        <header className="border-b border-white/5 bg-black/50 backdrop-blur-xl">
          <div className="container flex items-center justify-between h-12">
            <BidSnapLogo size="sm" />
            <div className="flex items-center gap-4 text-xs text-white/40">
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> View {(viewerData?.views || 0) + 1} of {MAX_VIEWS}</span>
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Secure session</span>
            </div>
          </div>
        </header>

        {/* Video area */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-5xl">
            <SecureVideoPlayer email={email} token={token} />
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/5 py-3">
          <div className="container flex items-center justify-between text-xs text-white/30">
            <span>Confidential — Do not distribute</span>
            <span>{email}</span>
          </div>
        </footer>
      </div>
    </ProtectionLayer>
  );
}
