const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;
const connect = require("./config/config.mongoose");
const PostRouter = require("./routers/post.router");

connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", PostRouter);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
