const { default: mongoose } = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true, // this will make sure any white spaces before or after the string will be trimmed
      required: true,
      maxlength: 32,
      unique: true
    },
    
  },
  { timestamps: true }
); // we add timestamps to add the created at and updated at


module.exports = mongoose.model("Category", categorySchema);
