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
  let { data, error } = await supabase
    .from("timezones")
    .select("*")
    .eq("discord_user_id", id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});
// Define a route to create data in Supabase
app.post("/timezones", async (req, res) => {
    const { discord_user_id, timezone } = req.body;
  
    // Validate that both fields are provided
    if (!discord_user_id || !timezone) {
      return res.status(400).json({ error: "Both discord_user_id and timezone are required" });
    }
  
    // Insert the validated data into the "timezones" table
    const { data, error } = await supabase
      .from("timezones")
      .insert([{ discord_user_id, timezone }]);
  
    if (error) {
      return res.status(500).json({ error: error.message });
    }
  
    // Respond with the inserted data
    res.status(201).json(data);
  });
  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
