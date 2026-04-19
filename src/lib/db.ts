import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Durante desarrollo local sin .env.local, exponemos un stub que no crashea.
// En producción, Vercel inyecta las vars reales y createClient opera normalmente.
let client: SupabaseClient;

if (!url || !key) {
  const stub = {
    from:    () => stub,
    select:  () => stub,
    insert:  async () => ({ data: null, error: { message: "supabase_not_configured" } }),
    upsert:  async () => ({ data: null, error: { message: "supabase_not_configured" } }),
    update:  async () => ({ data: null, error: { message: "supabase_not_configured" } }),
    delete:  async () => ({ data: null, error: { message: "supabase_not_configured" } }),
    eq:      () => stub,
    gte:     () => stub,
    lte:     () => stub,
    in:      () => stub,
    order:   () => stub,
    limit:   () => stub,
    maybeSingle: async () => ({ data: null, error: null }),
    rpc:     async () => ({ data: null, error: { message: "supabase_not_configured" } }),
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client = stub as unknown as SupabaseClient;
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.warn("[supabase] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY no configurados — usando stub local.");
  }
} else {
  client = createClient(url, key);
}

export default client;
