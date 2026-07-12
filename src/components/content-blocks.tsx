import type { PublicContentBlock } from "@/lib/services/public-data-service";

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
export function ContentBlocks({ blocks }: { blocks: PublicContentBlock[] }) {
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

  return (
    <div className="space-y-6">
      {groups.map((group, index) => {
        if (Array.isArray(group)) {
          return (
            <div
              key={`stats-${index}`}
              className="grid grid-cols-2 gap-4 sm:grid-cols-4"
            >
              {group.map((stat) => {
                const p = payload(stat);
                return (
                  <div
                    key={stat.id}
                    className="rounded-2xl border border-foreground/10 bg-card p-5 text-center"
                  >
                    <p className="font-heading text-3xl font-bold text-foreground">
                      {p.value}
                    </p>
                    <p className="mt-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      {p.label}
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
              <h2 key={group.id} className="font-heading text-2xl font-bold sm:text-3xl">
                {p.text}
              </h2>
            );
          case "richtext":
            return (
              <p key={group.id} className="max-w-2xl text-base leading-relaxed text-muted-foreground">
                {p.text}
              </p>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
