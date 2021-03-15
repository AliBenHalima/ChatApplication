var createError = require('http-errors');
var express = require('express');
var path = require('path');
const cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const http = require('http');
const FormatMessage = require('./Utils/message');
const { JoinUser,UserLeave,RoomUsers } = require('./Utils/users');
var UsersAuthentification = require('./routes/UsersAuthentification');
const Auth = require("./Middleware/Auth");
var Test = require('./routes/Test');
var chatrooms = require('./routes/Chatrooms');
const ChatroomModel = require("./Models/Chatroom");
var app = express();
const server = http.createServer(app);
const ChatBot= "ChatBot";

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

io.use(async(socket,next)=>{
  try{
  const token = socket.handshake.query.token;
   
  const Payload = await jwt.verify(token,"my-secret-token");
  socket.username = Payload.username;
  next();
  }catch(err){
    throw err
  }
});

io.on('connection', (socket) => {
  socket.on("JoinRoom",async ({Currentroom})=>{
    try{
      
      let result = await ChatroomModel.findOne({"name":Currentroom});
      if(!result){await ChatroomModel.create({"name":Currentroom,messages:[] }) }
      socket.join(Currentroom);
     const Data =JoinUser(socket.id,socket.username,Currentroom)

        socket.emit("joined",Currentroom);

        // socket.emit("message",FormatMessage(ChatBot,`: ${socket.username} welcome to  the chat`))
    // socket.broadcast.to(Currentroom).emit("message",FormatMessage(ChatBot,`: ${socket.username} has Joined the chat`));
    
      
    }catch(e){
      console.log(e);
    }
 
    // const user = JoinUser(socket.id,username,room)
  

    // socket.broadcast.to(socket.activeRoom).emit("message",FormatMessage(ChatBot,`: ${socket.username} has Joined the chat`));
    // io.to(socket.activeRoom).emit("roomUsers",{
    //   room_:socket.activeRoom,
    //   users_:RoomUsers(socket.activeRoom)
      
    // });
  });
  
    // socket.on("typing",()=>{
    //   socket.to(user.room).emit("typing","SOmeone is typing")
    // })
 
  

  
  
    socket.on("Chatmessage",async({message,Currentroom})=>{
      io.to(Currentroom).emit("message",FormatMessage(socket.username,message))
      
      console.log("message from chat is", `${message} ${Currentroom}`)
      try {
     await ChatroomModel.updateOne({"name":Currentroom},{"$push":{
        "messages": {username:socket.username,message:message}
      }});  
    
      
    }catch(e){
      console.log(e);
    }
   
    });

    
    socket.on("leave",async(Currentroom)=>{
      console.log("leaving room",Currentroom)
      socket.leave(Currentroom);
      io.to(Currentroom).emit("message",FormatMessage(ChatBot,`: ${socket.username} has Left the chat`));
      UserLeave(Currentroom,socket.username);

      console.log(`${socket.username} has lef the chat`);
    })

    socket.on("disconnect",()=>{
      // const user = UserLeave(socket.activeRoom,socket.username);
      
        // io.to(socket.activeRoom).emit("message",FormatMessage(ChatBot,`: ${socket.username} has Left the chat`));
        
        // io.to(socket.activeRoom).emit("roomUsers",{
        //   room:socket.activeRoom,
        //   users:RoomUsers(socket.activeRoom)
        // })
      
    
     
    });
  });















app.use(cors());
var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 
}

// const io= socketio(server);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/users",UsersAuthentification);
app.use("/chatroom",chatrooms);
app.use("/test",Auth,Test);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(express.static(__dirname + '/images'));




mongoose
  .connect(
    "mongodb+srv://Ali:mypassword@cluster0.jdfda.mongodb.net/<ChatApp>?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then((result) => {
    console.log("Connection successfully established");
    server.listen(3000);
  })
  .catch((err) => {
    console.log(err); 
  });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
