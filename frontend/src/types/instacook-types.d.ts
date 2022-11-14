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

export type UserInfo = {
  user: string
  email: string
  numberFollower?: int
  numberFollowing?: int
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

export type Comment = {
  userName: string
  recipeID: string
  content: string
  dateCreated: string
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

export type SavedRecipeInfo = {
  _id: string,
  title: string,
  contributorUsername: string,
  numberLike: number
}
