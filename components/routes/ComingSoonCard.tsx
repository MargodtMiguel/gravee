import { Card } from "@/components/ui/card";
import { Hammer } from "lucide-react";

export function ComingSoonCard() {
  return (
    <Card className="h-full flex flex-col gap-2 items-center justify-center p-8 text-center bg-secondary/10 border-dashed border-2 min-h-[400px]">
      <div className="rounded-full bg-secondary/20 p-4">
        <Hammer className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold tracking-tight">
        Binnenkort meer routes
      </h3>
      <p className="text-muted-foreground text-sm max-w-[250px]">
        We werken hard aan nieuwe routes in andere regio's.
      </p>
    </Card>
  );
}
