interface RouteContentProps {
  children: React.ReactNode;
}

export function RouteContent({ children }: RouteContentProps) {
  if (!children) {
    return null;
  }

  return (
    <section>
      <article className="prose prose-lg prose-zinc mx-auto max-w-4xl dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-3xl prose-h3:text-2xl prose-h2:text-primary prose-h3:text-primary prose-a:text-amber-600 dark:prose-a:text-amber-400 prose-strong:font-semibold prose-img:rounded-xl">
        {children}
      </article>
    </section>
  );
}
