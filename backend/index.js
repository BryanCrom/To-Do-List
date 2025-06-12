import express from "express";

const app = express();

app.get("/api/notes", (req, res) => {
  res.send("you have 5 notes");
});

app.listen(3000);
