import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Camera, ImagePlus, Info, RefreshCw, ScanLine, Sun, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/layout/AppShell";
import { PageTransition } from "@/components/common/PageTransition";
import { Button } from "@/components/ui/button";
import { useT, type TranslationKey } from "@/lib/i18n";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Disease Scanner — Koleroga AI" },
      {
        name: "description",
        content:
          "Capture or upload a photo of your arecanut bunch and get a koleroga fruit rot assessment in seconds.",
      },
      { property: "og:title", content: "Disease Scanner — Koleroga AI" },
      {
        property: "og:description",
        content: "Camera-first koleroga scanning for arecanut plantations.",
      },
    ],
  }),
  component: ScannerPage,
});

const instructionKeys: TranslationKey[] = ["scan.step1", "scan.step2", "scan.step3", "scan.step4"];

function ScannerPage() {
  const t = useT();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      toast.error("File size exceeds 12MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageDataUrl(reader.result);
        stopCamera();
      }
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error("Camera access not supported on this browser.");
        return;
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(mediaStream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      toast.error("Could not access camera. Please allow camera permissions or upload an image.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setImageDataUrl(dataUrl);
      stopCamera();
      toast.success("Photo captured!");
    }
  };

  const startAnalysis = () => {
    if (!imageDataUrl) {
      // Use fallback default diseased sample if user clicks straight to analysis without file
      sessionStorage.setItem("pending_scan_image", "");
    } else {
      sessionStorage.setItem("pending_scan_image", imageDataUrl);
    }
    void navigate({ to: "/analysis" });
  };

  return (
    <AppShell title={t("scan.title")} subtitle={t("scan.sub")}>
      <PageTransition className="space-y-6 lg:grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start lg:gap-6 lg:space-y-0">
        <div className="space-y-5">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border bg-foreground/90 shadow-xl">
            {isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="h-full w-full object-cover"
              />
            ) : imageDataUrl ? (
              <img
                src={imageDataUrl}
                alt="Selected arecanut bunch preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-center text-white/80">
                <div>
                  <Camera size={52} aria-hidden className="mx-auto text-primary" />
                  <p className="mt-3 text-base font-semibold">{t("scan.preview")}</p>
                  <p className="text-sm text-white/60">{t("scan.previewHint")}</p>
                </div>
              </div>
            )}

            {/* Scanning Laser Line */}
            <motion.div
              aria-hidden
              className="absolute inset-x-6 h-0.5 rounded bg-leaf shadow-[0_0_18px_var(--color-leaf)]"
              animate={{ top: ["12%", "86%", "12%"] }}
              transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute inset-6 pointer-events-none rounded-2xl border-2 border-dashed border-white/35" />
          </div>

          {isCameraActive ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="hero" size="xl" onClick={capturePhoto}>
                <Camera aria-hidden />
                Capture Photo
              </Button>
              <Button variant="outline" size="xl" onClick={stopCamera}>
                Cancel Camera
              </Button>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="hero" size="xl" onClick={startCamera}>
                <Camera aria-hidden />
                {t("scan.openCamera")}
              </Button>
              <Button variant="outline" size="xl" onClick={() => fileRef.current?.click()}>
                <ImagePlus aria-hidden />
                {t("scan.upload")}
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="sr-only"
                aria-hidden
                tabIndex={-1}
                onChange={handleFileUpload}
              />
            </div>
          )}

          {imageDataUrl && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="surface-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex min-w-0 items-center gap-3">
                <motion.span
                  aria-hidden
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/12 text-primary"
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                >
                  <ScanLine size={24} />
                </motion.span>
                <div>
                  <p className="truncate text-sm font-bold">Image Ready for AI Analysis</p>
                  <p className="text-xs text-muted-foreground">High resolution scan frame</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setImageDataUrl(null)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 size={18} />
                </Button>
                <Button variant="hero" size="lg" onClick={startAnalysis} className="w-full sm:w-auto">
                  {t("scan.analyze")}
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        <section className="surface-card p-5" aria-label={t("scan.instructions")}>
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-warning/25 text-warning-foreground"
            >
              <Info size={20} />
            </span>
            <h2 className="text-base font-bold sm:text-lg">{t("scan.instructions")}</h2>
          </div>
          <ol className="mt-4 space-y-3">
            {instructionKeys.map((key, index) => (
              <li key={key} className="flex items-start gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm leading-relaxed">{t(key)}</p>
              </li>
            ))}
          </ol>
          <div className="mt-5 flex items-start gap-3 rounded-2xl bg-accent/60 p-4">
            <Sun size={20} aria-hidden className="mt-0.5 shrink-0 text-primary" />
            <p className="text-sm text-accent-foreground">{t("weather.riskNote")}</p>
          </div>
        </section>
      </PageTransition>
    </AppShell>
  );
}