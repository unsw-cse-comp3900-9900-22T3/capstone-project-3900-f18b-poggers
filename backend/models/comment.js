
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  userID: {
    type: String,
    required: true,
  },
  recipeID: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    required: true,
  },
  content:{
    type:String,
    required: true 
  }
});

module.exports = mongoose.model("Comment", commentSchema);
