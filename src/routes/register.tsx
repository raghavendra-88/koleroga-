import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sprout,
  Trees,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import heroImage from "@/assets/hero-plantation.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LanguageToggle } from "@/components/common/LanguageToggle";
import { Logo } from "@/components/common/Logo";
import { useAuth } from "@/lib/auth";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register Farm Account — Koleroga AI" },
      {
        name: "description",
        content: "Create your Koleroga AI farm profile to monitor fruit rot risks and keep farm records.",
      },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const t = useT();
  const navigate = useNavigate();
  const { register, user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Optional Farm Details
  const [farmName, setFarmName] = useState("");
  const [village, setVillage] = useState("Shivamogga");
  const [district, setDistrict] = useState("Shivamogga");
  const [state, setState] = useState("Karnataka");
  const [plantationArea, setPlantationArea] = useState("3.5 acres");
  const [plantCount, setPlantCount] = useState<number>(650);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (user) {
    void navigate({ to: "/dashboard" });
  }

  // Password Strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "Empty", color: "bg-muted" };
    if (pass.length < 6) return { score: 1, label: "Weak (min 6 chars)", color: "bg-destructive" };
    const hasNum = /\d/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    if (hasNum && hasSpecial && pass.length >= 8)
      return { score: 3, label: "Strong", color: "bg-success" };
    return { score: 2, label: "Medium", color: "bg-warning" };
  };

  const passStrength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMsg("Please enter a valid phone number.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await register({
      fullName,
      email,
      phone,
      password,
      farmName: farmName || `${fullName}'s Arecanut Plantation`,
      village,
      district,
      state,
      plantationArea,
      plantCount: Number(plantCount) || 500,
    });
    setLoading(false);

    if (result.success) {
      toast.success(`Welcome to Koleroga AI, ${fullName}! Your account is ready.`);
      void navigate({ to: "/dashboard" });
    } else {
      setErrorMsg(result.error || "Registration failed.");
    }
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
            className="w-full max-w-2xl rounded-3xl border border-white/20 bg-card/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
          >
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/12 px-3 py-1 text-xs font-semibold text-primary">
                <ShieldCheck size={14} />
                Farmer Registration
              </span>
              <h1 className="mt-3 text-2xl font-extrabold text-foreground sm:text-3xl">
                {t("auth.registerTitle")}
              </h1>
              <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                {t("auth.registerSub")}
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

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Account Credentials */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                  1. Account Information
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground">
                      {t("auth.fullName")} *
                    </label>
                    <div className="relative mt-1">
                      <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Rahul Kumar"
                        className="h-11 rounded-xl pl-10 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground">
                      {t("auth.email")} *
                    </label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="rahul@gmail.com"
                        className="h-11 rounded-xl pl-10 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground">
                      {t("auth.phone")} *
                    </label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="h-11 rounded-xl pl-10 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground">
                      {t("auth.password")} *
                    </label>
                    <div className="relative mt-1">
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-11 rounded-xl pl-10 pr-10 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {password && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full ${passStrength.color}`}
                            style={{ width: `${(passStrength.score / 3) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-semibold text-muted-foreground">
                          {passStrength.label}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground">
                    {t("auth.confirmPassword")} *
                  </label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-11 rounded-xl pl-10 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Plantation & Location Info */}
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                  2. Arecanut Plantation Information (Optional)
                </h3>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground">
                      {t("auth.farmName")}
                    </label>
                    <div className="relative mt-1">
                      <Sprout className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={farmName}
                        onChange={(e) => setFarmName(e.target.value)}
                        placeholder="Green Valley Arecanut Farm"
                        className="h-11 rounded-xl pl-10 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground">
                      {t("auth.village")}
                    </label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        placeholder="Thirthahalli"
                        className="h-11 rounded-xl pl-10 text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground">
                      {t("auth.district")}
                    </label>
                    <Input
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="Shivamogga"
                      className="h-11 rounded-xl text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground">
                      {t("auth.area")}
                    </label>
                    <Input
                      value={plantationArea}
                      onChange={(e) => setPlantationArea(e.target.value)}
                      placeholder="3.5 acres"
                      className="h-11 rounded-xl text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground">
                      {t("auth.plants")}
                    </label>
                    <div className="relative mt-1">
                      <Trees className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="number"
                        value={plantCount}
                        onChange={(e) => setPlantCount(Number(e.target.value))}
                        placeholder="650"
                        className="h-11 rounded-xl pl-10 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="xl"
                className="w-full mt-4"
                disabled={loading}
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>{t("auth.createAccountBtn")}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 flex items-center justify-between text-xs pt-4 border-t border-border/60">
              <span className="text-muted-foreground">{t("auth.haveAccount")}</span>
              <Link
                to="/login"
                className="font-semibold text-primary hover:underline"
              >
                {t("auth.signInBtn")}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
