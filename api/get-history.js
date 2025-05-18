import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from("search-history")
    .select("*") // This already includes state
    .order("searched_at", { ascending: false })
    .limit(5);

  if (error) return res.status(500).json({ error });
  return res.status(200).json(data);
}
