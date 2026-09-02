import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  centered = true,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  centered?: boolean;
}) {
  return (
    <div
      className={
        centered
          ? "mx-auto max-w-2xl text-center"
          : "flex flex-wrap items-end justify-between gap-4"
      }
    >
      <div>
        {eyebrow && (
          <div className={`flex items-center gap-2 ${centered ? "justify-center" : ""}`}>
            <span className="h-px w-6 bg-[#c59b4e]/60" />
            <p className="eyebrow">{eyebrow}</p>
            <span className="h-px w-6 bg-[#c59b4e]/60" />
          </div>
        )}
        <h2 className={`mt-3 font-display text-3xl text-foreground sm:text-4xl lg:text-5xl font-light tracking-tight ${centered ? "hairline-center" : "hairline"}`}>
          {title}
        </h2>
        {description && (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base font-light">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

