const User = require("../models/usermodel");
const Todo = require("../models/todomodel");
const jwt = require("jsonwebtoken");
const path = require("path");

const { promisify } = require("util");
const { categorized } = require("./categorizedTodo");

const prodectedRoute = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      const decode = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.SECRECT_KEY
      );

      const user = await User.findById(decode.id);

      if (user) {
        next();
      } else {
        res
          .status(401)
          .render("signin.ejs");
      }
    } else {
      return res
        .status(401)
        .render("signin.ejs");
    }
  } catch (msg) {
    res.status(400).json({
      error: "There is some error occured",
      msg,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = await User.create({
      userName: req.body.userName,
      emailAddress: req.body.email,
      password: req.body.password,
    });
    await newUser.save();
    res.status(201).render("signin.ejs", {
      status: true,
      msg: "Successfully registered login to continue..",
    });
  } catch (err) {
    res.status(201).render("signin.ejs", {
      msg: err.message,
      status: false,
    });
  }
};
const signup = (req, res) => {
  res.status(200).render("signup.ejs");
};
const homepage = async (req, res) => {
  const decode = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.SECRECT_KEY
  );

  const user = await User.findById(decode.id);
  const todos = await categorized(user._id);
  // res.status(200).json(todos)
  res.status(200).render("index.ejs", { user, todos });
};

const signin = (req, res) => {
  res.status(200).render("signin.ejs");
};
const getUser = async (req, res) => {
  const user = await User.findById(req.params.id).populate("todos");
  res.status(201).json({
    status: "Success",
    result: user,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).render("signin.ejs");
  }

  const user = await User.findOne({ emailAddress: email }).select("+password");
  if (!user) {
    return res
      .status(400)
      .render("signin.ejs", { msg: "Incorrect email or password" });
  }
  const token = jwt.sign({ id: user._id }, process.env.SECRECT_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const cookieOptions = {
    expires: new Date(Date.now() + 90 + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.cookie("jwt", token, cookieOptions);

  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({
      status: "failed",
      message: "Incorrect eamil or password!",
    });
  } else {
    const todos = await categorized(user._id);

    res.status(200).render("index.ejs", { user, todos });
  }
};

const getUserTodoDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("todos");
    let { todos } = user;

    res.status(200).json({
      totalTasks: todos.length,
      todos,
    });
  } catch (err) {
    res.status(400).json("can't fetch now.");
  }
};
const logout = async (req, res) => {
  res.cookie("jwt", "Logout", {
    expires: new Date(0),
    httpOnly: true,
  });
  // res.status(200).redirect('/')
  res.status(204).json({
    status: 204,
    message: "Successfully Logged Out",
  });
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.body.userId;

    if (await User.findById(userId)) {
      await Todo.deleteMany({ user: userId });
      await User.findByIdAndDelete(userId);
      res.status(204).json({
        status: 204,
        message: "Successfully deleted",
      });
    } else {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
  } catch (err) {
    
    res.status(400).json({
      message: "Failed to delete.",
      error: err,
    });
  }
};

module.exports = {
  createUser,
  getUser,
  signin,
  signup,
  login,
  homepage,
  prodectedRoute,
  getUserTodoDetails,
  logout,
  deleteUser,
};
