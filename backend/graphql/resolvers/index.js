const authResolver = require("./user");

const rootResolver = {
  ...authResolver,
};

module.exports = rootResolver;
