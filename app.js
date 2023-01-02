/*  [app.js] requires the main routes, and main tools, we get app 
from express and use it on the routes, and the tools to form the 
connection between the frontend on one hand and the dataBase on 
the other then run the server or a specific port */
//-------------------------------------------------------------------------------[Requirements]
//-----------------------------------------------{Express imports}
// [Express require] && [Express used to generate app]
const express = require("express");
const app = express();
// [DataBase Mongoose require]
const mongoose = require("mongoose");
//[requiring .env] && [Run config() to make .env accessable]
const dotenv = require("dotenv");
dotenv.config();
//[Express-Validator]
const expressValidator = require("express-validator");
//-----------------------------------------------{Tools imports}
// [requiring Tools and helpers]
/* npm i body-parser morgan cookie-parser
 >> morgan is good for development,
  since it shows the routes movements in the console */
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser"); // we use it to save the user credentials in a cookie
const morgan = require("morgan");
const cors = require("cors");
//-----------------------------------------------{Routes imports}
const authRoutes = require("./routes/auth-routes");
const userRoutes = require("./routes/user-routes");
const categoryRoutes = require("./routes/category-routes");
const productRoutes = require("./routes/product-routes");
const braintreeRoutes = require("./routes/braintree-routes");
const orderRoutes = require("./routes/order-routes");
//------------------------------------------------------------------------------------[Logic]
//[Connecting to Database] && [Handling possible errors]
/* [Warning] The user of MongoDB will not work unless you 
recently change the passwrod of the user from Mongo Atlas */
  mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    
    /*  useNewUrlParser , useUnifiedTopology , useFindAndModify , and useCreateIndex are no longer supported options. Mongoose 6 always behaves as if useNewUrlParser , useUnifiedTopology , and useCreateIndex are true , and useFindAndModify is false .
    useNewUrlParser: true,npm version mongoose.
    useCreateIndex: true, */
  })
  // we get the promise response in .then() function
  .then(() => console.log("DB Connected"));
mongoose.connection.on("error", (err) => {
  console.log(`DB connection error: ${err.message}`);
});
//-------------------------------------------
// [Tools MIDDLEWARES]
// we know how to use morgan, from the morgan docs
app.use(morgan("dev"));
// that's how we extract the json data from the request body
app.use(bodyParser.json());
/* Saves data in cookies, it makes the website remember some 
informaion about you, to help you better in the next visit. */
app.use(cookieParser());
// this is the middleware responsible for validating the user creation
app.use(expressValidator());
// we used cors as middleware on the app to avoid cross origin errors
// And this is how the API will be able to handle request coming from different origin >>namely requests from the Front End
app.use(cors({ origin: "*" }));
app.use(cors());
//--------------------------------------------------
// [Routes/ middlewares]
// We should put /api prefixed with all routes and this is the convention
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", braintreeRoutes);
app.use("/api", orderRoutes);
//--------------------------------------------------
// [listening to the port]
// retrieving the port from the .env file or 8000 as fallback
const port = process.env.PORT || 8000;
// listening to the port and running a callback function to do an action after the server is created
app.listen(port, () => {
  console.log(`listening to port ${port}`);
});
