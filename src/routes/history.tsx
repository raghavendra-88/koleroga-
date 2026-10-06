import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { PageTransition } from "@/components/common/PageTransition";
import { ScanRecordCard } from "@/components/cards/ScanRecordCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Farm History — Koleroga AI" },
      {
        name: "description",
        content:
          "A searchable timeline of every arecanut scan with disease, severity and plot details.",
      },
      { property: "og:title", content: "Farm History — Koleroga AI" },
      { property: "og:description", content: "Track every koleroga scan across your plots." },
    ],
  }),
  component: HistoryPage,
});

type Filter = "all" | "healthy" | "diseased";

function HistoryPage() {
  const { t } = useLanguage();
  const { scans } = useAuth();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filters: { value: Filter; label: string }[] = [
    { value: "all", label: t("common.all") },
    { value: "healthy", label: t("common.healthy") },
    { value: "diseased", label: t("common.diseased") },
  ];

  const records = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return scans.filter((record) => {
      const status = record.diseaseCode === "healthy" ? "healthy" : "diseased";
      const matchesFilter = filter === "all" || status === filter;
      const haystack = [record.disease, record.plot, record.id].join(" ").toLowerCase();
      return matchesFilter && (needle === "" || haystack.includes(needle));
    });
  }, [scans, query, filter]);

  return (
    <AppShell title={t("history.title")} subtitle={t("history.sub")}>
      <PageTransition className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              size={18}
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("common.search")}
              aria-label={t("common.search")}
              className="h-13 rounded-2xl border-border bg-card pl-11 text-base"
            />
          </div>
          <div
            className="flex shrink-0 gap-2 overflow-x-auto pb-1"
            role="group"
            aria-label={t("common.filter")}
          >
            {filters.map((item) => (
              <Button
                key={item.value}
                variant={filter === item.value ? "default" : "outline"}
                size="default"
                className="rounded-full"
                aria-pressed={filter === item.value}
                onClick={() => setFilter(item.value)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {records.length === 0 ? (
          <div className="surface-card p-8 text-center text-sm text-muted-foreground">
            <p>{t("history.empty")}</p>
            {scans.length === 0 && (
              <p className="mt-2 text-xs">
                Scan your first arecanut bunch using the Scanner to build your farm history.
              </p>
            )}
          </div>
        ) : (
          <ol className="relative space-y-4 border-l-2 border-border pl-5 sm:pl-7">
            {records.map((record, index) => (
              <motion.li
                key={record.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="relative"
              >
                <span
                  aria-hidden
                  className="absolute -left-[27px] top-8 h-3.5 w-3.5 rounded-full border-2 border-card bg-primary sm:-left-[35px]"
                />
                <ScanRecordCard record={record} />
              </motion.li>
            ))}
          </ol>
        )}
      </PageTransition>
    </AppShell>
  );
}