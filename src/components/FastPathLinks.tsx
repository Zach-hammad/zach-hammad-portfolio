import { fastPathLinks } from "@/data/proof";

interface FastPathLinksProps {
  className?: string;
  align?: "center" | "start";
}

export default function FastPathLinks({
  className = "",
  align = "center",
}: FastPathLinksProps) {
  const alignmentClass =
    align === "center" ? "justify-center" : "justify-start";

  return (
    <div
      className={`flex flex-wrap items-center gap-2 text-xs text-neutral-400 ${alignmentClass} ${className}`}
    >
      {fastPathLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.external ? "_blank" : undefined}
          rel={link.external ? "noopener noreferrer" : undefined}
          aria-label={link.ariaLabel}
          className="inline-flex min-h-11 items-center rounded-sm px-2 hover:text-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-200 focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
        >
          [{link.label}]
        </a>
      ))}
    </div>
  );
}
