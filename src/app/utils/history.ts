export interface HistoryEntry {
  id: string;
  type: "divination" | "mbti" | "horoscope" | "answer" | "bazi" | "xiaoliuren";
  date: string;
  title: string;
  summary: string;
  detail?: string;
  icon: string;
}

const STORAGE_KEY = "xuanyu_history";
const MAX_ENTRIES = 50;

export function saveToHistory(entry: Omit<HistoryEntry, "id" | "date">) {
  try {
    const existing = getHistory();
    const now = new Date();
    const newEntry: HistoryEntry = {
      ...entry,
      id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      date: now.toLocaleDateString("zh-CN", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    const updated = [newEntry, ...existing].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newEntry;
  } catch {
    return null;
  }
}

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}

export function removeEntry(id: string) {
  const updated = getHistory().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

// Bazi profile storage
export interface BaziProfile {
  name: string;
  birthDate: string;
  birthHour: number;
}

export function saveBaziProfile(profile: BaziProfile) {
  localStorage.setItem("xuanyu_bazi_profile", JSON.stringify(profile));
}

export function getBaziProfile(): BaziProfile | null {
  try {
    const raw = localStorage.getItem("xuanyu_bazi_profile");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
