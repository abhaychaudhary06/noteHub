const User = require("../models/User");
const auth = async (req,res,next)=>{
    if(!req.session.userId){
        return res.redirect('/login');
    }
        const user = await User.findById(req.session.userId);
        if(!user){
            req.session = null;
            return res.redirect("/login");
        }
        req.user = user;
        next();
}
module.exports = auth;