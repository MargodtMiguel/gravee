import Image from "next/image";
import { Award, LocateIcon, MapPin, Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RouteWithContent } from "@/lib/routes";
import { RouteStatsBar } from "./RouteStatsBar";

interface Props {
  route: RouteWithContent;
}

export function RouteHero({ route }: Props) {
  return (
    <section className="relative h-[50vh] min-h-[400px] w-full overflow-hidden md:h-[60vh]">
      <div className="absolute inset-0">
        <Image
          src={route.heroImage}
          alt={route.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="relative flex h-full flex-col items-center  justify-center px-4 text-center md:items-start md:px-8 lg:px-16 md:pt-16 lg:pt-24">
        <div className="max-w-7xl flex flex-col items-center mx-auto gap-10">
          <div className="flex flex-col gap-4 items-center">
            <Badge className="gap-1.5 bg-white/5 border border-white/10 text-white text-md backdrop-blur-sm">
              <MapPin className="size-5" />
              {route.location}
            </Badge>

            <h1 className=" text-3xl font-bold tracking-tight text-white drop-shadow-lg md:text-4xl lg:text-5xl xl:text-6xl">
              {route.title}
            </h1>
          </div>

          <RouteStatsBar stats={route.stats} />
        </div>
      </div>
    </section>
  );
}
