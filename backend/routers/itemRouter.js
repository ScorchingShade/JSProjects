const express = require("express");
const expressAsyncHandler =require("express-async-handler");
const {items} = require("../models/models.js");

const itemRouter = express.Router()

// List Items
itemRouter.get("/list", expressAsyncHandler(async(req, res) => {
    res.status(200).send(items);
  }));

// list items based on slug
  itemRouter.get("/list/:slug", expressAsyncHandler(async(req, res) => {

    const item = items.find((x)=>x.id==req.params.slug);

    if(item) {
      res.status(200).send(item);
      return;
    }
    res.status(404).send({ message: 'Product Not Found' });
    return;
  }));



  // Create a new item
  itemRouter.post("/create", expressAsyncHandler(async(req, res) => {
    const { name, url, price } = await req.body;
    if (!name) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    // had to add url and price because otherwise the app would look too boring, and what ecomm item does not have price or image!!
    const item = {
      id: items.length + 1,
      name,
      url,
      price,
      created_at: new Date(),
    };
    items.push(item);
    return res.status(201).json(item);
  }));



  module.exports=itemRouter