import { useState, useEffect } from 'react';
import { API, Auth } from "aws-amplify";
import { useNavigate } from 'react-router-dom';
import { GraphQLResult } from '@aws-amplify/api-graphql';
import { Recipe } from '../types/instacook-types';
import { Typography, Container, Grid, Link } from '@mui/material';
import ProfileRecipe from '../components/profile/ProfileRecipe';

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

const Feed = (props: Props) => {
  const [userEmail, setUserEmail] = useState("");
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [recipeList, setRecipeList] = useState<Recipe[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        // const filter = { 'contributor': { eq: profileUsername === undefined ? username : profileUsername } };
        const apiData: GraphQLResult<any> = await API.graphql({
          query: listRecipes,
          // variables: { filter: filter },
        });
        const recipes: Recipe[] = apiData.data.listRecipes.items;
        // const newList: Recipe[] = recipes.map((item) => ({
        //   id: item.id,
        //   name: item.name,
        //   content: item.content,
        //   fileImage: item.fileImage.slice(5).slice(0, -1),
        //   contributor: item.contributor,
        //   owner: item.owner,
        //   createdAt: item.createdAt,
        //   updatedAt: item.updatedAt
        //   // tag: ['kfc', 'is', 'better'],
        //   // like: 21,
        // }))

        console.log("zap");
        // console.log(newList);
        // // setRecipeList([]);
        // setRecipeList([...newList]);
      } catch (error) {
        console.log("Error on fetching recipe", error);
        setRecipeList([]);
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
      <div style={{ backgroundColor: 'white' }}>
        <div>This should be the feed (/feed)</div>
        <div>You are logged in as: </div>
        <div>Email: {userEmail}</div>
        <div>Username: {username}</div>
        <div>Id: {id}</div>
      </div>

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