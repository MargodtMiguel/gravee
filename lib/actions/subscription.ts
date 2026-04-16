"use server";

import { supabase } from "../supabaseClient";

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) return { error: "Email is vereist" };

  const { error } = await supabase
    .from("subscribers")
    .insert([{ email, source: "newsletter" }]);

  // 23505 is the Postgres error code for unique constraint violation
  if (error && error.code !== "23505") {
    console.error("Supabase insert error:", error);
    return { error: "Er is iets misgegaan. Probeer het later opnieuw." };
  }

  return { success: true };
}

export async function captureRouteDownloadEmail(email: string, slug: string) {
  if (!email) return { error: "Email is vereist" };

  // Eerst proberen we de email toe te voegen aan de subscribers (voor de nieuwsbrief)
  const { error: subscriberError } = await supabase
    .from("subscribers")
    .insert([{ email, source: "route_download", route_slug: slug }]);

  // we negeren error code 23505 (unique constraint violation) omdat ze mogelijk al ingeschreven zijn
  if (subscriberError && subscriberError.code !== "23505") {
    console.error("Supabase insert subscriber error:", subscriberError);
    // Continue anyway, maybe we can still log the download
  }

  // Vervolgens slaan we de specifieke download op, zodat we zien wie wat downloadt
  const { error: downloadError } = await supabase
    .from("route_downloads")
    .insert([{ email, route_slug: slug }]);

  if (downloadError) {
    console.error("Supabase insert download error:", downloadError);
    // Zelfs als het opslaan van de download mislukt, laten we de gebruiker downloaden
    // maar we returnen een log. Voor de ervaring sturen we altijd success terug:
  }
  
  return { success: true };
}
