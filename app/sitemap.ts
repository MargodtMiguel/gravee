import type { MetadataRoute } from "next";
import { getAllRouteSlugs } from "@/lib/routes";

const BASE_URL = "https://gravee.cc";

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = getAllRouteSlugs();

  const routes = slugs.map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
    },
    ...routes,
  ];
}
