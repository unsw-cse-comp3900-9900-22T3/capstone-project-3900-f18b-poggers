const Recipe = require("../../models/recipe");
const User = require("../../models/user");
const Tag = require("../../models/tag.js");

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
      tags: args.recipeInput.tags,
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
        title: recipe.title,
        content: recipe.content,
        dateCreated: recipe.dateCreated.toISOString(),
        contributorUsername: authUser.username,
        numberLike: 0,
        listComments: [],
        tags: recipe.tags,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  getRecipeById: async (args) => {
    const recipe = await Recipe.findById(args.recipeID);

    const contributor = await User.findById(recipe.contributor._id);

    const sortedListTags = await Tag.find({
      _id: { $in: recipe.tags },
    }).sort({
      content: 1,
    });

    const listTagNames = (await sortedListTags).map((tags) => {
      return tags.content;
    });

    return {
      title: recipe.title,
      content: recipe.content,
      dateCreated: recipe.dateCreated.toISOString(),
      contributorUsername: contributor.username,
      numberLike: recipe.like.length,
      listComments: [],
      tags: listTagNames,
    };
  },

  getListRecipeByContributor: async (args) => {
    const user = await User.findOne({
      username: args.username,
    });

    if (!user) {
      throw new Error("User not found");
    }

    const sortedListRecipe = Recipe.find({
      _id: { $in: user.listRecipes },
    }).sort({ dateCreated: -1 });

    return (await sortedListRecipe).map((recipe) => {
      return {
        title: recipe.title,
        content: recipe.content,
        numberLike: recipe.like.length,
        tags: [],
      };
    });
  },

  getNewsFeed: async (req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }

    let newsFeed = [];
    const authUser = await User.findById(req.userId);

    for (const followUser of authUser.following) {
      const user = await User.findOne({
        username: followUser.username,
      });
      for (const recipeID of user.listRecipes) {
        const recipe = await Recipe.findById(recipeID);
        newsFeed.push(recipe);
      }
    }

    const sortedNewsFeed = newsFeed.sort({ dateCreated: -1 });
    return (await sortedNewsFeed).map((recipe) => {
      return {
        title: recipe.title,
        content: recipe.content,
        numberLike: recipe.like.length,
        tags: [],
      };
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
  },

  updateRecipe: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }

    const recipe = await Recipe.findById(args.recipeID);
    recipe.content = args.recipeInput.content;
    recipe.title = args.recipeInput.title;
    recipe.dateCreated = new Date(args.recipeInput.dateCreated);

    await recipe.save();
    return {
      title: recipe.title,
      content: recipe.content,
      dateCreated: recipe.dateCreated.toISOString(),
      contributorUsername: recipe.contributor.username,
      numberLike: recipe.like.length,
      listComments: [],
      tags: recipe.tags,
    }
  },

  deleteRecipe: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }

    const recipe = await Recipe.findById(args.recipeID);
    const user = await User.findById(recipe.contributor);
    user.listRecipes.pop(args.recipeID);
    await user.save();
    await recipe.remove();
    return true;
  },
};
