const express = require("express");
const router = express.Router(); // Router is a method offered by express, and when invoked it creates the router constant
// We import the exports from the user controller, to utilize the logic that we stored there to keep this file clean
const {
  create,
  productById,
  read,
  remove,
  update,
  list,
  listRelated,
  listCategories,
  listBySearch,
  listSearch,
  photo 
} = require("../controllers/product-controller");
const {
   requireSignIn,
  isAuth,
  isAdmin,
} = require("../controllers/auth-controller");
const { userById } = require("../controllers/user-controller");


// .get is a method offered by express to receive the client's get requests and send the response according to the middleware function logic
// it's actually '/api/...' but we already get it prefixed in the app.js file
router.get("/product/:productId", read);
// the validator is passed as a second argument, validators like requireSignIn or isAdmin
router.post("/product/create/:userId", requireSignIn, isAdmin, isAuth, create);
router.delete(
  "/product/:productId/:userId",
  requireSignIn,
  isAdmin,
  isAuth,
  remove
);
router.put(
  "/product/:productId/:userId",
  requireSignIn,
  isAdmin,
  isAuth,
  update
);
router.get("/products", list)
router.get('/products/search', listSearch)
router.get("/products/related/:productId", listRelated)
router.get("/products/categories", listCategories)
/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */
// route - make sure its post
router.post("/products/by/search", listBySearch);
// router.get("/products/search", listSearch);
router.get("/product/photo/:productId", photo)
// userById populates the user and get's the userId and helps it handled as a param in the URL
router.param("userId", userById);
router.param("productId", productById);

module.exports = router; // the router object, that the Router function gave us, will handle all the logic regarding handling routes, and hence it's the object we want to export, to keep our programming modular
