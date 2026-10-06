import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Language = "en" | "kn";

const en = {
  "app.name": "Koleroga AI",
  "app.tagline": "Protecting Every Arecanut Tree with AI",
  "app.loading": "Preparing your farm dashboard",

  "welcome.headline": "Smart Disease Detection for Every Farmer",
  "welcome.sub":
    "Scan your arecanut bunches, track plantation health and act before koleroga spreads.",
  "welcome.login": "Login",
  "welcome.register": "Register",
  "welcome.guest": "Continue as Guest",
  "welcome.trust": "Built with agriculture scientists for Malnad farmers",

  "nav.home": "Home",
  "nav.scan": "Scan",
  "nav.weather": "Weather",
  "nav.history": "History",
  "nav.profile": "Profile",
  "nav.dashboard": "Dashboard",
  "nav.scanner": "Disease Scanner",
  "nav.farm": "My Farm",
  "nav.farmHistory": "Farm History",
  "nav.reports": "Reports",
  "nav.settings": "Settings",

  "auth.loginTitle": "Sign In to Koleroga AI",
  "auth.loginSub": "Access your farm dashboard, disease history and risk alerts",
  "auth.registerTitle": "Register Farm Account",
  "auth.registerSub": "Create your account to start tracking arecanut plantation health",
  "auth.email": "Email Address",
  "auth.password": "Password",
  "auth.confirmPassword": "Confirm Password",
  "auth.fullName": "Full Name",
  "auth.phone": "Phone Number",
  "auth.farmName": "Farm / Plantation Name",
  "auth.village": "Village / Location",
  "auth.district": "District",
  "auth.state": "State",
  "auth.area": "Plantation Area (acres)",
  "auth.plants": "Number of Arecanut Plants",
  "auth.remember": "Remember me",
  "auth.forgotPass": "Forgot Password?",
  "auth.noAccount": "Don't have an account?",
  "auth.haveAccount": "Already registered?",
  "auth.signInBtn": "Sign In",
  "auth.createAccountBtn": "Create Account",
  "auth.forgotTitle": "Reset Password",
  "auth.forgotSub": "Enter your email to receive password reset instructions",
  "auth.resetBtn": "Send Reset Link",

  "common.viewAll": "View all",
  "common.search": "Search",
  "common.filter": "Filter",
  "common.all": "All",
  "common.healthy": "Healthy",
  "common.diseased": "Diseased",
  "common.today": "Today",
  "common.back": "Back",
  "common.placeholderData": "Sample data shown for preview",
  "common.save": "Save Changes",
  "common.cancel": "Cancel",

  "greeting.morning": "Good Morning",
  "greeting.afternoon": "Good Afternoon",
  "greeting.evening": "Good Evening",

  "dash.weatherSummary": "Today's Weather",
  "dash.temperature": "Temperature",
  "dash.humidity": "Humidity",
  "dash.rain": "Rain Chance",
  "dash.diseaseRisk": "Disease Risk",
  "dash.quickActions": "Quick Actions",
  "dash.scanDisease": "Scan Disease",
  "dash.myFarm": "My Farm",
  "dash.recentDetection": "Recent Detection",
  "dash.tips": "Today's Tips",
  "dash.alerts": "Latest Alerts",
  "dash.schemes": "Government Schemes",
  "dash.applyNow": "Apply",
  "dash.riskLow": "Low",
  "dash.riskModerate": "Moderate",
  "dash.riskHigh": "High",

  "scan.title": "Disease Scanner",
  "scan.sub": "Point your camera at an arecanut bunch and capture a clear photo.",
  "scan.openCamera": "Open Camera",
  "scan.upload": "Upload Image",
  "scan.preview": "Camera Preview",
  "scan.previewHint": "Camera feed appears here",
  "scan.instructions": "How to take a good photo",
  "scan.step1": "Stand 1–2 metres away from the bunch",
  "scan.step2": "Use daylight, avoid shadows and flash",
  "scan.step3": "Keep the whole bunch inside the frame",
  "scan.step4": "Capture 2–3 photos of affected areas",
  "scan.analyze": "Start Analysis",

  "analysis.title": "Analysing your photo",
  "analysis.step1": "Scanning image",
  "analysis.step2": "Analysing leaf and nut texture",
  "analysis.step3": "Checking symptoms",
  "analysis.step4": "Estimating severity",
  "analysis.hint": "Please keep the app open",

  "result.title": "Scan Result",
  "result.detected": "Koleroga Detected",
  "result.healthy": "Healthy Plant",
  "result.confidence": "Confidence",
  "result.severity": "Severity",
  "result.affected": "Affected Area",
  "result.treatment": "Treatment",
  "result.save": "Save Report",
  "result.share": "Share Report",
  "result.again": "Scan Again",
  "result.summary":
    "Fruit rot symptoms found on the lower bunch. Immediate spraying is recommended.",
  "result.treatmentTitle": "Recommended Treatment",
  "result.treatment1": "Spray 1% Bordeaux mixture before the next rain spell",
  "result.treatment2": "Remove and burn fallen infected nuts",
  "result.treatment3": "Repeat spraying after 40 days of monsoon",

  "weather.title": "Weather",
  "weather.sub": "Plantation forecast for Shivamogga & Malnad belt",
  "weather.wind": "Wind",
  "weather.rainProb": "Rain Probability",
  "weather.riskMeter": "Koleroga Risk Meter",
  "weather.timeline": "Hourly Timeline",
  "weather.week": "7 Day Rainfall",
  "weather.riskNote": "High humidity (>85%) with continuous rain increases fruit rot risk.",

  "history.title": "Farm History",
  "history.sub": "Every scan you saved, newest first",
  "history.empty": "No scans match your filters",

  "reports.title": "Reports",
  "reports.sub": "Plantation health overview",
  "reports.weeklyScans": "Weekly Scans",
  "reports.healthyPlants": "Healthy Plants",
  "reports.diseasedPlants": "Diseased Cases",
  "reports.successRate": "Treatment Success",
  "reports.scanTrend": "Scan Trend",
  "reports.distribution": "Health Distribution",

  "profile.title": "Profile",
  "profile.village": "Village",
  "profile.farmSize": "Farm Size",
  "profile.language": "Language",
  "profile.darkMode": "Dark Mode",
  "profile.notifications": "Notifications",
  "profile.about": "About",
  "profile.privacy": "Privacy Policy",
  "profile.logout": "Logout",
  "profile.edit": "Edit Profile",
  "profile.trees": "Trees",
  "profile.scans": "Scans",
  "profile.saved": "Saved Reports",

  "farm.title": "My Farm",
  "farm.sub": "Manage your arecanut plantation details and health status",
  "farm.editTitle": "Edit Farm Information",

  "settings.title": "Settings",
  "settings.appearance": "Appearance",
  "settings.alertsSection": "Alerts",
  "settings.diseaseAlerts": "Disease outbreak alerts",
  "settings.weatherAlerts": "Heavy rain alerts",
  "settings.schemeAlerts": "Government scheme updates",
  "settings.aboutApp": "About Koleroga AI",
  "settings.version": "Version 1.0.0 (Production)",
} as const;

export type TranslationKey = keyof typeof en;

const kn: Record<TranslationKey, string> = {
  "app.name": "ಕೊಳೆರೋಗ AI",
  "app.tagline": "ಪ್ರತಿ ಅಡಿಕೆ ಮರವನ್ನೂ AI ಮೂಲಕ ರಕ್ಷಿಸಿ",
  "app.loading": "ನಿಮ್ಮ ತೋಟದ ಮಾಹಿತಿ ಸಿದ್ಧವಾಗುತ್ತಿದೆ",

  "welcome.headline": "ಪ್ರತಿ ರೈತರಿಗೂ ಸ್ಮಾರ್ಟ್ ರೋಗ ಪತ್ತೆ",
  "welcome.sub":
    "ಅಡಿಕೆ ಗೊನೆಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಿ, ತೋಟದ ಆರೋಗ್ಯ ಗಮನಿಸಿ, ಕೊಳೆರೋಗ ಹರಡುವ ಮೊದಲೇ ಕ್ರಮ ಕೈಗೊಳ್ಳಿ.",
  "welcome.login": "ಲಾಗಿನ್",
  "welcome.register": "ನೋಂದಣಿ",
  "welcome.guest": "ಅತಿಥಿಯಾಗಿ ಮುಂದುವರಿಯಿರಿ",
  "welcome.trust": "ಮಲೆನಾಡಿನ ರೈತರಿಗಾಗಿ ಕೃಷಿ ವಿಜ್ಞಾನಿಗಳ ಜೊತೆ ರೂಪಿಸಲಾಗಿದೆ",

  "nav.home": "ಮುಖಪುಟ",
  "nav.scan": "ಸ್ಕ್ಯಾನ್",
  "nav.weather": "ಹವಾಮಾನ",
  "nav.history": "ಇತಿಹಾಸ",
  "nav.profile": "ಪ್ರೊಫೈಲ್",
  "nav.dashboard": "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
  "nav.scanner": "ರೋಗ ಸ್ಕ್ಯಾನರ್",
  "nav.farm": "ನನ್ನ ತೋಟ",
  "nav.farmHistory": "ತೋಟದ ಇತಿಹಾಸ",
  "nav.reports": "ವರದಿಗಳು",
  "nav.settings": "ಸೆಟ್ಟಿಂಗ್ಸ್",

  "auth.loginTitle": "ಕೊಳೆರೋಗ AI ಗೆ ಲಾಗಿನ್ ಆಗಿ",
  "auth.loginSub": "ನಿಮ್ಮ ತೋಟದ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್, ರೋಗ ಇತಿಹಾಸ ಮತ್ತು ಎಚ್ಚರಿಕೆಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
  "auth.registerTitle": "ತೋಟದ ಖಾತೆ ತೆರೆಯಿರಿ",
  "auth.registerSub": "ಅಡಿಕೆ ತೋಟದ ಆರೋಗ್ಯ ಮೇಲ್ವಿಚಾರಣೆಗಾಗಿ ನೋಂದಾಯಿಸಿ",
  "auth.email": "ಇಮೇಲ್ ವಿಳಾಸ",
  "auth.password": "ಪಾಸ್‌ವರ್ಡ್",
  "auth.confirmPassword": "ಪಾಸ್‌ವರ್ಡ್ ಖಚಿತಪಡಿಸಿ",
  "auth.fullName": "ಪೂರ್ಣ ಹೆಸರು",
  "auth.phone": "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
  "auth.farmName": "ತೋಟದ ಹೆಸರು",
  "auth.village": "ಗ್ರಾಮ / ಸ್ಥಳ",
  "auth.district": "ಜಿಲ್ಲೆ",
  "auth.state": "ರಾಜ್ಯ",
  "auth.area": "ತೋಟದ ವಿಸ್ತೀರ್ಣ (ಎಕರೆ)",
  "auth.plants": "ಅಡಿಕೆ ಮರಗಳ ಸಂಖ್ಯೆ",
  "auth.remember": "ನನ್ನನ್ನು ನೆನಪಿಡಿ",
  "auth.forgotPass": "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?",
  "auth.noAccount": "ಖಾತೆ ಇಲ್ಲವೇ?",
  "auth.haveAccount": "ಈಗಾಗಲೇ ನೋಂದಾಯಿಸಿದ್ದೀರಾ?",
  "auth.signInBtn": "ಲಾಗಿನ್ ಆಗಿ",
  "auth.createAccountBtn": "ಖಾತೆ ತೆರೆಯಿರಿ",
  "auth.forgotTitle": "ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸಿ",
  "auth.forgotSub": "ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸುವ ಸೂಚನೆಗಳಿಗಾಗಿ ಇಮೇಲ್ ನಮೂದಿಸಿ",
  "auth.resetBtn": "ಲಿಂಕ್ ಕಳುಹಿಸಿ",

  "common.viewAll": "ಎಲ್ಲವನ್ನೂ ನೋಡಿ",
  "common.search": "ಹುಡುಕಿ",
  "common.filter": "ಫಿಲ್ಟರ್",
  "common.all": "ಎಲ್ಲಾ",
  "common.healthy": "ಆರೋಗ್ಯಕರ",
  "common.diseased": "ರೋಗಗ್ರಸ್ತ",
  "common.today": "ಇಂದು",
  "common.back": "ಹಿಂದೆ",
  "common.placeholderData": "ಪೂರ್ವವೀಕ್ಷಣೆಗಾಗಿ ಮಾದರಿ ಮಾಹಿತಿ",
  "common.save": "ಉಳಿಸಿ",
  "common.cancel": "ರದ್ದುಮಾಡಿ",

  "greeting.morning": "ಶುಭೋದಯ",
  "greeting.afternoon": "ಶುಭ ಮಧ್ಯಾಹ್ನ",
  "greeting.evening": "ಶುಭ ಸಂಜೆ",

  "dash.weatherSummary": "ಇಂದಿನ ಹವಾಮಾನ",
  "dash.temperature": "ತಾಪಮಾನ",
  "dash.humidity": "ಆರ್ದ್ರತೆ",
  "dash.rain": "ಮಳೆ ಸಾಧ್ಯತೆ",
  "dash.diseaseRisk": "ರೋಗ ಅಪಾಯ",
  "dash.quickActions": "ತ್ವರಿತ ಕ್ರಮಗಳು",
  "dash.scanDisease": "ರೋಗ ಸ್ಕ್ಯಾನ್",
  "dash.myFarm": "ನನ್ನ ತೋಟ",
  "dash.recentDetection": "ಇತ್ತೀಚಿನ ಪತ್ತೆ",
  "dash.tips": "ಇಂದಿನ ಸಲಹೆಗಳು",
  "dash.alerts": "ಇತ್ತೀಚಿನ ಎಚ್ಚರಿಕೆಗಳು",
  "dash.schemes": "ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
  "dash.applyNow": "ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
  "dash.riskLow": "ಕಡಿಮೆ",
  "dash.riskModerate": "ಮಧ್ಯಮ",
  "dash.riskHigh": "ಹೆಚ್ಚು",

  "scan.title": "ರೋಗ ಸ್ಕ್ಯಾನರ್",
  "scan.sub": "ಅಡಿಕೆ ಗೊನೆಯ ಸ್ಪಷ್ಟ ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ.",
  "scan.openCamera": "ಕ್ಯಾಮೆರಾ ತೆರೆಯಿರಿ",
  "scan.upload": "ಚಿತ್ರ ಅಪ್‌ಲೋಡ್",
  "scan.preview": "ಕ್ಯಾಮೆರಾ ಪೂರ್ವವೀಕ್ಷಣೆ",
  "scan.previewHint": "ಇಲ್ಲಿ ಕ್ಯಾಮೆರಾ ದೃಶ್ಯ ಕಾಣಿಸುತ್ತದೆ",
  "scan.instructions": "ಉತ್ತಮ ಫೋಟೋ ತೆಗೆಯುವ ವಿಧಾನ",
  "scan.step1": "ಗೊನೆಯಿಂದ 1–2 ಮೀಟರ್ ದೂರ ನಿಲ್ಲಿ",
  "scan.step2": "ಹಗಲು ಬೆಳಕು ಬಳಸಿ, ನೆರಳು ತಪ್ಪಿಸಿ",
  "scan.step3": "ಪೂರ್ಣ ಗೊನೆ ಚೌಕಟ್ಟಿನಲ್ಲಿ ಇರಲಿ",
  "scan.step4": "ರೋಗಗ್ರಸ್ತ ಭಾಗದ 2–3 ಫೋಟೋ ತೆಗೆಯಿರಿ",
  "scan.analyze": "ವಿಶ್ಲೇಷಣೆ ಪ್ರಾರಂಭಿಸಿ",

  "analysis.title": "ನಿಮ್ಮ ಫೋಟೋ ವಿಶ್ಲೇಷಣೆಯಾಗುತ್ತಿದೆ",
  "analysis.step1": "ಚಿತ್ರ ಸ್ಕ್ಯಾನ್ ಆಗುತ್ತಿದೆ",
  "analysis.step2": "ಎಲೆ ಮತ್ತು ಕಾಯಿ ವಿಶ್ಲೇಷಣೆ",
  "analysis.step3": "ಲಕ್ಷಣಗಳ ಪರಿಶೀಲನೆ",
  "analysis.step4": "ತೀವ್ರತೆ ಅಂದಾಜು",
  "analysis.hint": "ಆ್ಯಪ್ ತೆರೆದಿರಲಿ",

  "result.title": "ಸ್ಕ್ಯಾನ್ ಫಲಿತಾಂಶ",
  "result.detected": "ಕೊಳೆರೋಗ ಪತ್ತೆಯಾಗಿದೆ",
  "result.healthy": "ಆರೋಗ್ಯಕರ ಮರ",
  "result.confidence": "ವಿಶ್ವಾಸ ಮಟ್ಟ",
  "result.severity": "ತೀವ್ರತೆ",
  "result.affected": "ಬಾಧಿತ ಪ್ರದೇಶ",
  "result.treatment": "ಚಿಕಿತ್ಸೆ",
  "result.save": "ವರದಿ ಉಳಿಸಿ",
  "result.share": "ವರದಿ ಹಂಚಿ",
  "result.again": "ಮತ್ತೆ ಸ್ಕ್ಯಾನ್",
  "result.summary": "ಕೆಳಗಿನ ಗೊನೆಯಲ್ಲಿ ಕೊಳೆರೋಗ ಲಕ್ಷಣ ಕಂಡಿದೆ. ಕೂಡಲೇ ಸಿಂಪಡಣೆ ಮಾಡಿ.",
  "result.treatmentTitle": "ಶಿಫಾರಸು ಮಾಡಿದ ಚಿಕಿತ್ಸೆ",
  "result.treatment1": "ಮಳೆಗೂ ಮೊದಲು 1% ಬೋರ್ಡೋ ಮಿಶ್ರಣ ಸಿಂಪಡಿಸಿ",
  "result.treatment2": "ಬಿದ್ದ ರೋಗಗ್ರಸ್ತ ಕಾಯಿಗಳನ್ನು ಸುಟ್ಟುಹಾಕಿ",
  "result.treatment3": "40 ದಿನಗಳ ನಂತರ ಮತ್ತೆ ಸಿಂಪಡಿಸಿ",

  "weather.title": "ಹವಾಮಾನ",
  "weather.sub": "ಶಿವಮೊಗ್ಗ ಮತ್ತು ಮಲೆನಾಡು ತೋಟದ ಮುನ್ಸೂಚನೆ",
  "weather.wind": "ಗಾಳಿ",
  "weather.rainProb": "ಮಳೆ ಸಾಧ್ಯತೆ",
  "weather.riskMeter": "ಕೊಳೆರೋಗ ಅಪಾಯ ಮಾಪಕ",
  "weather.timeline": "ಗಂಟೆವಾರು ಮಾಹಿತಿ",
  "weather.week": "7 ದಿನಗಳ ಮಳೆ",
  "weather.riskNote": "ಹೆಚ್ಚು ಆರ್ದ್ರತೆ ಮತ್ತು ನಿರಂತರ ಮಳೆ ಕೊಳೆರೋಗ ಅಪಾಯ ಹೆಚ್ಚಿಸುತ್ತದೆ.",

  "history.title": "ತೋಟದ ಇತಿಹಾಸ",
  "history.sub": "ನೀವು ಉಳಿಸಿದ ಎಲ್ಲಾ ಸ್ಕ್ಯಾನ್‌ಗಳು",
  "history.empty": "ಫಿಲ್ಟರ್‌ಗೆ ಹೊಂದುವ ಸ್ಕ್ಯಾನ್ ಇಲ್ಲ",

  "reports.title": "ವರದಿಗಳು",
  "reports.sub": "ತೋಟದ ಆರೋಗ್ಯದ ಅವಲೋಕನ",
  "reports.weeklyScans": "ವಾರದ ಸ್ಕ್ಯಾನ್",
  "reports.healthyPlants": "ಆರೋಗ್ಯಕರ ಮರಗಳು",
  "reports.diseasedPlants": "ರೋಗಗ್ರಸ್ತ ಪ್ರಕರಣಗಳು",
  "reports.successRate": "ಚಿಕಿತ್ಸೆ ಯಶಸ್ಸು",
  "reports.scanTrend": "ಸ್ಕ್ಯಾನ್ ಪ್ರವೃತ್ತಿ",
  "reports.distribution": "ಆರೋಗ್ಯ ವಿತರಣೆ",

  "profile.title": "ಪ್ರೊಫೈಲ್",
  "profile.village": "ಗ್ರಾಮ",
  "profile.farmSize": "ತೋಟದ ವಿಸ್ತೀರ್ಣ",
  "profile.language": "ಭಾಷೆ",
  "profile.darkMode": "ಡಾರ್ಕ್ ಮೋಡ್",
  "profile.notifications": "ಅಧಿಸೂಚನೆಗಳು",
  "profile.about": "ನಮ್ಮ ಬಗ್ಗೆ",
  "profile.privacy": "ಗೋಪ್ಯತಾ ನೀತಿ",
  "profile.logout": "ಲಾಗ್ ಔಟ್",
  "profile.edit": "ಪ್ರೊಫೈಲ್ ಬದಲಿಸಿ",
  "profile.trees": "ಮರಗಳು",
  "profile.scans": "ಸ್ಕ್ಯಾನ್‌ಗಳು",
  "profile.saved": "ಉಳಿಸಿದ ವರದಿಗಳು",

  "farm.title": "ನನ್ನ ತೋಟ",
  "farm.sub": "ನಿಮ್ಮ ಅಡಿಕೆ ತೋಟದ ಮಾಹಿತಿ ಮತ್ತು ಆರೋಗ್ಯ ನಿರ್ವಹಿಸಿ",
  "farm.editTitle": "ತೋಟದ ಮಾಹಿತಿ ಬದಲಿಸಿ",

  "settings.title": "ಸೆಟ್ಟಿಂಗ್ಸ್",
  "settings.appearance": "ರೂಪ",
  "settings.alertsSection": "ಎಚ್ಚರಿಕೆಗಳು",
  "settings.diseaseAlerts": "ರೋಗ ಹರಡುವಿಕೆ ಎಚ್ಚರಿಕೆ",
  "settings.weatherAlerts": "ಭಾರೀ ಮಳೆ ಎಚ್ಚರಿಕೆ",
  "settings.schemeAlerts": "ಸರ್ಕಾರಿ ಯೋಜನೆ ಮಾಹಿತಿ",
  "settings.aboutApp": "ಕೊಳೆರೋಗ AI ಬಗ್ಗೆ",
  "settings.version": "ಆವೃತ್ತಿ 1.0.0 (ಉತ್ಪಾದನೆ)",
};

const dictionaries: Record<Language, Record<TranslationKey, string>> = { en, kn };

export interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = "koleroga.language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "kn") setLanguage(stored);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language === "kn" ? "kn" : "en";
  }, [language]);

  const t = useCallback(
    (key: TranslationKey) => dictionaries[language][key] ?? dictionaries.en[key],
    [language],
  );

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () => setLanguage((prev) => (prev === "en" ? "kn" : "en")),
      t,
    }),
    [language, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}

export function useT() {
  return useLanguage().t;
}

export function localized<T>(language: Language, value: { en: T; kn: T }): T {
  return language === "kn" ? value.kn : value.en;
}