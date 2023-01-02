// formidable is a replacement to multer
const formidable = require("formidable");
// lodash is a 3rd party package
const _ = require("lodash");

const { errorHandler } = require("../helpers/dbErrorHandler");

const fs = require("fs"); // import filesystem

const Product = require("../models/product-model"); // to get access to the dB, and search in it

// Create C-RUD
exports.create = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded!",
      });
    }
    // check for all fields
    const { name, description, price, category, quantity, shipping } = fields; // formidable usage in the docs
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: "All fields are required!",
      });
    }
    let product = new Product(fields);
    // file.photo holds the photo sent either by FrontEnd or Postman
    if (files.photo) {
      // This is a validation on the size of the image by checking the size property returned with the files.photo object that we receive from the client
      // console.log("FILES PHOTO: ", files.photo);
      // This checks if the photo is bigger than 1mb it should throw this error
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb in size",
        });
      }
      product.photo.data = fs.readFileSync(files.photo.filepath); // change path to filepath
      product.photo.contentType = files.photo.mimetype; // change typt to mimetype
    }
    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};
// Aid controller to return the product of an Id we have
exports.productById = (req, res, next, id) => {
  // the id will be coming from the route parameter
  Product.findById(id).populate('category').exec((err, product) => {
    // when we search in Pruduct either we get an error or the product
    if (err || !product) {
      return res.status(400).json({
        error: "Product not found!",
      });
    }
    // if there's no error we want to set the product property in the request to the product value we got from the search by the id
    req.product = product;
    next(); // we call next at the end to refer to the next middleware to run
  });
};
// Read C-R-UD
exports.read = (req, res, next) => {
  req.product.photo = undefined; // we set the photo to undefined to avoid crashes when handling it. It will be handeled separately
  return res.json(req.product);
};
// Delete CRU-D
exports.remove = (req, res, next) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Product deleted successfully!",
      // , deletedProduct
    });
  });
};
// Update CR-U-D
exports.update = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded!",
      });
    }
    // check for all fields
    // We commented because while updating, not all the fields are requored to be updated
    // const { name, description, price, category, quantity, shipping } = fields; // formidable usage in the docs
    // if (
    //   !name ||
    //   !description ||
    //   !price ||
    //   !category ||
    //   !quantity ||
    //   !shipping
    // ) {
    //   return res.status(400).json({
    //     error: "All fields are required!",
    //   });
    // }
    let product = req.product;
    // lodash library helps by updating the product by extending the prev product and update it with the new fields
    product = _.extend(product, fields);

    // file.photo holds the photo sent either by FrontEnd or Postman
    if (files.photo) {
      // This is a validation on the size of the image by checking the size property returned with the files.photo object that we receive from the client
      // console.log("FILES PHOTO: ", files.photo);
      // This checks if the photo is bigger than 1mb it should throw this error
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb in size",
        });
      }
      product.photo.data = fs.readFileSync(files.photo.filepath); // change path to filepath
      product.photo.contentType = files.photo.mimetype; // change typt to mimetype
    }
    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};

// SELL/ ARRIVALS >> query parameters from the FrontEnd
// If no params were sent, all products will be returned
// by sell = /products?sortBy=sold&order=desc&limit=4
// by arrival = /products?sortBy=createdAt&order=desc&limit=4
// limit, is the limit of the number of results pulled from the query

exports.list = (req, res, next) => {
  let order = req.query.order ? req.query.order : "asc"; // to make the order asc by default if the Front End didn't send order
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id"; // to make the sortBy "_id" by default if the Front End didn't send a sortBy in query
  // to set def val to the limit, if the Front End didn't send a limit in query, we parse the limit to integer
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;
  Product.find()
    .select("-photo") // -photo means that we deselect photos, because it's large size, we handle it later seperately
    .populate("category") // populate is available thanks to setting a mongoose Object Id in the category model, get's the category of the product
    .sort([[sortBy, order]]) // this is how we sort
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        res.status(400).json({
          message: "No products found!",
        });
      }
      res.json(products);
    });
};
//--------------------------------------------------{list related products}
// gets the category of the productId >> then returns all the products in this category
exports.listRelated = (req, res, next) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;
  // &ne mongo expression that excludes the current product from the search
  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .populate("category", "_id name")
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        res.status(400).json({
          message: "Products not found!",
        });
      }
      res.json(products);
    });
};
//--------------------------------------------------{categories list}
exports.listCategories = (req, res, next) => {
  // .distinct returns an array with the categories used to create products
  Product.distinct("category", {}, (err, categories) => {
    if (err) {
      res.status(400).json({
        error: "Couldn't find categories!",
      });
    }
    res.json(categories);
  });
};
//--------------------------------------------------{Filters}
exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  Product.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found",
        });
      }
      res.json({
        size: data.length,
        data,
      });
    });
};
//--------------------------------------------------{attach photo to product}
// photo is a middleware that returns the photo of a speceific product
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};
//--------------------------------------------------{list search results}
exports.listSearch = (req, res) => {
  // create query object to hold search value and category value
  const query = {};
  // assign search value to query.name
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: "i" }; // i means lower case sensitivity, $regex and $options are mogoose built in
    // assign category value to query.category
    // if the user used a category, but didn't use All the categories
    if (req.query.category && req.query.category != "All") {
      query.category = req.query.category;
    }
    // find the product based on query object with 2 properties
    // search and category
    Product.find(query, (err, products) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(products);
    }).select("-photo"); // we deselect the photo from the search to speed up the search
  }
};
//--------------------------------------------------{decrease and increase stock and sold}
exports.decreaseQuantity = (req, res, next) => {
  let bulkOps = req.body.order.products.map((item) => {
    return {
      updateOne: {
        // updateOne is a mongoDB method
        filter: { _id: item._id }, // this is the filter to update a certain products quantity and sold
        update: { $inc: { quantity: -item.count, sold: +item.count } }, // $inc = increment in mongo
      },
    };
  });
  // bulkWrite is a method offered by mongoose
  // we know how to use it from the docs
  Product.bulkWrtie(bulkOps, {}, (error, products) => {
    if (error) {
      return res.status(400).json({
        error: "Couldn't update product",
      });
    }
    next(); // next is used to call the following middleware of the route
  });
};
