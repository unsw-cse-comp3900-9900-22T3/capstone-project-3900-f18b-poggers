const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tagSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Tag", tagSchema);
