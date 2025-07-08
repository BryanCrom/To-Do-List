import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import path from "path";

import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";
//import requestTracker from "./middleware/requestTracker.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

if (process.env.NODE_ENV !== "production") {
  //apply cors
  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );
}

//lets us use req.body
app.use(express.json());

//apply rate limiter
app.use(rateLimiter);

//apply request tracker
//app.use(requestTracker);

app.use("/notes", notesRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Backend started on PORT: " + PORT);
  });
});
