
// auth-routes contains the routing, and dispatch the methods "the middleware functions" in the controllers folder.
//--------------------------------------------------[Inputs]
// [requiring express]
const express = require("express");
// [using express to create the router] Router is a method offered by express, and when invoked it creates the router constant
const router = express.Router();
//--------------------------------------------------
// [requiring authentication controllers]
const {
  userById,
  read,
  update,
  purchaseHistory,
} = require("../controllers/user-controller");
const {
  requireSignIn,
  isAuth,
  isAdmin,
} = require("../controllers/auth-controller");
//--------------------------------------------------[Logic]
router.get(
  "/secret/:userId",
  requireSignIn,
  isAuth,
  isAdmin,
  (req, res, next) => {
    res.json({
      user: req.profile, // we equaled req.profile with user in the user controller
    });
  }
);
// Read user profile and send to the frontend
router.get("/user/:userId", requireSignIn, isAuth, read);
//Update user profile and send the update to the frontend
router.put("/user/:userId", requireSignIn, isAuth, update);
// get purchase history
router.get("/orders/by/user/:userId", requireSignIn, isAuth, purchaseHistory);

//--------------------------------------------------
// we use the route parameter since we used :userId in the route
router.param("userId", userById);
//--------------------------------------------------[Output the results]
// the router object, that the Router function gave us, will handle all the logic regarding handling routes, and hence it's the object we want to export, to keep our programming modular
module.exports = router; 
