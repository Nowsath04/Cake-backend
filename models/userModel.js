const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  userid: {
    type: String,
    required: true
  },

  nonce: String,

},
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("User", userSchema);

module.exports = userModel
