import express from "express";
import notesControllers from "../controllers/notes-controllers.js";

const router = express.Router();

router.get("/", notesControllers.getAllNotes);
router.post("/", notesControllers.createNote);
router.put("/:id", notesControllers.updateNote);
router.delete("/:id", notesControllers.deleteNote);

export default router;
