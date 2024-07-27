const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  name: {
    required: [true, "please enter a name"],
  },
  email: {
    required: [true, "please enter your email address"],
    type: String,
  },
  pasworrd: {
    required: [true, "please enter a password"],
    type: String,
  },
  role: {
    type: String,
    default: "admin",
  },
});

const adminModel = mongoose.model("Admin", AdminSchema);
module.exports = adminModel;
