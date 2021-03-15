const mongoose = require("mongoose");

const chatroomSchema = new mongoose.Schema({
    name :{type:String,required:true,unique : true,},
    users :{type:Array,required:false},
    messages:{type:Array,required:false},
    
});

module.exports = mongoose.model("Chatroom", chatroomSchema);