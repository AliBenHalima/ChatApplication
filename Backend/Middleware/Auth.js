const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token,"my-secret-token");
    req.userId = decodedToken.userId;
     req.username=decodedToken.username;
    next();

  }  catch(err){
    res.send("Invalid Token");
}
};