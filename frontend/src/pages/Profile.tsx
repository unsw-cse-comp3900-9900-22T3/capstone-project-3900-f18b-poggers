import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, Grid, Box, Avatar } from '@mui/material';
import ProfileRecipe from '../components/profile/ProfileRecipe';
import { API, Auth } from "aws-amplify";
import { GraphQLResult } from '@aws-amplify/api-graphql';
import { Recipe } from '../types/instacook-types';
import { useNavigate, useParams } from 'react-router-dom';
import { currentAuthenticatedUser } from '../util/currentAuthenticatedUser';

type Props = {}

const listRecipes = /* GraphQL */ `
query ListRecipes(
  $filter: ModelRecipeFilterInput
  $limit: Int
  $nextToken: String
  ) {
  listRecipes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      content
      contributor
      fileImage
      createdAt
      updatedAt
      owner
    }
    nextToken
  }
}
`;


const Profile = (props: Props) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [buttonText, setButtonText] = useState("Subscribe");
  const [recipeList, setRecipeList] = React.useState<Recipe[]>([]);
  const [username, setUsername] = React.useState("");
  const { profileUsername } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const filter = { 'contributor': { eq: profileUsername === undefined ? username : profileUsername } };
        const apiData: GraphQLResult<any> = await API.graphql({
          query: listRecipes,
          variables: { filter: filter },
        });
        const recipes: Recipe[] = apiData.data.listRecipes.items;
        const newList: Recipe[] = recipes.map((item) => ({
          id: item.id,
          name: item.name,
          content: item.content,
          fileImage: item.fileImage.slice(5).slice(0, -1),
          contributor: item.contributor,
          owner: item.owner,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
          // tag: ['kfc', 'is', 'better'],
          // like: 21,
        }))

        newList.sort((a, b) => {
          return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
        })

        console.log(newList);
        setRecipeList([...newList]);
      } catch (error) {
        console.log("Error on fetching recipe", error);
      }
    };

    const setUserData = async () => {
      try {
        const {user} = await currentAuthenticatedUser();

        if (profileUsername === undefined) {
          // username not in params
          console.log(user)
          setUsername(user);

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
    setUserData()
    fetchRecipes();
  }, [navigate, profileUsername]);

  const subscribe = () => {
    setIsSubscribed(!isSubscribed);
    isSubscribed ? setButtonText("Subscribe") : setButtonText("Unsubscribe");
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