"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";

const LINKS = [
  { href: "/", label: "Overview" },
  { href: "/youtube", label: "YouTube" },
  { href: "/reddit", label: "Reddit" },
  { href: "/instagram", label: "Instagram" },
  { href: "/trends", label: "Trends" },
  { href: "/recommendations", label: "Recommendations" },
  { href: "/settings", label: "Settings" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/85 backdrop-blur">
      {/* Single line at every width: the link strip scrolls horizontally when
          it runs out of room rather than wrapping into a multi-row block. */}
      <div className="shell flex items-center gap-3 py-3 sm:gap-5">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ground"
        >
          <span
            className="h-7 w-7 shrink-0 rounded-sm"
            style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-2))" }}
            aria-hidden="true"
          />
          <span className="hidden font-display text-fluid-lg font-bold text-ink min-[420px]:inline">
            Atlas
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="scrollbar-none flex min-w-0 flex-1 items-center gap-1 overflow-x-auto"
        >
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "shrink-0 whitespace-nowrap rounded-sm px-3 py-1.5 text-fluid-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent",
                  active
                    ? "bg-accent-soft text-accent"
                    : "text-ink-soft hover:bg-surface-raised hover:text-ink"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
