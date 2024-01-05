const { TopologyDescription } = require("mongodb");
const User = require("../models/userModel");
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

//signup get
const loadSignup = async (req, res) => {
  try {
    if(req.session.user_id){
      res.redirect('/');
    }else{
       if(req.session.taken){
        req.session.taken=false;
        res.render("signup", { message: "This email already taken" });
      }else if(req.session.successfully){
        req.session.successfully=false;
        res.render("signup", { message1: "Successfully SignUp" });
      }else if(req.session.cpPass){
        req.session.cpPass=false;
        res.render("signup",{message:"Confirm Password Invalid"});
      }else{
        res.render('signup');
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

//sign up post
const insertUser = async (req, res) => {
  try {
    const user = {
      firstname: req.body.fname,
      lastname: req.body.lname,
      email: req.body.email,
      mobile: req.body.mobile,
      password: req.body.password,
      cpassword: req.body.cpassword,
    };

    const existingUser = await User.findOne({ email: user.email });

    if (existingUser) {
      req.session.taken=true;
      res.redirect('/signup');
    } else {
      if(user.password==user.cpassword){
        const spassword = await securePassword(req.body.password);
        user.password=spassword;
        const userData = await User.insertMany(user);
        req.session.successfully=true;
        res.redirect('/signup');
      }else{
        req.session.cpPass=true;
        res.redirect('/signup');
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

//login get
const loadLogin = async (req, res) => {
  try {
    if(req.session.user_id){
      res.redirect('/');
    }else{
      if(req.session.passError){
        req.session.passError=false;
        res.render("login", { message: "Invalied Password" });
      }else if(req.session.alreadyTaken){
        req.session.alreadyTaken=false;
        res.render("login", { message: "This email didn't signup yet" });
      }else{
        res.render('login'); 
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

//login post
const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email });

    if (userData) {
      const isPasswordMatch = await bcrypt.compare(password, userData.password);
      if (isPasswordMatch) {
          req.session.user_id = userData._id;
          res.redirect('/');
      } else {
        req.session.passError=true;
        res.redirect('/login');
      }
    } else {
      req.session.alreadyTaken=true;
      res.redirect('/login');
    }
  } catch (error) {
    console.log(error.message);
  }
};

//home 
const loadHome= async (req,res)=>{
  try{
    const userData= await User.findOne({_id:req.session.user_id});
    if(userData){
      res.render('home',{user:userData});
    }else{
      req.session.user_id=null;
      res.redirect('/login');
    }
  }catch(error){
    console.log(error.message);
  }
};

//user logout 
const userLogout=async(req,res)=>{
  try{
    req.session.user_id=null;
    res.redirect('/');
  }catch(error){
    console.log(error.message);
  }
};

module.exports = {
  loadSignup,
  insertUser,
  loadLogin,
  verifyLogin,
  loadHome,
  userLogout,
};
