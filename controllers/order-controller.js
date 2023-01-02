//----------------------------------------------------------------------------------[Requirements]---------
//----------------------------------------------------------------{Models}
const { Order, CartItem } = require("../models/order-model");
//--------------------------------------------------------------{Error Handler}
const { errorHandler } = require("../helpers/dbErrorHandler");

//-------------------------------------------------------------------------------------[Logic]---------
//-------------------------------------------------------{get order by id}
exports.orderById = (req, res, next, id) => {
  // we also need the id that we get form the route parameter
  Order.findById(id)
    // 'products.product' to get the product from the products array
    // "name price" to get the name and the price from the targeted product
    .populate("products.product", "name price")
    .exec((error, order) => {
      if (error || !order) {
        return res.status(400).json({ error: errorHandler(error) });
      }
      // if we found the order, we assign its value to the req.order
      req.order = order;
      next();
    });
};
//-------------------------------------------------------{create order}
exports.create = (req, res) => {
  // console.log('Order create',  req.body);
  //----------------------------------------------------------------{add user property}
  req.body.order.user = req.profile; // can log the req to check the value of req.profile
  //----------------------------------------------------------------{get order instance}
  const order = new Order(req.body.order);
  //----------------------------------------------------------{save order in DB and handle error}
  order.save((error, data) => {
    if (error) {
    }
    res.json(data);
  });
};
//-------------------------------------------------------{get all orders for a user}
exports.listOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name address")
    .sort("-created") // sorts by the created date
    .exec((error, orders) => {
      // .exec executes the callback function
      if (error) {
        return res.status(400).json({ error: errorHandler(error) });
      }
      res.json(orders);
    });
};
//-------------------------------------------------------{give frontend option to change status of the order}
exports.getStatusValues = (req, res) => {
  res.json(Order.schema.path("status").enumValues); // search how to use enums
};
//-------------------------------------------------------{update order status}
exports.updateOrderStatus = (req, res) => {
  //  we get the orderId and the status  in the body of the frontend request
  //  $set is a mongoose method that's used to update in the database
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (error, order) => {
      if (error) {
        return res.status(400).json({ error: errorHandler(error) });
      }
      res.json(order);
    }
  );
};
