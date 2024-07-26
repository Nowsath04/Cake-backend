const mongoose = require("mongoose");
const { type } = require("os");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter the name"],
  },
  password: {
    type: String,
    required: [true, "please enter a password"],
  },
  DOB: {
    required: true,
    type:String
  },
  email: {
    type: String,
    require: [true, "please enter a valid email"],
  },
  emailVarifications: {
    type:Boolean,
    default: false,
  }
});

const userModel=mongoose.model("User", userSchema);

module.exports = userModel
