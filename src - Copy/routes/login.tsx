import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import heroImage from "@/assets/hero-plantation.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { LanguageToggle } from "@/components/common/LanguageToggle";
import { Logo } from "@/components/common/Logo";
import { useAuth } from "@/lib/auth";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Koleroga AI" },
      {
        name: "description",
        content: "Sign in to access your smart arecanut disease scanner and plantation reports.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const t = useT();
  const navigate = useNavigate();
  const { login, continueAsGuest, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If already logged in, auto redirect to dashboard
  if (user) {
    void navigate({ to: "/dashboard" });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toast.success("Successfully authenticated!");
      void navigate({ to: "/dashboard" });
    } else {
      setErrorMsg(result.error || "Invalid credentials.");
    }
  };

  const handleGuest = () => {
    continueAsGuest();
    toast.info("Continuing as Guest");
    void navigate({ to: "/dashboard" });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <img
        src={heroImage}
        alt="Arecanut plantation background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/65 to-black/85 backdrop-blur-[2px]"
      />

      <div className="relative flex min-h-screen flex-col">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-5 sm:px-8">
          <Link to="/welcome" className="min-w-0 text-white [&_p]:text-white">
            <Logo />
          </Link>
          <LanguageToggle className="border border-white/25 bg-white/15 text-white hover:bg-white/25" />
        </header>

        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md rounded-3xl border border-white/20 bg-card/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
          >
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/12 px-3 py-1 text-xs font-semibold text-primary">
                <ShieldCheck size={14} />
                Secure Portal
              </span>
              <h1 className="mt-3 text-2xl font-extrabold text-foreground sm:text-3xl">
                {t("auth.loginTitle")}
              </h1>
              <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                {t("auth.loginSub")}
              </p>
            </div>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-medium text-destructive"
              >
                {errorMsg}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground">
                  {t("auth.email")}
                </label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@gmail.com"
                    className="h-12 rounded-xl pl-10 text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-muted-foreground">
                    {t("auth.password")}
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    {t("auth.forgotPass")}
                  </Link>
                </div>
                <div className="relative mt-1">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 rounded-xl pl-10 pr-10 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                  <Checkbox
                    checked={remember}
                    onCheckedChange={(v) => setRemember(!!v)}
                  />
                  <span>{t("auth.remember")}</span>
                </label>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="xl"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>{t("auth.signInBtn")}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-3 pt-4 border-t border-border/60">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t("auth.noAccount")}</span>
                <Link
                  to="/register"
                  className="font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <UserPlus size={14} />
                  {t("auth.createAccountBtn")}
                </Link>
              </div>

              <Button
                variant="ghost"
                size="default"
                onClick={handleGuest}
                className="w-full text-xs text-muted-foreground hover:text-foreground"
              >
                {t("welcome.guest")}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
