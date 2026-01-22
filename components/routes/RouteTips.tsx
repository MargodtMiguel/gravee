import { ParkingCircle, Coffee, Wrench, type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RouteTip } from "@/lib/routes";

interface RouteTipsProps {
  tips: RouteTip[];
}

const tipConfig: Record<string, { icon: LucideIcon }> = {
  parking: {
    icon: ParkingCircle,
  },
  food: {
    icon: Coffee,
  },
  technical: {
    icon: Wrench,
  },
};

export function RouteTips({ tips }: RouteTipsProps) {
  if (!tips || tips.length === 0) {
    return null;
  }

  return (
    <section className="pt-12">
      <h2 className="mb-6 text-3xl font-semibold tracking-tight text-primary">
        Tips van de Maker
      </h2>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {tips.map((tip, index) => {
          const config = tipConfig[tip.type] || tipConfig.technical;
          const Icon = config.icon;

          return (
            <Card
              key={index}
              className={`bg-white shadow-none ${
                index % 2 === 0 && index === tips.length - 1
                  ? "lg:col-span-2"
                  : ""
              } `}
            >
              <CardContent className="flex gap-4">
                <div className="p-2 bg-primary/10 rounded-full h-min">
                  <Icon className={`size-5 text-primary`} />
                </div>

                <div className="flex flex-col gap-2">
                  <CardTitle className="text-primary">{tip.title}</CardTitle>
                  <p className="text-sm leading-relaxed">{tip.content}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
