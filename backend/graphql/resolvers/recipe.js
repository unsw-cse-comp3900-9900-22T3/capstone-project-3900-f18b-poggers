const recipe = require("../../models/recipe");
const Recipe = require("../../models/recipe");
const User = require("../../models/user");

module.exports = {
  createRecipe: async (args, req) => {
    // TODO check token to continue (Ignore this for now)

    const recipe = new Recipe({
      title: args.recipeInput.title,
      content: args.recipeInput.content,
      dateCreated: new Date(args.recipeInput.dateCreated),
      contributor: "634b99b78d5b79ca9856f95c",
    });

    let createdRecipe;
    try {
      const contributor = await User.findById("634b99b78d5b79ca9856f95c");

      if (!contributor) {
        throw new Error("User not found.");
      }

      const result = await recipe.save();
      console.log(result);
      // createdRecipe = transformEvent(result);

      contributor.listRecipes.push(recipe);
      await contributor.save();

      // TODO return proper data
      return {
        content: recipe.content,
        title: recipe.title,
        _id: recipe.id,
        dateCreated: recipe.dateCreated,
        contributor: contributor,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  getRecipeById: async (args, req) => {
    // TODO check token to continue (Ignore this for now)

    const recipe = await Recipe.findOne({
      _id: args.id,
    });


    const contributor = await User.findById(recipe.contributor._id);

    
    return {
      content: recipe.content, 
      title: recipe.title,
      dateCreated: recipe.dateCreated,
      contributorUsername: contributor.username,
    };
  },

  getListRecipeByContributor: async (args, req) => {
    // TODO check token to continue (Ignore this for now)

    const user = await User.findOne({
      username: args.username,
    });

    if (!user) {
      throw new Error("User not found");
    }

    let recipes = [];

    user.listRecipes.forEach(async(n,i)=> {
      
      const recipe = await Recipe.findOne({
        _id: n._id,
      });
      console.log(recipe);
    });

    console.log(recipes);

    //TODO  Return a list of recipes
    return [
      {
        content: "someContent",
        title: "someTitle",
        _id: null,
        dateCreated: "somedate",
        contributor: null,
      },
    ];
  },
};
