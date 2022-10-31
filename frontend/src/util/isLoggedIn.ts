
type isUserAuthRes = {
  data: {
    isUserAuth: boolean
  },
  errors: [{ message: string }] | undefined | null;
}

export const isLoggedIn = async (): Promise<boolean> => {
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

  const apiData: isUserAuthRes = await res.json();

  if (apiData.errors) {
    throw new Error(apiData.errors[0].message);
  }

  return apiData.data.isUserAuth;
}
