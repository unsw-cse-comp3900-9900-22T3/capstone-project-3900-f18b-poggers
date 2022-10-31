const authResolver = require("./user");
const recipeResolver = require("./recipe");
const commentResolver = require("./comment");
const tagResolver = require("./tag");

const rootResolver = {
  ...authResolver,
  ...recipeResolver,
  ...commentResolver,
  ...tagResolver
};

module.exports = rootResolver;
