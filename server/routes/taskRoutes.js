const express = require("express");
const router = express.Router();
const Task = require("../models/task");


// ✅ CREATE TASK
router.post("/add", async (req, res) => {
  try {
    const { text, priority } = req.body;

    if (!text || !priority) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newTask = new Task({ text, priority });
    await newTask.save();

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ GET ALL TASKS
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ UPDATE TASK (IMPORTANT FIXED)
router.put("/:id", async (req, res) => {
  try {
    const { text, priority, isCompleted, isFavorite } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        text,
        priority,
        isCompleted,
        isFavorite,
      },
      { new: true }
    );

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ✅ DELETE TASK
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task deleted ✅" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
