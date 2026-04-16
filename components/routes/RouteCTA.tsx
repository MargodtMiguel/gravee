"use client";

import { useState } from "react";
import { Coffee, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { captureRouteDownloadEmail } from "@/lib/actions/subscription";

interface RouteCTAProps {
  slug: string;
}

export function RouteCTA({ slug }: RouteCTAProps) {
  const gpxDownloadUrl = `/routes/${slug}/track.gpx`;
  const buyMeCoffeeUrl = "https://buymeacoffee.com/gravee";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const downloadGpx = () => {
    const link = document.createElement("a");
    link.href = gpxDownloadUrl;
    link.download = "track.gpx";
    link.click();
  };

  const handleDownloadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    const res = await captureRouteDownloadEmail(email, slug);
    setLoading(false);

    if (res?.success) {
      downloadGpx();
    } else {
      alert(res?.error || "Er is een fout opgetreden. Probeer het opnieuw.");
    }
  };

  return (
    <section className="bg-[#EDEAE4]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 flex gap-12 flex-col md:flex-row items-center justify-between">
        <div className="flex-1 w-full flex flex-col gap-2">
          <h3 className="text-primary font-bold text-xl tracking-tight">
            Ready to Ride?
          </h3>
          <p className="pb-4">
            Vul je e-mailadres in om de actuele GPX direct te downloaden. Ik update de routes regelmatig.
          </p>

          <form onSubmit={handleDownloadSubmit} className="flex flex-col sm:flex-row w-full max-w-md gap-3">
            <input 
              type="email" 
              placeholder="Jouw e-mailadres" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="flex h-10 flex-1 rounded-full border border-primary/20 bg-background px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button
              type="submit"
              className="rounded-full w-full sm:w-fit"
              disabled={loading}
              data-umami-event="Download GPX"
              data-umami-event-route={slug}
            >
              <Download className="size-4" />
              {loading ? "Even geduld..." : "Download GPX (Gratis)"}
            </Button>
          </form>
        </div>

        <div className="h-px md:h-32 w-full md:w-px bg-primary/20"></div>

        <Card className="shadow-none flex-1 w-full">
          <CardContent>
            <div className="flex gap-2 items-center">
              <Avatar className="size-10">
                <AvatarImage
                  src="https://cdn.buymeacoffee.com/uploads/profile_pictures/2026/01/zUYvHgmwB8zICMO2.jpeg@300w_0e.webp"
                  alt="@shadcn"
                />
                <AvatarFallback>MD</AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <div className="font-light text-xs">ROUTE DOOR</div>
                <div className="font-bold text-primary">Miguel</div>
              </div>
            </div>
            <p className="pt-2 pb-4 text-muted-foreground text-sm">
              "Uren scouten voor de perfecte rit. Smaakte de route naar meer?
              Trakteer de scout op een koffie."
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
