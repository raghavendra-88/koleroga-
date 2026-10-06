import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import heroImage from "@/assets/hero-plantation.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LanguageToggle } from "@/components/common/LanguageToggle";
import { Logo } from "@/components/common/Logo";
import { useT } from "@/lib/i18n";
import { db } from "@/lib/db";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password — Koleroga AI" },
      {
        name: "description",
        content: "Reset your Koleroga AI account password.",
      },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const t = useT();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid registered email address.");
      return;
    }

    setLoading(true);
    const existing = await db.getUserByEmail(email);
    setLoading(false);

    if (!existing) {
      setErrorMsg("No account found with this email address.");
      return;
    }

    setSubmitted(true);
    toast.success("Password reset instructions generated.");
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
                Password Recovery
              </span>
              <h1 className="mt-3 text-2xl font-extrabold text-foreground sm:text-3xl">
                {t("auth.forgotTitle")}
              </h1>
              <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                {t("auth.forgotSub")}
              </p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 space-y-4 text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/20 text-success">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-lg font-bold">Reset Instructions Sent</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We have verified your email address (<strong>{email}</strong>). Follow the link sent to your inbox to set a new password, or click below to return to sign in.
                </p>
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full mt-4"
                  onClick={() => void navigate({ to: "/login" })}
                >
                  Return to Login
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {errorMsg && (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs font-medium text-destructive">
                    {errorMsg}
                  </div>
                )}

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

                <Button
                  type="submit"
                  variant="hero"
                  size="xl"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? "Verifying Email..." : t("auth.resetBtn")}
                </Button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-border/60 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft size={14} />
                Back to Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
