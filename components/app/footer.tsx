"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { subscribeToNewsletter } from "@/lib/actions/subscription";

export const Footer = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await subscribeToNewsletter(formData);
    if (res?.success) {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <footer className="bg-[#EDEAE4]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between bg-primary text-primary-foreground p-8 md:p-12 rounded-2xl">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold mb-2">Blijf op de hoogte!</h2>
            <p className="text-primary-foreground/90">
              Schrijf je in voor onze nieuwsbrief om updates over nieuwe routes en evenementen te ontvangen.
            </p>
          </div>
          {success ? (
            <div className="bg-primary-foreground/10 px-6 py-4 rounded-md border border-primary-foreground/20 text-center w-full md:w-auto">
              <span className="font-semibold text-lg">Bedankt voor je inschrijving! 🎉</span>
            </div>
          ) : (
            <form className="flex w-full md:w-auto gap-2" onSubmit={handleSubmit}>
              <input 
                type="email" 
                name="email"
                placeholder="Jouw e-mailadres" 
                required
                disabled={loading}
                className="flex h-10 w-full md:w-64 rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2 text-sm placeholder:text-primary-foreground/60 outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button type="submit" variant="secondary" className="whitespace-nowrap" disabled={loading}>
                {loading ? "Even geduld..." : "Inschrijven"}
              </Button>
            </form>
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 text-sm border-t border-primary/20">
        &copy; {new Date().getFullYear()} Gravee.cc. Alle rechten voorbehouden.
      </div>
    </footer>
  );
};
