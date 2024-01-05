const express = require("express");
const router = express();

//body-parser
const bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

//view engine
router.set("view engine", "ejs");
router.set("views", "./views/users");

const userController = require("../controllers/userController");

//home
router.get("/",userController.loadHome);

//login
router.get("/login",userController.loadLogin);
router.post("/login",userController.verifyLogin);

//signup
router.get("/signup",userController.loadSignup);
router.post("/signup", userController.insertUser);

//logout
router.get('/logout',userController.userLogout);

module.exports = router;
