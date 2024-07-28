const express = require("express");
const router = express.Router();

const {
  createTodo,
  deleteTodo,
  updateTodo,
} = require("../controllers/todocontroller");

router.route("/:id").post(createTodo).delete(deleteTodo).patch(updateTodo);

module.exports = router;
