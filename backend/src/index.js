import express from "express";
import notesRoutes from "./routes/notesRoutes.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
//import requestTracker from "./middleware/requestTracker.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Backend started on PORT: " + PORT);
  });
});

//lets us use req.body
app.use(express.json());

//apply rate limiter
app.use(rateLimiter);

//apply request tracker
//app.use(requestTracker);

app.use("/notes", notesRoutes);
