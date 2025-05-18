import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Use a dummy WHERE clause to satisfy RLS
  const { error } = await supabase
    .from("search-history")
    .delete()
    .gt("id", "00000000-0000-0000-0000-000000000000");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ message: "History cleared." });
}
