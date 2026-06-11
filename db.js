const mongoose = require("mongoose");
const db = async ()=>{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MONGODB CONNECT");
}
module.exports = db;