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
        "relative flex items-center rounded-full bg-foreground/5 p-1 text-[11px] font-black border border-foreground/10 h-8 w-[138px] gap-0.5",
        isPending && "opacity-70 pointer-events-none"
      )}
    >
      {/* Sliding Active Indicator */}
      <div
        className={cn(
          "absolute top-1 bottom-1 w-[42px] rounded-full bg-primary transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          currentLang === "id" && "left-1",
          currentLang === "en" && "left-[48px]",
          currentLang === "zh" && "left-[92px]"
        )}
      />

      <button
        onClick={() => toggleLanguage("id")}
        className={cn(
          "relative z-10 w-[42px] h-full flex items-center justify-center rounded-full transition-colors duration-300 select-none cursor-pointer text-center",
          currentLang === "id" ? "text-secondary" : "text-muted-foreground hover:text-foreground"
        )}
        aria-label="Bahasa Indonesia"
      >
        ID
      </button>
      
      <button
        onClick={() => toggleLanguage("en")}
        className={cn(
          "relative z-10 w-[42px] h-full flex items-center justify-center rounded-full transition-colors duration-300 select-none cursor-pointer text-center",
          currentLang === "en" ? "text-secondary" : "text-muted-foreground hover:text-foreground"
        )}
        aria-label="English language"
      >
        EN
      </button>

      <button
        onClick={() => toggleLanguage("zh")}
        className={cn(
          "relative z-10 w-[42px] h-full flex items-center justify-center rounded-full transition-colors duration-300 select-none cursor-pointer text-center",
          currentLang === "zh" ? "text-secondary" : "text-muted-foreground hover:text-foreground"
        )}
        aria-label="Chinese language"
      >
        中文
      </button>
    </div>
  );
}
