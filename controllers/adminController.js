const Admin = require("../models/adminModel");
const User = require('../models/userModel');
const bcrypt = require("bcrypt");

//hash password
const securePassword = async (password) => {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  } catch (error) {
    console.log(error.message);
  }
};

//home 
const loadAdminHome=async(req,res)=>{
  try{
    const adminData=await Admin.findOne({_id:req.session.admin_id});
    if(adminData){
      res.render('adminhome',{admin:adminData});
    }else{
      res.redirect('/admin/login');
    }
  }catch(error){
    console.log(error.message);
  }
};

// login get
const loadAdminLogin = async (req, res) => {
  try {
     if(req.session.admin_id){
      res.redirect('/admin');
    }else{
      if(req.session.passError){
        req.session.passError=false;
        res.render("adminlogin", { message: "Invalied Password" });
      }else if(req.session.Invalied){
        req.session.Invalied=false;
        res.render("adminlogin", { message: "Invalied" });
      }else{
        res.render('adminlogin');
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

//login post
const verifyAdminLogin = async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const adminData = await Admin.findOne({ username: username });

    if (adminData) {
      const isPasswordMatch = await bcrypt.compare(password, adminData.password);
      if (isPasswordMatch) {
          req.session.admin_id = adminData._id;
          res.redirect('/admin');
      } else {
        req.session.passError=true;
        res.redirect('/admin/login');
      }
    } else {
      req.session.Invalied=true;
      res.redirect('/admin/login');
    }
  } catch (error) {
    console.log(error.message);
  }
};

//userDetials
const userDetials=async(req,res)=>{
  try{
    if(req.session.admin_id){
      const userData=await User.find({});
      res.render('userdetials',{users:userData});
    }else{
      res.redirect('/admin/login');
    }
  }catch(error){
    console.log(error.message);
  }
};

//AddNewUser get
const loadNewUser=async(req,res)=>{
  try{
    if(req.session.admin_id){
      if(req.session.adduser1){
        req.session.adduser1=false;
        res.render('newuser',{message1:'This email already taken'});
      }else if(req.session.adduser2){
        req.session.adduser2=false;
        res.render('newuser',{message:"User Added"});
      }else{
        res.render('newuser');
      }
    }else{
      res.redirect('/admin/login');
    }
  }catch(error){
    console.log(error.message);
  }
};

//AddNewUser post
const addUser=async(req,res)=>{
  try{
    const spassword = await securePassword(req.body.password);
    const user = new User({
      firstname: req.body.fname,
      lastname: req.body.lname,
      email: req.body.email,
      mobile: req.body.mobile,
      password: spassword,
    });

    const existingUser = await User.findOne({ email: user.email });
    // const userData= await user.save();
    if(existingUser){
      req.session.adduser1=true;
      res.redirect('/admin/newuser')
    }else{
      const userData = await User.insertMany(user);
      req.session.adduser2=true;
      res.redirect('/admin/newuser')
    }
  }catch(error){
    console.log(error.message);
  }
};

//loadEditUser
const loadEditUser=async(req,res)=>{
  try{
    if(req.session.admin_id){
      const id=req.query.id;
      const userData= await User.findById({_id:id});
      if(userData){
        res.render('edituser',{user:userData});
      }else{
        res.redirect('/admin/userdetials');
      }
    }else{
      res.redirect('/admin/login');
    }
  }catch(error){
    console.log(error.message);
  }
};

//updateUser
const updateUser=async (req,res)=>{
  try{
    const userData=await User.findByIdAndUpdate({_id:req.body.id},{$set:{firstname:req.body.fname,lastname:req.body.lname,email:req.body.email,mobile:req.body.mobile}});
    res.redirect('/admin/userdetials');
  }catch(error){
    console.log(error.message);
  }
};

//deleteUser
const deleteUser=async(req,res)=>{
  try{
    const id=req.query.id;
    const userData=await User.deleteOne({_id:id});
    res.redirect('/admin/userdetials');
  }catch(error){
    console.log(error.message);
  }
};

// admin logout
const adminLogout=async(req,res)=>{
  try{
    req.session.admin_id=null;
    res.redirect('/admin');
  }catch(error){
    console.log(error.message);
  }
};

module.exports={
  loadAdminLogin,
  verifyAdminLogin,
  adminLogout,
  loadAdminHome,
  userDetials,
  loadNewUser,
  addUser,
  loadEditUser,
  updateUser,
  deleteUser,
};