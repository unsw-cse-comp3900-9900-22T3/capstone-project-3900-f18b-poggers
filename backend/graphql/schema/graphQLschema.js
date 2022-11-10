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
  email: String!
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
  title: String!
  dateCreated: String!
  content: String!
  contributor: User! 
  like: [String!]!
  listComments: [Comment!]!
  listTags: [Tag!]!
}

type Tag{
  _id: ID!
  content : String!
}

type RecipeThumbnail{
  _id: ID!
  contributorUsername: String!
  title: String!
  content: String!
  numberLike :Int!
  tags: [String!]!
}

type RecipeDetail{
  _id: ID!
  contributorUsername: String!
  title: String!
  content: String!
  numberLike :Int!
  tags: [String!]!
  dateCreated: String!
  listComments: [Comment!]!
}

type Comment{
  userName: String!
  recipeID: ID!
  content: String!
  dateCreated: String!
}

input RecipeInput{
  title: String!
  dateCreated : String!
  content: String!
  tags: [ID!]!
}

input UserInput {
  email: String!
  username: String!
  password: String!
}


type RootQuery {
  login(username: String!, password: String!): AuthData!
  getListRecipeByContributor(username: String!): [RecipeThumbnail!]!
  getNewsFeed: [RecipeThumbnail!]!
  getRecipeById(recipeID: ID!): RecipeDetail!
  getUserInfo(username:String!):UserInfo!
  isFollowing(followUser:String!): Boolean!
  getTags: [Tag!]!
  isUserAuth: UserInfo!
  isRecipeLiked(recipeID: ID!): Boolean!
  getListRecipeByTags(tags: [ID!]!): [RecipeThumbnail!]!
  getListOfRecipeBook: [String!]!
  getSavedRecipe(recipeBookID: ID): [RecipeThumbnail!]!
  checkRecipeInBook(recipeBookID: ID, recipeID: ID): Boolean!
}


type RootMutation {
  createUser(userInput: UserInput): User
  createRecipe(recipeInput: RecipeInput): RecipeDetail!
  createComment(recipeID: ID!,content:String!,dateCreated:String!): Boolean!
  likeRecipe(recipeID: ID!): Boolean!
  follow(followUsername: String!): Boolean!
  updateRecipe(recipeID: ID!,recipeInput: RecipeInput): Boolean!
  createRecipeBook(recipeBookName: String!): Boolean!
  addRecipeToBook(recipeBookID: ID, recipeID: ID): Boolean!
  deleteRecipeBook(recipeBookID: ID): Boolean!
  deleteRecipeIdInBook(recipeBookID: ID, recipeID: ID): Boolean!
}


schema {
  query: RootQuery
  mutation: RootMutation
}
`);
