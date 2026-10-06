import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Leaf, Sprout } from "lucide-react";
import { useEffect } from "react";

import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Koleroga AI — Protecting Every Arecanut Tree" },
      {
        name: "description",
        content:
          "Open Koleroga AI to scan arecanut bunches for koleroga fruit rot, check plantation weather risk and keep farm records.",
      },
      { property: "og:title", content: "Koleroga AI — Protecting Every Arecanut Tree" },
      {
        property: "og:description",
        content: "Arecanut disease detection built for Karnataka farmers.",
      },
    ],
  }),
  component: SplashScreen,
});

const leafPositions = [
  { left: "12%", delay: 0 },
  { left: "32%", delay: 0.6 },
  { left: "58%", delay: 1.1 },
  { left: "78%", delay: 0.3 },
];

function SplashScreen() {
  const t = useT();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void navigate({ to: "/welcome" });
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-leaf px-6 text-center text-white">
      {leafPositions.map((leaf) => (
        <motion.span
          key={leaf.left}
          aria-hidden
          className="pointer-events-none absolute top-0 text-white/25"
          style={{ left: leaf.left }}
          initial={{ y: -80, rotate: 0, opacity: 0 }}
          animate={{ y: "100vh", rotate: 320, opacity: [0, 1, 1, 0] }}
          transition={{ duration: 6, delay: leaf.delay, repeat: Infinity, ease: "linear" }}
        >
          <Leaf size={34} />
        </motion.span>
      ))}

      <motion.div
        initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 12 }}
        className="relative grid h-28 w-28 place-items-center rounded-[2rem] bg-white/18 backdrop-blur-sm"
      >
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-[2rem] border-2 border-white/40"
          animate={{ scale: [1, 1.25, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
        />
        <Sprout size={56} strokeWidth={2} aria-hidden />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="mt-8 text-4xl font-extrabold sm:text-5xl"
      >
        {t("app.name")}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="mt-3 max-w-md text-base text-white/90 sm:text-lg"
      >
        {t("app.tagline")}
      </motion.p>

      <div className="mt-12 flex items-center gap-2" aria-label={t("app.loading")} role="status">
        {[0, 1, 2].map((dot) => (
          <motion.span
            key={dot}
            className="h-3 w-3 rounded-full bg-white"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -6, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: dot * 0.16 }}
          />
        ))}
      </div>
      <p className="mt-4 text-sm text-white/80">{t("app.loading")}</p>
    </div>
  );
}
