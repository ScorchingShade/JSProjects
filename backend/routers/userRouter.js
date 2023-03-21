const express = require("express");
const expressAsyncHandler =require("express-async-handler");
const {authenticate,generateToken} = require("../utils");
const {users} = require("../models/models.js");

const userRouter = express.Router()

// Create a new user
userRouter.post("/create", expressAsyncHandler(async(req, res) => {
    const { name, username, password } = req.body;
    if (!name || !username || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const user = {
      id: users.length + 1,
      name,
      username,
      password,
      token: "",
      cart_id: null,
      created_at: new Date(),
    };
  
     // check if user already exists
     const existingUser = users.find(u => u.username === username);
     if (existingUser) {
       return res.status(409).send('User already exists');
     }
  
    users.push(user);
    // Generate token and save to user
    const token = generateToken(user);
    user.token = token;
    return res.json({ token });
  }));
  
  // Login for existing user
  userRouter.post("/login", expressAsyncHandler(async(req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Generate token and save to user
    const token = generateToken(user);
    user.token = token;
    return res.json({ token });
  }));

  // List all users
  userRouter.get("/list", authenticate, expressAsyncHandler(async(req, res) => {
    res.status(200).send(users);
    }));


    module.exports=userRouter
      