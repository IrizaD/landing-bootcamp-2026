import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!, {
  prepare: false, // required for Supabase transaction mode pooler
});
export default sql;
