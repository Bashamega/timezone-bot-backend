const { createClient } = require("@supabase/supabase-js");
// Supabase setup using environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
module.exports = { supabase: createClient(SUPABASE_URL, SUPABASE_KEY) };