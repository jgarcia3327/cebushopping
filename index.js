const express = require("express");
const app = express();

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// app.enable('trust proxy');
// console.log(app.get('trust proxy'));

// app.use(logger)

// app.get("/", logger, logger, (req, res) => {
//     console.log("Here")
//     // res.status(500).json({ error:"500", message:"Test 500" })
//     // res.download("server.js")
//     // res.json({message:"Hi"})
//     res.render('index', { text: "World" })
// })

const userRouter = require("./routes/users");
app.use("/users", userRouter);

const yifyRouter = require("./routes/yify");
app.use("/yify", yifyRouter);

// function logger(req, res, next) {
//     console.log(req.originalUrl)
//     next()
// }

app.listen(25281);