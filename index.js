const EXPRESS = require("express");
const dotenv = require("dotenv");
dotenv.config();
const LOGGER = require("morgan");
const CORS = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const APP = EXPRESS();
const PORT = process.env.PORT || 3011;

const indexRouter = require("./routes/index");

// App Configuration Entries
APP.disable("x-powered-by");
APP.use(CORS());
APP.use(EXPRESS.urlencoded({ extended: true }));
APP.use(LOGGER("dev"));
APP.use(EXPRESS.json());
APP.use(cookieParser());
APP.use(EXPRESS.static(path.join(__dirname, "public")));

APP.use("/api/v1/webhooks", indexRouter);

APP.on("error", onError);

APP.listen(PORT, () => {
  console.log("Webooks server is up on port: " + PORT);
});

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
    // break;
    default:
      throw error;
  }
}
