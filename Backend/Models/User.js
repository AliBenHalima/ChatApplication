const mongoose = require('mongoose');

const userSchema=new mongoose.Schema({
    Username :{type:String,required:true,unique : true},
    Email  :{type:String,required:true},
    Password :{type:String,required:true},
    chatrooms :{type:Array,required:false},
    });

    module.exports = mongoose.model('User',userSchema);