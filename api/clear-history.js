import { supabase } from "./supabaseClient"; // your Supabase client setup

export default async function handler(req, res) {
  if (req.method !== "DELETE") return res.status(405).end("Method Not Allowed");

  const { error } = await supabase.from("search_history").delete().neq("id", 0); // delete all

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ message: "History cleared." });
}
