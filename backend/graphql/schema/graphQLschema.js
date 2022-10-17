const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type User {
  _id: ID!
  email: String!
  username: String!
  password: String
  listRecipe: [Recipe!]
}

type Recipe{
  _id: ID!
  title: String!
  dateCreated: String!
  content: String!
  contributor: User! 
}

input RecipeInput{
  title: String!
  dateCreated : String!
  content: String!
}

type RecipeOutput{
  title: String!
  dateCreated : String!
  content: String!
  contributorUsername: String!
}

type AuthData {
  userId: ID!
  username: String!
  email: String!
  token: String!
  tokenExpiration: Int!
}
input UserInput {
  email: String!
  username: String!
  password: String!
}
type RootQuery {
    login(username: String!, password: String!): AuthData!
    getListRecipeByContributor(username: String!): [RecipeOutput!]!
    getRecipeById(id: String!): RecipeOutput!
}
type RootMutation {
    createUser(userInput: UserInput): User
    createRecipe(recipeInput: RecipeInput): Recipe
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`);
