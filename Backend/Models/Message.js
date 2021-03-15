const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    message :{type:String,required:true},
    user :{type: mongoose.Schema.Types.ObjectId,ref:'User', required: true },
    chatrooms:{type: mongoose.Schema.Types.ObjectId,ref:'Chatroom', required: true } 

});

module.exports = mongoose.model("Message", MessageSchema);