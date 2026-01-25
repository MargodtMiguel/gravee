"use client";

import { useState, useMemo } from "react";
import { RouteData } from "@/lib/routes";
import { RouteCard } from "@/components/routes/RouteCard";
import { ComingSoonCard } from "@/components/routes/ComingSoonCard";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ArrowUpDown } from "lucide-react";

interface RouteBrowserProps {
  initialRoutes: RouteData[];
}

export function RouteBrowser({ initialRoutes }: RouteBrowserProps) {
  const [province, setProvince] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("recent");

  const { provinces, maxDistanceRange } = useMemo(() => {
    const uniqueProvinces = Array.from(
      new Set(initialRoutes.map((r) => r.province)),
    ).sort();

    const maxDist = Math.max(
      ...initialRoutes.map((r) => r.stats.distance),
      100,
    );

    const roundedMax = Math.ceil(maxDist / 10) * 10;

    return {
      provinces: uniqueProvinces,
      maxDistanceRange: roundedMax,
    };
  }, [initialRoutes]);

  const [maxDistance, setMaxDistance] = useState<number>(maxDistanceRange);

  const filteredAndSortedRoutes = useMemo(() => {
    let result = [...initialRoutes];

    if (province !== "all") {
      result = result.filter((route) => route.province === province);
    }

    result = result.filter((route) => route.stats.distance <= maxDistance);

    result.sort((a, b) => {
      switch (sortOption) {
        case "shortest":
          return a.stats.distance - b.stats.distance;
        case "longest":
          return b.stats.distance - a.stats.distance;
        case "recent":
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return result;
  }, [initialRoutes, province, maxDistance, sortOption]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div className="flex flex-row gap-2 md:gap-4 overflow-x-auto pb-2 md:pb-0 no-scrollbar items-center">
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary text-secondary-foreground text-sm font-medium rounded-full transition-colors whitespace-nowrap">
                <span>Afstand</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium leading-none">Afstand</h4>
                  <span className="text-sm text-muted-foreground font-mono">
                    0 - {maxDistance}km
                  </span>
                </div>
                <Slider
                  defaultValue={[maxDistanceRange]}
                  value={[maxDistance]}
                  max={maxDistanceRange}
                  step={5}
                  min={0}
                  onValueChange={(vals) => setMaxDistance(vals[0])}
                />
              </div>
            </PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 bg-secondary/50 hover:bg-secondary text-secondary-foreground text-sm font-medium rounded-full transition-colors whitespace-nowrap outline-none">
                <span>{province === "all" ? "Regio" : province}</span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuRadioGroup
                value={province}
                onValueChange={setProvince}
              >
                <DropdownMenuRadioItem value="all">
                  Alle regio's
                </DropdownMenuRadioItem>
                {provinces.map((prov) => (
                  <DropdownMenuRadioItem key={prov} value={prov}>
                    {prov}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block w-px h-6 bg-border" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 text-foreground text-sm font-medium outline-none hover:text-foreground/80 transition-colors">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                <span>Sorteer</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={sortOption}
                onValueChange={setSortOption}
              >
                <DropdownMenuRadioItem value="recent">
                  Meest recent
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="shortest">
                  Korste afstand
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="longest">
                  Langste afstand
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {filteredAndSortedRoutes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedRoutes.map((route) => (
            <RouteCard key={route.slug} route={route} />
          ))}
          <ComingSoonCard />
        </div>
      ) : (
        <div className="text-center py-20 bg-secondary/20 rounded-xl border border-dashed">
          <p className="text-muted-foreground text-lg">
            Geen routes gevonden met deze filters.
          </p>
          <button
            onClick={() => {
              setProvince("all");
              setMaxDistance(maxDistanceRange);
            }}
            className="mt-4 text-sm font-medium text-primary hover:underline"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
