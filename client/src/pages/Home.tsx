import { BidSnapLogo } from "@/components/BidSnapLogo";
import { PasswordGate } from "@/components/PasswordGate";
import { ProtectionLayer } from "@/components/ProtectionLayer";
import { Watermark } from "@/components/Watermark";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Monitor, Play, Shield, ArrowRight, Zap, Target, BarChart3, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

const HERO_BG = "https://private-us-east-1.manuscdn.com/sessionFile/JeB2Dprf4iNsX1sCUil2ah/sandbox/Zsyu4B084VKGFF2JaXEYuH-img-1_1771600445000_na1fn_Ymlkc25hcC1oZXJvLWJn.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSmVCMkRwcmY0aU5zWDFzQ1VpbDJhaC9zYW5kYm94L1pzeXU0QjA4NFZLR0ZGMkphWEVZdUgtaW1nLTFfMTc3MTYwMDQ0NTAwMF9uYTFmbl9ZbWxrYzI1aGNDMW9aWEp2TFdKbi5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=ECx6XK1Y7Yd6j0nhlAurTvtiEKBMnlXlV3BUF73ustsipF29h-iFej07AAJl~bJQWdnhR66V84ocramkg1~wSDt8dDOmG-4-swCsGlPWNvofN9flHvdv-sX32dawQvgONHRWdIPEjawy1dWyI6V84V4iilyFJkkp8dJdi2sZxv0Qgmm5nBk-Gc9Tj3QTMAGTGK2ZhJzwXDB8UlCIpDNxtZT70vhCXRwgZAMgJHLle-mxnZyqk5HxXI1uJ7AsK2SOOaqAf1MCUwrCrHlSbyaoz5Bkzy4y9q1p~ULm16bPMu0rDR9HJowwLU4oE0wEvcamqZu7XRdPE5GzfSL0t1jpZQ__";

const CONTRACTOR_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/JeB2Dprf4iNsX1sCUil2ah/sandbox/Zsyu4B084VKGFF2JaXEYuH-img-4_1771600439000_na1fn_Ymlkc25hcC1jb250cmFjdG9yLWhlcm8.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSmVCMkRwcmY0aU5zWDFzQ1VpbDJhaC9zYW5kYm94L1pzeXU0QjA4NFZLR0ZGMkphWEVZdUgtaW1nLTRfMTc3MTYwMDQzOTAwMF9uYTFmbl9ZbWxrYzI1aGNDMWpiMjUwY21GamRHOXlMV2hsY204LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=GLS6AGP~Wj-6Bffjr8Vha4996XgL8AQPxwKP3c0WTMFnGhydElA-PWdSSoKEj3Hf2WgKuihJLydaf2JZLv952jwA4C4GqL8RFTJF5EuTK4DZFL8pJEsuYtZdKEE2Jcp88cYJwD99vdpYGcAH4XP7kboF6hJRObfDSKPEMn5Or4ZcoZNe1fqFCFRfN5xRM0DGWpC3nHbukeamhoj9wMk8qv3YlaRLqQ5clwSY6dFWIXJzykm37Wm5B-HW329HcNr-Qtcc7820czRwFpKn1wNalQgNn0hxM-VyX2VppUbA3sOVHNnoZ-eOeOPxLJKxcmsxOwi4NsNHrtUtxXeoJpTsnw__";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0, 0, 0.2, 1] as const },
  }),
};

function HomeContent() {
  return (
    <ProtectionLayer>
      <Watermark />
      <div className="min-h-screen">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
          <div className="container flex items-center justify-between h-16">
            <BidSnapLogo size="sm" />
            <div className="flex items-center gap-3">
              <Link href="/demo">
                <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10">
                  <Monitor className="w-4 h-4 mr-2" /> Live Demo
                </Button>
              </Link>
              <Link href="/walkthrough">
                <Button variant="outline" size="sm" className="border-accent/30 text-accent hover:bg-accent/10">
                  <Play className="w-4 h-4 mr-2" /> Walkthrough
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
          <div className="absolute inset-0">
            <img src={HERO_BG} alt="" className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
          </div>

          <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center py-20">
            <motion.div initial="hidden" animate="visible" className="space-y-8">
              <motion.div custom={0} variants={fadeUp}>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide">
                  <Zap className="w-3 h-3" /> WHITE-LABEL SaaS PLATFORM
                </span>
              </motion.div>

              <motion.h1 custom={1} variants={fadeUp} className="text-5xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
                Instant Pricing
                <br />
                <span className="text-gradient">for Contractors</span>
              </motion.h1>

              <motion.p custom={2} variants={fadeUp} className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Give your customers instant, accurate quotes using satellite measurement technology.
                No more driving to job sites for estimates. Close deals faster, 24/7.
              </motion.p>

              <motion.div custom={3} variants={fadeUp} className="flex flex-wrap gap-4">
                <Link href="/demo">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 h-12">
                    Try the Live Demo <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/walkthrough">
                  <Button size="lg" variant="outline" className="border-border hover:bg-secondary font-semibold px-8 h-12">
                    <Play className="w-4 h-4 mr-2" /> Watch Walkthrough
                  </Button>
                </Link>
              </motion.div>

              <motion.div custom={4} variants={fadeUp} className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> White-label ready</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Your brand, your pricing</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400" /> Setup in 48 hours</span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0, 0, 0.2, 1] as const }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/10 rounded-2xl blur-2xl" />
                <img
                  src={CONTRACTOR_IMG}
                  alt="Contractor using BidSnap"
                  className="relative rounded-2xl border border-border/50 shadow-2xl w-full"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 relative">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">How BidSnap Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Your customers get instant pricing in under 60 seconds. You get qualified leads with accepted contracts.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Target, title: "Address Entry", desc: "Customer enters their property address. BidSnap locates it instantly via satellite.", color: "text-blue-400", bg: "bg-blue-500/10" },
                { icon: CheckCircle2, title: "Qualifying Questions", desc: "Smart questions filter out bad leads and gather job details automatically.", color: "text-green-400", bg: "bg-green-500/10" },
                { icon: BarChart3, title: "Satellite Measurement", desc: "AI measures the driveway/surface area from satellite imagery. No site visit needed.", color: "text-amber-400", bg: "bg-amber-500/10" },
                { icon: Zap, title: "Instant Price + Contract", desc: "Customer sees their price and can accept a mini contract with checkboxes on the spot.", color: "text-purple-400", bg: "bg-purple-500/10" },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="glass-card rounded-xl p-6 hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 rounded-lg ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <div className="text-xs font-mono text-muted-foreground mb-2">Step {i + 1}</div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Case Study Section */}
        <section className="py-24 relative border-t border-border/30">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-8 lg:p-12 glow-border"
            >
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-6">
                    CASE STUDY
                  </span>
                  <h2 className="text-3xl font-bold mb-4">Anthony's Asphalt</h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Anthony's Asphalt was the first contractor to deploy BidSnap. Within the first month, they saw a dramatic increase in qualified leads and closed deals — all without driving to a single job site for an estimate.
                  </p>
                  <div className="grid grid-cols-3 gap-6">
                    {[
                      { value: "340%", label: "More Leads" },
                      { value: "< 60s", label: "Quote Time" },
                      { value: "$0", label: "Site Visit Cost" },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <div className="text-2xl font-bold text-gradient font-mono">{stat.value}</div>
                        <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <Link href="/demo">
                    <div className="glass-card rounded-xl p-6 hover:border-primary/40 transition-all cursor-pointer group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Monitor className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-semibold">Interactive Demo</div>
                            <div className="text-sm text-muted-foreground">Try the full client flow</div>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                  <Link href="/walkthrough">
                    <div className="glass-card rounded-xl p-6 hover:border-accent/40 transition-all cursor-pointer group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                            <Play className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <div className="font-semibold">Product Walkthrough</div>
                            <div className="text-sm text-muted-foreground">Animated feature tour</div>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                  <Link href="/watch/demo-preview">
                    <div className="glass-card rounded-xl p-6 hover:border-green-500/40 transition-all cursor-pointer group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <div className="font-semibold">Secure Video Player</div>
                            <div className="text-sm text-muted-foreground">Self-destructing demo viewer</div>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-green-400 transition-colors group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-border/30">
          <div className="container flex items-center justify-between">
            <BidSnapLogo size="sm" />
            <p className="text-xs text-muted-foreground">
              &copy; 2025 BidSnap. All rights reserved. Confidential demo.
            </p>
          </div>
        </footer>
      </div>
    </ProtectionLayer>
  );
}

export default function Home() {
  return (
    <PasswordGate>
      <HomeContent />
    </PasswordGate>
  );
}
