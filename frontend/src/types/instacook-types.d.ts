export type Recipe = {
  id: string
  name: string
  content: string
  contributor: string
  fileImage: string
  createdAt: string
  updatedAt: string
  owner: string
}

export type User = {
  _id?: string
  email?: string
  username?: string
  password?: string | null
  listRecipe?: Recipe[]
}

export type UserInfo = {
  username?: string
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
  _id?: string
  content?: string
}

export type RecipeThumbnail = {
  title?: string
  content?: string
  numberLike?: int
  tags?: string[]
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

export type isUserAuthData = {
  data: {
    [key: string]: UserInfo
  },
  errors: [{ message: string }] | undefined | null;
}