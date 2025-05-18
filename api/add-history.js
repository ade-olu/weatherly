import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { city, state, country } = req.body;

  const { error } = await supabase.from("search-history").insert([
    {
      city,
      state,
      country,
      searched_at: new Date().toISOString(),
    },
  ]);

  if (error) return res.status(500).json({ error });
  return res.status(200).json({ message: "Search saved" });
}
