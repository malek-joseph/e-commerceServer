// order-routes contains the routing, and dispatch the methods "the middleware functions" in the controllers folder.
//---------------------------------------------------------------------------[Requirements]
//------------------------------------------------------{Empress imports}
// [requiring express to create the route]
const express = require("express");
// [using express to create the router] Router is a method offered by express, and when invoked it creates the router constant
const router = express.Router();
//-------------------------------------------------------{Core imports}
//-------------------------------------/orders controllers/
//[required to run the route param]
const {
  create,
  listOrders,
  getStatusValues,
  orderById,
  updateOrderStatus,
} = require("../controllers/order-controller");
//----------------------------------/user controllers imports/
const {
  userById,
  addOrderToUserHistory,
} = require("../controllers/user-controller");
//--------------------------------/product controllers imports/
const { decreaseQuantity } = require("../controllers/product-controller");
//------------------------------------------------------------{Validators imports}
const {
  requireSignIn,
  isAuth,
  isAdmin,
} = require("../controllers/auth-controller");
//---------------------------------------------------------------------------[Routes]
//[utilizing router] takes method, route, validators and middleware function to handle a client request.
/*.get is a method offered by express.Router() to handle the client's requests then route the app accordinlgy
it's actually '/api/' but we already get it prefixed in the app.js file
the validator is passed as a second argument
we have the :userId in the route, because this route should only be availbale for the authenticated users.  */
//-----------------------------------------------------{Core routing}
//-----------------------------------{create order && update user history and product stock and sold}
router.post(
  "/order/create/:userId",
  requireSignIn,
  isAuth,
  addOrderToUserHistory, // before creating the order we want to add it to the purchase history
  decreaseQuantity, // decrease the available quantity of the product since it's purchased and hence reduced from the stock
  create
);
//-----------------------------------{get all orders and sent to front end}
router.get("/order/list/:userId", requireSignIn, isAuth, isAdmin, listOrders);
//-----------------------------------{give the option to change order status in the frontend}
router.get(
  "/order/status-values/:userId",
  requireSignIn,
  isAuth,
  isAdmin,
  getStatusValues
);
//-----------------------------------{update the status of an order}
router.put(
  "/order/:orderId/status/:userId",
  requireSignIn,
  isAuth,
  isAdmin,
  updateOrderStatus
);
//--------------------------------------------------{Params routing}
// we use the route parameter since we used :userId in the route
router.param("userId", userById);
router.param("orderId", orderById);
//------------------------------------- -----------------------------------[Return]
// the router object, that the Router function gave us, will handle all the logic regarding ha ndling routes, and hence it's the object we want to export, to keep our programming modular
module.exports = router;
