//---------------------------------------------------------------------------[Requirements]
//--------------------------------------------------{User model}
const { errorHandler } = require("../helpers/dbErrorHandler");
const { Order } = require("../models/order-model");
const User = require("../models/user-model"); // to get access to the dB, and search in it
//---------------------------------------------------------------------------[Logic]
//--------------------------------------------------{get the user by id}
// This middleware runs automatically when there's a userId passed in the params and it assigns the user found by id to req.profile
exports.userById = (req, res, next, id) => {
  // the id will be coming from the route parameter
  // the .exec is a JS method that checks and return for exact match, otherwise will return null
  // it takes a callback function as a parameter, so that we can pass arguments to the callback function
  console.log(id);
    // User.findById(id).exec((err, user) => {
    //   if (err || !user) {
    //     return res.status(400).json({
    //       error: "User not found",
    //     });
    //   }
    //   // but if we found the user, we add it to the req.profile >> convention decided by the author to name ot profile
    //   req.profile = user;
    //   next();
    // });
  User.findById(id, function (err, user) {
    if (err || !user) {
      console.log('hello');
      return res.status(400).json({
        error: "Error happened while searching for the user",
      });
    } else {
      console.log("Result : ", user);
      req.profile = user;
      next();
    }
  });
};
//--------------------------------------------------{define the req.profile}
exports.read = (req, res) => {
  // We just want to exclude the hashed password and the salt from the profile we send via json
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  console.log(req.profile);
  return res.json(req.profile);
};
//--------------------------------------------------{update user}
exports.update = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true }, // this updates the values of the user
    (err, user) => {
      if (err) {
        res.json({
          error: "You're not authorized to do this action!",
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;

      res.json(user);
    }
  );
};
//--------------------------------------------------{set order history for the user}
exports.addOrderToUserHistory = (req, res, next) => {
  let history = [];
  req.body.order.products.forEach((item) => {
    history.push({
      _id: item._id,
      name: item.name,
      description: item.description,
      category: item.category,
      quantity: item.count,
      transaction_id: req.body.order.transaction_id,
      amount: req.body.order.amount,
    });
  });
  // to retrieve the updated user history and send it as json again, we use
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { history: history } },
    { new: true },
    (error, data) => {
      if (error) {
        return res.status(400).json({
          error: "Couldn't update user's purchase history",
        });
      }
      next(); // once the update is done, we can run this callback function to execute something
    }
  );
};

exports.purchaseHistory = (req, res) => {
  Order.find({user: req.profile._id})
  .populate('user', '_id name')
  .sort('-created')
    .exec((error, orders) => {
      if (error) {
        return res.status(400).json({
          error: errorHandler(error)
        })
      }
      res.json(orders )
    
  })
}
