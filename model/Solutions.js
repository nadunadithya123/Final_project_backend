const mongoose = require("mongoose");

const schema = mongoose.Schema;

const solutionSchema = new schema(
  {
    title: {
      type: String,
      require: true,
    },
    solution: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Solution", solutionSchema);
