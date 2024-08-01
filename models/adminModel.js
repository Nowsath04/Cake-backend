const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter a name"],
  },
  email: {
    type: String,
    required: [true, "please enter your email address"],
  },
  password: {
    type: String,
    required: [true, "please enter a password"],
  },
  role: {
    type: String,
    default: "admin",
  },
});

const adminModel = mongoose.model("Admin", AdminSchema);
module.exports = adminModel;
