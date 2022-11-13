export type Recipe = {
  _id: string,
  contributorUsername: string,
  title: string,
  content: string,
  contributor: string,
  numberLike: number,
  tags: string[],
  image: string,
}

export type User = {
  _id?: string
  email?: string
  username?: string
  password?: string | null
  listRecipe?: Recipe[]
}

export type UserInfo = {
  user: string
  email?: string
  numberFollower?: int
  numberFollowing?: int
}

export type AuthData = {
  userId?: string
  username?: string
  email?: string
  token?: string
  tokenExpiration?: int
}

export type Recipe = {
  title?: string
  dateCreated?: string
  content?: string
  contributor?: User
  like?: string[]
  listComments?: Comment[]
  listTags?: Tag[]
}

export type Tag = {
  _id: string
  content: string
}

export type RecipeThumbnail = {
  _id: string
  contributorUsername: string
  title: string
  content: string
  numberLike: number
  tags: string[]
  image: string
}

export type RecipeDetail = {
  title?: string
  content?: string
  dateCreated?: string
  contributorUsername?: string
  numberLike?: int
  listComments?: Comment[]
  tags?: string[]
}

export type Comment = {
  userName?: string
  recipeID?: string
  content?: string
  dateCreated?: string
}

export type Tag = {
  _id: string,
  content: string,
}

export type TagObj = {
  [tagName: string]: string
}

export type BookInfo = {
  _id: string,
  name: string,
}
<<<<<<< HEAD

export type SavedRecipeInfo = {
  _id: string,
  title: string,
  contributorUsername: string,
  numberLike: number
}
=======
>>>>>>> main
