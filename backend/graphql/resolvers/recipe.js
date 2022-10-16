const Recipe = require("../../models/recipe");
const User = require("../../models/user");

const transformEvent = (recipe) => {
  return {
    ...recipe._doc,
    _id: recipe.id,
    date: dateToString(recipe._doc.date),
    creator: user.bind(this, recipe.creator),
  };
};

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      createdEvents: events.bind(this, user._doc.createdEvents),
    };
  } catch (err) {
    throw err;
  }
};

module.exports = {
  createRecipe: async (args, req) => {
    // const newRecipe = new Recipe({
    //   title: args.RecipeInput.title,
    //   content: args.RecipeInput.content,
    //   dateCreated: args.RecipeInput.dateCreated,
    // });
    //
    // const result = await user.save();

    // return { ...result._doc, password: null, _id: result.id };
    //
    // if (!req.isAuth) {
    //   throw new Error('Unauthenticated!');
    // }
    //
    // const event = new Event({
    //   title: args.eventInput.title,
    //   description: args.eventInput.description,
    //   price: +args.eventInput.price,
    //   date: new Date(args.eventInput.date),
    //   creator: req.userId
    // });

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

      return {
        content: "someContent",
        title: "someTitle",
        _id: null,
        dateCreated: "somedate",
        contributor: null,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
