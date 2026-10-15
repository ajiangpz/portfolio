"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Locale = "en" | "zh";
const LocaleContext = createContext<{ locale: Locale; toggleLocale: () => void } | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const previousLanguage = document.documentElement.lang;
    try {
      if (sessionStorage.getItem("digital-orbit-locale") === "zh") setLocale("zh");
    } catch { /* Storage restrictions must not prevent browsing or changing language. */ }
    return () => { document.documentElement.lang = previousLanguage; };
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    try { sessionStorage.setItem("digital-orbit-locale", locale); } catch { /* In-memory state still works. */ }
  }, [locale]);

  // The root layout owns this state so Link navigation cannot reset the chosen language.
  return <LocaleContext.Provider value={{ locale, toggleLocale: () => setLocale((value) => value === "en" ? "zh" : "en") }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale requires LocaleProvider");
  return context;
}
