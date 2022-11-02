import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, Grid, Box, Avatar } from '@mui/material';
import ProfileRecipe from '../components/profile/ProfileRecipe';
import { Recipe } from '../types/instacook-types';
import { useNavigate, useParams } from 'react-router-dom';
import { currentAuthenticatedUser } from '../util/currentAuthenticatedUser';

type Props = {}

const Profile = (props: Props) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  // const [buttonText, setButtonText] = useState("Loading");
  const [buttonLock, setButtonLock] = useState(true);
  const [recipeList, setRecipeList] = React.useState<Recipe[]>([]);
  const { profileUsername } = useParams();
  const navigate = useNavigate();

  useEffect(() => {

    // get list of recipes from contributor
    const fetchRecipes = async () => {
      try {
        const requestBody = {
          query: `
            query {
              getListRecipeByContributor(username: "${profileUsername}") {
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
            'Content-Type': 'application/json'
          }
        });

        const apiData = await res.json();
        if (apiData.errors) {
          throw new Error(apiData.errors[0].message);
        }

        const recipes = apiData.data.getListRecipeByContributor
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
        setRecipeList([]);
      }

    };

    // check if the contributor is subscribed
    const checkSubscribe = async () => {
      try {
        const requestBody = {
          query: `
            query {
              isFollowing(followUser: "${profileUsername}")
              }
          `
          };
  
        const res = await fetch('http://localhost:3000/graphql', {
          body: JSON.stringify(requestBody),
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
  
        const apiData = await res.json();
        if (apiData.errors) {
          throw new Error(apiData.errors[0].message);
        }

        // if contributor is subscribed, set text to Unsubscribe, otherwise Subscribe
        setIsSubscribed(apiData.data.isFollowing);
      } catch (error) {
        console.log("checkSubscribe failed:", error);
      }

    }

    // check if the logged in user's token is valid
    // and get logged in user's detail
    const setUserData = async () => {
      console.log("setUserData in Feed.tsx called");
      try {
        const { user } = await currentAuthenticatedUser();
        console.log(user)
        // setUsername(user);

        // if the user is viewing their own profile, lock the subscribe button
        user === profileUsername 
          ? setButtonLock(true) : setButtonLock(false);
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
    checkSubscribe();
    fetchRecipes();
  }, [navigate, profileUsername]);

  // subscribe/unsubscribe contributor
  const subscribe = async () => {
    try {
      // update the button text after subscribe/unsubscribe
      setIsSubscribed(!isSubscribed);
      const requestBody = {
        query: `
          mutation {
            follow(followUsername: "${profileUsername}")
            }
        `
        };

      const res = await fetch('http://localhost:3000/graphql', {
        body: JSON.stringify(requestBody),
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });

      const apiData = await res.json();
      if (apiData.errors) {
        throw new Error(apiData.errors[0].message);
      }

      
    } catch (error) {
      console.log("subscribe button failed:", error);
    }
  }

  return (
    <Container
      maxWidth="md"
      sx={{ backgroundColor: 'white', paddingBottom: 2, minHeight: 'calc(100vh - 64px)' }}
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
      >
        {/* Profile image */}
        <Grid item md={4}>
          <Box
            mt={2}
            ml={{ md: 6 }}
          >
            <Avatar
              sx={{
                minHeight: 150,
                minWidth: 150,
                maxHeight: 150,
                maxWidth: 150,
              }}
              alt={"Profile Image"}
            />
          </Box>

          {/* Subscribe button */}
          <Box
            textAlign='center'
            mr={{ md: 4 }}
            mt={1}
          >
            {isSubscribed ? 
              <Button
                onClick={() => subscribe()}
                variant="contained"
                color="secondary"
                size="small"
                disabled={buttonLock}
              >
                Unsubscribe
              </Button>
            :  
              <Button
                onClick={() => subscribe()}
                variant="contained"
                color="secondary"
                size="small"
                disabled={buttonLock}
              >
                Subscribe
              </Button>
            }
          </Box>

          

        </Grid>

        {/* Username and description */}
        <Grid item xs={12} md={8}>
          <Typography variant="h3" mb={1}>
            {profileUsername}
          </Typography>

          <Typography variant="subtitle1" pr={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis rutrum, erat ac aliquam scelerisque, est enim luctus leo, a pretium diam nisl nec eros. Cras sit amet viverra eros.
          </Typography>
        </Grid>

        {/* Recipe header */}
        <Grid item md={12} xs={12}>
          <Box sx={{
            borderBottom: 1,
            marginTop: 3,
            paddingBottom: 1,
          }}>
            <Typography variant="h5" ml={2}>
              Recipes
            </Typography>
          </Box>
        </Grid>

      </Grid>

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

export default Profile