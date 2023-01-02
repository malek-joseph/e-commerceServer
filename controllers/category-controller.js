const categoryModel = require("../models/category-model");
const Category = require("../models/category-model"); // to get access to the dB, and search in it

const { errorHandler } = require("../helpers/dbErrorHandler");

exports.categoryById = (req, res, next, id) => {
  // we get the id from the route parameter
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Category doesn't exist!",
      });
    }
    // if there's no error finding the category, we store the category in the req.category to use it later on in the read middleware
    req.category = category;
    next(); // next is important here to refer to the next middleware to execute
  });
};

exports.create = (req, res) => {
  const category = new Category(req.body);
  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({ data });
  });
};

exports.read = (req, res, next) => {
  return res.json(req.category)
};

exports.update = (req, res, next) => {
  // when categoryId is sent in a param, categoryById is fired and stores the category of the id we want in req.category
  const category = req.category;
  category.name = req.body.name // a category has only the name property which we updated
  category.save((err, data) => {
    if (err) {
      res.status(400).json({
        error: errorHandler(err)
      })
    }
    res.json(data)
  })

}
exports.remove = (req, res, next) => {
  const category = req.category
  category.remove((err, data) => {
    if (err) {
      res.status(400).json({
        error: errorHandler(err)
      })
    }
    res.json({
      message: "category deleted!"
    })
  })
}
exports.list = (req, res, next) => {
  Category.find((err, data) => {
       if (err) {
         res.status(400).json({
           error: errorHandler(err),
         });
       }
    res.json(data)
   })
}
