const mongoose = require("mongoose");
// crypto is used to hash the password and is core node module
const crypto = require("crypto");
// we use the uuid to create an id in a dynamic way
const { v4: uuidv4 } = require("uuid"); // this is the proper way to handle uuid issue, it happens


const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, // this will make sure any white spaces before or after the string will be trimmed
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true, // this will make sure any white spaces before or after the string will be trimmed
      required: true,
      maxlength: 32,
      unique: true,
    },
    hashed_password: {
      // we store the the hashed password, we leave it as a value taken from the input, the virtual input, but when we store the date we store the hashed password
      type: String,
      required: true,
    },
    about: {
      type: String,
      trim: true,
    },
    salt: {
      // salt will be used later to generate the hashed password
      type: String,
    },
    role: {
      // this is the default role, to allow authorization later
      type: Number,
      default: 0,
    },
    history: {
      // those are the purchase history of a certain user
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
); // we add timestamps to add the created at and updated at

// virtual field
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv4();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// This is how we add methods to the userSchema
userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      // we learn how to use crypto in the npm documentation of crypto
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

module.exports = mongoose.model("User", userSchema);
