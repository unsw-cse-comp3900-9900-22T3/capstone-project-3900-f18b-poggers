const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type User {
  _id: ID!
  email: String!
  username: String!
  password: String
}
type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
}
input UserInput {
  username: String!
  password: String!
}
type RootQuery {
    login(username: String!, password: String!): AuthData!
}
type RootMutation {
    createUser(userInput: UserInput): User
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`);
