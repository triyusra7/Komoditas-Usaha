"use client";

import { useTransition } from "react";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/i18n";

type LanguageSwitcherProps = {
  currentLang: Language;
};

export function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const [isPending, startTransition] = useTransition();

  const toggleLanguage = (lang: Language) => {
    if (lang === currentLang || isPending) return;

    startTransition(() => {
      // Set cookie client-side
      document.cookie = `lang=${lang}; path=/; max-age=31536000; SameSite=Lax`;
      
      // Reload to force Next.js Server Components to render with the new cookie
      window.location.reload();
    });
  };

  return (
    <div 
      className={cn(
        "relative flex items-center rounded-full bg-foreground/5 p-1 text-xs font-bold border border-foreground/10",
        isPending && "opacity-70 pointer-events-none"
      )}
    >
      {/* Sliding Active Indicator */}
      <div
        className={cn(
          "absolute top-1 bottom-1 w-[38px] rounded-full bg-primary transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          currentLang === "en" ? "left-[calc(100%-42px)]" : "left-1"
        )}
      />

      <button
        onClick={() => toggleLanguage("id")}
        className={cn(
          "relative z-10 px-3 py-1 rounded-full transition-colors duration-300 select-none cursor-pointer",
          currentLang === "id" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
        aria-label="Bahasa Indonesia"
      >
        ID
      </button>
      
      <button
        onClick={() => toggleLanguage("en")}
        className={cn(
          "relative z-10 px-3 py-1 rounded-full transition-colors duration-300 select-none cursor-pointer",
          currentLang === "en" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
        )}
        aria-label="English language"
      >
        EN
      </button>
    </div>
  );
}
