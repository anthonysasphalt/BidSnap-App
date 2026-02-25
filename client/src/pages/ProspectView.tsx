import { useState, useEffect, useCallback } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { BidSnapLogo } from "@/components/BidSnapLogo";
import { ProtectionLayer } from "@/components/ProtectionLayer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Shield, Lock, AlertTriangle, Eye, Clock, MapPin,
  ChevronRight, ChevronLeft, CheckCircle2, Satellite, DollarSign,
  FileText, BarChart3, Zap, Target, Users
} from "lucide-react";

const SATELLITE_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/JeB2Dprf4iNsX1sCUil2ah/sandbox/Zsyu4B084VKGFF2JaXEYuH-img-2_1771600451000_na1fn_Ymlkc25hcC1zYXRlbGxpdGUtdmlldw.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSmVCMkRwcmY0aU5zWDFzQ1VpbDJhaC9zYW5kYm94L1pzeXU0QjA4NFZLR0ZGMkphWEVZdUgtaW1nLTJfMTc3MTYwMDQ1MTAwMF9uYTFmbl9ZbWxrYzI1aGNDMXpZWFJsYkd4cGRHVXRkbWxsZHcucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=wELocY0FfoQkl-4VcQZTVxCiu-4UVQbWt2iIapMA1633vRXyX4WlLlfGvv4qKrbLr3kC-7QpQAscy99IK0YPaNW206vrB49Qx0-BhA6jr7gKlX~lDt3y-ujFk7F7I3NcfB7NMmNSvWYmn-EujDNQc6SeeQvKA-4AagdTc8EOSuZIdiTPTSYGtXKx0TqniDYFhyyU0a2iuggzwfFPz5gauUKBoFhErV9BT7uxD25QGn~YF~O5dhNLsv7GRkHsykcuGus-xc6p5ftvoOEjTRVPHlepXwAnpGC~eCy8HPrEwMdYSkYYW7~8O5iFO~jtWN~PVpwdIxOL5M3VOLl1gHGLQw__";

// ==================== Email Watermark ====================
function EmailWatermark({ email }: { email: string }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none" style={{ userSelect: "none" }}>
      {Array.from({ length: 8 }).map((_, row) => (
        <div key={row} className="flex whitespace-nowrap" style={{ transform: `rotate(-25deg) translateY(${row * 140 - 200}px) translateX(-100px)` }}>
          {Array.from({ length: 6 }).map((_, col) => (
            <span
              key={col}
              className="text-white/[0.06] text-sm font-mono mx-16 select-none"
              style={{ userSelect: "none" }}
            >
              {email}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

// ==================== Expired State ====================
function ExpiredState({ error }: { error: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #0B1120 0%, #131B2E 50%, #0B1120 100%)" }}>
      <div className="glass-card rounded-2xl p-8 w-full max-w-md text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground mb-2">Demo Unavailable</h2>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
        <div className="glass-card rounded-lg p-4 text-left">
          <p className="text-sm text-muted-foreground">
            Contact <strong className="text-foreground">Anthony</strong> for a new demo link:
          </p>
          <p className="text-sm text-primary mt-1">anthony@bidsnap.com</p>
        </div>
        <BidSnapLogo size="sm" />
      </div>
    </div>
  );
}

// ==================== Email Verification Gate ====================
function EmailGate({ token, prospectName, companyName, onVerified }: {
  token: string;
  prospectName: string;
  companyName?: string | null;
  onVerified: (data: any) => void;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const verifyMutation = trpc.prospect.verify.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        onVerified(data);
      } else {
        setError(data.error || "Verification failed");
      }
    },
    onError: (err) => {
      setError(err.message || "Verification failed");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #0B1120 0%, #131B2E 50%, #0B1120 100%)" }}>
      <div className="glass-card rounded-2xl p-8 w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <BidSnapLogo size="md" />
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground">Welcome, {prospectName}</h2>
            {companyName && <p className="text-sm text-muted-foreground">{companyName}</p>}
          </div>
          <p className="text-sm text-muted-foreground">
            Verify your email to access the BidSnap demo
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1"><Shield className="w-3 h-3 text-green-400" /> Secure</div>
          <div className="flex items-center gap-1"><Eye className="w-3 h-3 text-blue-400" /> Limited views</div>
          <div className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-400" /> Time-limited</div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError("");
            verifyMutation.mutate({ token, email });
          }}
          className="space-y-4"
        >
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              <Mail className="w-3 h-3 inline mr-1" />Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="bg-secondary/50 border-border/50"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={verifyMutation.isPending || !email}
          >
            <Lock className="w-4 h-4 mr-2" />
            {verifyMutation.isPending ? "Verifying..." : "Access Demo"}
          </Button>
        </form>

        <p className="text-xs text-center text-muted-foreground">
          Use the email address provided by Anthony
        </p>
      </div>
    </div>
  );
}

// ==================== Demo Walkthrough (Prospect View) ====================
type DemoStep = "intro" | "address" | "questions" | "measuring" | "pricing" | "contract" | "accepted";

function ProspectDemo({ prospectName, prospectEmail, viewsUsed, maxViews, expiresAt }: {
  prospectName: string;
  prospectEmail: string;
  viewsUsed: number;
  maxViews: number;
  expiresAt: number;
}) {
  const [step, setStep] = useState<DemoStep>("intro");
  const [measuring, setMeasuring] = useState(false);

  const startMeasuring = useCallback(() => {
    setMeasuring(true);
    setTimeout(() => {
      setMeasuring(false);
      setStep("pricing");
    }, 3000);
  }, []);

  const steps: { key: DemoStep; label: string }[] = [
    { key: "intro", label: "Welcome" },
    { key: "address", label: "Address" },
    { key: "questions", label: "Qualify" },
    { key: "measuring", label: "Measure" },
    { key: "pricing", label: "Price" },
    { key: "contract", label: "Contract" },
    { key: "accepted", label: "Done" },
  ];

  const currentIdx = steps.findIndex(s => s.key === step);

  const timeLeft = expiresAt - Date.now();
  const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));

  return (
    <ProtectionLayer>
      <EmailWatermark email={prospectEmail} />

      {/* Screenshot protection overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9998]" style={{
        background: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(59,130,246,0.01) 10px, rgba(59,130,246,0.01) 20px)",
      }} />

      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-border/50 bg-card/80 backdrop-blur-xl">
          <div className="container flex items-center justify-between h-14">
            <BidSnapLogo size="sm" />
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> View {viewsUsed}/{maxViews}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {hoursLeft}h left</span>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary font-semibold">
                DEMO
              </span>
            </div>
          </div>
        </header>

        {/* Progress */}
        <div className="border-b border-border/30 bg-card/50">
          <div className="container py-3">
            <div className="flex items-center gap-1 overflow-x-auto">
              {steps.map((s, i) => (
                <div key={s.key} className="flex items-center">
                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-all ${
                    i < currentIdx ? "text-green-400" :
                    i === currentIdx ? "text-primary bg-primary/10" :
                    "text-muted-foreground"
                  }`}>
                    {i < currentIdx ? <CheckCircle2 className="w-3 h-3" /> :
                     <span className="w-4 h-4 rounded-full border flex items-center justify-center text-[10px]">{i + 1}</span>}
                    <span className="hidden sm:inline">{s.label}</span>
                  </div>
                  {i < steps.length - 1 && <ChevronRight className="w-3 h-3 text-muted-foreground/30 mx-0.5" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 container py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              {/* INTRO */}
              {step === "intro" && (
                <div className="glass-card rounded-2xl p-8 text-center space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto">
                    <Zap className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold mb-2">Welcome to BidSnap, {prospectName}!</h1>
                    <p className="text-muted-foreground">
                      You're about to see how BidSnap gives your customers instant, accurate pricing
                      using satellite measurement technology — no site visits needed.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { icon: Target, label: "Instant Quotes", desc: "Under 60 seconds" },
                      { icon: Satellite, label: "Satellite AI", desc: "Measures automatically" },
                      { icon: FileText, label: "Mini Contracts", desc: "Close on the spot" },
                    ].map((f) => (
                      <div key={f.label} className="text-center space-y-2">
                        <f.icon className="w-6 h-6 text-primary mx-auto" />
                        <div className="text-xs font-semibold">{f.label}</div>
                        <div className="text-xs text-muted-foreground">{f.desc}</div>
                      </div>
                    ))}
                  </div>
                  <Button onClick={() => setStep("address")} className="bg-primary hover:bg-primary/90">
                    Start the Demo <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}

              {/* ADDRESS */}
              {step === "address" && (
                <div className="glass-card rounded-2xl p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">Step 1: Customer Enters Address</h2>
                      <p className="text-sm text-muted-foreground">Your customer types their property address</p>
                    </div>
                  </div>
                  <div className="bg-secondary/30 rounded-xl p-6 space-y-4">
                    <label className="text-sm font-medium">Property Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        value="123 Oak Street, Ann Arbor, MI 48104"
                        readOnly
                        className="pl-10 bg-background/50 border-border/50"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground italic">
                      Demo data — in production, this connects to Google Maps autocomplete
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep("intro")}>
                      <ChevronLeft className="w-4 h-4 mr-1" /> Back
                    </Button>
                    <Button onClick={() => setStep("questions")} className="bg-primary hover:bg-primary/90">
                      Find My Property <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* QUESTIONS */}
              {step === "questions" && (
                <div className="glass-card rounded-2xl p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">Step 2: Qualifying Questions</h2>
                      <p className="text-sm text-muted-foreground">Smart questions filter leads and gather job details</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { q: "How old is your driveway?", a: "5-10 years" },
                      { q: "Current condition?", a: "Good — minor wear" },
                      { q: "Any visible cracks?", a: "A few small ones" },
                    ].map((item) => (
                      <div key={item.q} className="bg-secondary/30 rounded-lg p-4">
                        <div className="text-sm font-medium mb-2">{item.q}</div>
                        <div className="text-sm text-primary bg-primary/10 rounded px-3 py-1.5 inline-block">{item.a}</div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep("address")}>
                      <ChevronLeft className="w-4 h-4 mr-1" /> Back
                    </Button>
                    <Button onClick={() => { setStep("measuring"); startMeasuring(); }} className="bg-primary hover:bg-primary/90">
                      Measure My Driveway <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* MEASURING */}
              {step === "measuring" && (
                <div className="glass-card rounded-2xl p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Satellite className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">Step 3: Satellite Measurement</h2>
                      <p className="text-sm text-muted-foreground">AI measures the driveway from satellite imagery</p>
                    </div>
                  </div>
                  <div className="relative rounded-xl overflow-hidden">
                    <img src={SATELLITE_IMG} alt="Satellite view" className="w-full rounded-xl opacity-80" />
                    {measuring && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="text-center space-y-3">
                          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                          <div className="text-sm font-semibold text-primary">Measuring driveway area...</div>
                          <div className="text-xs text-muted-foreground">Analyzing satellite imagery with AI</div>
                        </div>
                      </div>
                    )}
                    {!measuring && (
                      <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur rounded-lg p-3 flex items-center justify-between">
                        <div>
                          <div className="text-xs text-muted-foreground">Measured Area</div>
                          <div className="text-lg font-bold text-primary font-mono">2,400 sq ft</div>
                        </div>
                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PRICING */}
              {step === "pricing" && (
                <div className="glass-card rounded-2xl p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">Step 4: Instant Price Generated</h2>
                      <p className="text-sm text-muted-foreground">Customer sees their price immediately</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-xl p-6 text-center space-y-4 border border-primary/20">
                    <div className="text-sm text-muted-foreground">Your Sealcoating Quote</div>
                    <div className="text-5xl font-extrabold text-gradient font-mono">$600</div>
                    <div className="text-sm text-muted-foreground">
                      2,400 sq ft × $0.25/sq ft
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="bg-secondary/30 rounded-lg p-2">
                        <div className="text-muted-foreground">Property</div>
                        <div className="font-semibold">123 Oak St</div>
                      </div>
                      <div className="bg-secondary/30 rounded-lg p-2">
                        <div className="text-muted-foreground">Area</div>
                        <div className="font-semibold">2,400 sq ft</div>
                      </div>
                      <div className="bg-secondary/30 rounded-lg p-2">
                        <div className="text-muted-foreground">Service</div>
                        <div className="font-semibold">Sealcoating</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep("measuring")}>
                      <ChevronLeft className="w-4 h-4 mr-1" /> Back
                    </Button>
                    <Button onClick={() => setStep("contract")} className="bg-primary hover:bg-primary/90">
                      Accept & Continue <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}

              {/* CONTRACT */}
              {step === "contract" && (
                <div className="glass-card rounded-2xl p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold">Step 5: Mini Contract</h2>
                      <p className="text-sm text-muted-foreground">Customer accepts terms with checkboxes</p>
                    </div>
                  </div>
                  <div className="bg-secondary/30 rounded-xl p-6 space-y-4">
                    <div className="text-sm font-medium border-b border-border/30 pb-3">Service Agreement</div>
                    {[
                      "I agree to the quoted price of $600 for sealcoating services",
                      "I understand the scope includes driveway sealcoating for 2,400 sq ft",
                      "I agree to payment terms: 50% deposit, 50% on completion",
                    ].map((text, i) => (
                      <label key={i} className="flex items-start gap-3 cursor-pointer group">
                        <div className="w-5 h-5 rounded border border-primary/50 bg-primary/10 flex items-center justify-center mt-0.5 group-hover:border-primary">
                          <CheckCircle2 className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm text-muted-foreground">{text}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep("pricing")}>
                      <ChevronLeft className="w-4 h-4 mr-1" /> Back
                    </Button>
                    <Button onClick={() => setStep("accepted")} className="bg-green-600 hover:bg-green-700">
                      <CheckCircle2 className="w-4 h-4 mr-1" /> Accept Contract
                    </Button>
                  </div>
                </div>
              )}

              {/* ACCEPTED */}
              {step === "accepted" && (
                <div className="glass-card rounded-2xl p-8 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Contract Accepted!</h2>
                    <p className="text-muted-foreground">
                      That's the complete customer flow. From address entry to signed contract in under 60 seconds.
                    </p>
                  </div>
                  <div className="glass-card rounded-xl p-6 text-left space-y-3">
                    <h3 className="font-semibold text-sm">What BidSnap Does For You:</h3>
                    <div className="space-y-2">
                      {[
                        "Instant quotes 24/7 — no manual estimating",
                        "Satellite measurement — no site visits needed",
                        "Qualified leads only — bad leads filtered out",
                        "Signed contracts — close deals on the spot",
                        "Admin dashboard — track all leads and contracts",
                        "Your brand — fully white-labeled to your business",
                      ].map((item) => (
                        <div key={item} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="glass-card rounded-xl p-4 bg-primary/5 border border-primary/20">
                    <p className="text-sm text-muted-foreground">
                      Ready to get BidSnap for your business? Contact <strong className="text-foreground">Anthony</strong> to get started.
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => setStep("intro")}>
                    Replay Demo
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/30 py-4">
          <div className="container flex items-center justify-between text-xs text-muted-foreground">
            <span>Demo — Powered by BidSnap</span>
            <span>Confidential — {prospectEmail}</span>
          </div>
        </footer>
      </div>
    </ProtectionLayer>
  );
}

// ==================== Main Prospect View ====================
export default function ProspectView() {
  const params = useParams<{ token: string }>();
  const token = params.token || "";

  const linkQuery = trpc.prospect.checkLink.useQuery(
    { token },
    { enabled: !!token, retry: false }
  );

  const [verifiedData, setVerifiedData] = useState<any>(null);

  // Loading
  if (linkQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0B1120" }}>
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-muted-foreground">Verifying demo link...</p>
        </div>
      </div>
    );
  }

  // Invalid / expired link
  if (linkQuery.data && !linkQuery.data.valid) {
    return <ExpiredState error={linkQuery.data.error || "This demo link is no longer available."} />;
  }

  // Error
  if (linkQuery.error) {
    return <ExpiredState error="Unable to verify this demo link. Please try again." />;
  }

  // Verified — show the demo
  if (verifiedData) {
    return (
      <ProspectDemo
        prospectName={verifiedData.prospectName}
        prospectEmail={verifiedData.prospectEmail}
        viewsUsed={verifiedData.viewsUsed}
        maxViews={verifiedData.maxViews}
        expiresAt={verifiedData.expiresAt}
      />
    );
  }

  // Email verification gate
  if (linkQuery.data?.valid) {
    return (
      <EmailGate
        token={token}
        prospectName={linkQuery.data.prospectName || ""}
        companyName={linkQuery.data.companyName}
        onVerified={setVerifiedData}
      />
    );
  }

  return <ExpiredState error="This demo link is not available." />;
}
