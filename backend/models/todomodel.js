const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  completed: {
    type: String,
    default: "unchecked",
  },
  stared: {
    type: String,
    default: "fa-regular",
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Users",
    requied: true,
  },
  Date: {
    type: Date,
    default: Date.now,
  },
});

const Todo = mongoose.model("Todos", todoSchema);

module.exports = Todo;
