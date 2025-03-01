
const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

// Create a new task
router.post("/", async (req, res) => {
    try {
        const { title, description, status, dueDate } = req.body;
        if (!title || !description || !dueDate) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const task = new Task({ title, description, status, dueDate });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all tasks (with optional filtering)
router.get("/", async (req, res) => {
    try {
        const { status, dueDate } = req.query;
        let filter = {};
        if (status) filter.status = status;
        if (dueDate) filter.dueDate = new Date(dueDate);

        const tasks = await Task.find(filter);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a task by ID
router.get("/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: "Invalid Task ID" });
    }
});

// Update a task by ID
router.put("/:id", async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedTask) return res.status(404).json({ message: "Task not found" });
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: "Invalid Task ID" });
    }
});

// Delete a task by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) return res.status(404).json({ message: "Task not found" });
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Invalid Task ID" });
    }
});

module.exports = router;
