import type { PublicContentBlock } from "@/lib/services/public-data-service";
import { tc, type Language } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type BlockPayload = {
  text?: string;
  label?: string;
  value?: string;
  url?: string;
};

function payload(block: PublicContentBlock): BlockPayload {
  return (block.content ?? {}) as BlockPayload;
}

/**
 * Renders owner-editable CMS blocks. Consecutive `stat` blocks are grouped
 * into one grid so the owner can add stats without touching layout.
 */
export function ContentBlocks({
  blocks,
  lang = "id",
  theme = "light",
}: {
  blocks: PublicContentBlock[];
  lang?: Language;
  theme?: "dark" | "light";
}) {
  const groups: (PublicContentBlock | PublicContentBlock[])[] = [];
  for (const block of blocks) {
    const last = groups[groups.length - 1];
    if (block.block_type === "stat") {
      if (Array.isArray(last)) last.push(block);
      else groups.push([block]);
    } else {
      groups.push(block);
    }
  }

  const isDark = theme === "dark";

  return (
    <div className={cn("space-y-8", isDark && "flex flex-col items-center text-center")}>
      {groups.map((group, index) => {
        if (Array.isArray(group)) {
          return (
            <div
              key={`stats-${index}`}
              className="flex flex-wrap gap-6 justify-center w-full mt-4"
            >
              {group.map((stat) => {
                const p = payload(stat);
                return (
                  <div
                    key={stat.id}
                    className={cn(
                      "rounded-[18px] p-6 text-center transition-all duration-300 w-[calc(50%-12px)] sm:w-[220px]",
                      isDark
                        ? "border-2 border-[#fdfbf7] bg-[#243426] shadow-[4px_4px_0px_#fdfbf7] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#fdfbf7]"
                        : "border-2 border-secondary bg-[#fdfbf7] shadow-[4px_4px_0px_#1d2b1f] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#1d2b1f]"
                    )}
                  >
                    <p
                      className={cn(
                        "font-heading font-black",
                        isDark ? "text-4xl text-[#fdfbf7]" : "text-3xl text-secondary"
                      )}
                    >
                      {p.value}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-xs font-black tracking-widest uppercase",
                        isDark ? "text-[#f7f0e6]/80" : "text-secondary/80"
                      )}
                    >
                      {tc(p.label, lang)}
                    </p>
                  </div>
                );
              })}
            </div>
          );
        }

        const p = payload(group);
        switch (group.block_type) {
          case "heading":
            return (
              <h2
                key={group.id}
                className={cn(
                  "font-heading font-black tracking-tight leading-tight mt-6",
                  isDark
                    ? "text-center text-4xl sm:text-5xl text-[#fdfbf7]"
                    : "text-3xl sm:text-4xl text-secondary"
                )}
              >
                {tc(p.text, lang)}
              </h2>
            );
          case "richtext":
            return (
              <p
                key={group.id}
                className={cn(
                  "leading-relaxed font-sans font-medium mt-2",
                  isDark
                    ? "text-center mx-auto max-w-3xl text-base md:text-lg text-[#f7f0e6]/80"
                    : "max-w-2xl text-base text-secondary/70"
                )}
              >
                {tc(p.text, lang)}
              </p>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
