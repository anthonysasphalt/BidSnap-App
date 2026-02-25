import { useState } from "react";
import { BidSnapLogo } from "@/components/BidSnapLogo";
import { PasswordGate } from "@/components/PasswordGate";
import { ProtectionLayer } from "@/components/ProtectionLayer";
import { Watermark } from "@/components/Watermark";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, ChevronRight, ChevronLeft, CheckCircle2, Satellite, DollarSign,
  FileText, ArrowLeft, Home, LayoutDashboard, Users, Settings, BarChart3,
  Bell, Search, TrendingUp, Clock, CheckSquare, XCircle
} from "lucide-react";
import { Link } from "wouter";

const SATELLITE_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/JeB2Dprf4iNsX1sCUil2ah/sandbox/Zsyu4B084VKGFF2JaXEYuH-img-2_1771600451000_na1fn_Ymlkc25hcC1zYXRlbGxpdGUtdmlldw.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSmVCMkRwcmY0aU5zWDFzQ1VpbDJhaC9zYW5kYm94L1pzeXU0QjA4NFZLR0ZGMkphWEVZdUgtaW1nLTJfMTc3MTYwMDQ1MTAwMF9uYTFmbl9ZbWxrYzI1aGNDMXpZWFJsYkd4cGRHVXRkbWxsZHcucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=wELocY0FfoQkl-4VcQZTVxCiu-4UVQbWt2iIapMA1633vRXyX4WlLlfGvv4qKrbLr3kC-7QpQAscy99IK0YPaNW206vrB49Qx0-BhA6jr7gKlX~lDt3y-ujFk7F7I3NcfB7NMmNSvWYmn-EujDNQc6SeeQvKA-4AagdTc8EOSuZIdiTPTSYGtXKx0TqniDYFhyyU0a2iuggzwfFPz5gauUKBoFhErV9BT7uxD25QGn~YF~O5dhNLsv7GRkHsykcuGus-xc6p5ftvoOEjTRVPHlepXwAnpGC~eCy8HPrEwMdYSkYYW7~8O5iFO~jtWN~PVpwdIxOL5M3VOLl1gHGLQw__";

const ADMIN_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/JeB2Dprf4iNsX1sCUil2ah/sandbox/Zsyu4B084VKGFF2JaXEYuH-img-3_1771600445000_na1fn_Ymlkc25hcC1hZG1pbi1kYXNoYm9hcmQ.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSmVCMkRwcmY0aU5zWDFzQ1VpbDJhaC9zYW5kYm94L1pzeXU0QjA4NFZLR0ZGMkphWEVZdUgtaW1nLTNfMTc3MTYwMDQ0NTAwMF9uYTFmbl9ZbWxrYzI1aGNDMWhaRzFwYmkxa1lYTm9ZbTloY21RLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=oVzfJSjyizDadmv2Xn~QKXzJ8w48NCKL9T1v~zQfvoLCZ7jlahJeNSnrUs~wnegV-fL~AAzmTAA4NarrIhIkrgVjLNaAo3gzui4bMYQVw1l3veQjdgQnSTpRKRAq9LSQ0H56V3qNRLykiwEoXu~dj0SWBSjT6fBfKnkWFrVWMe0Gj04wnASYfm72T7C9j1QrWRmiE5TIXz~VkO9s6HAnTX~k7Fd769Rycl3zG-qgUVygfMj6OR6dHZVHk-JJ2kZIfB9TsdG0WCoeKw8RJoeAfUh5QICxrL-GcU33qRf7wvZhTF4NU8gg3Vf1v5~BwJlx-wpeq2KfMmwrHzlj-o~eeQ__";

type DemoStep = "address" | "questions" | "measuring" | "pricing" | "contract" | "accepted" | "admin";

function DemoContent() {
  const [step, setStep] = useState<DemoStep>("address");
  const [address, setAddress] = useState("");
  const [answers, setAnswers] = useState({ age: "", condition: "", cracks: "" });
  const [contractChecks, setContractChecks] = useState({ terms: false, scope: false, payment: false });
  const [measuring, setMeasuring] = useState(false);

  const startMeasuring = () => {
    setMeasuring(true);
    setTimeout(() => {
      setMeasuring(false);
      setStep("pricing");
    }, 3000);
  };

  const steps: { key: DemoStep; label: string }[] = [
    { key: "address", label: "Address" },
    { key: "questions", label: "Qualify" },
    { key: "measuring", label: "Measure" },
    { key: "pricing", label: "Price" },
    { key: "contract", label: "Contract" },
    { key: "accepted", label: "Done" },
  ];

  const currentIdx = steps.findIndex(s => s.key === step);

  return (
    <ProtectionLayer>
      <Watermark />
      <div className="min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="border-b border-border/50 bg-card/80 backdrop-blur-xl">
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
                Anthony's Asphalt — Demo
              </span>
            </div>
            {step !== "admin" && (
              <Button
                variant="outline"
                size="sm"
                className="border-primary/30 text-primary text-xs"
                onClick={() => setStep("admin")}
              >
                <LayoutDashboard className="w-3 h-3 mr-1" /> View Admin Panel
              </Button>
            )}
          </div>
        </header>

        {step === "admin" ? (
          <AdminPanel onBack={() => setStep("address")} />
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Progress bar */}
            <div className="border-b border-border/30 bg-card/50">
              <div className="container py-4">
                <div className="flex items-center gap-2">
                  {steps.map((s, i) => (
                    <div key={s.key} className="flex items-center gap-2">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        i < currentIdx ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                        i === currentIdx ? "bg-primary/10 text-primary border border-primary/30" :
                        "bg-secondary text-muted-foreground border border-transparent"
                      }`}>
                        {i < currentIdx ? <CheckCircle2 className="w-3 h-3" /> : <span className="w-3 text-center">{i + 1}</span>}
                        <span className="hidden sm:inline">{s.label}</span>
                      </div>
                      {i < steps.length - 1 && <ChevronRight className="w-3 h-3 text-muted-foreground/30" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Step content */}
            <div className="flex-1 flex items-center justify-center py-12">
              <div className="container max-w-2xl">
                <AnimatePresence mode="wait">
                  {step === "address" && (
                    <StepCard key="address" title="Enter Your Property Address" subtitle="We'll locate your property using satellite imagery">
                      <div className="space-y-4">
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="123 Oak Street, Ann Arbor, MI"
                            className="w-full pl-12 pr-4 py-4 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg"
                            autoFocus
                          />
                        </div>
                        <Button
                          className="w-full h-12 bg-primary hover:bg-primary/90 text-lg font-semibold"
                          onClick={() => { if (!address) setAddress("123 Oak Street, Ann Arbor, MI"); setStep("questions"); }}
                        >
                          Find My Property <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                      </div>
                    </StepCard>
                  )}

                  {step === "questions" && (
                    <StepCard key="questions" title="A Few Quick Questions" subtitle="Help us provide the most accurate quote">
                      <div className="space-y-5">
                        <SelectField
                          label="How old is your asphalt?"
                          value={answers.age}
                          onChange={(v) => setAnswers({ ...answers, age: v })}
                          options={["Less than 5 years", "5–10 years", "10–20 years", "20+ years"]}
                        />
                        <SelectField
                          label="Overall condition?"
                          value={answers.condition}
                          onChange={(v) => setAnswers({ ...answers, condition: v })}
                          options={["Excellent", "Good — minor wear", "Fair — some cracks", "Poor — needs repair first"]}
                        />
                        <SelectField
                          label="Any significant cracks or damage?"
                          value={answers.cracks}
                          onChange={(v) => setAnswers({ ...answers, cracks: v })}
                          options={["No cracks", "Hairline cracks only", "Some visible cracks", "Major cracking/potholes"]}
                        />
                        <div className="flex gap-3">
                          <Button variant="outline" className="flex-1 h-12" onClick={() => setStep("address")}>
                            <ChevronLeft className="w-4 h-4 mr-2" /> Back
                          </Button>
                          <Button
                            className="flex-1 h-12 bg-primary hover:bg-primary/90 font-semibold"
                            onClick={() => {
                              setAnswers({ age: "5–10 years", condition: "Good — minor wear", cracks: "Hairline cracks only" });
                              setStep("measuring");
                              setTimeout(startMeasuring, 500);
                            }}
                          >
                            Measure My Driveway <Satellite className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </StepCard>
                  )}

                  {step === "measuring" && (
                    <StepCard key="measuring" title="Measuring Your Driveway" subtitle="Satellite imagery analysis in progress...">
                      <div className="space-y-6">
                        <div className="relative rounded-xl overflow-hidden border border-border">
                          <img src={SATELLITE_IMG} alt="Satellite view" className="w-full aspect-video object-cover" />
                          {measuring && (
                            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                              <div className="flex flex-col items-center gap-3">
                                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                <span className="text-primary font-semibold text-sm">Analyzing satellite imagery...</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { label: "Property Found", done: true },
                            { label: "Surface Detected", done: measuring },
                            { label: "Area Calculated", done: false },
                          ].map((item) => (
                            <div key={item.label} className={`flex items-center gap-2 text-sm ${item.done ? "text-green-400" : "text-muted-foreground"}`}>
                              {item.done ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border border-muted-foreground/30" />}
                              {item.label}
                            </div>
                          ))}
                        </div>
                      </div>
                    </StepCard>
                  )}

                  {step === "pricing" && (
                    <StepCard key="pricing" title="Your Instant Quote" subtitle="123 Oak Street, Ann Arbor, MI">
                      <div className="space-y-6">
                        <div className="glass-card rounded-xl p-6 text-center glow-border">
                          <div className="text-sm text-muted-foreground mb-2">Driveway Sealcoating</div>
                          <div className="text-5xl font-extrabold text-gradient font-mono mb-2">$600</div>
                          <div className="text-sm text-muted-foreground">Based on 2,400 sq ft measured area</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-secondary/50 rounded-lg p-4">
                            <div className="text-xs text-muted-foreground mb-1">Surface Area</div>
                            <div className="text-lg font-bold font-mono">2,400 sq ft</div>
                          </div>
                          <div className="bg-secondary/50 rounded-lg p-4">
                            <div className="text-xs text-muted-foreground mb-1">Price per sq ft</div>
                            <div className="text-lg font-bold font-mono">$0.25</div>
                          </div>
                          <div className="bg-secondary/50 rounded-lg p-4">
                            <div className="text-xs text-muted-foreground mb-1">Condition</div>
                            <div className="text-lg font-bold">Good</div>
                          </div>
                          <div className="bg-secondary/50 rounded-lg p-4">
                            <div className="text-xs text-muted-foreground mb-1">Est. Duration</div>
                            <div className="text-lg font-bold">3–4 hours</div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" className="flex-1 h-12" onClick={() => setStep("questions")}>
                            <ChevronLeft className="w-4 h-4 mr-2" /> Back
                          </Button>
                          <Button className="flex-1 h-12 bg-primary hover:bg-primary/90 font-semibold" onClick={() => setStep("contract")}>
                            Accept & Continue <FileText className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </StepCard>
                  )}

                  {step === "contract" && (
                    <StepCard key="contract" title="Mini Service Contract" subtitle="Review and accept to schedule your sealcoating">
                      <div className="space-y-5">
                        <div className="bg-secondary/30 rounded-xl p-5 text-sm space-y-3 max-h-48 overflow-y-auto border border-border/50">
                          <p className="font-semibold">Anthony's Asphalt — Service Agreement</p>
                          <p className="text-muted-foreground">This agreement confirms the sealcoating service for the property at <strong className="text-foreground">123 Oak Street, Ann Arbor, MI</strong>.</p>
                          <p className="text-muted-foreground"><strong className="text-foreground">Scope:</strong> Professional sealcoating of approximately 2,400 sq ft of asphalt driveway surface, including cleaning, crack filling (hairline cracks), and two coats of commercial-grade sealer.</p>
                          <p className="text-muted-foreground"><strong className="text-foreground">Total Price:</strong> $600.00</p>
                          <p className="text-muted-foreground"><strong className="text-foreground">Payment:</strong> Due upon completion of service. We accept cash, check, and all major credit cards.</p>
                          <p className="text-muted-foreground"><strong className="text-foreground">Warranty:</strong> 1-year warranty against peeling or flaking under normal conditions.</p>
                        </div>

                        {[
                          { key: "terms" as const, label: "I agree to the terms and conditions above" },
                          { key: "scope" as const, label: "I confirm the scope of work is accurate" },
                          { key: "payment" as const, label: "I understand the payment terms ($600.00 due upon completion)" },
                        ].map((item) => (
                          <label key={item.key} className="flex items-start gap-3 cursor-pointer group">
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-all ${
                                contractChecks[item.key]
                                  ? "bg-primary border-primary"
                                  : "border-muted-foreground/30 group-hover:border-primary/50"
                              }`}
                              onClick={() => setContractChecks({ ...contractChecks, [item.key]: !contractChecks[item.key] })}
                            >
                              {contractChecks[item.key] && <CheckCircle2 className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{item.label}</span>
                          </label>
                        ))}

                        <div className="flex gap-3">
                          <Button variant="outline" className="flex-1 h-12" onClick={() => setStep("pricing")}>
                            <ChevronLeft className="w-4 h-4 mr-2" /> Back
                          </Button>
                          <Button
                            className="flex-1 h-12 bg-green-600 hover:bg-green-700 font-semibold disabled:opacity-50"
                            disabled={!contractChecks.terms || !contractChecks.scope || !contractChecks.payment}
                            onClick={() => setStep("accepted")}
                          >
                            <CheckSquare className="w-4 h-4 mr-2" /> Accept Contract
                          </Button>
                        </div>
                      </div>
                    </StepCard>
                  )}

                  {step === "accepted" && (
                    <StepCard key="accepted" title="Contract Accepted!" subtitle="You're all set. Anthony's Asphalt will be in touch.">
                      <div className="space-y-6 text-center">
                        <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-10 h-10 text-green-400" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-muted-foreground">A confirmation has been sent to your email.</p>
                          <p className="text-muted-foreground text-sm">Contract #BS-2025-0847</p>
                        </div>
                        <div className="glass-card rounded-xl p-5 text-left">
                          <div className="text-xs text-muted-foreground mb-3 font-semibold uppercase tracking-wide">Summary</div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span className="text-muted-foreground">Property</span><span>123 Oak Street, Ann Arbor, MI</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Service</span><span>Driveway Sealcoating</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Area</span><span className="font-mono">2,400 sq ft</span></div>
                            <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-bold text-gradient font-mono">$600.00</span></div>
                          </div>
                        </div>
                        <Button className="w-full h-12 bg-primary hover:bg-primary/90 font-semibold" onClick={() => setStep("admin")}>
                          <LayoutDashboard className="w-4 h-4 mr-2" /> View Admin Panel
                        </Button>
                      </div>
                    </StepCard>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectionLayer>
  );
}

function StepCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="glass-card rounded-2xl p-8 glow-border"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-1">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </motion.div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
      >
        <option value="">Select...</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function AdminPanel({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState("dashboard");

  const sidebarItems = [
    { key: "dashboard", icon: Home, label: "Dashboard" },
    { key: "quotes", icon: DollarSign, label: "Quotes" },
    { key: "customers", icon: Users, label: "Customers" },
    { key: "analytics", icon: BarChart3, label: "Analytics" },
    { key: "settings", icon: Settings, label: "Settings" },
  ];

  const recentQuotes = [
    { name: "John Smith", address: "123 Oak St, Ann Arbor", sqft: "2,400", price: "$600", status: "Accepted", statusColor: "text-green-400 bg-green-500/10" },
    { name: "Sarah Johnson", address: "456 Maple Ave, Ypsilanti", sqft: "1,800", price: "$450", status: "Pending", statusColor: "text-amber-400 bg-amber-500/10" },
    { name: "Mike Williams", address: "789 Elm Dr, Saline", sqft: "3,200", price: "$800", status: "Accepted", statusColor: "text-green-400 bg-green-500/10" },
    { name: "Lisa Brown", address: "321 Pine Rd, Dexter", sqft: "2,100", price: "$525", status: "Expired", statusColor: "text-red-400 bg-red-500/10" },
    { name: "Tom Davis", address: "654 Cedar Ln, Chelsea", sqft: "2,800", price: "$700", status: "Pending", statusColor: "text-amber-400 bg-amber-500/10" },
  ];

  return (
    <div className="flex-1 flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-border/50 bg-card/50 flex flex-col">
        <div className="p-4 border-b border-border/30">
          <div className="text-xs text-muted-foreground mb-1">Admin Panel</div>
          <div className="text-sm font-semibold">Anthony's Asphalt</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                activeTab === item.key
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border/30">
          <button onClick={onBack} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Client View
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="border-b border-border/30 bg-card/30 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search quotes, customers..."
                className="pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-sm w-72 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-secondary/50 transition-colors">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
              AA
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Total Quotes", value: "247", change: "+12%", icon: FileText, color: "text-blue-400" },
              { label: "Accepted", value: "183", change: "+8%", icon: CheckCircle2, color: "text-green-400" },
              { label: "Revenue", value: "$91,500", change: "+23%", icon: TrendingUp, color: "text-amber-400" },
              { label: "Avg Response", value: "47s", change: "-15%", icon: Clock, color: "text-purple-400" },
            ].map((stat) => (
              <div key={stat.label} className="glass-card rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-xs text-green-400 font-mono">{stat.change}</span>
                </div>
                <div className="text-2xl font-bold font-mono">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Admin dashboard image */}
          <div className="glass-card rounded-xl overflow-hidden border border-border/50">
            <div className="px-5 py-4 border-b border-border/30 flex items-center justify-between">
              <h3 className="font-semibold">Recent Quotes</h3>
              <Button variant="outline" size="sm" className="text-xs">Export CSV</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Customer</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Address</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Sq Ft</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Price</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentQuotes.map((q, i) => (
                    <tr key={i} className="border-b border-border/20 hover:bg-secondary/20 transition-colors">
                      <td className="px-5 py-3 text-sm font-medium">{q.name}</td>
                      <td className="px-5 py-3 text-sm text-muted-foreground">{q.address}</td>
                      <td className="px-5 py-3 text-sm font-mono">{q.sqft}</td>
                      <td className="px-5 py-3 text-sm font-mono font-semibold">{q.price}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${q.statusColor}`}>
                          {q.status === "Accepted" && <CheckCircle2 className="w-3 h-3" />}
                          {q.status === "Pending" && <Clock className="w-3 h-3" />}
                          {q.status === "Expired" && <XCircle className="w-3 h-3" />}
                          {q.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dashboard screenshot */}
          <div className="glass-card rounded-xl overflow-hidden border border-border/50">
            <div className="px-5 py-4 border-b border-border/30">
              <h3 className="font-semibold">Analytics Overview</h3>
            </div>
            <img src={ADMIN_IMG} alt="Admin Dashboard Analytics" className="w-full" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Demo() {
  return (
    <PasswordGate>
      <DemoContent />
    </PasswordGate>
  );
}
