import { motion } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";

import { StatusBadge } from "@/components/common/StatusBadge";
import { useLanguage, localized } from "@/lib/i18n";
import type { ScanRecord } from "@/data/mock";
import type { DiseaseScanRecord } from "@/lib/db";

type AnyScanRecord = ScanRecord | DiseaseScanRecord;

export function ScanRecordCard({ record }: { record: AnyScanRecord }) {
  const { t, language } = useLanguage();

  const diseaseText =
    typeof record.disease === "string" ? record.disease : localized(language, record.disease);

  const plotText =
    typeof record.plot === "string" ? record.plot : localized(language, record.plot);

  const severityText =
    typeof record.severity === "string" ? record.severity : localized(language, record.severity);

  const status =
    "status" in record && record.status
      ? record.status
      : record.diseaseCode === "healthy"
        ? "healthy"
        : "diseased";

  return (
    <motion.article
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 240, damping: 20 }}
      className="surface-card grid grid-cols-[auto_minmax(0,1fr)] gap-4 p-4"
    >
      <img
        src={record.image}
        alt={diseaseText}
        loading="lazy"
        width={1024}
        height={768}
        className="h-20 w-20 shrink-0 rounded-2xl object-cover sm:h-24 sm:w-24"
      />
      <div className="min-w-0">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
          <h3 className="truncate text-base font-bold text-foreground">{diseaseText}</h3>
          <StatusBadge status={status} />
        </div>
        <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-muted-foreground">
          <MapPin size={14} aria-hidden className="shrink-0" />
          {plotText}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} aria-hidden />
            {new Date(record.date).toLocaleDateString(language === "kn" ? "kn-IN" : "en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span>
            {t("result.confidence")}: <strong className="text-foreground">{record.confidence}%</strong>
          </span>
          <span>
            {t("result.severity")}:{" "}
            <strong className="text-foreground">{severityText}</strong>
          </span>
        </div>
      </div>
    </motion.article>
  );
}