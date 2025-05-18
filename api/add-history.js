import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { error } = await supabase.from("search-history").delete().neq("id", 0); // Delete all rows

  if (error) return res.status(500).json({ error });
  return res.status(200).json({ message: "History cleared" });
}
