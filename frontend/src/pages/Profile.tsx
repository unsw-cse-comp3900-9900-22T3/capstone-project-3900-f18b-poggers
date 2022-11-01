import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, Grid, Box, Avatar } from '@mui/material';
import ProfileRecipe from '../components/profile/ProfileRecipe';
import { Auth } from "aws-amplify";
import { Recipe } from '../types/instacook-types';
import { useNavigate, useParams } from 'react-router-dom';

type Props = {}

const Profile = (props: Props) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [buttonText, setButtonText] = useState("Loading");
  const [recipeList, setRecipeList] = React.useState<Recipe[]>([]);
  const [username, setUsername] = React.useState("");
  const { profileUsername } = useParams();
  const navigate = useNavigate();

  const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzVmNjAyYmNjNTA0ZDJjZjMwYTQ0MDAiLCJlbWFpbCI6InN3eGVyZ2FtZXI2NUBnbWFpbC5jb20iLCJpYXQiOjE2NjczMDE5NjUsImV4cCI6MTY2NzMwNTU2NX0.09DaRMN7SHoZF_vP50kaZ0CraC3oAkk-WZyJQJlxO9g"

  
  useEffect(() => {
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
        const recipes = apiData.data.getListRecipeByContributor

        const newList: Recipe[] = recipes.map((item: Recipe) => ({
            _id: item._id,
            contributorUsername: item.contributorUsername,
            title: item.title,
            content: item.content,
            numberLike: item.numberLike,
        }))

        console.log(newList);
        setRecipeList([...newList]);
      } catch (error) {
        console.log("Error on fetching recipe", error);
      }

    };

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
            'Authorization': token,
          }
        });
  
        const apiData = await res.json();
        console.log(apiData)
        setIsSubscribed(apiData.data.isFollowing);
        isSubscribed ? setButtonText("Unsubscribe") : setButtonText("Subscribe");
      } catch (error) {
        console.log("checkSubscribe failed:", error);
      }

    }

    const setUserData = async () => {
      try {
        // TS types are wrong: https://github.com/aws-amplify/amplify-js/issues/4927
        const user = await Auth.currentAuthenticatedUser({
          bypassCache: false
        })

        if (profileUsername === undefined) {
          // username not in params
          console.log(user)
          setUsername(user.username);

        } else {
          // username param provided
          setUsername(profileUsername);
        }
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
  }, [navigate, profileUsername, isSubscribed]);

  const subscribe = async () => {
    try {
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
          'Authorization': token,
        }
      });

      const apiData = await res.json();
      if (apiData.errors) {
        throw new Error(apiData.errors[0].message);
      }
      // console.log(apiData)
      setIsSubscribed(!isSubscribed);
      isSubscribed ? setButtonText("Unsubscribe") : setButtonText("Subscribe");
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
            <Button
              onClick={() => subscribe()}
              variant="contained"
              color="secondary"
              size="small"
            >
              {buttonText}
            </Button>
          </Box>

        </Grid>

        {/* Username and description */}
        <Grid item xs={12} md={8}>
          <Typography variant="h3" mb={1}>
            {username}
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