import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Import pages
import Dashboard from "@/pages/Dashboard";
import DiabetesForm from "@/pages/DiabetesForm";
import HeartForm from "@/pages/HeartForm";
import ParkinsonsForm from "@/pages/ParkinsonsForm";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/diabetes" component={DiabetesForm} />
      <Route path="/heart" component={HeartForm} />
      <Route path="/parkinsons" component={ParkinsonsForm} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
