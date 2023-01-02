// auth-routes contains the routing, and dispatch the methods "the middleware functions" in the controllers folder.
//--------------------------------------------------[Inputs]
// [requiring express]
const express = require("express");
// [using express to create the router] Router is a method offered by express, and when invoked it creates the router constant
const router = express.Router();
//--------------------------------------------------
// [validate signup]
const { userSignupValidator } = require("../validator");
//--------------------------------------------------
// [importing authentication controllers]
const {
  signup,
  signin,
  signout,
  requireSignIn,
} = require("../controllers/auth-controller");
//--------------------------------------------------[Logic]
//[utilizing router] takes method, route, validators and middleware function to handle a client request.

// .get is a method offered by express.Router() to handle the client's requests then route the app accordinlgy
// it's actually '/api/' but we already get it prefixed in the app.js file
// the validator is passed as a second argument
router.post("/signup", userSignupValidator, signup);
router.post("/signin", signin);
router.get("/signout", signout);
router.get("/hello", requireSignIn, (req, res, next) => {
  // requireSignIn makes it required to be authenticated to be able to got to this route
  res.send("hello");
});

//--------------------------------------------------[Output the results]
// the router object, that the Router function gave us, will handle all the logic regarding handling routes, and hence it's the object we want to export, to keep our programming modular
module.exports = router; 
