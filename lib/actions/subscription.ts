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

  const { error: downloadError } = await supabase
    .from("route_downloads")
    .insert([{ email, route_slug: slug }]);

  if (downloadError) {
    console.error("Supabase insert download error:", downloadError);
  }
  
  return { success: true };
}
