import React, {useState, useEffect} from 'react';
import { Button, Typography, Container, Grid, Box } from '@mui/material';
import ProfileRecipe from '../components/ProfileRecipe';
import { API } from "aws-amplify";
import { GraphQLResult } from '@aws-amplify/api-graphql';


type Props = {}

// Sample data for props

// type RecipeObject = {
//   id: string,
//   name: string,
//   content: string,
//   fileImage: string,
//   like: number,
//   tag: string[],
// }

// const post1: RecipeObject = {
//   id: "1239udfasd8f",
//   name: "Sample Post",
//   content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis rutrum, erat ac aliquam scelerisque, est enim luctus leo, a pretium diam nisl nec eros. Cras sit amet viverra eros.",
//   tag: ['vanilla'],
//   fileImage: "https://cdn.discordapp.com/attachments/206003287093149696/1026867082610085898/unknown.png",
//   like: 9999,
// }

const post2: Recipe = {
  id: "2239udfasd8f",
  name: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  content: "Short Descriptionaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  contributor: "z",
  // tag: ['h20','water','glass','coke'],
  fileImage: "https://media.discordapp.net/attachments/206003287093149696/1026867303154978906/unknown.png?width=1080&height=60",
  // like: 6969,
  createdAt: "asd",
  updatedAt: "dsa",
  owner: "a",
}

// const post3: RecipeObject = {
//   id: "3239udfasd8f",
//   name: "Happy Meal",
//   content: "im lovin it",
//   tag: ['kfc','is','better'],
//   fileImage: "https://www.kiis1011.com.au/wp-content/uploads/sites/3/2020/10/mymaccas-happymeal.png?crop=84px,0px,899px,1080px&resize=680,816&quality=75",
//   like: 420,
// }

// const post4: RecipeObject = {
//   id: "4239udfasd8f",
//   name: "Holidays",
//   content: "cool mountains cool mountains cool mountains cool mountains cool mountains cool mountains cool mountains cool mountains cool mountains cool mountains",
//   tag: ['instagram','instagram','instagram','instagram','instagram','instagram'],
//   fileImage: "https://images.unsplash.com/photo-1615003162333-d3ff3ce1f0f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dWx0cmElMjB3aWRlfGVufDB8fDB8fA%3D%3D&w=1000&q=80",
//   like: 21,
// }

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

type Recipe = {
  id: string,
  name: string,
  content: string,
  contributor: string,
  fileImage: string,
  createdAt: string,
  updatedAt: string,
  owner: string,
}

const Profile = (props: Props) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [buttonText, setButtonText] = useState("Subscribe");
  const [recipeList, setRecipeList] = React.useState<Recipe[]>([]);



  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const apiData: GraphQLResult<any> = await API.graphql({
          query: listRecipes,
        });
        const recipes: Recipe[] = apiData.data.listRecipes.items;
        const newList: Recipe[] = recipes.map((item) => ({
          id: item.id,
          name: item.name,
          content: item.content,
          fileImage: item.fileImage.slice(5).slice(0,-1),
          contributor: item.contributor,
          owner: item.owner,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
          // tag: ['kfc', 'is', 'better'],
          // like: 21,
        }))
        console.log(newList);
        setRecipeList([...newList]);
        console.log(recipeList);
        
      } catch (error) {
        console.log("Error on fetching recipe", error);
      }
    };
    fetchRecipes();
  },[]);



  const subscribe = () => {
    setIsSubscribed(!isSubscribed);
    isSubscribed ? setButtonText("Subscribe") : setButtonText("Unsubscribe");
  }

  return (
    <Container 
      maxWidth="md"
      >
      <Grid 
        container
        justifyContent="center"
        alignItems="center"
      >
        {/* Profile image */}
        <Grid item md={4}>
          <Box
            component="img"
            sx={{
              minHeight: 150,
              minWidth: 150,
              maxHeight: 150,
              maxWidth: 150,
              borderRadius: "50%",
              objectFit: "cover",
            }}
            alt="Profile Image"
            src="https://i.redd.it/a1zcxisgjls71.png"
            mt={2}
            ml={{md: 6}}
          />

          {/* Subscribe button */}
          <Box 
            textAlign='center'
            mr={{md: 4}}
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
            Test User
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
        ml={{md: 15}}
        mr={{md: 15}}
      >

        {
          recipeList.map((item, index) => {
            return (
              <ProfileRecipe key={index} post={item}/>
            )
          })
        }

        <ProfileRecipe post={post2}/>
      </Grid>
    </Container>
  )
}

export default Profile