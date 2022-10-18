const Recipe = require("../../models/recipe");
const User = require("../../models/user");

module.exports = {
  createRecipe: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const authUser = await User.findById(req.userId);

    const recipe = new Recipe({
      title: args.recipeInput.title,
      content: args.recipeInput.content,
      dateCreated: new Date(args.recipeInput.dateCreated),
      like: [],
      contributor: req.userId,
    });

    try {
      if (!authUser) {
        throw new Error("User not found.");
      }

      await recipe.save();

      authUser.listRecipes.push(recipe);
      await authUser.save();

      return {
        content: recipe.content,
        title: recipe.title,
        dateCreated: recipe.dateCreated,
        contributorUsername: authUser.username,
        numberLike: 0,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  getRecipeById: async (args) => {
    const recipe = await Recipe.findById(args.recipeID);

    const contributor = await User.findById(recipe.contributor._id);

    return {
      content: recipe.content,
      title: recipe.title,
      dateCreated: recipe.dateCreated,
      contributorUsername: contributor.username,
      numberLike: recipe.like.length,
    };
  },

  getListRecipeByContributor: async (args) => {
    const user = await User.findOne({
      username: args.username,
    });

    if (!user) {
      throw new Error("User not found");
    }

    let recipes = [];

    user.listRecipes.forEach(async (n, i) => {
      const recipe = await Recipe.findOne({
        _id: n._id,
      });
    });

    //TODO  Return a list of recipes

    return [
      {
        content: "someContent",
        title: "someTitle",
        dateCreated: "somedate",
        contributorUsername: user.username,
        numberLike: 10,
      },
    ];
  },

  likeRecipe: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const authUser = await User.findById(req.userId);

    const recipe = await Recipe.findById(args.recipeID);

    if (recipe.like.includes(authUser.username)) {
      recipe.like.pop(authUser.username);
    } else {
      recipe.like.push(authUser.username);
    }

    await recipe.save();

    return true;
  },
};
