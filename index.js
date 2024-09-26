require("dotenv").config();
const express = require("express");
const session = require("express-session");
const app = express();
app.use(session({
    secret:'Lidf8!0',
    resave: true,
    saveUninitialized: true
}));

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

const userRouter = require("./routes/users");
app.use("/users", userRouter);

const yifyRouter = require("./routes/yify");
app.use("/yify", yifyRouter);

app.listen(25281);