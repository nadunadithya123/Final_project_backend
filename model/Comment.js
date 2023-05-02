const mongoose = require("mongoose");

const schema = mongoose.Schema;

const commentsSchema = new schema(
  {
    newsId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    comment: {
      type: String,
      require: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentsSchema);
