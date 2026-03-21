// client/src/App.tsx
// Replace your existing App.tsx content with this

import { Switch, Route, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/protected-route";
import AuthPage from "@/pages/auth-page";

// Import your existing main page here:
// import HomePage from "@/pages/home-page";

const queryClient = new QueryClient();

function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      {/* Auth page — redirect to home if already logged in */}
      <Route path="/auth">
        {isAuthenticated ? <Redirect to="/" /> : <AuthPage />}
      </Route>

      {/* Protected home route — put your main app page here */}
      <Route path="/">
        <ProtectedRoute component={PlaceholderHomePage} />
        {/* Replace PlaceholderHomePage with your actual page component, e.g.:
            <ProtectedRoute component={HomePage} /> */}
      </Route>

      {/* Catch-all */}
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}

// Remove this once you wire up your real home page
function PlaceholderHomePage() {
  const { user, logout } = useAuth();
  return (
    <div style={{ minHeight: "100vh", background: "#0f1117", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "DM Sans, sans-serif" }}>
      <div style={{ textAlign: "center", color: "white" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700 }}>Welcome, {user?.username}! 👋</h1>
        <p style={{ color: "#64748b", marginTop: 8 }}>You are now logged in to MediPredict.</p>
        <button onClick={logout} style={{
          marginTop: 24, padding: "10px 24px", background: "linear-gradient(135deg, #38bdf8, #818cf8)",
          border: "none", borderRadius: 10, color: "white", fontWeight: 600,
          fontSize: 14, cursor: "pointer", fontFamily: "inherit",
        }}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}
