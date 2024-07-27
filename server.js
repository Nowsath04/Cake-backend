const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const DbConnection = require("./config/dbConnection");
dotenv.config({ path: path.join(__dirname, "config/config.env") });
const PORT = process.env.PORT || 4000;
const userRouter=require("./router/userRouter")
const adminRouter=require("./router/AdminRouter")
// middleware
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/user",userRouter)
app.use("/api/admin",adminRouter)
// db connected
DbConnection();
app.listen(PORT, () => {
  console.log(`listening on ${PORT} on ${process.env.NODE_ENV}`);
});
