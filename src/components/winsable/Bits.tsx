import type { ReactNode } from "react";

export function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className} fill="none">
      <path
        d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowRight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className} fill="none">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CtaLink({
  href,
  children,
  variant = "solid",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "accent";
  className?: string;
}) {
  const base =
    "group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300";
  const styles = {
    solid:
      "bg-gold text-background hover:bg-gold-dim hover:shadow-[0_0_30px_oklch(0.55_0.22_295/0.3)]",
    accent: "bg-gold/10 text-gold border border-gold/30 hover:bg-gold/20 hover:border-gold/50",
    outline:
      "border border-white/20 text-foreground hover:border-gold/50 hover:bg-gold/10 hover:text-gold",
  }[variant];

  return (
    <a href={href} className={`${base} ${styles} ${className}`}>
      <span className="swap-label">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
    </a>
  );
}

export function ServiceIcon({ name, className = "" }: { name: string; className?: string }) {
  const paths: Record<string, ReactNode> = {
    recovery: (
      <>
        <path d="M4 12a8 8 0 1 0 3-6.2" />
        <path d="M4 4v4h4" />
      </>
    ),
    disabled: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M6.5 6.5 17.5 17.5" />
      </>
    ),
    impersonation: (
      <>
        <circle cx="9" cy="9" r="3.2" />
        <path d="M3.5 19.5c.8-3.1 3-4.8 5.5-4.8s4.7 1.7 5.5 4.8" />
        <path d="M16 6.5h5M18.5 4v5" />
      </>
    ),
    copyright: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M14.5 9.6a3.4 3.4 0 1 0 0 4.8" />
      </>
    ),
    support: (
      <>
        <path d="M4 13a8 8 0 0 1 16 0" />
        <rect x="3" y="13" width="3.5" height="6" rx="1.6" />
        <rect x="17.5" y="13" width="3.5" height="6" rx="1.6" />
      </>
    ),
    hacked: (
      <>
        <path d="M12 2 3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5Z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}

export function PlatformMark({ name, className = "" }: { name: string; className?: string }) {
  const marks: Record<string, ReactNode> = {
    Instagram: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
      </>
    ),
    Facebook: (
      <>
        <path d="M14.5 8.5h2.2V5.4h-2.4c-2.2 0-3.6 1.4-3.6 3.7v1.6H8.4v3.1h2.3V21h3.2v-7.2h2.4l.4-3.1h-2.8V9.5c0-.7.3-1 1.2-1Z" />
      </>
    ),
    TikTok: (
      <>
        <path d="M13.6 3v9.6a3 3 0 1 1-2.4-2.9" />
        <path d="M13.6 4.6c.5 2 2 3.4 4.2 3.6" />
      </>
    ),
    YouTube: (
      <>
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
        <path d="M10.5 9.5v5l4.2-2.5-4.2-2.5Z" fill="currentColor" stroke="none" />
      </>
    ),
    X: (
      <>
        <path d="M4 4l7.2 8.4L4.5 20" />
        <path d="M20 4l-7 8.4L19.5 20" />
        <path d="M4 4h3.3M16.7 20H20" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {marks[name]}
    </svg>
  );
}

export function LogoMark({ className = "" }: { className?: string }) {
  return <img src="/logo-symbol.jpg" alt="WinsAble" className={className} width={40} height={40} />;
}

export function LogoFull({ className = "" }: { className?: string }) {
  return (
    <img
      src="/logo-full.jpg"
      alt="WinsAble — Protecting What You Built"
      className={className}
      width={160}
      height={40}
    />
  );
}
