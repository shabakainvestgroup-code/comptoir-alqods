import { env } from "@/lib/env";

type QueryOptions = {
  select?: string;
  order?: string;
  limit?: number;
};

function isSupabaseConfigured() {
  return Boolean(env.supabaseUrl && env.supabaseServiceRoleKey);
}

async function supabaseFetch(path: string, init?: RequestInit) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  const url = `${env.supabaseUrl}/rest/v1/${path}`;

  const response = await fetch(url, {
    ...init,
    headers: {
      apikey: env.supabaseServiceRoleKey as string,
      Authorization: `Bearer ${env.supabaseServiceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(init?.headers || {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status}`);
  }

  return response.json();
}

export async function listRows<T>(table: string, options: QueryOptions = {}): Promise<T[]> {
  const params = new URLSearchParams();
  params.set("select", options.select || "*");
  if (options.order) params.set("order", options.order);
  if (options.limit) params.set("limit", String(options.limit));
  return supabaseFetch(`${table}?${params.toString()}`);
}

export async function insertRow<T>(table: string, row: unknown): Promise<T> {
  const rows = await supabaseFetch(table, {
    method: "POST",
    body: JSON.stringify(row)
  });

  return rows[0] as T;
}

export async function upsertRows<T>(table: string, rowsToUpsert: unknown[], onConflict = "id"): Promise<T[]> {
  const params = new URLSearchParams();
  params.set("on_conflict", onConflict);

  return supabaseFetch(`${table}?${params.toString()}`, {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation"
    },
    body: JSON.stringify(rowsToUpsert)
  });
}

export async function updateRow<T>(table: string, id: string, values: unknown): Promise<T> {
  const params = new URLSearchParams();
  params.set("id", `eq.${id}`);

  const rows = await supabaseFetch(`${table}?${params.toString()}`, {
    method: "PATCH",
    body: JSON.stringify(values)
  });

  return rows[0] as T;
}

export { isSupabaseConfigured };
