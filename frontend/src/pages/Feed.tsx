import { useState, useEffect } from 'react';
import { Auth } from "aws-amplify";
import { useNavigate } from 'react-router-dom';
import { Recipe } from '../types/instacook-types';
import { Typography, Container, Grid, Link } from '@mui/material';
import ProfileRecipe from '../components/profile/ProfileRecipe';

type Props = {}

const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzVmNjAyYmNjNTA0ZDJjZjMwYTQ0MDAiLCJlbWFpbCI6InN3eGVyZ2FtZXI2NUBnbWFpbC5jb20iLCJpYXQiOjE2NjcyNzg4NzksImV4cCI6MTY2NzI4MjQ3OX0.PJCG0QSJs9c5Ti2wiF09hxRCUZjS0beo5I7uYvjlVio"


const Feed = (props: Props) => {
  const [userEmail, setUserEmail] = useState("");
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [recipeList, setRecipeList] = useState<Recipe[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const requestBody = {
          query: `
            query {
              getNewsFeed {
                _id
                contributorUsername
                title
                content
                numberLike
                tags
              }
            }
          `
        };
        const res = await fetch('http://localhost:3000/graphql', {
          body: JSON.stringify(requestBody),
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          }
        });

        const apiData = await res.json();
        if (apiData.errors) {
          throw new Error(apiData.errors[0].message);
        }
        // const recipes = apiData.data.getListRecipeByContributor

        // const newList: Recipe[] = recipes.map((item: Recipe) => ({
        //   _id: item._id,
        //   contributorUsername: item.contributorUsername,
        //   title: item.title,
        //   content: item.content,
        //   numberLike: item.numberLike,
        // }))

        // console.log(newList);
        // setRecipeList([...newList]);
      } catch (error) {
        console.log("Error on fetching recipe", error);
      }
    };

    const setUserData = async () => {
      console.log("setUserData in Feed.tsx called");
      try {
        // TS types are wrong: https://github.com/aws-amplify/amplify-js/issues/4927
        const user = await Auth.currentAuthenticatedUser({
          bypassCache: false
        })
        console.log(user)
        setUsername(user.username);
        setUserEmail(user.attributes.email);
        setId(user.attributes.sub);
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
    setUserData();
    fetchRecipes();
  }, [navigate])

  return (



    <Container
      maxWidth="md"
      sx={{ backgroundColor: 'white', paddingBottom: 2, minHeight: 'calc(100vh - 64px)' }}
    >
      {/* <div style={{ backgroundColor: 'white' }}>
        <div>This should be the feed (/feed)</div>
        <div>You are logged in as: </div>
        <div>Email: {userEmail}</div>
        <div>Username: {username}</div>
        <div>Id: {id}</div>
      </div> */}

      {/* A message if there are no recipes displayed */}
      {recipeList.length === 0 && (
        <Grid item pt={10}>
          <Typography variant="h2" align='center' mb={5}>
            No posts yet.
          </Typography>

          <Typography variant="h4" align='center'>
            Head to the <Link href='/#'>discovery page</Link> to get started.
          </Typography>
        </Grid>
      )}

      {/* Recipe Posts */}
      <Grid
        container
        item
        direction="column"
        justifyContent="center"
        alignItems="center"
        md={9}
        ml={{ md: 15 }}
        mr={{ md: 15 }}
      >
        {recipeList.map((item, index) => (
          <ProfileRecipe key={index} post={item} />
        ))}
      </Grid>
    </Container>
  )
}

export default Feed