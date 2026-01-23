import Link from "next/link";
import Image from "next/image";
import { RouteData } from "@/lib/routes";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  MapPin,
  Mountain,
  ArrowUpRight,
  RulerDimensionLine,
  PanelLeftRightDashed,
} from "lucide-react";

interface RouteCardProps {
  route: RouteData;
}

export function RouteCard({ route }: RouteCardProps) {
  return (
    <Link href={`/routes/${route.slug}`} className="block h-full group">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg border-border/50 hover:border-border py-0">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={route.heroImage}
            alt={route.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <CardContent className="px-6">
          <h3 className="text-xl font-bold tracking-tight mb-1 group-hover:text-primary transition-colors">
            {route.title}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{route.location}</span>
          </div>

          <div className="grid grid-cols-3 gap-4 py-4">
            <div className="flex  gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium flex items-center gap-1.5">
                <RulerDimensionLine className="size-4 text-primary" />
              </span>
              <span className="font-semibold text-sm">
                {route.stats.distance}km
              </span>
            </div>

            <div className="flex  gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium flex items-center gap-1.5">
                <Mountain className="size-4 text-primary" />
              </span>
              <span className="font-semibold text-sm">
                {route.stats.elevation}m
              </span>
            </div>

            <div className="flex gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium flex items-center gap-1.5">
                <PanelLeftRightDashed className="size-4 text-primary" />
              </span>
              <span className="font-semibold text-sm">
                {route.stats.gravelPercent}%
              </span>
            </div>
          </div>

          <p className="text-muted-foreground line-clamp-2 text-sm">
            {route.description}
          </p>
        </CardContent>

        <CardFooter className="p-6 pt-0 mt-auto ml-auto">
          <div className="w-full flex gap-1 items-center justify-between text-sm font-semibold text-primary group-hover:underline decoration-2 underline-offset-4">
            Bekijk route
            <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
