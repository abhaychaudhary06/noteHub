const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const authMiddleware = require("../middleware/auth");
router.use(authMiddleware);

router.get("/",async (req,res)=>{
    const notes = await Note.find({user:req.user._id});
    
    res.render('notes',{user:req.user,notes});
})
router.get("/add",(req,res)=>{
    res.render("addNote",{user:req.user,error:null});
})

router.post("/add",async (req,res)=>{
    const {title,content,category} = req.body;
    const note = new Note({
        user:req.user._id,
        title,
        content,
        category
    });
    await note.save();
    res.redirect('/notes');
})

router.get("/edit/:id",async (req,res)=>{
    const note = await Note.findOne({_id:req.params.id,
        user:req.user._id
    });
    if(!note){
        return res.redirect("/notes");
    }
    res.render("editNote",{user:req.user,note,error:null});
})

router.put("/edit/:id",async (req,res)=>{
    const {title,content,category} = req.body;
    await Note.findOneAndUpdate({
        _id:req.params.id},{title,content,category},{new:true});
        res.redirect("/notes");
})

router.delete("/:id",async (req,res) => {
    await Note.findOneAndDelete({_id:req.params.id});
    res.redirect("/notes");
})

module.exports = router;