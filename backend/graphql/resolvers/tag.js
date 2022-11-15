const Tag = require("../../models/tag");


module.exports = {
  createTag: async (args) => {
    const tagName = args.tagName.charAt(0).toUpperCase() + args.tagName.slice(1);
    console.log(tagName);
    let tag = await Tag.findOne({ content: tagName });
    console.log(tag);
    if (tag) {
      throw new Error("Tag already exists");
    }

    tag = new Tag({
      content: tagName,
    });
    await tag.save();
    return true;
  },

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
