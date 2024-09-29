require("dotenv").config();
const express = require("express");
const cors = require("cors"); // Import cors
const { supabase } = require("./config/supabaseClient");
const app = express();
const PORT = process.env.PORT || 3000;

// CORS options
const corsOptions = {
  origin: "*", // Replace with your trusted domain
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"], // You can specify allowed headers
};

// Enable CORS with options
app.use(cors(corsOptions));

// Middleware to verify the request comes from the Discord bot
app.use((req, res, next) => {
  const botToken = process.env.BOT_TOKEN; // Store your bot token in environment variables
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader === `Bearer ${botToken}`) {
    next(); // If token matches, allow the request
  } else {
    res.status(403).json({ error: "Forbidden: Invalid token" }); // Otherwise, block the request
  }
});

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
    return res
      .status(400)
      .json({ error: "Both discord_user_id and timezone are required" });
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
module.exports = app;
