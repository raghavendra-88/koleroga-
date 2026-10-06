import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, ScanLine, ShieldCheck, UserPlus } from "lucide-react";

import heroImage from "@/assets/hero-plantation.jpg";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/common/LanguageToggle";
import { Logo } from "@/components/common/Logo";
import { useT } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/welcome")({
  head: () => ({
    meta: [
      { title: "Welcome to Koleroga AI — Smart Arecanut Disease Detection" },
      {
        name: "description",
        content:
          "Login, register or continue as a guest to scan arecanut bunches for koleroga and monitor plantation risk.",
      },
      { property: "og:title", content: "Smart Disease Detection for Every Farmer" },
      {
        property: "og:description",
        content: "Koleroga AI brings arecanut disease detection to every Karnataka plantation.",
      },
    ],
  }),
  component: WelcomeScreen,
});

function WelcomeScreen() {
  const t = useT();
  const navigate = useNavigate();
  const { continueAsGuest } = useAuth();

  const handleGuest = () => {
    continueAsGuest();
    void navigate({ to: "/dashboard" });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <img
        src={heroImage}
        alt="Arecanut plantation in Karnataka at sunrise"
        width={1920}
        height={1280}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/60 to-black/85"
      />

      <div className="relative flex min-h-screen flex-col">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-5 sm:px-8">
          <div className="min-w-0 text-white [&_p]:text-white">
            <Logo />
          </div>
          <LanguageToggle className="border border-white/25 bg-white/15 text-white hover:bg-white/25" />
        </header>

        <div className="flex flex-1 items-end px-5 pb-10 sm:px-8 sm:pb-14">
          <div className="mx-auto w-full max-w-6xl lg:grid lg:grid-cols-2 lg:items-end lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-white"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold backdrop-blur-sm sm:text-sm">
                <ShieldCheck size={16} aria-hidden />
                {t("welcome.trust")}
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                {t("welcome.headline")}
              </h1>
              <p className="mt-4 max-w-xl text-base text-white/85 sm:text-lg">
                {t("welcome.sub")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="mt-9 rounded-3xl border border-white/15 bg-card/95 p-5 shadow-[var(--shadow-card)] backdrop-blur-md sm:p-6 lg:mt-0"
            >
              <div className="flex flex-col gap-3">
                <Button asChild variant="hero" size="xl" className="w-full">
                  <Link to="/login">
                    <ArrowRight aria-hidden />
                    {t("welcome.login")}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="xl" className="w-full">
                  <Link to="/register">
                    <UserPlus aria-hidden />
                    {t("welcome.register")}
                  </Link>
                </Button>
                <Button variant="ghost" size="lg" onClick={handleGuest} className="w-full text-primary">
                  <ScanLine aria-hidden />
                  {t("welcome.guest")}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}