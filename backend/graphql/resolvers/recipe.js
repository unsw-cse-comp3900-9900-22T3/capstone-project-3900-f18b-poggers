const Recipe = require("../../models/recipe");
const User = require("../../models/user");
const Tag = require("../../models/tag.js");
const Comment = require("../../models/comment.js");

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
      numberLike: 0,
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

      const sortedListTag = await Tag.find({_id: {$in: recipe.tags}}).sort({content: 1});
      const tagNames = sortedListTag.map((tag) => {return tag.content});

      return {
        _id: recipe._id,
        title: recipe.title,
        content: recipe.content,
        dateCreated: recipe.dateCreated.toISOString(),
        contributorUsername: authUser.username,
        numberLike: 0,
        listComments: [],
        tags: tagNames,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },


  getRecipeById: async (args) => {
    const recipe = await Recipe.findById(args.recipeID);
    const contributor = await User.findById(recipe.contributor);

    // query and sort list of tags
    const sortedListTag = await Tag.find({_id: {$in: recipe.tags}}).sort({content: 1});
    const tagNames = sortedListTag.map((tag) => {return tag.content});

    // query and sort list of comments
    const sortedListComment = await Comment.find({_id: {$in: recipe.listComments}}).sort({dateCreated: -1});
    const comments = sortedListComment.map((comment) => {
      return {
        userName: comment.userName,
        recipeID: comment.recipeID,
        content: comment.content,
        dateCreated: comment.dateCreated.toISOString(),
      }
    });

    return {
      _id: recipe._id,
      title: recipe.title,
      content: recipe.content,
      dateCreated: recipe.dateCreated.toISOString(),
      contributorUsername: contributor.username,
      numberLike: recipe.numberLike,
      listComments: comments,
      tags: tagNames,
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
    }).sort({ dateCreated: -1, numberLike: -1 });

    return (await sortedListRecipe).map(async (recipe) => {
      // query and sort list of tags
      const sortedListTag = await Tag.find({_id: {$in: recipe.tags}}).sort({content: 1});
      const tagNames = sortedListTag.map((tag) => {return tag.content});
      return {
        _id: recipe._id,
        contributorUsername: user.username,
        title: recipe.title,
        content: recipe.content,
        numberLike: recipe.numberLike,
        tags: tagNames,
      };
    });
  },

  getNewsFeed: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }

    const authUser = await User.findById(req.userId);
    const follwingUsers = await User.find({username: {$in: authUser.listFollowing}});

    let listRecipeID = [];
    for (const followingUser of follwingUsers) {
      for (const recipeID of followingUser.listRecipes) {
        listRecipeID.push(recipeID);
      }
    }

    const sortedNewsFeed = await Recipe.find({_id: {$in: listRecipeID}}).sort({dateCreated: -1, numberLike: -1});
    return sortedNewsFeed.map(async (recipe) => {
      // query and sort list of tags
      const sortedListTag = await Tag.find({_id: {$in: recipe.tags}}).sort({content: 1});
      const tagNames = sortedListTag.map((tag) => {return tag.content});

      const contributor = await User.findById(recipe.contributor);
      return {
        _id: recipe._id,
        contributorUsername: contributor.username,
        title: recipe.title,
        content: recipe.content,
        numberLike: recipe.numberLike,
        tags: tagNames,
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
      recipe.numberLike--;
    } else {
      recipe.like.push(authUser.username);
      recipe.numberLike++;
    }

    await recipe.save();

    return true;
  },

  updateRecipe: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }

    const recipe = await Recipe.findById(args.recipeID);
    recipe.dateCreated = new Date(args.recipeInput.dateCreated);
    recipe.title = args.recipeInput.title;
    recipe.content = args.recipeInput.content;
    recipe.tags = args.recipeInput.tags;

    await recipe.save();
    return true;
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

  
  isRecipeLiked: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const recipe = await Recipe.findById(args.recipeID);
    const authUser = await User.findById(req.userId);
  
    if (recipe.like.includes(authUser.username)) {
      return true 
    }
    return false; 
  },
  
};
