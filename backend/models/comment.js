const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  recipeID: {
    type: Schema.Types.ObjectId,
    ref: "Recipe",
  },
  dateCreated: {
    type: Date,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
