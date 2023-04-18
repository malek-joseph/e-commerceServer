const User = require('../models/user-model') 
const jwt = require('jsonwebtoken') // This creates the sign-in token
const { expressjwt: expressJwt } = require("express-jwt"); // For the authorization check 
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.signup = (req, res) => {
  console.log("req.body", req.body);
  const user = new User(req.body);
  // then we save the user in the dB, but sending a callback function as an argument, because the function we want to pass, has already arguments in them, so they must be written with parenthesis, which casues the original function to fire immediately, while we want it to fire at a certain time, and we handle this by passing the callback function in an arrow function
  user.save((error, user) => {
    if (error) {
      console.log(error);
      return res.status(400).json({
        error: errorHandler(error)
      })
    }
    // we set those values to undefined to avoid them send with the response
    user.hashed_password = undefined
    user.salt = undefined
    res.json({
      user
    })
  });
}


exports.signin = (req, res, next) => {
  // 1st we try to find the user using the email 
  const { email, password } = req.body
  User.findOne({ email: email }, (error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: "email doesn't exist, please try signup",
      });
    }
    // If we found a user, we wanna make sure the email and the password match
    // 1 create authenticate method in the user model
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: 'email and password mismatch'
      })
    }
    // 2 generate a signed token with user id and secret
    // sign is a method offered by jwt
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    // 3 presist the token and save it as 't' in a cookie with expiry date
    res.cookie('t', token, { expire: new Date() + 9999 })
    // 4 return a response to the front-end client, containing the token and the user 
    const { _id, name, email, role } = user
    
    return res.json({ token, user: { _id, email, name, role } });
  })
}

exports.signout = (req, res, next) => {
  res.clearCookie('t')  // we signing out by clearing the login token 
  res.json({message: 'logged out successfully!'})
}

exports.requireSignIn = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"], // added later
  userProperty: "auth"
});


// this middleware makes sure that if the user managed  to be signedIn, he still won't be able to access any other userId without being Authenticated, which means your Id is equal to the auth id 
exports.isAuth = (req, res, next) => {
  let user = req.profile && req.auth && req.profile._id == req.auth._id

  if (!user) {
    return res.status(403) // 403 unauthorized
      .json({
      error: "Access denied!"
    })
  }
  next()
}

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(403).json({error: "Admin resource! Access denied!"})
  }
  next()
}