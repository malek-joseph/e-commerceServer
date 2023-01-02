const { default: mongoose } = require("mongoose");

const {ObjectId} = mongoose.Schema // this is how we d

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, // this will make sure any white spaces before or after the string will be trimmed
      required: true,
      maxlength: 32,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: true,
      maxlength: 2000,
    },
    category: {
      // Working on relationship between models
      type: ObjectId, // we want to connect this type with the correspondent category
      ref: 'Category', // This is how we refer to the Category model to complete the link using the ObjectId
      required: true
    },
    quantity: {
      type: Number
    },
    sold: {
      type: Number,
      default: 0
    },
    photo: {
      data: Buffer,
      contentType: String
    },
    shipping: {
      required: false,
      type: Boolean
    }
  },
  { timestamps: true }
); // we add timestamps to add the created at and updated at

module.exports = mongoose.model("Product", productSchema);
