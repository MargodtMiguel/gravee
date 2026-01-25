import fs from "fs";
import path from "path";

const ROUTES_DIRECTORY = path.join(process.cwd(), "src/content/routes");

export interface RouteTip {
  type: "parking" | "food" | "technical";
  title: string;
  content: string;
}

export interface RouteStats {
  distance: number;
  elevation: number;
  gravelPercent: number;
  difficulty: number;
}

export interface RouteData {
  slug: string;
  title: string;
  date: string;
  description: string;
  heroImage: string;
  location: string;
  province: string;
  stats: RouteStats;
  tips: RouteTip[];
}

export interface RouteWithContent extends RouteData {
  gpxContent: string;
  mdxSource: string;
}

/**
 * Get all route slugs from the content directory
 */
export function getAllRouteSlugs(): string[] {
  if (!fs.existsSync(ROUTES_DIRECTORY)) {
    return [];
  }

  const entries = fs.readdirSync(ROUTES_DIRECTORY, { withFileTypes: true });
  
  return entries
    .filter((entry) => entry.isDirectory())
    .filter((entry) => {
      // Check if directory contains route.json
      const routeJsonPath = path.join(ROUTES_DIRECTORY, entry.name, "route.json");
      return fs.existsSync(routeJsonPath);
    })
    .map((entry) => entry.name);
}

/**
 * Get route data by slug
 */
export function getRouteBySlug(slug: string): RouteWithContent | null {
  const routeDir = path.join(ROUTES_DIRECTORY, slug);
  
  if (!fs.existsSync(routeDir)) {
    return null;
  }

  const routeJsonPath = path.join(routeDir, "route.json");
  const blogMdxPath = path.join(routeDir, "blog.mdx");
  const trackGpxPath = path.join(routeDir, "track.gpx");

  if (!fs.existsSync(routeJsonPath)) {
    return null;
  }

  try {
    const routeJson = JSON.parse(fs.readFileSync(routeJsonPath, "utf-8")) as RouteData;
    const mdxSource = fs.existsSync(blogMdxPath)
      ? fs.readFileSync(blogMdxPath, "utf-8")
      : "";
    const gpxContent = fs.existsSync(trackGpxPath)
      ? fs.readFileSync(trackGpxPath, "utf-8")
      : "";

    return {
      ...routeJson,
      mdxSource,
      gpxContent,
    };
  } catch (error) {
    console.error(`Error reading route ${slug}:`, error);
    return null;
  }
}

/**
 * Get all routes with their data
 */
export function getAllRoutes(): RouteData[] {
  const slugs = getAllRouteSlugs();
  
  return slugs
    .map((slug) => {
      const routeJsonPath = path.join(ROUTES_DIRECTORY, slug, "route.json");
      try {
        return JSON.parse(fs.readFileSync(routeJsonPath, "utf-8")) as RouteData;
      } catch {
        return null;
      }
    })
    .filter((route): route is RouteData => route !== null);
}
