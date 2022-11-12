const Tag = require("../../models/tag");


module.exports = {
  getTags: async () => {
    const tagList = await Tag.find().sort();
    return tagList.map((tag) => {
      return {
        _id: tag._id,
        content: tag.content
      }
    });
  }
};
