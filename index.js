const express = require("express");
const dbConnect = require("./src/config/dataBase");
const cors = require("cors");
const app = express();
var cookieParser = require("cookie-parser");
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

const profileRouter = require("./src/routes/profile.route");
const requestRouter = require("./src/routes/request.route");
const userAuthRouter = require("./src/routes/userAuth.route");
const userRouter = require("./src/routes/user.route");

app.use("/", userAuthRouter);
app.use("/", requestRouter);
app.use("/", profileRouter);
app.use("/", userRouter);

dbConnect()
  .then(() => {
    console.log("Database Connection Established");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log("Error at connecting to database", err);
  });
