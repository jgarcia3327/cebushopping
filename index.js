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


/**
 * TEST
 */
// console.log("TEST");
// var torrentStream = require('torrent-stream');

// var engine = torrentStream('magnet:?xt=urn:btih:923AF83918215E6324E742AB16F985617A252BB5&dn=Assassin%27s%20Guild');

// engine.on('ready', function() {
// 	engine.files.forEach(function(file) {
// 		console.log('filename:', file.name);
//     if (file.name.indexOf('.mp4') < 0) return;
//     var stream = file.createReadStream();
// 		// stream is readable stream to containing the file content
//     console.log(stream);
// 	});
// });


app.listen(25281);