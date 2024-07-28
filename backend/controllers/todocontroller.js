const User = require("../models/usermodel");
const Todo = require("../models/todomodel");

const createTodo = async (req, res) => {
  const user = await User.findById(req.body.ref);
  const newTodo = await Todo.create({
    title: req.body.title,
    user: req.body.ref,
  });
  let savedTodo = await newTodo.save();

  user.todos.push(savedTodo._id);
  await user.save();

  res.status(201).json({
    status: 201,
    message: "Success",
    savedTodo,
  });
};

const deleteTodo = async (req, res) => {
  let todoId = req.params.id;
  await Todo.findByIdAndDelete(todoId);
  let userId = req.body.userId;

  const user = await User.findByIdAndUpdate(userId, {
    $pull: { todos: todoId },
  });

  res.status(200).json({
    //actual delete status code is 204
    message: "Successfully Deleted.",
  });
};

const updateTodo = async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(
    req.body.todoId,
    {
      title: req.body.title,
      stared: req.body.stared,
      completed: req.body.completed,
    },
    { new: true, runValidators: true }
  );
  if (todo) {
    res.status(200).json({
      message: "Successfully Updated.",
      todo,
    });
  } else {
    res.status(404).json({
      message: "Invalid Id",
    });
  }
};

//=---------------------------------------------------

module.exports = { createTodo, deleteTodo, updateTodo };
