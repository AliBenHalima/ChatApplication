const express = require("express");
const Auth = require("../Middleware/Auth");
const router = express.Router();
// const mongoose = require("mongoose");
const ChatroomModel = require("../Models/Chatroom");
const UserModel = require("../Models/User");

router.get("/All", async (req, res) => {
  ChatroomModel.find((err, documents) => {
    if (!err) {
      res.send(documents);
    } else {
      res.send("Error");
    }
  });
});

router.post("/Add", async (req, res) => {

  const chatroomExists = await ChatroomModel.findOne({ name:req.body.name });

  if (chatroomExists) return res.json({
    message: "Chatroom with that name already exists!",success:false
  });;
  

  const chatroom = new ChatroomModel({
    name:req.body.name
  });

  await chatroom.save();

  res.json({
    message: "Chatroom created!",success:true
  });
});

router.get("/chats/:room",async (req,res)=>{
  try{
    let results = await ChatroomModel.findOne({"name":req.params.room})
    res.send(results);
  }catch(e){
    res.status(500).send({message:e.message})
  }
})
router.get("/chatrooms",Auth,async (req,res)=>{
  try{
    console.log("req username is ",req.username)
    let results = await ChatroomModel.find({ users: { "$in" : [req.username]} });
    res.send(results);
  }catch(e){
    res.status(500).send({message:e.message})
  }
})

router.post("/AddUser", async (req, res) => {
  if (req.body.Currentroom && req.body.username) {
    let result = await UserModel.findOne({"Username":req.body.username });
    if(result){
      const add = await ChatroomModel.updateOne({"name":req.body.Currentroom},{"$addToSet":{
        "users":req.body.username
      }});
      if(add)
        res.json({
          status:
            `${req.body.username} has been addded`,success:true
        }); 
      } 
      else{
        res.send({status:`${req.body.username}Doesnt exist`,success:false})
            }
          }
      });

      router.get("/users/:Currentroom",async (req,res)=>{
        try{        
          let results = await ChatroomModel.findOne({"name":req.params.Currentroom})
          res.send(results);
        }catch(e){
          res.status(500).send({message:e.message})
        }
      })



module.exports = router;