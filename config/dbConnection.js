const mongoose = require("mongoose");

// Connect to MongoDB

const DbConnection = () => {
    try {
        mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
}

module.exports = DbConnection;