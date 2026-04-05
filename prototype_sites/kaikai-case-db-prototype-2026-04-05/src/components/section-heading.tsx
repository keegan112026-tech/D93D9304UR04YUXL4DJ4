type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="space-y-3">
      <div className="inline-flex rounded-full border border-border/70 bg-card/80 px-3 py-1 text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
        {eyebrow}
      </div>
      <div className="space-y-2">
        <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {title}
        </h2>
        <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}
