import express from "express";
import notesControllers from "../controllers/notesControllers.js";

const router = express.Router();

router.get("/", notesControllers.getAllNotes);
router.get("/:id", notesControllers.getNote);
router.post("/", notesControllers.createNote);
router.put("/:id", notesControllers.updateNote);
router.delete("/:id", notesControllers.deleteNote);

export default router;
