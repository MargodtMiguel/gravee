"use client";

import { Coffee, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";

interface RouteCTAProps {
  slug: string;
}

export function RouteCTA({ slug }: RouteCTAProps) {
  const gpxDownloadUrl = `/routes/${slug}/track.gpx`;
  const buyMeCoffeeUrl = "https://buymeacoffee.com/gravee";

  const downloadGpx = () => {
    const link = document.createElement("a");
    link.href = gpxDownloadUrl;
    link.download = "track.gpx";
    link.click();
  };

  return (
    <section className="bg-[#EDEAE4]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 flex gap-12 flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col gap-2">
          <h3 className="text-primary font-bold text-xl tracking-tight">
            Ready to Ride?
          </h3>
          <p className="pb-4">
            Download het GPX bestand gratis en sync het met fietscomputer.
          </p>

          <Button className="rounded-full w-fit" onClick={downloadGpx}>
            <Download className="size-4" />
            Download GPX-bestand (Gratis)
          </Button>
        </div>

        <div className="h-px md:h-32 w-full md:w-px bg-primary/20"></div>

        <Card className="shadow-none max-fit">
          <CardContent>
            <div className="flex gap-2 items-center">
              <Avatar className="size-10">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>MD</AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <div className="font-light text-xs">ROUTE DOOR</div>
                <div className="font-bold text-primary">Michael De Vos</div>
              </div>
            </div>
            <p className="pt-2 pb-4 text-muted-foreground text-sm">
              "Ik spendeer uren om de mooiste stroken te vinden en te delen met
              jullie. Steun m'n werk met een koffie."
            </p>

            <Link href={buyMeCoffeeUrl}>
              <Button
                className="rounded-full w-fit hover:cursor-pointer"
                variant="secondary"
              >
                <Coffee className="size-4" />
                Trakteer op koffie
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
