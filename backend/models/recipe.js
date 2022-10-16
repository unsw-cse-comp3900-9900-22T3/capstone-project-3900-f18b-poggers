const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const recipeSchema = new Schema({
  title: {
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
});

module.exports = mongoose.model("Recipe", recipeSchema);
