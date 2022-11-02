const Recipe = require("../../models/recipe");
const Comment = require("../../models/comment");
const User = require("../../models/user");

module.exports = {
  createComment: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const recipe = await Recipe.findById(args.recipeID);
    const user = await User.findById(req.userId);

    const comment = new Comment({
      content: args.content,
      userName: user.username,
      recipeID: args.recipeID,
      dateCreated: args.dateCreated,
    });

    try {
      recipe.listComments.push(comment);

      await comment.save();

      await recipe.save();
      return true;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
