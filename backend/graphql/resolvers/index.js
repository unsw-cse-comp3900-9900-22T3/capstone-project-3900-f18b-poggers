const authResolver = require("./user");
const recipeResolver = require("./recipe");
const commentResolver = require("./comment");
const tagResolver = require("./tag");
const recipeBookResolver = require("./recipeBook");

const rootResolver = {
  ...authResolver,
  ...recipeResolver,
  ...commentResolver,
  ...tagResolver,
  ...recipeBookResolver
};

module.exports = rootResolver;
