const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Name is required please provide"],
    trim: true,
    minlength: [4, "Username must be atleast 4 letters."],
  },
  emailAddress: {
    type: String,
    required: [true, "Email is required please provide"],
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required please provide"],
    minlength: [8, "Password must be atleast 8 letters."],
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  todos: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Todos",
      requied: true,
    },
  ],
});

userSchema.pre("save", async function (next) {
  //only run this function if the password actually modified
  if (!this.isModified("password")) return next();

  //Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});



userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("Users", userSchema);

module.exports = User;
