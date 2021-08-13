const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRouter = require("./routers/user");
const movieRouter = require("./routers/movie");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT;
app.use(express.json());

mongoose
  .connect(process.env.DB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("DB connection successful");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(userRouter);
app.use(movieRouter);
app.listen(port, () => {
  console.log("App is up on port:" + port);
});
