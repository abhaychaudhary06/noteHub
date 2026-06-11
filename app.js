const express        = require("express");
const app            = express();
const path           = require("path");
const db             = require("./db");
const methodOverride = require('method-override');
const cookieSession  = require('cookie-session'); // ← yeh
require("dotenv").config();

db();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

app.use(cookieSession({          // ← express-session ki jagah yeh
  name: 'session',
  secret: process.env.SESSION_SECRET || 'notehub_secret_123',
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 din
}));

app.use("/", require("./routes/authRoutes"));
app.use("/notes", require('./routes/noteRoutes'));

app.listen(process.env.PORT, () => {
  console.log(`Server run at http://localhost:${process.env.PORT}`);
});