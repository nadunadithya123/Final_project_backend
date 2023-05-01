const mongoose = require("mongoose");

const schema = mongoose.Schema;

const userSchema = new schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      minLength: 8,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
