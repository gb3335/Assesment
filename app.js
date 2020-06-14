const express =require("express");
const expressLayouts = require('express-ejs-layouts');
const mongoose= require('mongoose');
const flash =require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const socket = require("socket.io");

const app = express();

require('./config/passport')(passport);

const db= require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db, {useUnifiedTopology: true,useNewUrlParser : true})
.then(()=> console.log('Mongo DB Connected'))
.catch(err => console.log(err));

app.use(expressLayouts);
app.set('view engine','ejs');

//Bodyparser
app.use(express.urlencoded({extended: false}));

//Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,

  }));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

app.use((req,res,next)=> {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use(express.static("views"));

const PORT = process.env.PORT || 5000;

var server1 = app.listen(PORT, console.log(`Server started on Port ${PORT}`));
var io = socket(server1);

var usernames = {};
var imgadds = {};
var rooms = ["global", "chess", "video-games"];
io.on("connection", function(socket) {

  console.log("User connected to server.");

//socket
socket.on("createUser", function(username) {
    socket.username = username;
    usernames[username] = username;
    socket.currentRoom = "global";
    socket.join("global");
    socket.emit("updateChat", "INFO", "You have joined global room");
    socket.broadcast
      .to("global")
      .emit("updateChat", "INFO", username + " has joined global room");
    io.sockets.emit("updateUsers", usernames);
    socket.emit("updateRooms", rooms, "global");
  });

  socket.on("imgadd", function(data) {
    socket.data=data;
    imgadds[data]= data;
    socket.broadcast
      .to("global")
      .emit("updateChat", "INFO", data + " has joined global room");
    io.sockets.emit("imgsrc1", imgadds);
  });
  socket.on("sendMessage", function(data) {
    io.sockets
      .to(socket.currentRoom)
      .emit("updateChat", socket.username, data);
  });
  socket.on("createRoom", function(room) {
    if (room != null) {
      rooms.push(room);
      io.sockets.emit("updateRooms", rooms, null);
    }
  });
  socket.on("updateRooms", function(room) {
    socket.broadcast
      .to(socket.currentRoom)
      .emit("updateChat", "INFO", socket.username + " left room");
    socket.leave(socket.currentRoom);
    socket.currentRoom = room;
    socket.join(room);
    socket.emit("updateChat", "INFO", "You have joined " + room + " room");
    socket.broadcast
      .to(room)
      .emit("updateChat", "INFO", socket.username + " has joined " + room + " room");
  });
  socket.on("disconnect", function() {
    delete usernames[socket.username];
    io.sockets.emit("updateUsers", usernames);
    socket.broadcast.emit("updateChat", "INFO", socket.username + " has disconnected");
  });
});
