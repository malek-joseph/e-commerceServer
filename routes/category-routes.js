const express = require("express");
const router = express.Router(); // Router is a method offered by express, and when invoked it creates the router constant

// We import the exports from the user controller, to utilize the logic that we stored there to keep this file clean
const {
  create,
  categoryById,
  read,
  update,
  remove,
  list 
} = require("../controllers/category-controller");
const {
  requireSignIn,
  isAuth,
  isAdmin,
} = require("../controllers/auth-controller");
const { userById } = require("../controllers/user-controller");

// .get is a method offered by express to handle the client's requests then route the app accordinlgy
// it's actually '/api/' but we already get it prefixed in the app.js file
// the validator is passed as a second argument
router.get("/category/:categoryId", read)
router.post("/category/create/:userId", requireSignIn, isAdmin, isAuth, create);
router.put("/category/:categoryId/:userId", requireSignIn, isAdmin, isAuth, update);
router.delete(
  "/category/:categoryId/:userId",
  requireSignIn,
  isAdmin,
  isAuth,
  remove
);
router.get("/categories", list);
 

router.param("categoryId", categoryById)
router.param("userId", userById); // userById populates the user and get's the userId and helps it handled as a param in the URL

module.exports = router; // the router object, that the Router function gave us, will handle all the logic regarding handling routes, and hence it's the object we want to export, to keep our programming modular
