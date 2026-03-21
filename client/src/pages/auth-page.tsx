import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Heart, Eye, EyeOff, Activity, Shield, Stethoscope } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

async function apiRequest(url: string, data: object) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || "Request failed");
  }
  return res.json();
}

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [, setLocation] = useLocation();

  const loginForm = useForm<LoginData>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterData>({ resolver: zodResolver(registerSchema) });

  const loginMutation = useMutation({
    mutationFn: (data: LoginData) => apiRequest("/api/login", data),
    onSuccess: () => setLocation("/"),
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => apiRequest("/api/register", data),
    onSuccess: () => setLocation("/"),
  });

  const features = [
    { icon: Stethoscope, label: "Diabetes Prediction" },
    { icon: Heart, label: "Heart Disease Analysis" },
    { icon: Activity, label: "Parkinson's Detection" },
    { icon: Shield, label: "Secure & Private" },
  ];

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'DM Sans', sans-serif", background: "#0f1117" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background gradient blobs */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at 20% 50%, rgba(56,189,248,0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.1) 0%, transparent 60%)",
        }} />
        <div style={{
          position: "absolute", top: "10%", left: "5%", width: 300, height: 300, borderRadius: "50%",
          background: "rgba(56,189,248,0.06)", filter: "blur(60px)",
        }} />
        <div style={{
          position: "absolute", bottom: "15%", right: "5%", width: 250, height: 250, borderRadius: "50%",
          background: "rgba(168,85,247,0.08)", filter: "blur(50px)",
        }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: "linear-gradient(135deg, #38bdf8, #818cf8)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Heart size={22} color="white" fill="white" />
            </div>
            <span style={{ color: "white", fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px" }}>MediPredict</span>
          </div>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>AI-Powered Disease Prediction</p>
        </div>

        <div className="relative z-10">
          <h1 style={{
            color: "white", fontSize: 44, fontWeight: 800,
            lineHeight: 1.1, letterSpacing: "-2px", marginBottom: 20,
          }}>
            Predict.<br />
            <span style={{ background: "linear-gradient(135deg, #38bdf8, #818cf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Prevent.
            </span><br />
            Protect.
          </h1>
          <p style={{ color: "#64748b", fontSize: 16, lineHeight: 1.6, maxWidth: 380 }}>
            Our machine learning models analyze your health data to predict risk of diabetes, heart disease, and Parkinson's with clinical-grade accuracy.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-3">
          {features.map(({ icon: Icon, label }) => (
            <div key={label} style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10,
            }}>
              <Icon size={16} color="#38bdf8" />
              <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6" style={{ background: "#0f1117" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-10 justify-center">
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #38bdf8, #818cf8)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Heart size={18} color="white" fill="white" />
            </div>
            <span style={{ color: "white", fontSize: 20, fontWeight: 700 }}>MediPredict</span>
          </div>

          {/* Tab switcher */}
          <div style={{
            display: "flex", background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12,
            padding: 4, marginBottom: 32,
          }}>
            {(["login", "register"] as const).map((tab) => (
              <button key={tab} onClick={() => setMode(tab)} style={{
                flex: 1, padding: "10px 0", borderRadius: 8, border: "none", cursor: "pointer",
                fontWeight: 600, fontSize: 14, transition: "all 0.2s",
                background: mode === tab ? "linear-gradient(135deg, #38bdf8, #818cf8)" : "transparent",
                color: mode === tab ? "white" : "#64748b",
                fontFamily: "inherit",
              }}>
                {tab === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>

          <h2 style={{ color: "white", fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 6 }}>
            {mode === "login" ? "Welcome back" : "Get started"}
          </h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>
            {mode === "login"
              ? "Sign in to access your health predictions"
              : "Create an account to start predicting"}
          </p>

          {/* Error */}
          {(loginMutation.error || registerMutation.error) && (
            <div style={{
              background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 10, padding: "12px 16px", marginBottom: 20,
              color: "#f87171", fontSize: 14,
            }}>
              {(loginMutation.error as Error)?.message || (registerMutation.error as Error)?.message}
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === "login" && (
            <form onSubmit={loginForm.handleSubmit((d) => loginMutation.mutate(d))}>
              <Field
                label="Username"
                error={loginForm.formState.errors.username?.message}
                {...loginForm.register("username")}
                placeholder="Enter your username"
              />
              <PasswordField
                label="Password"
                error={loginForm.formState.errors.password?.message}
                show={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
                placeholder="Enter your password"
                {...loginForm.register("password")}
              />
              <SubmitButton loading={loginMutation.isPending} label="Sign In" />
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === "register" && (
            <form onSubmit={registerForm.handleSubmit((d) => registerMutation.mutate(d))}>
              <Field
                label="Username"
                error={registerForm.formState.errors.username?.message}
                {...registerForm.register("username")}
                placeholder="Choose a username"
              />
              <PasswordField
                label="Password"
                error={registerForm.formState.errors.password?.message}
                show={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
                placeholder="Create a password (min 6 chars)"
                {...registerForm.register("password")}
              />
              <PasswordField
                label="Confirm Password"
                error={registerForm.formState.errors.confirmPassword?.message}
                show={showConfirm}
                onToggle={() => setShowConfirm(!showConfirm)}
                placeholder="Confirm your password"
                {...registerForm.register("confirmPassword")}
              />
              <SubmitButton loading={registerMutation.isPending} label="Create Account" />
            </form>
          )}

          <p style={{ color: "#334155", fontSize: 12, textAlign: "center", marginTop: 24 }}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function Field({ label, error, placeholder, ...props }: any) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", color: "#94a3b8", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
        {label}
      </label>
      <input
        {...props}
        placeholder={placeholder}
        style={{
          width: "100%", boxSizing: "border-box",
          background: "rgba(255,255,255,0.04)", border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`,
          borderRadius: 10, padding: "11px 14px", color: "white", fontSize: 14,
          outline: "none", fontFamily: "inherit", transition: "border-color 0.2s",
        }}
        onFocus={(e: any) => { e.target.style.borderColor = "#38bdf8"; }}
        onBlur={(e: any) => { e.target.style.borderColor = error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"; }}
      />
      {error && <p style={{ color: "#f87171", fontSize: 12, marginTop: 4 }}>{error}</p>}
    </div>
  );
}

function PasswordField({ label, error, show, onToggle, placeholder, ...props }: any) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", color: "#94a3b8", fontSize: 13, fontWeight: 500, marginBottom: 6 }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          {...props}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          style={{
            width: "100%", boxSizing: "border-box",
            background: "rgba(255,255,255,0.04)", border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"}`,
            borderRadius: 10, padding: "11px 42px 11px 14px", color: "white", fontSize: 14,
            outline: "none", fontFamily: "inherit", transition: "border-color 0.2s",
          }}
          onFocus={(e: any) => { e.target.style.borderColor = "#38bdf8"; }}
          onBlur={(e: any) => { e.target.style.borderColor = error ? "rgba(239,68,68,0.5)" : "rgba(255,255,255,0.1)"; }}
        />
        <button type="button" onClick={onToggle} style={{
          position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
          background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: 0,
        }}>
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p style={{ color: "#f87171", fontSize: 12, marginTop: 4 }}>{error}</p>}
    </div>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button type="submit" disabled={loading} style={{
      width: "100%", padding: "12px 0", marginTop: 8,
      background: loading ? "rgba(56,189,248,0.4)" : "linear-gradient(135deg, #38bdf8, #818cf8)",
      border: "none", borderRadius: 10, color: "white", fontSize: 15,
      fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
      fontFamily: "inherit", transition: "opacity 0.2s", letterSpacing: "-0.2px",
    }}>
      {loading ? "Please wait..." : label}
    </button>
  );
}
