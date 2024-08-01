const mongoose = require("mongoose");
const { type } = require("os");

const userSchema = new mongoose.Schema({

  userid: {
    type: String
  },

  nonce: String,

  name: {
    type: String,

  },

  email: {
    type: String,
  },

  phoneno: {
    type: String,
  },

  dateofbirth: {
    type: String,
  },

},
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel
