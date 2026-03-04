import Link from "next/link";
import { Logo } from "./logo";

export const Nav = () => {
  return (
    <nav className="bg-background max-w-7xl mx-auto px-4 md:px-8 py-4">
      <div className="flex items-center gap-6">
        <Link href="/">
          <div className="flex gap-2 items-center">
            <Logo className="size-6 md:size-8" />
            <div className="text-primary font-extrabold text-lg md:text-xl">
              Gravee.cc
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-4 pt-[1px]">
          <Link
            href="/"
            className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Routes
          </Link>
        </div>
      </div>
    </nav>
  );
};
