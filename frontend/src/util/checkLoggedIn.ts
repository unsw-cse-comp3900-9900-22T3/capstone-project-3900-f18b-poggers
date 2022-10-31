import { isUserAuthData } from "../types/instacook-types";

export const checkLoggedIn = async () => {
  const body = {
    query: `
      query {
        isUserAuth
      }
    `
  }

  const token = localStorage.getItem('token');


  const res = await fetch('http://localhost:3000/graphql', {
    body: JSON.stringify(body),
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  });

  const apiData: isUserAuthData = await res.json();

  if (apiData.errors) {
    throw new Error(apiData.errors[0].message);
  }

  if (!apiData.data.isUserAuth) {
    throw new Error('User not authenticated.');
  }
}
