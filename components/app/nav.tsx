import Link from "next/link";
import { Logo } from "./logo";

export const Nav = () => {
  return (
    <nav className="bg-background max-w-7xl mx-auto px-4 md:px-8 py-4">
      <div className="  flex justify-between">
        <Link href="/">
          <div className="flex gap-2 items-center">
            <Logo className="size-6 md:size-8" />
            <div className="text-primary font-extrabold text-lg md:text-xl">
              Gravee.cc
            </div>
          </div>
        </Link>
      </div>
    </nav>
  );
};
