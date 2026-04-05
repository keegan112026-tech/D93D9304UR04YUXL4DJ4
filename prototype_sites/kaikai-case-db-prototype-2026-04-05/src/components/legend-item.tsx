type LegendItemProps = {
  label: string;
  tone: string;
};

export function LegendItem({ label, tone }: LegendItemProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: tone }}
      />
      <span>{label}</span>
    </div>
  );
}
