// auth-routes contains the routing, and dispatch the methods "the middleware functions" in the controllers folder.
//---------------------------------------------------------------------------[Requirements]
// [requiring express to create the route]
const express = require("express");
// [using express to create the router] Router is a method offered by express, and when invoked it creates the router constant
const router = express.Router();
//--------------------------------------------------
//[required to run the route param]
const { userById } = require("../controllers/user-controller");
const {
  generateToken,
  processPayment,
} = require("../controllers/braintree-controller");
// [requiring authentication controllers to use as validators]
const { requireSignIn, isAuth } = require("../controllers/auth-controller");
//---------------------------------------------------------------------------[Logic]
//[utilizing router] takes method, route, validators and middleware function to handle a client request.
/*.get is a method offered by express.Router() to handle the client's requests then route the app accordinlgy
it's actually '/api/' but we already get it prefixed in the app.js file
the validator is passed as a second argument
we have the :userId in the route, because this route should only be availbale for the authenticated users.  */
// [Check out]
router.get("/braintree/getToken/:userId", requireSignIn, isAuth, generateToken);
// [Finalize the Payment]
router.post(
  "/braintree/payment/:userId",
  requireSignIn,
  isAuth,
  processPayment
);

//--------------------------------------------------
// we use the route parameter since we used :userId in the route
router.param("userId", userById);
//------------------------------------------------------------------------[Output the results]
// the router object, that the Router function gave us, will handle all the logic regarding handling routes, and hence it's the object we want to export, to keep our programming modular
module.exports = router;
