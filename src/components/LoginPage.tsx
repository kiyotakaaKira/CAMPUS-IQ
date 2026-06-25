import { useState } from "react";
import { Building2, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthInput } from "./auth/AuthInput";
import { AuthButton } from "./auth/AuthButton";
import { AuthCard } from "./auth/AuthCard";
import { RoleAccessCenter } from "./auth/RoleAccessCenter";
import { OperationalActivityCanvas } from "./auth/OperationalActivityCanvas";
import { CampusPulsePanel } from "./auth/CampusPulsePanel";
import { RoleWelcomeScreen } from "./auth/RoleWelcomeScreen";
import { DashboardEntryTransition } from "./auth/DashboardEntryTransition";

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginStep, setLoginStep] = useState<"form" | "welcome" | "dashboard">("form");

  const handleLoginSuccess = async () => {
    setLoginStep("welcome");
    setTimeout(() => {
      setLoginStep("dashboard");
      setTimeout(() => navigate("/app", { replace: true }), 1800);
    }, 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const success = await login(userId, password);
    if (!success) {
      setError(true);
      setLoading(false);
    } else {
      handleLoginSuccess();
    }
  };

  const handleQuickLogin = async (id: string, pwd: string) => {
    setUserId(id);
    setPassword(pwd);
    setLoading(true);
    setError(false);
    const success = await login(id, pwd);
    if (success) handleLoginSuccess();
    else {
      setError(true);
      setLoading(false);
    }
  };

  if (loginStep === "welcome") return user ? <RoleWelcomeScreen user={user} /> : null;
  if (loginStep === "dashboard") return user ? <DashboardEntryTransition user={user} /> : null;

  return (
    <div className="min-h-screen auth-theme bg-background">
      {/* Mobile: compact pulse strip */}
      <div className="lg:hidden border-b border-border bg-surface px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">CampusIQ</p>
            <p className="text-[10px] text-muted-foreground">Campus Operating System</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-medium text-emerald-700">Live</span>
          </div>
        </div>
      </div>

      <div className="grid min-h-[calc(100vh-52px)] lg:min-h-screen lg:grid-cols-12">
        {/* Left: Campus Intelligence Center */}
        <div className="hidden lg:flex lg:col-span-5 flex-col border-r border-border bg-background p-6 xl:p-8">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-semibold text-foreground">CampusIQ</span>
              <p className="text-[10px] text-muted-foreground">Campus Operating System</p>
            </div>
          </div>
          <div className="flex-1">
            <OperationalActivityCanvas />
          </div>
        </div>

        {/* Center: Campus Pulse */}
        <div className="hidden lg:flex lg:col-span-3 flex-col border-r border-border bg-muted/20 p-6 xl:p-8">
          <CampusPulsePanel />
        </div>

        {/* Right: Authentication */}
        <div className="lg:col-span-4 flex flex-col justify-center px-6 py-10 lg:px-8 xl:px-10 bg-background">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full max-w-md mx-auto"
          >
            {/* Auth header */}
            <div className="mb-8 text-center lg:text-left">
              <div className="lg:hidden flex justify-center mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                  <Building2 className="h-6 w-6" />
                </div>
              </div>
              <h1 className="text-2xl font-semibold text-foreground tracking-tight">Welcome Back</h1>
              <p className="text-sm text-muted-foreground mt-1.5">Institution Access Portal</p>
            </div>

            <AuthCard className="p-6 sm:p-7 shadow-[var(--ciq-shadow-auth)]">
              <div className="flex items-center gap-2.5 mb-6 pb-5 border-b border-border">
                <div className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Building2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">CampusIQ</p>
                  <p className="text-[11px] text-muted-foreground">Secure institutional sign-in</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <AuthInput
                  label="Campus ID"
                  type="text"
                  placeholder="CITXXXXXX or FACXXX"
                  value={userId}
                  onChange={e => { setUserId(e.target.value); setError(false); }}
                  error={error}
                  required
                />
                <AuthInput
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(false); }}
                  error={error}
                  required
                />

                <div className="flex items-center justify-between text-sm pt-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" className="rounded border-border text-primary focus:ring-primary/20" />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors text-xs">Remember me</span>
                  </label>
                  <button type="button" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </button>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                    <Lock className="h-4 w-4 shrink-0" />
                    <span>Invalid Campus ID or password.</span>
                  </div>
                )}

                <AuthButton type="submit" className="w-full mt-1" isLoading={loading}>
                  Sign In
                </AuthButton>
              </form>
            </AuthCard>

            <RoleAccessCenter onQuickLogin={handleQuickLogin} />

            <p className="text-center text-[10px] text-muted-foreground mt-6">
              © 2026 CampusIQ Platform · Privacy · Terms
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
