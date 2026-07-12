"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavSection = {
  title: string;
  items: { href: string; label: string; icon: string }[];
};

export function AdminNav({ sections }: { sections: NavSection[] }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 overflow-y-auto py-3">
      {sections.map((section) => (
        <div key={section.title} className="mb-1">
          <p className="adm-nav-section">{section.title}</p>
          {section.items.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="adm-nav-item"
                data-active={isActive}
              >
                <span aria-hidden="true" className="w-5 text-center">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
