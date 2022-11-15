const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const recipeBookSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    required: true,
  },
  listRecipes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
    },
  ],
  contributor: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("RecipeBook", recipeBookSchema);
