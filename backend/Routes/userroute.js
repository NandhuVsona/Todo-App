const express = require("express");
const router = express.Router();

const {
  createUser,
  getUser,
  signup,
  signin,homepage,
  login,
  prodectedRoute,
  getUserTodoDetails,
  logout,
  deleteUser,
} = require("../controllers/usercontroller");

router.route("/").get(prodectedRoute,homepage).post(createUser).delete(prodectedRoute,deleteUser)
router.route("/home").post(login)
router.route("/signup").get(signup)
router.route("/signin").get(signin)
router.route("/logout").post(prodectedRoute,logout)
router.route("/api/v1/user/:id").get(prodectedRoute,getUser)
router.route("/api/v1/user/todos/details/:id").get(prodectedRoute,getUserTodoDetails);

module.exports = router;
