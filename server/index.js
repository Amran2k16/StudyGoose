const express = require("express");
const next = require("next");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
// 1 - importing dependencies
const Auth0Strategy = require("passport-auth0");
const uid = require("uid-safe");

// require("../config/passport")(passport);
const db = require("../config/keys_dev").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB connected. Testing again...."))
  .catch(err => console.log(err));

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", function() {
//   // we're connected!
//   console.log("We are connected");
// });

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  server.use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: true
    })
  );

  server.use(passport.initialize());
  server.use(passport.session());

  server.use(express.json());
  const courses = require("./routes/courses");
  server.use("/api/courses", courses);
  const users = require("./routes/users");
  server.use("/users", users);

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
