const express=require('express');
const adminRouter=express();

//body-parser
const bodyParser = require("body-parser");
adminRouter.use(bodyParser.json());
adminRouter.use(bodyParser.urlencoded({ extended: true }));

//view engine
adminRouter.set("view engine", "ejs");
adminRouter.set("views", "./views/admin");

const adminController = require("../controllers/adminController");

//home
adminRouter.get('/',adminController.loadAdminHome);
adminRouter.get('/home',adminController.loadAdminHome);

//login
adminRouter.get('/login',adminController.loadAdminLogin);
adminRouter.post('/login',adminController.verifyAdminLogin);

// logout
adminRouter.get('/logout',adminController.adminLogout);

//userDetials
adminRouter.get('/userdetials',adminController.userDetials);

//addNewUser
adminRouter.get('/newuser',adminController.loadNewUser);
adminRouter.post('/newuser',adminController.addUser);

//editUser
adminRouter.get('/edituser',adminController.loadEditUser);
adminRouter.post('/edituser',adminController.updateUser);

//deleteUser
adminRouter.get('/deleteuser',adminController.deleteUser);

module.exports=adminRouter;