import React from 'react'
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';

type Props = {}

const Feed = (props: Props) => {
  const [userEmail, setUserEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [id, setId] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    const setUserData = async () => {
      console.log("setUserData in Feed.tsx called");
      try {
        // TS types are wrong: https://github.com/aws-amplify/amplify-js/issues/4927
        const user = await Auth.currentAuthenticatedUser({
          // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
          bypassCache: false
        })
        console.log(user)
        setUsername(user.attributes["custom:displayName"]);
        setUserEmail(user.attributes.email);
        setId(user.username);
      } catch (e) {
        if (typeof e === "string") {
          console.log(e);
        } else if (e instanceof Error) {
          console.log(e.message);
        } else {
          console.log(e);
        }

        // go to login page if not authenticated
        navigate('/login');
      }
    }
    setUserData()
  }, [navigate])

  return (
    <>
      <div>You are logged in as: </div>
      <div>Email: {userEmail}</div>
      <div>Username: {username}</div>
      <div>Id: {id}</div>
    </>
  )
}

export default Feed