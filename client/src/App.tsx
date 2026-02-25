import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AudioProvider } from "./contexts/AudioContext";
import { AudioPlayer } from "./components/AudioPlayer";
import Home from "./pages/Home";
import Demo from "./pages/Demo";
import Walkthrough from "./pages/Walkthrough";
import SecurePlayer from "./pages/SecurePlayer";
import AdminPanel from "./pages/AdminPanel";
import ProspectView from "./pages/ProspectView";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/demo" component={Demo} />
      <Route path="/walkthrough" component={Walkthrough} />
      <Route path="/watch/:token" component={SecurePlayer} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/view/:token" component={ProspectView} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AudioProvider>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <Toaster />
            <Router />
            <AudioPlayer />
          </TooltipProvider>
        </ThemeProvider>
      </AudioProvider>
    </ErrorBoundary>
  );
}

export default App;
