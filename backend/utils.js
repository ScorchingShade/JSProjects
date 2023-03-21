
const jwt = require("jsonwebtoken");
const {users} = require("./models/models.js")

// Helper function to generate JWT token
function generateToken(user) {
    return jwt.sign({ id: user.id }, "secret-key");
  }

// Helper function to authenticate requests
function authenticate(req, res, next) {
    if(!req.headers.authorization){
      return res.status(400).json({message:"Invalid Request" });
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }
    try {
      const decoded = jwt.verify(token, "secret-key");
      const user = users.find((u) => u.id === decoded.id);
      if (!user) {
        return res.status(401).json({ message: "Something went wrong, please log in with correct credentials again" });
      }
      req.user = user;
      next();
    } catch (error) {
      return res.status(409).json({ message: "Error while authenticating" });
    }
  }

  module.exports={
    authenticate,
    generateToken
  }