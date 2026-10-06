import healthyImage from "@/assets/healthy-arecanut.jpg";
import diseasedImage from "@/assets/diseased-arecanut.jpg";

export type RiskLevel = "low" | "moderate" | "high";
export type HealthStatus = "healthy" | "diseased";

export interface Bilingual {
  en: string;
  kn: string;
}

export interface Farmer {
  name: Bilingual;
  village: Bilingual;
  farmSize: Bilingual;
  trees: number;
  scans: number;
  savedReports: number;
  avatarInitials: string;
}

export interface WeatherSnapshot {
  temperatureC: number;
  humidityPercent: number;
  rainChancePercent: number;
  windKph: number;
  condition: Bilingual;
  riskLevel: RiskLevel;
  riskScore: number;
}

export interface HourlyForecast {
  time: string;
  temperatureC: number;
  rainChancePercent: number;
}

export interface ScanRecord {
  id: string;
  date: string;
  plot: Bilingual;
  disease: Bilingual;
  status: HealthStatus;
  confidence: number;
  severity: Bilingual;
  image: string;
}

export interface Tip {
  id: string;
  title: Bilingual;
  body: Bilingual;
}

export interface AlertItem {
  id: string;
  title: Bilingual;
  detail: Bilingual;
  level: RiskLevel;
}

export interface Scheme {
  id: string;
  name: Bilingual;
  benefit: Bilingual;
  department: Bilingual;
}

export const farmer: Farmer = {
  name: { en: "Shivanna Gowda", kn: "ಶಿವಣ್ಣ ಗೌಡ" },
  village: { en: "Hosanagara, Shivamogga", kn: "ಹೊಸನಗರ, ಶಿವಮೊಗ್ಗ" },
  farmSize: { en: "3.5 acres", kn: "3.5 ಎಕರೆ" },
  trees: 820,
  scans: 48,
  savedReports: 21,
  avatarInitials: "SG",
};

export const currentWeather: WeatherSnapshot = {
  temperatureC: 26,
  humidityPercent: 88,
  rainChancePercent: 72,
  windKph: 12,
  condition: { en: "Heavy showers likely", kn: "ಭಾರೀ ಮಳೆ ಸಾಧ್ಯತೆ" },
  riskLevel: "high",
  riskScore: 78,
};

export const hourlyForecast: HourlyForecast[] = [
  { time: "6 AM", temperatureC: 22, rainChancePercent: 40 },
  { time: "9 AM", temperatureC: 24, rainChancePercent: 55 },
  { time: "12 PM", temperatureC: 27, rainChancePercent: 70 },
  { time: "3 PM", temperatureC: 26, rainChancePercent: 85 },
  { time: "6 PM", temperatureC: 24, rainChancePercent: 78 },
  { time: "9 PM", temperatureC: 23, rainChancePercent: 60 },
];

export const weeklyRainfall = [
  { day: "Mon", rainMm: 12, humidity: 82 },
  { day: "Tue", rainMm: 26, humidity: 88 },
  { day: "Wed", rainMm: 34, humidity: 91 },
  { day: "Thu", rainMm: 18, humidity: 86 },
  { day: "Fri", rainMm: 42, humidity: 93 },
  { day: "Sat", rainMm: 30, humidity: 90 },
  { day: "Sun", rainMm: 16, humidity: 84 },
];

export const weeklyScanTrend = [
  { week: "W1", healthy: 12, diseased: 4 },
  { week: "W2", healthy: 15, diseased: 6 },
  { week: "W3", healthy: 18, diseased: 3 },
  { week: "W4", healthy: 21, diseased: 5 },
];

export const scanHistory: ScanRecord[] = [
  {
    id: "SC-1048",
    date: "2026-08-03",
    plot: { en: "Plot A · North row", kn: "ಪ್ಲಾಟ್ A · ಉತ್ತರ ಸಾಲು" },
    disease: { en: "Koleroga (Fruit rot)", kn: "ಕೊಳೆರೋಗ (ಕಾಯಿ ಕೊಳೆ)" },
    status: "diseased",
    confidence: 92,
    severity: { en: "Moderate", kn: "ಮಧ್ಯಮ" },
    image: diseasedImage,
  },
  {
    id: "SC-1047",
    date: "2026-08-01",
    plot: { en: "Plot B · Near well", kn: "ಪ್ಲಾಟ್ B · ಬಾವಿ ಬಳಿ" },
    disease: { en: "No disease found", kn: "ರೋಗ ಕಂಡುಬಂದಿಲ್ಲ" },
    status: "healthy",
    confidence: 96,
    severity: { en: "None", kn: "ಇಲ್ಲ" },
    image: healthyImage,
  },
  {
    id: "SC-1043",
    date: "2026-07-28",
    plot: { en: "Plot C · Hill side", kn: "ಪ್ಲಾಟ್ C · ಗುಡ್ಡದ ಬದಿ" },
    disease: { en: "Koleroga (Early stage)", kn: "ಕೊಳೆರೋಗ (ಆರಂಭಿಕ)" },
    status: "diseased",
    confidence: 84,
    severity: { en: "Low", kn: "ಕಡಿಮೆ" },
    image: diseasedImage,
  },
  {
    id: "SC-1039",
    date: "2026-07-24",
    plot: { en: "Plot A · South row", kn: "ಪ್ಲಾಟ್ A · ದಕ್ಷಿಣ ಸಾಲು" },
    disease: { en: "No disease found", kn: "ರೋಗ ಕಂಡುಬಂದಿಲ್ಲ" },
    status: "healthy",
    confidence: 94,
    severity: { en: "None", kn: "ಇಲ್ಲ" },
    image: healthyImage,
  },
  {
    id: "SC-1031",
    date: "2026-07-18",
    plot: { en: "Plot D · Canal edge", kn: "ಪ್ಲಾಟ್ D · ಕಾಲುವೆ ಬದಿ" },
    disease: { en: "Koleroga (Advanced)", kn: "ಕೊಳೆರೋಗ (ತೀವ್ರ)" },
    status: "diseased",
    confidence: 97,
    severity: { en: "High", kn: "ಹೆಚ್ಚು" },
    image: diseasedImage,
  },
];

export const dailyTips: Tip[] = [
  {
    id: "tip-1",
    title: { en: "Spray before the rain", kn: "ಮಳೆಗೂ ಮೊದಲು ಸಿಂಪಡಿಸಿ" },
    body: {
      en: "Bordeaux mixture works best when leaves stay dry for 4 hours after spraying.",
      kn: "ಸಿಂಪಡಣೆಯ ನಂತರ 4 ಗಂಟೆ ಎಲೆ ಒಣಗಿದ್ದರೆ ಬೋರ್ಡೋ ಮಿಶ್ರಣ ಹೆಚ್ಚು ಪರಿಣಾಮಕಾರಿ.",
    },
  },
  {
    id: "tip-2",
    title: { en: "Clear the plantation floor", kn: "ತೋಟದ ನೆಲ ಸ್ವಚ್ಛವಾಗಿಡಿ" },
    body: {
      en: "Fallen infected nuts keep spores alive. Collect and burn them weekly.",
      kn: "ಬಿದ್ದ ರೋಗಗ್ರಸ್ತ ಕಾಯಿಗಳಲ್ಲಿ ಶಿಲೀಂಧ್ರ ಉಳಿಯುತ್ತದೆ. ವಾರಕ್ಕೊಮ್ಮೆ ಸಂಗ್ರಹಿಸಿ ಸುಟ್ಟುಹಾಕಿ.",
    },
  },
];

export const alerts: AlertItem[] = [
  {
    id: "al-1",
    title: { en: "Koleroga spread in Hosanagara", kn: "ಹೊಸನಗರದಲ್ಲಿ ಕೊಳೆರೋಗ ಹರಡುವಿಕೆ" },
    detail: {
      en: "14 plantations reported fruit rot this week within 8 km.",
      kn: "ಈ ವಾರ 8 ಕಿ.ಮೀ. ಒಳಗೆ 14 ತೋಟಗಳಲ್ಲಿ ಕಾಯಿ ಕೊಳೆ ವರದಿ.",
    },
    level: "high",
  },
  {
    id: "al-2",
    title: { en: "Heavy rain warning", kn: "ಭಾರೀ ಮಳೆ ಎಚ್ಚರಿಕೆ" },
    detail: {
      en: "120 mm rain expected over the next 48 hours.",
      kn: "ಮುಂದಿನ 48 ಗಂಟೆಗಳಲ್ಲಿ 120 ಮಿ.ಮೀ. ಮಳೆ ನಿರೀಕ್ಷೆ.",
    },
    level: "moderate",
  },
];

export const schemes: Scheme[] = [
  {
    id: "sch-1",
    name: { en: "Arecanut Crop Insurance", kn: "ಅಡಿಕೆ ಬೆಳೆ ವಿಮೆ" },
    benefit: {
      en: "Up to ₹75,000 per hectare cover for disease loss",
      kn: "ರೋಗ ನಷ್ಟಕ್ಕೆ ಹೆಕ್ಟೇರ್‌ಗೆ ₹75,000 ವರೆಗೆ ರಕ್ಷಣೆ",
    },
    department: { en: "Horticulture Dept., Karnataka", kn: "ತೋಟಗಾರಿಕೆ ಇಲಾಖೆ, ಕರ್ನಾಟಕ" },
  },
  {
    id: "sch-2",
    name: { en: "Sprayer Subsidy Scheme", kn: "ಸಿಂಪಡಣೆ ಯಂತ್ರ ಸಹಾಯಧನ" },
    benefit: {
      en: "50% subsidy on power sprayers for small farmers",
      kn: "ಸಣ್ಣ ರೈತರಿಗೆ ಪವರ್ ಸ್ಪ್ರೇಯರ್‌ಗೆ 50% ಸಹಾಯಧನ",
    },
    department: { en: "Raitha Samparka Kendra", kn: "ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರ" },
  },
  {
    id: "sch-3",
    name: { en: "Drip Irrigation Support", kn: "ಹನಿ ನೀರಾವರಿ ನೆರವು" },
    benefit: {
      en: "90% assistance for drip systems up to 2 hectares",
      kn: "2 ಹೆಕ್ಟೇರ್ ವರೆಗೆ ಹನಿ ನೀರಾವರಿಗೆ 90% ನೆರವು",
    },
    department: { en: "PMKSY, Govt. of India", kn: "PMKSY, ಭಾರತ ಸರ್ಕಾರ" },
  },
];

export const reportStats = {
  weeklyScans: 26,
  healthyPlants: 712,
  diseasedPlants: 108,
  successRate: 86,
};

export const healthDistribution = [
  { name: "Healthy", value: 712 },
  { name: "Diseased", value: 108 },
];

export { healthyImage, diseasedImage };