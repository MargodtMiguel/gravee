import { Route, Mountain, CircleDot, Gauge } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { RouteStats } from "@/lib/routes";

interface RouteStatsBarProps {
  stats: RouteStats;
}

export function RouteStatsBar({ stats }: RouteStatsBarProps) {
  const items = [
    {
      icon: Route,
      label: "Afstand",
      value: `${stats.distance}km`,
    },
    {
      icon: Mountain,
      label: "Hoogte",
      value: `${stats.elevation.toLocaleString()}m`,
    },
    {
      icon: CircleDot,
      label: "Onverhard",
      value: `${stats.gravelPercent}%`,
    },
    {
      icon: Gauge,
      label: "Moeilijkheid",
      value: stats.difficulty,
      colorClass: "text-primary",
    },
  ];

  return (
    <section className="w-full md:w-auto">
      <Card className="mx-auto max-w-7xl border-none shadow-sm py-2 ">
        <CardContent className="p-0">
          <div className="grid grid-cols-2 divide-x divide-y md:grid-cols-4 md:divide-y-0">
            {items.map((item, index) => (
              <div
                key={item.label}
                className={`flex flex-col items-center gap-1 p-4 md:px-6 ${
                  index < 2 ? "border-b md:border-b-0" : ""
                }`}
              >
                <item.icon className="size-5 text-primary" />

                <span className={`text-lg font-semibold text-primary`}>
                  {item.value}
                </span>
                <span className="text-xs font-medium uppercase tracking-wider text-primary">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
