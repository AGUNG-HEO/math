import { createClient, SupabaseClient } from "@supabase/supabase-js";

export interface StudentScoreRecord {
  id?: number;
  student_name: string;
  score: number;
  total_questions: number;
  accuracy: number;
  created_at?: string;
}

// Get Supabase URL and Key from process.env or localStorage
export function getSupabaseCredentials(): { url: string; key: string; isConfigured: boolean } {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  let key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (typeof window !== "undefined") {
    const localUrl = localStorage.getItem("custom_supabase_url");
    const localKey = localStorage.getItem("custom_supabase_anon_key");

    if (localUrl) url = localUrl;
    if (localKey) key = localKey;
  }

  const isPlaceholder =
    !url ||
    !key ||
    url.includes("your-supabase-project") ||
    key.includes("your-anon-key");

  return {
    url: url || "https://your-supabase-project.supabase.co",
    key: key || "your-anon-key",
    isConfigured: !isPlaceholder,
  };
}

let cachedClient: SupabaseClient | null = null;
let lastClientUrl = "";

export function getSupabaseClient(): SupabaseClient {
  const { url, key } = getSupabaseCredentials();

  if (!cachedClient || lastClientUrl !== url) {
    cachedClient = createClient(url, key);
    lastClientUrl = url;
  }

  return cachedClient;
}

export const supabase = getSupabaseClient();
