const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, "Task text is required"],
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    required: [true, "Priority is required"],
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Task", taskSchema);