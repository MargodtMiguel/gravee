import { getAllRoutes } from "@/lib/routes";
import { RouteBrowser } from "@/components/routes";

export const metadata = {
  title: "Routes | Gravee",
  description:
    "Vind de perfecte gravelroute voor jouw niveau en stijl, gecureerd door ons",
};

export default function RoutesPage() {
  const routes = getAllRoutes();

  return (
    <main className="bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <header className="max-w-3xl mb-6">
          <p className="text-secondary-foreground font-semibold tracking-wide uppercase text-sm mb-2">
            Verken Vlaamse gravelroutes
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 max-w-xl text-foreground">
            Ontdek je volgende avontuur.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Vind de perfecte gravelroute voor jouw niveau en stijl, gecureerd
            door gravel-liefhebbers.
          </p>
        </header>

        <RouteBrowser initialRoutes={routes} />
      </div>
    </main>
  );
}
