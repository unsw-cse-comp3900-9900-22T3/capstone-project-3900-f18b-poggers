const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    required: true,
  },
  contributor: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  numberLike: {
    type: Number,
    required: true,
  },
  like: [
    {
      type: String,
      required: false,
    },
  ],
  listComments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
});

module.exports = mongoose.model("Recipe", recipeSchema);
