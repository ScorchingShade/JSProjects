const express = require("express");
const {authenticate} = require("../utils");
const expressAsyncHandler =require("express-async-handler");
const {carts, cartItems, users, items, orders} = require("../models/models.js");

const cartRouter = express.Router()

// Add items to cart
cartRouter.post("/add", authenticate, expressAsyncHandler(async(req, res) => {
    const { item_id } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const user = Object.values(users).find((u) => u.token === token);
  
    if (user) {
      if (user.cart_id === null) {
        // Create a new cart for the user
        const cart_id = Object.keys(carts).length;
        carts[cart_id] = {
          id: cart_id+1,
          user_id: user.id,
          is_purchased: false,
          created_at: new Date(),
        };
        user.cart_id = cart_id+1;
      }
       // Get user's cart
    const cart = carts.find(c => c.user_id === user.id && !c.is_purchased);
  
    if (!cart) {
      res.status(404).send('No active cart found');
      return;
    }
  
  
    //Check if item exists to add in cart 
    const itemToAdd = items.find((i)=>i.id===item_id)
  
    if(!itemToAdd){
      res.status(404).json({ message: "Can't add item, item not found" });
      return;
    }
  
      // Add item to cart
      const cartItem = {
        cart_id: user.cart_id,
        item_id,
      };
      cartItems.push(cartItem);
      res.json({ message: "Item added to cart" });
    } else {
      res.status(401).send("Unauthorized");
    }
  }));


// Delete item from cart
cartRouter.post("/delete", expressAsyncHandler(async(req, res) => {
    const { item_id } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const user = Object.values(users).find((u) => u.token === token);
  
    if (user) {
      const cart = carts.find(c => c.user_id === user.id && !c.is_purchased);
  
      if (!cart) {
        res.status(404).send('No active cart found');
        return;
      }
  
      // Check if item exists in cart
      const itemIndex = cartItems.findIndex(ci => ci.cart_id === cart.id && ci.item_id === item_id);
      
      if (itemIndex === -1) {
        res.status(404).json({ message: "Can't delete item, item not found in cart" });
        return;
      }
  
      // Remove item from cart
      cartItems.splice(itemIndex, 1);
  
      if(cartItems.length<1){
        user.cart_id=null;
      }
      res.json({ message: "Item deleted from cart" });
    } else {
      res.status(401).send("Unauthorized");
    }
  }));


  // Convert cart to order
cartRouter.post("/:cartId/complete", expressAsyncHandler(async(req, res) => {
    const cart_id = parseInt(req.params.cartId);
    const token = req.headers.authorization.split(" ")[1];
    
    const user = Object.values(users).find((u) => u.token === token);


    const cart = carts.find((c)=>c.id===user.cart_id);
    const userCartItems = cartItems.filter(ci => ci.cart_id === cart.id);
    const itemsInCart = userCartItems.map(ci => items.find(item => item.id === ci.item_id));

    
    if (user && user.cart_id === cart_id && itemsInCart.length>0) {
      // Mark cart as purchased
      const cart = carts[cart_id-1];
      cart.is_purchased = true;
      // Create new order
      const order_id = Object.keys(orders).length;
      orders[order_id] = {
        id: order_id+1,
        cart_id: cart_id,
        user_id: user.id,
        created_at: new Date(),
      };


  
      // creates a new empty cart for user to purchase again
      const newCart_id = Object.keys(carts).length;
      carts[newCart_id] = {
        id: newCart_id+1,
        user_id: user.id,
        is_purchased: false,
        created_at: new Date(),
      };
      user.cart_id = newCart_id+1;
  
  
      res.status(200).json({ message: "Cart converted to order successfully" });
    } else {
      res.status(401).json({ message: "Unauthorized access" });
    }
  }));



  // List all cart items
cartRouter.post("/list", authenticate, expressAsyncHandler(async(req, res) => {
  
    const user = req.user;
    const cart = carts.find((c)=>c.id===user.cart_id);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
  
    const userCartItems = cartItems.filter(ci => ci.cart_id === cart.id);
    const itemsInCart = userCartItems.map(ci => items.find(item => item.id === ci.item_id));
  
    res.json({ cart, itemsInCart });
    res.status(200)
  }));
  

  module.exports=cartRouter