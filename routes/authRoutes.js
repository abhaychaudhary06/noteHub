const User = require("../models/User");
const express = require("express");
const router = express.Router();
router.get("/",(req,res,next)=>{
    res.render("home");
})

router.get("/register",(req,res,next)=>{
    if(req.session.userId) return res.redirect("/dashboard");
    res.render('register',{user:null,error:null});
})
router.post("/register",async (req,res,next)=>{
    const {name,email,password} = req.body;
    const existUser = await User.findOne({email});
    if(existUser){
        return res.render('register',{
            user:null,
            error:'Emaail already exist'
        });
    }
    const newUser = new User({name,email,password});
    await newUser.save();
    req.session.userId = newUser._id;
    res.redirect("/dashboard");
})
router.get("/login",async (req,res) => {
    if(req.session.userId){
        return res.redirect('/dashboard');
    }
    res.render('login',{user:null,error:null});
});

router.post("/login",async (req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user){
        return res.render("login",{
            user:null,
            error:'No account found with this email.'
        });
    }
    if(user.password!==password){
        return res.render("login",{user:null,
            error:'Invalid password'
        });
    }
    req.session.userId = user._id;
    res.redirect('/dashboard');
})

router.delete("/logout",async (req,res)=>{
    req.session=null;
    res.redirect('/');
});
const Note = require('../models/Note');         // upar add karo
const authMiddleware = require('../middleware/auth'); // upar add karo

// ── GET /dashboard ──────────────────────────────────────
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {

    // ─────────────────────────────────────────
    // CONCEPT: Multiple queries ek saath
    // Promise.all() → dono queries parallel chalti
    // hain — ek ke khatam hone ka wait nahi karna
    // dusri ke liye. Faster!
    // ─────────────────────────────────────────
    const [totalNotes, pinnedNotes, notes] = await Promise.all([
      Note.countDocuments({ user: req.user._id }),
      Note.countDocuments({ user: req.user._id, isPinned: true }),
      Note.find({ user: req.user._id })
          .sort({ createdAt: -1 })
          .limit(3)   // sirf 3 recent notes
    ]);

    // Categories count karo
    const categories = await Note.distinct('category', { user: req.user._id });

    res.render('dashboard', {
      user: req.user,
      totalNotes,
      pinnedNotes,
      categoryCount: categories.length,
      notes
    });

  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// Profile route bhi add karo yahan
router.get('/profile', authMiddleware, (req, res) => {
  res.render('profile', { user: req.user });
});
module.exports = router;