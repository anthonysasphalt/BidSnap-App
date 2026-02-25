import { useState, useEffect, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { BidSnapLogo } from "@/components/BidSnapLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  LogIn, LogOut, Plus, Link2, Eye, Clock, XCircle, Copy, CheckCircle2,
  Users, BarChart3, Shield, RefreshCw, ChevronDown, ChevronUp, Mail, Building2, User
} from "lucide-react";

// ==================== Admin Login ====================
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: () => {
      toast.success("Logged in successfully");
      onLogin();
    },
    onError: (err) => {
      toast.error(err.message || "Invalid credentials");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #0B1120 0%, #131B2E 50%, #0B1120 100%)" }}>
      <div className="glass-card rounded-2xl p-8 w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <BidSnapLogo size="md" />
          <h2 className="text-xl font-bold text-foreground">Admin Dashboard</h2>
          <p className="text-sm text-muted-foreground">Sign in to manage demo links</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loginMutation.mutate({ username, password });
          }}
          className="space-y-4"
        >
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="bg-secondary/50 border-border/50"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="bg-secondary/50 border-border/50"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90"
            disabled={loginMutation.isPending}
          >
            <LogIn className="w-4 h-4 mr-2" />
            {loginMutation.isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}

// ==================== Create Link Form ====================
function CreateLinkForm({ onCreated }: { onCreated: () => void }) {
  const [prospectName, setProspectName] = useState("");
  const [prospectEmail, setProspectEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [maxViews, setMaxViews] = useState(3);
  const [expiryHours, setExpiryHours] = useState(48);
  const [createdToken, setCreatedToken] = useState<string | null>(null);

  const createMutation = trpc.demoLinks.create.useMutation({
    onSuccess: (data) => {
      setCreatedToken(data.token);
      toast.success("Demo link created!");
      onCreated();
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create link");
    },
  });

  const copyLink = () => {
    if (!createdToken) return;
    const url = `${window.location.origin}/view/${createdToken}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  if (createdToken) {
    const url = `${window.location.origin}/view/${createdToken}`;
    return (
      <div className="glass-card rounded-xl p-6 space-y-4 border border-green-500/30">
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-semibold">Link Created Successfully!</span>
        </div>
        <div className="bg-secondary/50 rounded-lg p-3 flex items-center gap-2">
          <code className="text-sm text-primary flex-1 break-all">{url}</code>
          <Button size="sm" variant="outline" onClick={copyLink}>
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Send this link to <strong>{prospectName}</strong> ({prospectEmail}). They'll need to verify their email to access the demo.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setCreatedToken(null);
            setProspectName("");
            setProspectEmail("");
            setCompanyName("");
          }}
        >
          <Plus className="w-4 h-4 mr-1" /> Create Another
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createMutation.mutate({
          prospectName,
          prospectEmail,
          companyName: companyName || undefined,
          maxViews,
          expiryHours,
        });
      }}
      className="glass-card rounded-xl p-6 space-y-4"
    >
      <h3 className="font-semibold flex items-center gap-2">
        <Plus className="w-4 h-4 text-primary" /> Create New Demo Link
      </h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            <User className="w-3 h-3 inline mr-1" />Prospect Name *
          </label>
          <Input
            value={prospectName}
            onChange={(e) => setProspectName(e.target.value)}
            placeholder="John Smith"
            required
            className="bg-secondary/50 border-border/50"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            <Mail className="w-3 h-3 inline mr-1" />Prospect Email *
          </label>
          <Input
            type="email"
            value={prospectEmail}
            onChange={(e) => setProspectEmail(e.target.value)}
            placeholder="john@company.com"
            required
            className="bg-secondary/50 border-border/50"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            <Building2 className="w-3 h-3 inline mr-1" />Company Name
          </label>
          <Input
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Smith's Paving LLC"
            className="bg-secondary/50 border-border/50"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              <Eye className="w-3 h-3 inline mr-1" />Max Views
            </label>
            <Input
              type="number"
              value={maxViews}
              onChange={(e) => setMaxViews(parseInt(e.target.value) || 3)}
              min={1}
              max={100}
              className="bg-secondary/50 border-border/50"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              <Clock className="w-3 h-3 inline mr-1" />Expiry (hours)
            </label>
            <Input
              type="number"
              value={expiryHours}
              onChange={(e) => setExpiryHours(parseInt(e.target.value) || 48)}
              min={1}
              max={720}
              className="bg-secondary/50 border-border/50"
            />
          </div>
        </div>
      </div>
      <Button
        type="submit"
        className="bg-primary hover:bg-primary/90"
        disabled={createMutation.isPending || !prospectName || !prospectEmail}
      >
        <Link2 className="w-4 h-4 mr-2" />
        {createMutation.isPending ? "Creating..." : "Generate Demo Link"}
      </Button>
    </form>
  );
}

// ==================== Link Row ====================
function LinkRow({ link, onRevoke }: { link: any; onRevoke: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const viewsQuery = trpc.demoLinks.getViews.useQuery(
    { linkId: link.id },
    { enabled: expanded }
  );
  const revokeMutation = trpc.demoLinks.revoke.useMutation({
    onSuccess: () => {
      toast.success("Link revoked");
      onRevoke();
    },
  });

  const statusColors: Record<string, string> = {
    active: "text-green-400 bg-green-500/10 border-green-500/30",
    expired: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    revoked: "text-red-400 bg-red-500/10 border-red-500/30",
    viewed: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  };

  const timeLeft = link.expiresAt - Date.now();
  const hoursLeft = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60)));
  const minsLeft = Math.max(0, Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)));

  const copyLink = () => {
    const url = `${window.location.origin}/view/${link.token}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div
        className="p-4 flex items-center gap-4 cursor-pointer hover:bg-secondary/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm truncate">{link.prospectName}</span>
            {link.companyName && (
              <span className="text-xs text-muted-foreground truncate">({link.companyName})</span>
            )}
          </div>
          <div className="text-xs text-muted-foreground truncate">{link.prospectEmail}</div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[link.status] || ""}`}>
            {link.status}
          </span>
          <span className="text-xs text-muted-foreground">
            <Eye className="w-3 h-3 inline mr-1" />
            {link.viewsUsed}/{link.maxViews}
          </span>
          {link.status === "active" && (
            <span className="text-xs text-muted-foreground">
              <Clock className="w-3 h-3 inline mr-1" />
              {hoursLeft}h {minsLeft}m
            </span>
          )}
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-border/30 p-4 space-y-3 bg-secondary/10">
          <div className="flex items-center gap-2 flex-wrap">
            <Button size="sm" variant="outline" onClick={copyLink}>
              <Copy className="w-3 h-3 mr-1" /> Copy Link
            </Button>
            {link.status === "active" && (
              <Button
                size="sm"
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                onClick={(e) => {
                  e.stopPropagation();
                  revokeMutation.mutate({ token: link.token });
                }}
                disabled={revokeMutation.isPending}
              >
                <XCircle className="w-3 h-3 mr-1" /> Revoke
              </Button>
            )}
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Created: {new Date(link.createdAt).toLocaleString()}</div>
            <div>Expires: {new Date(link.expiresAt).toLocaleString()}</div>
            <div>Token: <code className="text-primary">{link.token}</code></div>
          </div>

          {viewsQuery.data && viewsQuery.data.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground">View History:</div>
              {viewsQuery.data.map((view: any, i: number) => (
                <div key={i} className="text-xs bg-secondary/30 rounded px-2 py-1 flex items-center gap-2">
                  <Eye className="w-3 h-3 text-primary" />
                  <span>{new Date(view.viewedAt).toLocaleString()}</span>
                  {view.ipAddress && <span className="text-muted-foreground">from {view.ipAddress}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ==================== Admin Dashboard ====================
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const linksQuery = trpc.demoLinks.list.useQuery(undefined, {
    refetchInterval: 10000, // Auto-refresh every 10 seconds
  });
  const logoutMutation = trpc.admin.logout.useMutation({
    onSuccess: () => {
      toast.success("Logged out");
      onLogout();
    },
  });

  const links = linksQuery.data || [];
  const activeLinks = links.filter((l: any) => l.status === "active");
  const totalViews = links.reduce((sum: number, l: any) => sum + l.viewsUsed, 0);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0B1120 0%, #131B2E 50%, #0B1120 100%)" }}>
      {/* Header */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <BidSnapLogo size="sm" />
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary font-semibold">
              ADMIN
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => linksQuery.refetch()}
              disabled={linksQuery.isFetching}
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${linksQuery.isFetching ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="w-3 h-3 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Links", value: links.length, icon: Link2, color: "text-primary" },
            { label: "Active Links", value: activeLinks.length, icon: Shield, color: "text-green-400" },
            { label: "Total Views", value: totalViews, icon: Eye, color: "text-amber-400" },
            { label: "Prospects", value: new Set(links.map((l: any) => l.prospectEmail)).size, icon: Users, color: "text-purple-400" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold font-mono">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Create Link */}
        <CreateLinkForm onCreated={() => linksQuery.refetch()} />

        {/* Links List */}
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> Demo Links ({links.length})
          </h3>
          {links.length === 0 ? (
            <div className="glass-card rounded-xl p-8 text-center text-muted-foreground">
              <Link2 className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p>No demo links created yet. Create your first one above!</p>
            </div>
          ) : (
            links.map((link: any) => (
              <LinkRow key={link.id} link={link} onRevoke={() => linksQuery.refetch()} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== Main Admin Panel ====================
export default function AdminPanel() {
  const adminQuery = trpc.admin.me.useQuery();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (adminQuery.data?.authenticated) {
      setIsAuthenticated(true);
    }
  }, [adminQuery.data]);

  if (adminQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0B1120" }}>
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return <AdminDashboard onLogout={() => setIsAuthenticated(false)} />;
}
