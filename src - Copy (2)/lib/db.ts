export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}

export interface FarmDetails {
  id: string;
  userId: string;
  farmName: string;
  village: string;
  district: string;
  state: string;
  plantationArea: string; // e.g. "4.5 acres"
  plantCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DiseaseScanRecord {
  id: string;
  userId: string;
  farmId?: string;
  image: string; // Base64 or Data URL
  disease: string; // e.g., "Koleroga (Fruit Rot)"
  diseaseCode: "koleroga" | "leaf_spot" | "healthy";
  confidence: number; // e.g., 94
  severity: "Low" | "Moderate" | "High" | "None";
  affectedAreaPercent: number; // e.g., 38
  symptoms: string[];
  recommendations: string[];
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO String
  plot: string; // e.g. "North Row - Plot A"
}

export interface UserNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: "info" | "warning" | "alert";
  createdAt: string;
}

const DB_NAME = "KolerogaAIDB";
const DB_VERSION = 1;

class KolerogaDatabase {
  private dbPromise: Promise<IDBDatabase | null>;

  constructor() {
    this.dbPromise = this.initDB();
  }

  private initDB(): Promise<IDBDatabase | null> {
    if (typeof window === "undefined" || !("indexedDB" in window)) {
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains("users")) {
          const userStore = db.createObjectStore("users", { keyPath: "id" });
          userStore.createIndex("email", "email", { unique: true });
        }

        if (!db.objectStoreNames.contains("farms")) {
          const farmStore = db.createObjectStore("farms", { keyPath: "id" });
          farmStore.createIndex("userId", "userId", { unique: false });
        }

        if (!db.objectStoreNames.contains("scans")) {
          const scanStore = db.createObjectStore("scans", { keyPath: "id" });
          scanStore.createIndex("userId", "userId", { unique: false });
          scanStore.createIndex("timestamp", "timestamp", { unique: false });
        }

        if (!db.objectStoreNames.contains("notifications")) {
          const notifStore = db.createObjectStore("notifications", { keyPath: "id" });
          notifStore.createIndex("userId", "userId", { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        console.warn("IndexedDB initialization failed, falling back to localStorage.");
        resolve(null);
      };
    });
  }

  // --- USER STORE ---
  async getUserByEmail(email: string): Promise<UserProfile | null> {
    const cleanEmail = email.trim().toLowerCase();
    const db = await this.dbPromise;
    if (db) {
      return new Promise((resolve) => {
        const tx = db.transaction("users", "readonly");
        const store = tx.objectStore("users");
        const index = store.index("email");
        const request = index.get(cleanEmail);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => resolve(null);
      });
    }

    // Fallback localStorage
    const users = this.getLocalStorage<UserProfile[]>("k_users", []);
    return users.find((u) => u.email.toLowerCase() === cleanEmail) || null;
  }

  async getUserById(id: string): Promise<UserProfile | null> {
    const db = await this.dbPromise;
    if (db) {
      return new Promise((resolve) => {
        const tx = db.transaction("users", "readonly");
        const store = tx.objectStore("users");
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => resolve(null);
      });
    }

    const users = this.getLocalStorage<UserProfile[]>("k_users", []);
    return users.find((u) => u.id === id) || null;
  }

  async saveUser(user: UserProfile): Promise<void> {
    const db = await this.dbPromise;
    if (db) {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction("users", "readwrite");
        const store = tx.objectStore("users");
        const request = store.put(user);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }

    const users = this.getLocalStorage<UserProfile[]>("k_users", []);
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) users[idx] = user;
    else users.push(user);
    this.setLocalStorage("k_users", users);
  }

  // --- FARM STORE ---
  async getFarmByUserId(userId: string): Promise<FarmDetails | null> {
    const db = await this.dbPromise;
    if (db) {
      return new Promise((resolve) => {
        const tx = db.transaction("farms", "readonly");
        const store = tx.objectStore("farms");
        const index = store.index("userId");
        const request = index.get(userId);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => resolve(null);
      });
    }

    const farms = this.getLocalStorage<FarmDetails[]>("k_farms", []);
    return farms.find((f) => f.userId === userId) || null;
  }

  async saveFarm(farm: FarmDetails): Promise<void> {
    const db = await this.dbPromise;
    if (db) {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction("farms", "readwrite");
        const store = tx.objectStore("farms");
        const request = store.put(farm);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }

    const farms = this.getLocalStorage<FarmDetails[]>("k_farms", []);
    const idx = farms.findIndex((f) => f.id === farm.id);
    if (idx >= 0) farms[idx] = farm;
    else farms.push(farm);
    this.setLocalStorage("k_farms", farms);
  }

  // --- SCANS STORE ---
  async getScansByUserId(userId: string): Promise<DiseaseScanRecord[]> {
    const db = await this.dbPromise;
    if (db) {
      return new Promise((resolve) => {
        const tx = db.transaction("scans", "readonly");
        const store = tx.objectStore("scans");
        const index = store.index("userId");
        const request = index.getAll(userId);
        request.onsuccess = () => {
          const list = (request.result || []) as DiseaseScanRecord[];
          list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          resolve(list);
        };
        request.onerror = () => resolve([]);
      });
    }

    const scans = this.getLocalStorage<DiseaseScanRecord[]>("k_scans", []);
    return scans
      .filter((s) => s.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async saveScan(scan: DiseaseScanRecord): Promise<void> {
    const db = await this.dbPromise;
    if (db) {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction("scans", "readwrite");
        const store = tx.objectStore("scans");
        const request = store.put(scan);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }

    const scans = this.getLocalStorage<DiseaseScanRecord[]>("k_scans", []);
    const idx = scans.findIndex((s) => s.id === scan.id);
    if (idx >= 0) scans[idx] = scan;
    else scans.push(scan);
    this.setLocalStorage("k_scans", scans);
  }

  async getScanById(scanId: string): Promise<DiseaseScanRecord | null> {
    const db = await this.dbPromise;
    if (db) {
      return new Promise((resolve) => {
        const tx = db.transaction("scans", "readonly");
        const store = tx.objectStore("scans");
        const request = store.get(scanId);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => resolve(null);
      });
    }

    const scans = this.getLocalStorage<DiseaseScanRecord[]>("k_scans", []);
    return scans.find((s) => s.id === scanId) || null;
  }

  // --- NOTIFICATIONS STORE ---
  async getNotificationsByUserId(userId: string): Promise<UserNotification[]> {
    const db = await this.dbPromise;
    if (db) {
      return new Promise((resolve) => {
        const tx = db.transaction("notifications", "readonly");
        const store = tx.objectStore("notifications");
        const index = store.index("userId");
        const request = index.getAll(userId);
        request.onsuccess = () => {
          const list = (request.result || []) as UserNotification[];
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          resolve(list);
        };
        request.onerror = () => resolve([]);
      });
    }

    const notifs = this.getLocalStorage<UserNotification[]>("k_notifs", []);
    return notifs
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async saveNotification(notification: UserNotification): Promise<void> {
    const db = await this.dbPromise;
    if (db) {
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction("notifications", "readwrite");
        const store = tx.objectStore("notifications");
        const request = store.put(notification);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    }

    const notifs = this.getLocalStorage<UserNotification[]>("k_notifs", []);
    const idx = notifs.findIndex((n) => n.id === notification.id);
    if (idx >= 0) notifs[idx] = notification;
    else notifs.push(notification);
    this.setLocalStorage("k_notifs", notifs);
  }

  async markNotificationRead(id: string): Promise<void> {
    const db = await this.dbPromise;
    if (db) {
      const tx = db.transaction("notifications", "readwrite");
      const store = tx.objectStore("notifications");
      const req = store.get(id);
      req.onsuccess = () => {
        if (req.result) {
          req.result.read = true;
          store.put(req.result);
        }
      };
    }

    const notifs = this.getLocalStorage<UserNotification[]>("k_notifs", []);
    const target = notifs.find((n) => n.id === id);
    if (target) {
      target.read = true;
      this.setLocalStorage("k_notifs", notifs);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    const db = await this.dbPromise;
    if (db) {
      const tx = db.transaction(["users", "farms", "scans", "notifications"], "readwrite");
      tx.objectStore("users").delete(userId);
      // delete farm, scans, notifications
      const farmStore = tx.objectStore("farms");
      const farmIdx = farmStore.index("userId");
      farmIdx.getAllKeys(userId).onsuccess = (e) => {
        const keys = (e.target as IDBRequest).result;
        keys.forEach((k) => farmStore.delete(k));
      };
    }

    let users = this.getLocalStorage<UserProfile[]>("k_users", []);
    users = users.filter((u) => u.id !== userId);
    this.setLocalStorage("k_users", users);

    let farms = this.getLocalStorage<FarmDetails[]>("k_farms", []);
    farms = farms.filter((f) => f.userId !== userId);
    this.setLocalStorage("k_farms", farms);

    let scans = this.getLocalStorage<DiseaseScanRecord[]>("k_scans", []);
    scans = scans.filter((s) => s.userId !== userId);
    this.setLocalStorage("k_scans", scans);
  }

  private getLocalStorage<T>(key: string, fallback: T): T {
    if (typeof window === "undefined") return fallback;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  }

  private setLocalStorage(key: string, value: unknown): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("localStorage set failed:", e);
    }
  }
}

export const db = new KolerogaDatabase();
