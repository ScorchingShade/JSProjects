const express = require("express");
const expressAsyncHandler =require("express-async-handler");
const {authenticate} = require("../utils");
const {orders} = require("../models/models.js");

const orderRouter = express.Router()

//list all orders 
orderRouter.post("/list",authenticate,expressAsyncHandler(async (req,res)=>{
  const user = req.user;
  const order = orders.filter((o)=>o.user_id===user.id);
  if (!order) {
    return res.status(404).json({ message: "Orders not found" });
  }

  res.status(200).send(order)
}));

module.exports=orderRouter;
  