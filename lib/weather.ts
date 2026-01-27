import {
  Sun,
  CloudSun,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  Snowflake,
  CloudLightning,
  CloudHail,
  HelpCircle,
  LucideIcon,
} from "lucide-react";

export interface WeatherData {
  current: {
    temperature_2m: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    precipitation_sum: number[];
  };
}

export async function getRouteWeather(
  lat: number,
  lng: number,
): Promise<WeatherData | null> {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lng.toString(),
      current: "temperature_2m,weather_code",
      daily: "precipitation_sum",
      past_days: "7",
      forecast_days: "1",
      timezone: "auto",
    });

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
      { next: { revalidate: 3600 } }, // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

export function getWeatherDescription(code: number): {
  label: string;
  icon: LucideIcon;
} {
  // WMO Weather interpretation codes (WW)
  // https://open-meteo.com/en/docs
  switch (code) {
    case 0:
      return { label: "Heldere hemel", icon: Sun };
    case 1:
    case 2:
    case 3:
      return { label: "Gedeeltelijk bewolkt", icon: CloudSun };
    case 45:
    case 48:
      return { label: "Mist", icon: CloudFog };
    case 51:
    case 53:
    case 55:
      return { label: "Motregen", icon: CloudDrizzle };
    case 56:
    case 57:
      return { label: "Bevriezende motregen", icon: CloudDrizzle };
    case 61:
    case 63:
    case 65:
      return { label: "Regen", icon: CloudRain };
    case 66:
    case 67:
      return { label: "IJzel", icon: Snowflake };
    case 71:
    case 73:
    case 75:
      return { label: "Sneeuwval", icon: Snowflake };
    case 77:
      return { label: "Sneeuwkorrels", icon: Snowflake };
    case 80:
    case 81:
    case 82:
      return { label: "Regenbuien", icon: CloudRain };
    case 85:
    case 86:
      return { label: "Sneeuwbuien", icon: Snowflake };
    case 95:
      return { label: "Onweer", icon: CloudLightning };
    case 96:
    case 99:
      return { label: "Onweer met hagel", icon: CloudHail };
    default:
      return { label: "Onbekend", icon: HelpCircle };
  }
}
