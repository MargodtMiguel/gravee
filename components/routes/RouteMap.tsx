"use client";

import { useRef, useEffect, useMemo, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { GpxCoordinate } from "@/lib/gpx";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface RouteMapProps {
  coordinates: GpxCoordinate[];
  accessToken: string;
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const chartConfig = {
  elevation: {
    label: "Elevation",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;

export function RouteMap({ coordinates, accessToken }: RouteMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const hoverMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const chartData = useMemo(() => {
    let totalDistance = 0;
    return coordinates.map((coord, index) => {
      if (index > 0) {
        totalDistance += calculateDistance(
          coordinates[index - 1].lat,
          coordinates[index - 1].lng,
          coord.lat,
          coord.lng,
        );
      }
      return {
        distance: totalDistance,
        elevation: coord.ele || 0,
        lat: coord.lat,
        lng: coord.lng,
      };
    });
  }, [coordinates]);

  useEffect(() => {
    if (!mapContainerRef.current || coordinates.length === 0) return;

    mapboxgl.accessToken = accessToken;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [coordinates[0].lng, coordinates[0].lat],
      zoom: 10,
    });

    mapRef.current = map;

    map.on("load", () => {
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coordinates.map((c) => [c.lng, c.lat]),
          },
        },
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#16CF16",
          "line-width": 5,
        },
      });

      new mapboxgl.Marker({ color: "#2D4739" })
        .setLngLat([coordinates[0].lng, coordinates[0].lat])
        .setPopup(new mapboxgl.Popup().setHTML("<strong>Start</strong>"))
        .addTo(map);

      const bounds = new mapboxgl.LngLatBounds();
      coordinates.forEach((coord) => {
        bounds.extend([coord.lng, coord.lat]);
      });
      map.fitBounds(bounds, { padding: 50 });
      setMapLoaded(true);
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      if (hoverMarkerRef.current) {
        hoverMarkerRef.current.remove();
        hoverMarkerRef.current = null;
      }
      map.remove();
      mapRef.current = null;
      setMapLoaded(false);
    };
  }, [coordinates, accessToken]);

  // Update marker when activeIndex changes
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    if (activeIndex !== null && chartData[activeIndex]) {
      const { lat, lng } = chartData[activeIndex];

      if (!hoverMarkerRef.current) {
        const el = document.createElement("div");
        el.className =
          "h-4 w-4 bg-chart-3 rounded-full border-2 border-white shadow-lg";

        hoverMarkerRef.current = new mapboxgl.Marker({
          element: el,
        })
          .setLngLat([lng, lat])
          .addTo(mapRef.current);
      } else {
        hoverMarkerRef.current.setLngLat([lng, lat]);
      }
    } else {
      if (hoverMarkerRef.current) {
        hoverMarkerRef.current.remove();
        hoverMarkerRef.current = null;
      }
    }
  }, [activeIndex, mapLoaded, chartData]);

  return (
    <section className="p-2 bg-white rounded-xl flex flex-col gap-6">
      <div className="overflow-hidden rounded-xl">
        <div
          ref={mapContainerRef}
          className="h-64 w-full md:h-96"
          aria-label="Route map"
        />
      </div>

      <div
        className="h-[180px] w-full"
        onMouseLeave={() => setActiveIndex(null)}
      >
        <ChartContainer config={chartConfig} className="h-full w-full">
          <AreaChart
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 0,
            }}
            onMouseMove={(state) => {
              if (state?.activeTooltipIndex !== undefined) {
                const index = Number(state.activeTooltipIndex);
                if (!isNaN(index)) {
                  setActiveIndex(index);
                }
              }
            }}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <defs>
              <linearGradient id="fillElevation" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-elevation)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-elevation)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="distance"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value.toFixed(0)}km`}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickCount={5}
              width={40}
              domain={[0, (dataMax: number) => Math.ceil(dataMax / 10) * 10]}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value: number) => (
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-primary" />
                      <span className="text-muted-foreground">Elevation</span>
                      <span className="font-mono font-medium">
                        {Math.round(value)}m
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Area
              dataKey="elevation"
              type="natural"
              fill="url(#fillElevation)"
              stroke="var(--color-elevation)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </section>
  );
}
