const express =require("express");
const router =express.Router();
const {ensureAuthenticated } = require('../config/auth');
var userN="";
router.get('/',(req,res)=>res.render('welcome'));
//var userN = req.user.name;
//localStorage.setItem("userN", userN);
router.get('/dashboard',ensureAuthenticated,(req,res)=>res.render('dashboard',{
    name: req.user.name
}));
module.exports= router;
