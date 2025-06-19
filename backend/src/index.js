import express from "express";
import notesRoutes from "./routes/notes-routes.js";

const app = express();

app.use("/notes", notesRoutes);

app.listen(3000);
