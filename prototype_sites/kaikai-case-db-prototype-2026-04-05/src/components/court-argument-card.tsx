import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CourtArgumentCardProps = {
  label: string;
  content: string;
  tone: "primary" | "secondary";
};

export function CourtArgumentCard({
  label,
  content,
  tone,
}: CourtArgumentCardProps) {
  return (
    <Card
      className={
        tone === "primary"
          ? "border-primary/20 bg-primary/5"
          : "border-border/70 bg-secondary/40"
      }
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{label}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm leading-7 text-muted-foreground">
        {content}
      </CardContent>
    </Card>
  );
}
