import React from 'react'
import { useNavigate } from 'react-router-dom';
import { currentAuthenticatedUser } from '../util/currentAuthenticatedUser';

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
        const { user } = await currentAuthenticatedUser();
        console.log(user)
        setUsername(user);
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
    <div style={{ backgroundColor: 'white' }}>
      <div>This should be the feed (/feed)</div>
      <div>You are logged in as: </div>
      <div>Email: {userEmail}</div>
      <div>Username: {username}</div>
      <div>Id: {id}</div>
    </div>
  )
}

export default Feed