export type Recipe = {
  id: string,
  name: string,
  content: string,
  contributor: string,
  fileImage: string,
  createdAt: string,
  updatedAt: string,
  owner: string,
}

export type Comment = {
  userName: string,
  content: string,
  dateCreated: string,
  recipeID: string,
}

export type Tag = {
  _id: string,
  content: string,
}