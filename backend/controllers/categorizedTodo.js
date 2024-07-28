const User = require("../models/usermodel");
const Todo = require("../models/todomodel");

const categorized = async (id) => {
  const todayTask = [];
  const yesterdayTask = [];
  const dayBeforeYesterday = [];
  const past = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const dayBeforeday = new Date(today);
  dayBeforeday.setDate(today.getDate() - 2);

  const user = await User.findById(id).populate("todos");
  let { todos } = user;
  todos.forEach((todo) => {
    let normalizeDate = new Date(todo.Date);
    normalizeDate.setHours(0, 0, 0, 0);
    if (normalizeDate.getTime() === today.getTime()) {
      todayTask.push(todo);
    } else if (normalizeDate.getTime() === yesterday.getTime()) {
      yesterdayTask.push(todo);
    } else if (normalizeDate.getTime() === dayBeforeday.getTime()) {
      dayBeforeYesterday.push(todo);
    } else {
      past.push(todo);
    }
  });
  return { todayTask, yesterdayTask, dayBeforeYesterday, past };
};

module.exports = { categorized };
