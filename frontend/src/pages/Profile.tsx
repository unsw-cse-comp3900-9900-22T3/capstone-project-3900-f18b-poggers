import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, Grid, Box, Avatar } from '@mui/material';
import ProfileRecipe from '../components/profile/ProfileRecipe';
import { Recipe } from '../types/instacook-types';
import { useNavigate, useParams } from 'react-router-dom';
import { currentAuthenticatedUser } from '../util/currentAuthenticatedUser';
import GroupsIcon from '@mui/icons-material/Groups';
import { red } from '@mui/material/colors';

type Props = {}

const Profile = (props: Props) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [buttonLock, setButtonLock] = useState(true);
  const [recipeList, setRecipeList] = React.useState<Recipe[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isUserValid, setIsUserValid] = useState(true);
  const { profileUsername } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Get list of recipes from contributor
     */
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
                image
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
          image: item.image,
          tags: item.tags,
        }))

        setRecipeList([...newList]);
        setIsUserValid(true);
      } catch (error) {
        console.log("Error on fetching recipe", error);
        setRecipeList([]);
        setIsUserValid(false);
      }

    };

    /**
     * Check if the contributor is subscribed
     */
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

    /**
     * Get number of followers and following of the contributor
     */
    const getFollowCount = async () => {
      try {
        const requestBody = {
          query: `
            query {
              getUserInfo(username: "${profileUsername}") {
                numberFollower
                numberFollowing
              }
            }
          `
        };

        const res = await fetch('http://localhost:3000/graphql', {
          body: JSON.stringify(requestBody),
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const apiData = await res.json();
        if (apiData.errors) {
          throw new Error(apiData.errors[0].message);
        }

        setFollowerCount(apiData.data.getUserInfo.numberFollower);
        setFollowingCount(apiData.data.getUserInfo.numberFollowing);
      } catch (error) {
        console.log("get follow count failed:", error);
        setButtonLock(true);
      }

    }

    /**
     * Check if the user is authenticated, and get logged-in user detail
     */
    const setUserData = async () => {
      try {
        const { user } = await currentAuthenticatedUser();

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
      }
    }
    setUserData();
    checkSubscribe();
    fetchRecipes();
    getFollowCount();
  }, [navigate, profileUsername]);

  /**
   * Subscribe to the contributor if it's subsubscribed,
   * otherwise unsubscribe
   */
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

      isSubscribed ?
        setFollowerCount(followerCount - 1) : setFollowerCount(followerCount + 1)


    } catch (error) {
      console.log("subscribe button failed:", error);
    }
  }

  return (
    <Container
      sx={{ backgroundColor: 'white', paddingBottom: 2, minHeight: 'calc(100vh - 64px)' }}
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
      >
        {/* Profile image */}
        <Grid
          item
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
          md={4}
        >
          <Box
            mt={2}
            ml={{ md: 12.5 }}
          >
            <Avatar
              sx={{
                minHeight: 150,
                minWidth: 150,
                maxHeight: 150,
                maxWidth: 150,
                bgcolor: red[500],
                fontSize: '75px',
                marginBottom: 2,
              }}
              alt={"Profile Image"}
            >
              {profileUsername && profileUsername.charAt(0).toUpperCase()}
            </Avatar>

            {/* Subscribe button */}
            <Button
              onClick={() => subscribe()}
              variant="contained"
              color="secondary"
              size="small"
              disabled={buttonLock}
              sx={{
                marginLeft: isSubscribed ? 1.1 : 2.5
              }}
            >
              {isSubscribed ?
                <Typography>
                  Unsubscribe
                </Typography>
                :
                <Typography>
                  Subscribe
                </Typography>
              }
            </Button>
          </Box>
        </Grid>

        {/* Username and description */}
        <Grid item xs={12} md={6}>
          <Typography variant="h3" mb={1}>
            {profileUsername}
          </Typography>

          <Grid container direction="row" alignItems="center" pt={2}>
            {isUserValid ?
              <>
                <GroupsIcon sx={{ marginRight: 1 }} />
                <Typography variant="subtitle1" pr={4}>
                  {followerCount} followers / {followingCount} following
                </Typography>
              </>
              :
              <Typography sx={{ color: "#FF0000" }} variant="h5" pr={4}>
                User does not exist
              </Typography>
            }
          </Grid>
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
        ml={{ md: 18 }}
        mr={{ md: 18 }}
      >
        {recipeList.map((item, index) => (
          <ProfileRecipe key={index} post={item} />
        ))}
      </Grid>
    </Container>
  )
}

export default Profile