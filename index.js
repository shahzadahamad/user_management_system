const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/user_management_system");
// ------------------------

const nocache = require("nocache");
const path = require("path");
const express = require("express");
const app = express();
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");

//session
app.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000*80000000 },
  })
);

// nocache
app.use(nocache());

// static file
app.use(express.static(path.join(__dirname, "public")));

// for user routes
const router = require("./routes/userRoute");
app.use("/", router);

// for admin routes
const adminRouter = require("./routes/adminRoute");
app.use("/admin", adminRouter);

//error
app.set("view engine", "ejs");
app.set("views", "./views/error");

// otherPage
app.use((req, res, next) => {
  res.status(404);
  res.render("error");
  next();
});

app.listen(3000, () => {
  console.log("Server running on 3000 : http://localhost:3000");
});