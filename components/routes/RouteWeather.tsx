"use client";

import { WeatherData, getWeatherDescription } from "@/lib/weather";
import { getRainfallSummary } from "@/lib/rainfall";
import { Card } from "@/components/ui/card";

interface RouteWeatherProps {
  weather: WeatherData;
}

export function RouteWeather({ weather }: RouteWeatherProps) {
  const currentCondition = getWeatherDescription(weather.current.weather_code);
  const rainfallSummary = getRainfallSummary(weather.daily.precipitation_sum);

  return (
    <Card className="bg-[#2D4739] text-white border-none p-6 shadow-md rounded-2xl">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-300">
          Huidige condities
        </span>
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-3">
            <span className="text-5xl font-bold tracking-tight">
              {Math.round(weather.current.temperature_2m)}
              <span className="font-semibold">°C</span>
            </span>
            <span className="text-xl font-medium text-gray-200 pb-1">
              {currentCondition.label}
            </span>
          </div>
          <currentCondition.icon className="h-10 w-10 text-green-400 fill-current" />
        </div>
      </div>

      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300">Neerslag afgelopen 7 dagen</span>
          <span className="font-medium text-white">{rainfallSummary}</span>
        </div>
      </div>
    </Card>
  );
}
