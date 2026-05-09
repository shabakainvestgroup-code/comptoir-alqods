import { env } from "@/lib/env";

type QueryOptions = {
  select?: string;
  order?: string;
  limit?: number;
  offset?: number;
  filters?: Record<string, string | number | boolean>;
  or?: string;
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
  if (options.offset) params.set("offset", String(options.offset));
  if (options.or) params.set("or", options.or);
  Object.entries(options.filters || {}).forEach(([key, value]) => {
    params.set(key, typeof value === "string" && value.includes(".") ? value : `eq.${value}`);
  });
  return supabaseFetch(`${table}?${params.toString()}`);
}

export async function getRowById<T>(table: string, id: string): Promise<T | null> {
  const rows = await listRows<T>(table, {
    select: "*",
    filters: { id }
  });

  return rows[0] || null;
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

export async function updateRows<T>(table: string, filters: Record<string, string | number | boolean>, values: unknown): Promise<T[]> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => params.set(key, `eq.${value}`));

  return supabaseFetch(`${table}?${params.toString()}`, {
    method: "PATCH",
    body: JSON.stringify(values)
  });
}

export async function deleteRows<T>(table: string, filters: Record<string, string | number | boolean>): Promise<T[]> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => params.set(key, `eq.${value}`));

  return supabaseFetch(`${table}?${params.toString()}`, {
    method: "DELETE"
  });
}

export { isSupabaseConfigured };
