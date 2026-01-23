import { getAllRoutes } from "@/lib/routes";
import { RouteCard } from "@/components/routes";

export const metadata = {
  title: "Routes | Gravee",
  description:
    "Vind de perfecte gravelroute voor jouw niveau en stijl, gecureerd door ons",
};

export default function RoutesPage() {
  const routes = getAllRoutes();

  return (
    <main className="bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <header className="max-w-3xl mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 max-w-xl">
            Ontdek je volgende avontuur.
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Vind de perfecte gravelroute voor jouw niveau en stijl, gecureerd
            door ons.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {routes.map((route) => (
            <RouteCard key={route.slug} route={route} />
          ))}
        </div>
      </div>
    </main>
  );
}
