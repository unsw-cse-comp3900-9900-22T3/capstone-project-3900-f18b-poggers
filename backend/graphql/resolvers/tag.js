const Tag = require("../../models/tag");


module.exports = {
  getTags: async (req) =>{
    const tagList = Tag.find().sort();
    return (await tagList).map((tag)=>{
      return {
        _id : tag._id,
        content: tag.content
      } 
    });
  }
};
