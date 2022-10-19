const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type User {
  _id: ID!
  email: String!
  username: String!
  password: String
  listRecipe: [Recipe!]
}

type UserInfo{
  username: String!
  numberFollower: Int!
  numberFollowing: Int!
}

type AuthData {
  userId: ID!
  username: String!
  email: String!
  token: String!
  tokenExpiration: Int!
}

type Recipe{
  _id: ID!
  title: String!
  dateCreated: String!
  content: String!
  contributor: User! 
  like: [String!]!
  listComments: [Comment!]!
}

type RecipeOutput{
  title: String!
  dateCreated : String!
  content: String!
  contributorUsername: String!
  numberLike :Int!
}

type Comment{
  userName: String!
  recipeID: String!
  content: String!
  dateCreated: String!
}

input RecipeInput{
  title: String!
  dateCreated : String!
  content: String!
}

input UserInput {
  email: String!
  username: String!
  password: String!
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
    createComment(recipeID:String!,content:String!,dateCreated:String!): Boolean!
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`);
