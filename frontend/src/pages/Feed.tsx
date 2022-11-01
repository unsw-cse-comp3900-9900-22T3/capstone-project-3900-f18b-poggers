import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recipe } from '../types/instacook-types';
import { Typography, Container, Grid, Link } from '@mui/material';
import ProfileRecipe from '../components/profile/ProfileRecipe';

type Props = {}

const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzVmNjAyYmNjNTA0ZDJjZjMwYTQ0MDAiLCJlbWFpbCI6InN3eGVyZ2FtZXI2NUBnbWFpbC5jb20iLCJpYXQiOjE2NjczMTI4OTcsImV4cCI6MTY2NzMxNjQ5N30.Zp5wmG5o2kzQkgMqpCSGkZ4hlhis2rMm45It4BZsgQE"


const Feed = (props: Props) => {
  const [recipeList, setRecipeList] = useState<Recipe[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // get recipes from all the contributors user has subscribed to
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
        const recipes = apiData.data.getNewsFeed

        const newList: Recipe[] = recipes.map((item: Recipe) => ({
          _id: item._id,
          contributorUsername: item.contributorUsername,
          title: item.title,
          content: item.content,
          numberLike: item.numberLike,
          tags: item.tags,
        }))

        console.log(newList);
        setRecipeList([...newList]);
      } catch (error) {
        console.log("Error on fetching recipe", error);
      }
    };

    // check if the logged in user's token is valid
    const setUserData = async () => {
      console.log("setUserData in Feed.tsx called");
      try {
        const requestBody = {
          query: `
            query {
              isUserAuth {
                  username
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
          // error will be thrown if the token has expired or is invalid
          throw new Error(apiData.errors[0].message);
        }
      } catch (error) {
        console.log("fetching user data failed:", error);

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