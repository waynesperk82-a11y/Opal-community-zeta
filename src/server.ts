import express from "express";
import router from "./index"; // your router file

const app = express();
const PORT = process.env.PORT || 3000;

// Use your routes
app.use(router);

// Homepage (fixes your blank issue)
app.get("/", (req, res) => {
  res.send("My app is live 🚀");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
