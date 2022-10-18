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
  like: [String!]!
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
  numberLike :Int!
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

type UserInfo{
  username: String!
  numberFollower: Int!
  numberFollowing: Int!
}

type RootQuery {
    login(username: String!, password: String!): AuthData!
    getListRecipeByContributor(username: String!): [RecipeOutput!]!
    getRecipeById(recipeID: String!): RecipeOutput!
    likeRecipe( recipeID: String!): Boolean!
    follow(followUsername: String!): Boolean!
    getUserInfo(username:String!):UserInfo!
    isFollowing(followUser:String!): Boolean!
  
}
type RootMutation {
    createUser(userInput: UserInput): User
    createRecipe(recipeInput: RecipeInput): RecipeOutput
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`);
