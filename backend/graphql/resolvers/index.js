const authResolver = require("./user");
const recipeResolver = require("./recipe");

const rootResolver = {
  ...authResolver,
  ...recipeResolver,
};

module.exports = rootResolver;
