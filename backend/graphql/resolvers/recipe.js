const Recipe = require("../../models/recipe");
const User = require("../../models/user");
const Tag = require("../../models/tag.js");
const Comment = require("../../models/comment.js");

// helper functions

// get tag names from list of tag ids
// tag names sorted by alphabetical order
const getTagNames = async (listTagID) => {
  const sortedListTag = await Tag.find({
    _id: { $in: listTagID }
  }).sort({
    content: 1,
  });
  const tagNames = sortedListTag.map((tag) => {
    return tag.content;
  });
  return tagNames;
}

// get comment info from list of comment ids
// comments sorted by date created
const getComments = async (listCommentID) => {
  const sortedListComment = await Comment.find({
    _id: { $in: listCommentID }
  }).sort({
    dateCreated: -1
  });
  const comments = sortedListComment.map((comment) => {
    return {
      userName: comment.userName,
      recipeID: comment.recipeID,
      content: comment.content,
      dateCreated: comment.dateCreated.toISOString(),
    };
  });
  return comments;
}

// convert recipe object from database to data return to frontend
const toRecipeDetail = async (recipe, username) => {
  return {
    _id: recipe._id,
    image: recipe.image,
    contributorUsername: username,
    title: recipe.title,
    content: recipe.content,
    numberLike: recipe.numberLike,
    tags: await getTagNames(recipe.tags),
    dateCreated: recipe.dateCreated.toISOString(),
    listComments: await getComments(recipe.listComments),
  };
}

// convert recipe object from database to data return to frontend
const toRecipeThumbnail = async (recipe, username) => {
  return {
    _id: recipe._id,
    image: recipe.image,
    contributorUsername: username,
    title: recipe.title,
    content: recipe.content,
    numberLike: recipe.numberLike,
    tags: await getTagNames(recipe.tags),
  };
}

// end of helper functions

module.exports = {
  // create a new recipe by a logged in user
  createRecipe: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const authUser = await User.findById(req.userId);

    const recipe = new Recipe({
      title: args.recipeInput.title,
      content: args.recipeInput.content,
      image: args.recipeInput.image,
      dateCreated: new Date(args.recipeInput.dateCreated),
      numberLike: 0,
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

      return await toRecipeDetail(recipe, authUser.username);
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  // update recipe content by a logged in user
  updateRecipe: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }

    const recipe = await Recipe.findById(args.recipeID);
    recipe.dateCreated = new Date(args.recipeInput.dateCreated);
    recipe.title = args.recipeInput.title;
    recipe.content = args.recipeInput.content;
    recipe.tags = args.recipeInput.tags;
    recipe.image = args.recipeInput.image;

    await recipe.save();
    return true;
  },

  // get recipe detail by recipe id
  getRecipeById: async (args) => {
    const recipe = await Recipe.findById(args.recipeID);
    const contributor = await User.findById(recipe.contributor);
    return await toRecipeDetail(recipe, contributor.username);
  },

  // get all recipe thumbnail from a contributor by username
  // recipes sorted by date created then number of likes
  getListRecipeByContributor: async (args) => {
    const user = await User.findOne({
      username: args.username,
    });

    if (!user) {
      throw new Error("User not found");
    }

    const sortedListRecipe = Recipe.find({
      _id: { $in: user.listRecipes },
    }).sort({
      dateCreated: -1, numberLike: -1
    });

    return (await sortedListRecipe).map(async (recipe) => {
      return await toRecipeThumbnail(recipe, user.username);
    });
  },

  // get all recipe thumbnail that match given tags
  // recipes sorted by number of likes then date created
  getListRecipeByTags: async (args) => {
    const sortedListRecipe = await Recipe.find({
      tags: { $all: args.tags },
    }).sort({
      numberLike: -1, dateCreated: -1
    });
    return sortedListRecipe.map(async (recipe) => {
      const contributor = await User.findById(recipe.contributor);
      return await toRecipeThumbnail(recipe, contributor.username);
    });
  },

  // get all recipe thumbnail whose title matchs given keywords
  // recipes sorted by number of likes then date created
  getListRecipeByTitle: async (args) => {
    const recipes = await Recipe.find({
      $text: { $search: args.keywords }
    }).sort({
      numberLike: -1, dateCreated: -1
    });
    return recipes.map(async (recipe) => {
      const contributor = await User.findById(recipe.contributor);
      return await toRecipeThumbnail(recipe, contributor.username);
    });
  },

  // get all recipe thumbnail from a user's subscribed contributors
  // recipes sorted by date created then number of likes
  getNewsFeed: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }

    const authUser = await User.findById(req.userId);
    const follwingUsers = await User.find({
      username: { $in: authUser.listFollowing },
    });

    let listRecipeID = [];
    for (const followingUser of follwingUsers) {
      for (const recipeID of followingUser.listRecipes) {
        listRecipeID.push(recipeID);
      }
    }

    const sortedNewsFeed = await Recipe.find({
      _id: { $in: listRecipeID },
    }).sort({
      dateCreated: -1, numberLike: -1
    });
    return sortedNewsFeed.map(async (recipe) => {
      const contributor = await User.findById(recipe.contributor);
      return await toRecipeThumbnail(recipe, contributor.username);
    });
  },

  // get similar recipes by a given recipe id
  // recipes sorted by text relevance
  getListReccommendRecipe: async (args) => {
    const recipeById = await Recipe.findById(args.recipeID);

    const stringReplace = ['\\[', '\\]', '"'];
    let content = recipeById.content.replace(/,/g, '');

    for (let index = 0; index < stringReplace.length; index++) {
      const regex = new RegExp(stringReplace[index], 'g');
      content = content.replace(regex, ' ');
    }

    let recipes = await Recipe.find(
      { $text: { $search: content } },
      { score: { $meta: "textScore" } }
    ).sort({
      score: { $meta: "textScore" }
    });
    recipes = recipes.filter((recipe) => recipe._id.toString() !== args.recipeID);
    return recipes.map(async (recipe) => {
      const contributor = await User.findById(recipe.contributor);
      return await toRecipeThumbnail(recipe, contributor.username);
    });
  },

  // like a recipe by a logged in user
  // if the user already liked the recipe, unlike it
  likeRecipe: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const authUser = await User.findById(req.userId);

    const recipe = await Recipe.findById(args.recipeID);

    if (recipe.like.includes(authUser.username)) {
      recipe.like = recipe.like.filter(
        (username) => username !== authUser.username
      );
      recipe.numberLike--;
    } else {
      recipe.like.push(authUser.username);
      recipe.numberLike++;
    }

    await recipe.save();
    return true;
  },

  // check if a logged in user liked a recipe
  isRecipeLiked: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const recipe = await Recipe.findById(args.recipeID);
    const authUser = await User.findById(req.userId);

    if (recipe.like.includes(authUser.username)) {
      return true;
    }
    return false;
  },
};
