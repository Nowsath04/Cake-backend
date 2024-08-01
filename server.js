const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const DbConnection = require("./config/dbConnection");
dotenv.config({ path: path.join(__dirname, "config/config.env") });
const PORT = process.env.PORT || 4000;
const userRouter = require("./router/userRouter");
const ErrorMiddleware = require("./middleWare/error");
const cookieParser = require("cookie-parser");

// middleware
const app = express();

app.use(cookieParser())

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // specify your frontend origin here
  credentials: true, // allow credentials to be sent
}));
app.use("/api/user", userRouter);

// db connected
DbConnection();

app.listen(PORT, () => {
  console.log(`listening on ${PORT} on ${process.env.NODE_ENV}`);
});

// error handler middleware
app.use(ErrorMiddleware);
