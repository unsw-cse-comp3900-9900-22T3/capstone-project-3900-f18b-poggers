import { UserInfo } from "../types/instacook-types";

export const currentAuthenticatedUser = async (): Promise<UserInfo> => {
  const body = {
    query: `
      query {
        isUserAuth {
          username
          email
          numberFollower
          numberFollowing
        }
      }
    `
  }

  const token = localStorage.getItem('token');


  const res = await fetch('http://localhost:6921/graphql', {
    body: JSON.stringify(body),
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  });

  const apiData = await res.json();

  if (apiData.errors) {
    throw new Error(apiData.errors[0].message);
  }

  if (!apiData.data.isUserAuth) {
    throw new Error('User not authenticated.');
  }

  return {
    user: apiData.data.isUserAuth.username,
    email: apiData.data.isUserAuth.email,
    numberFollower: apiData.data.isUserAuth.numberFollower,
    numberFollowing: apiData.data.isUserAuth.numberFollowing
  }
}
