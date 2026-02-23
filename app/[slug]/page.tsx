import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getRouteBySlug, getAllRouteSlugs } from "@/lib/routes";
import { parseGpx } from "@/lib/gpx";
import {
  RouteHero,
  RouteMap,
  RouteContent,
  RouteTips,
  RouteCTA,
  RouteWeather,
} from "@/components/routes";
import { getRouteWeather } from "@/lib/weather";

export async function generateStaticParams() {
  const slugs = getAllRouteSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const route = getRouteBySlug(slug);

  if (!route) {
    return {
      title: "Route Not Found | Gravee",
    };
  }

  const city = route.location.split(",")[0].trim();
  const title = `${route.title} - Gravel in ${city}`;

  return {
    title,
    description: route.description,
    keywords: [
      "Gravel",
      "Gravelroute",
      "Gravelbiken",
      city,
      route.province,
      "Gravee",
      route.title,
    ],
    openGraph: {
      title,
      description: route.description,
      images: [route.heroImage],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: route.description,
      images: [route.heroImage],
    },
  };
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export default async function RoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const route = getRouteBySlug(slug);

  if (!route) {
    notFound();
  }

  const coordinates = parseGpx(route.gpxContent);
  const startPoint = coordinates[0];
  const weather = await getRouteWeather(startPoint.lat, startPoint.lng);

  let MdxContent: React.ComponentType | null = null;
  try {
    const mdxModule = await import(`@/src/content/routes/${slug}/blog.mdx`);
    MdxContent = mdxModule.default;
  } catch {
    MdxContent = null;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: route.title,
    description: route.description,
    image: `https://gravee.cc${route.heroImage}`,
    author: {
      "@type": "Organization",
      name: "Gravee",
      url: "https://gravee.cc",
    },
    publisher: {
      "@type": "Organization",
      name: "Gravee",
      logo: {
        "@type": "ImageObject",
        url: "https://gravee.cc/icon.png",
      },
    },
    datePublished: route.date,
  };

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RouteHero route={route} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-20 flex flex-col gap-10">
        <div className="grid md:grid-cols-12 gap-12">
          <div className="md:col-span-7 order-2 md:order-1">
            {MdxContent && (
              <RouteContent>
                <MdxContent />
              </RouteContent>
            )}

            <RouteTips tips={route.tips} />
          </div>

          <div className="md:col-span-5 order-1 md:order-2 flex flex-col gap-4">
            <RouteMap coordinates={coordinates} accessToken={MAPBOX_TOKEN} />
            {weather && <RouteWeather weather={weather} />}
          </div>
        </div>
      </div>
      <RouteCTA slug={route.slug} />
    </main>
  );
}
