const users=[]
const ChatroomModel = require("../Models/Chatroom");

const JoinUser = async(id,username,room)=>{
   
    const user={id,username,room}
  try{
    await ChatroomModel.updateOne({"name":room},{"$addToSet":{
        "users":username
      }});
  }catch(e){
      console.log(e)
  }
  
        
    return user
}
const UserLeave = async (room,username)=>{
    try{
    await ChatroomModel.updateOne({"name":room}, {$pull: { "users": username}});
    }catch(e){
        console.log(e)
    }
    return username

}
const RoomUsers =(room)=>{
    return users.filter(user=>user.room===room)
}

module.exports = {JoinUser,UserLeave,RoomUsers}