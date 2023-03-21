const express = require("express");
const bodyParser = require("body-parser");
const userRouter = require("./routers/userRouter.js");
const cartRouter = require("./routers/cartRouter.js");
const itemRouter = require("./routers/itemRouter.js");
const orderRouter = require("./routers/orderRouter.js");

const app = express();
// Middleware to parse request bodies
app.use(bodyParser.json());

//Router usage
app.use("/user", userRouter);
app.use("/item", itemRouter);
app.use("/cart", cartRouter);
app.use("/orders", orderRouter);

  // start the server
  const PORT = process.env.PORT || 3000;
// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

