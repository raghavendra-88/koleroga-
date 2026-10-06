import React, { createContext, useContext, useEffect, useState } from "react";
import { db, type UserProfile, type FarmDetails, type DiseaseScanRecord, type UserNotification } from "./db";

export interface AuthState {
  user: UserProfile | null;
  farm: FarmDetails | null;
  scans: DiseaseScanRecord[];
  notifications: UserNotification[];
  isGuest: boolean;
  isLoading: boolean;
}

export interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  farmName?: string;
  village?: string;
  district?: string;
  state?: string;
  plantationArea?: string;
  plantCount?: number;
}

export interface AuthContextType extends AuthState {
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  continueAsGuest: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateFarm: (updates: Partial<FarmDetails>) => Promise<void>;
  addScanRecord: (scan: DiseaseScanRecord) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  changePassword: (oldPass: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  refreshData: () => Promise<void>;
}

const SESSION_STORAGE_KEY = "k_session_user_id";
const GUEST_STORAGE_KEY = "k_is_guest";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function getUserInitials(name?: string | null): string {
  if (!name || !name.trim()) return "G";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0] ? parts[0].substring(0, 2).toUpperCase() : "G";
  const first = parts[0] ? parts[0][0] : "";
  const last = parts[parts.length - 1] ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

export async function hashPassword(password: string): Promise<string> {
  if (typeof window === "undefined" || !window.crypto || !window.crypto.subtle) {
    return `hashed_${password}`;
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "koleroga_salt_2026");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [farm, setFarm] = useState<FarmDetails | null>(null);
  const [scans, setScans] = useState<DiseaseScanRecord[]>([]);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore session on mount
  useEffect(() => {
    async function initSession() {
      if (typeof window === "undefined") {
        setIsLoading(false);
        return;
      }

      try {
        const guestFlag = localStorage.getItem(GUEST_STORAGE_KEY);
        if (guestFlag === "true") {
          setIsGuest(true);
          setIsLoading(false);
          return;
        }

        const savedUserId = localStorage.getItem(SESSION_STORAGE_KEY);
        if (savedUserId) {
          const profile = await db.getUserById(savedUserId);
          if (profile) {
            setUser(profile);
            const farmData = await db.getFarmByUserId(profile.id);
            setFarm(farmData);
            const userScans = await db.getScansByUserId(profile.id);
            setScans(userScans);
            const userNotifs = await db.getNotificationsByUserId(profile.id);
            setNotifications(userNotifs);
          } else {
            localStorage.removeItem(SESSION_STORAGE_KEY);
          }
        }
      } catch (err) {
        console.error("Session restore error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    initSession();
  }, []);

  const refreshData = async () => {
    if (!user) return;
    const farmData = await db.getFarmByUserId(user.id);
    setFarm(farmData);
    const userScans = await db.getScansByUserId(user.id);
    setScans(userScans);
    const userNotifs = await db.getNotificationsByUserId(user.id);
    setNotifications(userNotifs);
  };

  const register = async (data: RegisterData) => {
    try {
      const existing = await db.getUserByEmail(data.email);
      if (existing) {
        return { success: false, error: "An account with this email address already exists." };
      }

      const passHash = await hashPassword(data.password);
      const userId = `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const now = new Date().toISOString();

      const newUser: UserProfile = {
        id: userId,
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        passwordHash: passHash,
        createdAt: now,
        updatedAt: now,
        lastLogin: now,
      };

      await db.saveUser(newUser);

      // Create farm profile
      const newFarm: FarmDetails = {
        id: `farm_${Date.now()}`,
        userId,
        farmName: data.farmName?.trim() || `${newUser.fullName}'s Plantation`,
        village: data.village?.trim() || "Shivamogga",
        district: data.district?.trim() || "Shivamogga",
        state: data.state?.trim() || "Karnataka",
        plantationArea: data.plantationArea?.trim() || "3.5 acres",
        plantCount: data.plantCount || 650,
        createdAt: now,
        updatedAt: now,
      };
      await db.saveFarm(newFarm);

      // Welcome notification
      const welcomeNotif: UserNotification = {
        id: `notif_${Date.now()}`,
        userId,
        title: "Welcome to Koleroga AI!",
        message: `Hello ${newUser.fullName}, your arecanut plantation account is now active. Scan your first bunch to start monitoring fruit rot risks.`,
        read: false,
        type: "info",
        createdAt: now,
      };
      await db.saveNotification(welcomeNotif);

      // Set active session
      localStorage.setItem(SESSION_STORAGE_KEY, userId);
      localStorage.removeItem(GUEST_STORAGE_KEY);
      setIsGuest(false);
      setUser(newUser);
      setFarm(newFarm);
      setScans([]);
      setNotifications([welcomeNotif]);

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration failed. Please try again.";
      return { success: false, error: msg };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const profile = await db.getUserByEmail(email);
      if (!profile) {
        return { success: false, error: "No account found with this email address." };
      }

      const inputHash = await hashPassword(password);
      if (profile.passwordHash !== inputHash) {
        return { success: false, error: "Invalid email or password." };
      }

      // Update last login timestamp
      profile.lastLogin = new Date().toISOString();
      await db.saveUser(profile);

      localStorage.setItem(SESSION_STORAGE_KEY, profile.id);
      localStorage.removeItem(GUEST_STORAGE_KEY);
      setIsGuest(false);
      setUser(profile);

      const farmData = await db.getFarmByUserId(profile.id);
      setFarm(farmData);

      const userScans = await db.getScansByUserId(profile.id);
      setScans(userScans);

      const userNotifs = await db.getNotificationsByUserId(profile.id);
      setNotifications(userNotifs);

      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed. Please check credentials.";
      return { success: false, error: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(GUEST_STORAGE_KEY);
    setUser(null);
    setFarm(null);
    setScans([]);
    setNotifications([]);
    setIsGuest(false);
  };

  const continueAsGuest = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.setItem(GUEST_STORAGE_KEY, "true");
    setUser(null);
    setFarm(null);
    setScans([]);
    setNotifications([]);
    setIsGuest(true);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated: UserProfile = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await db.saveUser(updated);
    setUser(updated);
  };

  const updateFarm = async (updates: Partial<FarmDetails>) => {
    if (!user) return;
    const currentFarm = farm || {
      id: `farm_${Date.now()}`,
      userId: user.id,
      farmName: `${user.fullName}'s Farm`,
      village: "Shivamogga",
      district: "Shivamogga",
      state: "Karnataka",
      plantationArea: "3.0 acres",
      plantCount: 500,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedFarm: FarmDetails = {
      ...currentFarm,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await db.saveFarm(updatedFarm);
    setFarm(updatedFarm);
  };

  const addScanRecord = async (scan: DiseaseScanRecord) => {
    if (!user) return;
    await db.saveScan(scan);
    setScans((prev) => [scan, ...prev.filter((s) => s.id !== scan.id)]);

    // Trigger high risk warning notification if Koleroga high severity
    if (scan.diseaseCode === "koleroga" && (scan.severity === "High" || scan.severity === "Moderate")) {
      const notif: UserNotification = {
        id: `notif_${Date.now()}`,
        userId: user.id,
        title: "Fruit Rot Risk Warning",
        message: `High risk scan result (${scan.confidence}% confidence) saved for ${scan.plot}. Apply Bordeaux spray immediately.`,
        read: false,
        type: "warning",
        createdAt: new Date().toISOString(),
      };
      await db.saveNotification(notif);
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const markNotificationRead = async (id: string) => {
    await db.markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteAccount = async () => {
    if (!user) return;
    await db.deleteUser(user.id);
    logout();
  };

  const changePassword = async (oldPass: string, newPass: string) => {
    if (!user) return { success: false, error: "No user logged in." };
    const oldHash = await hashPassword(oldPass);
    if (oldHash !== user.passwordHash) {
      return { success: false, error: "Current password is incorrect." };
    }

    const newHash = await hashPassword(newPass);
    user.passwordHash = newHash;
    user.updatedAt = new Date().toISOString();
    await db.saveUser(user);
    setUser({ ...user });
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        farm,
        scans,
        notifications,
        isGuest,
        isLoading,
        register,
        login,
        logout,
        continueAsGuest,
        updateProfile,
        updateFarm,
        addScanRecord,
        markNotificationRead,
        deleteAccount,
        changePassword,
        refreshData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
