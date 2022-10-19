const authResolver = require("./user");
const recipeResolver = require("./recipe");
const commentResolver = require("./comment");

const rootResolver = {
  ...authResolver,
  ...recipeResolver,
  ...commentResolver,
};

module.exports = rootResolver;
