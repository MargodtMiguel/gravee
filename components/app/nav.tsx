import { Logo } from "./logo";

export const Nav = () => {
  return (
    <nav className="bg-background px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between">
        <div className="flex gap-2 items-center">
          <Logo className="size-8 text-primary" />
          <div className="text-primary font-extrabold text-xl">Gravee.cc</div>
        </div>
      </div>
    </nav>
  );
};
