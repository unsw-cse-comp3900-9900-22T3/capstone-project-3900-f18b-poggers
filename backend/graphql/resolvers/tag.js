const Tag = require("../../models/tag");


module.exports = {
  createTag: async (args) => {
    const tag = new Tag({
      content: args.content,
    });

    await tag.save();
    return true;
  },

  getTags: async () =>{
    const tagList = await Tag.find().sort();
    return tagList.map((tag)=>{
      return {
        _id: tag._id,
        content: tag.content
      } 
    });
  }
};
