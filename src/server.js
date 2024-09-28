require("dotenv").config();
const express = require("express");
const { supabase } = require("./config/supabaseClient");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Define a route to fetch data from Supabase
app.get("/timezones/:id", async (req, res) => {
  const { id } = req.params;
  let { data, error } = await supabase.from("timezones").select("*").eq('discord_user_id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
