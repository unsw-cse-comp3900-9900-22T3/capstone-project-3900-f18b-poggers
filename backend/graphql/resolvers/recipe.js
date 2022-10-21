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
        dateCreated: recipe.dateCreated.toISOString(),
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

    const sortedListRecipe = Recipe.find({_id: {$in: user.listRecipes}}).sort({dateCreated: -1});
    
    return (await sortedListRecipe).map((recipe) => {
      return {
        content: recipe.content,
        title: recipe.title,
        dateCreated: recipe.dateCreated.toISOString(),
        contributorUsername: user.username,
        numberLike: recipe.like.length,
      } 
    });
  },

  getNewsFeed: async (req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }

    let newsFeed = [];
    const authUser = await User.findById(req.userId);

    for(const followUser of authUser.following) {
      const user = await User.findOne({
        username: followUser.username,
      })
      for (const recipeID of user.listRecipes) {
        const recipe = await Recipe.findById(recipeID);
        newsFeed.push(recipe);
      }
    }

    const sortedNewsFeed = newsFeed.sort({dateCreated: -1});
    return (await sortedNewsFeed).map((recipe) => {
      return {
        content: recipe.content,
        title: recipe.title,
        dateCreated: recipe.dateCreated.toISOString(),
        contributorUsername: recipe.contributor.username,
        numberLike: recipe.like.length,
      }
    });
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
  }
};
