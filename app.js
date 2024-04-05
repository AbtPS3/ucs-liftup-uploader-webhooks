const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const port = process.env.PORT;

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/webhooks", indexRouter);

// app.listen(port, () => {
//   console.log(` Webhooks server is running on port ${port}`);
// });

module.exports = app;
