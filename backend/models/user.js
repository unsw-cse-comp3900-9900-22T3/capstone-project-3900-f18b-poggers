const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  listRecipes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
    },
  ],
  listFollower: [
    {
      type: String,
      required: false,
    },
  ],
  listFollowing: [
    {
      type: String,
      required: false,
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
