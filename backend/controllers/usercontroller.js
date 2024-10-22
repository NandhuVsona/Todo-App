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
        res.status(401).render("signin.ejs");
      }
    } else {
      return res.status(401).render("signin.ejs");
    }
  } catch (msg) {
    res.status(201).render("signin.ejs", {
      tostal: {
        msg: "Token is expried login to continue..",
        title: "JWT Error.!",
        bg: "rgba(255, 166, 0, 0.654)",
        color: "orange",
      },
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
      tostal: {
        msg: "Account created login to continue..",
        title: "Success",
        bg: "rgba(0, 254, 89, 0.47)",
        color: "rgb(34, 177, 21)",
      },
    });
  } catch (err) {
    res.status(400).render("signin.ejs", {
      tostal: {
        msg: err.message,
        title: "Failed",
        bg: " rgba(255, 0, 0, 0.336)",
        color: "red",
      },
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
      .render("signin.ejs", {
        tostal: {
          msg: "Incorrect email or password",
          color: "red",
          title: "404 Not found",
          bg: " rgba(255, 0, 0, 0.336)",
        },
      });
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
    return res
      .status(400)
      .render("signin.ejs", {
        tostal: {
          msg: "Your passowrd didn't match",
          color: "red",
          title: "Incorrect Password",
          bg: " rgba(255, 0, 0, 0.336)",
        },
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
