const express = require("express");
const router = express.Router();
const UserModel = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Auth = require("../Middleware/Auth");


router.get("/", (req, res) => {
  UserModel.find((err, documents) => {
    if (!err) {
      res.send(documents);
    } else {
      res.send("Error");
    }
  });
});

module.exports = router;