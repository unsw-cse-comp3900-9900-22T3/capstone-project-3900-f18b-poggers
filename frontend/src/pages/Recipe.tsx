import React, { useEffect } from 'react'
import { IconButton, Avatar, Divider, ListItemAvatar, CardContent, CardActionArea, ListItemText, List, ListItem, CardMedia, Card, Box, Button, Checkbox, Container, createTheme, CssBaseline, FormControlLabel, Grid, TextField, Typography } from '@mui/material'
import Carousel from 'react-material-ui-carousel'
import testimg from '../static/images/authbackground.jpeg'
import SendIcon from '@mui/icons-material/Send';
import { graphqlOperation } from "aws-amplify";
import { useNavigate } from 'react-router-dom';
import Amplify, { API, Auth, Storage } from "aws-amplify";
import { ConnectingAirportsOutlined } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import Image from 'mui-image';
type Props = {}

type Comment = {
  author: string,
  comment: string,
}

const Recipe = (props: Props) => {

  const [recipes, setRecipes] = React.useState([]);
  const navigate = useNavigate();

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
  const getRecipe = /* GraphQL */ `
  query GetRecipe($id: ID!) {
    getRecipe(id: $id) {
      id
      name
      content
      contributor
      fileImage
      createdAt
      updatedAt
      owner
    }
  }
  `;

  React.useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const apiData: any = await API.graphql({ query: listRecipes });
        const recipes = apiData.data.listRecipes.items;
        console.log(recipes);
        const apiData2: any = await API.graphql({
          query: getRecipe,
          variables: { id: recipeId }
        });
        const recipeById = apiData2.data.getRecipe;

        setRecipes(recipeById);
        setRecipeName(recipeById.name);
        setDescription(JSON.parse(recipeById.content)[2])
        setContributorName(recipeById.contributor);
        if (recipeById.content[0] != null) {
          setIngredients(JSON.parse(recipeById.content)[0]);
        }
        if (recipeById.content[1] != null) {
          setInstructions(JSON.parse(recipeById.content)[1]);
        }

        const fileAccessURL = await Storage.get(recipeById.fileImage.slice(5, -1), { expires: 30, level: "public" });
        setRecipeImage(fileAccessURL);
      } catch (error) {
        console.log("error on fetching recipe", error);
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
    setUserData()
    fetchRecipes();
  }, [navigate]);

  const pathname = window.location.pathname;
  const recipeId = pathname.slice(8);


  const [userEmail, setUserEmail] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [id, setId] = React.useState("");
  const [description, setDescription] = React.useState<string>("");
  const [recipeImage, setRecipeImage] = React.useState<string>("");
  const [recipeName, setRecipeName] = React.useState<string>("");
  const [contributorName, setContributorName] = React.useState<string>("");
  const [ingredients, setIngredients] = React.useState([""]);
  const [instructions, setInstructions] = React.useState([""]);
  const [similarRecipes, setSimilarRecipes] = React.useState([1, 2, 3, 4, 5, 6, 7])
  const [comments, setComments] = React.useState([{ author: "Gordon Ramsay", comment: "This lamb is so undercooked, it’s following Mary to school!" }, { author: "Gordon Ramsay", comment: "My gran could do better! And she’s dead!" }, { author: "Gordon Ramsay", comment: "This pizza is so disgusting, if you take it to Italy you’ll get arrested." }])
  const listIngredient = ingredients.map((ingredient, key) =>
    <li key={key}>
      <ListItemText primary={ingredient} />
    </li>
  );
  const listInstructions = instructions.map((instruction, key) =>
    <ListItem key={key}>
      <Grid
        container
        spacing={0}
        direction="row"
      >
        <Grid item sm={0} sx={{ paddingTop: 0.75 }}>
          <Typography variant="h5">
            {key + 1}
          </Typography>
        </Grid>
        <Grid item sm={10} sx={{ borderLeft: "1px solid", padding: 0, paddingLeft: 1, margin: 1 }}>
          {instruction}
        </Grid>
      </Grid>
    </ListItem>
  );

  const similarRecipesCarousel = similarRecipes.map((recipe, key) =>
    <Grid key={key} item sm={3}>
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            image={testimg}
            alt="similar recipe"
          />
          <CardContent>
            <Typography variant="h5">
              Similar Recipe {recipe}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );

  const listComments = comments.map((comment, key) =>
    <div key={key}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={comment.author} src="/static/images/avatar/1.jpg" />
        </ListItemAvatar>
        <ListItemText
          primary={comment.author}
          secondary={
            <Typography variant="body2">
              {comment.comment}
            </Typography>
          }
        />
      </ListItem>
      <Divider variant="inset" />
    </div>
  );

  let items = []
  let carouselTab: any[] = []
  for (let i = 0; i < similarRecipesCarousel.length; i++) {
    carouselTab.push(similarRecipesCarousel[i]);
    if (carouselTab.length % 4 === 0) {
      items.push(carouselTab);
      carouselTab = [];
    }
  }
  items.push(carouselTab);

  const bgStyles = {
    backgroundColor: "#d3d3d3",
  }

  const handleComment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log(formData.get("comment"))
    const data: Comment = {
      author: username,
      comment: JSON.parse(JSON.stringify(formData.get("comment"))),
    };
    setComments([data, ...comments]);
  };


  function editButton() {
    if (contributorName === username) {
      console.log("DANK NUGGIES")
      return
      (<IconButton>
        <EditIcon />
      </IconButton>)
    }
  }

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      style={bgStyles}
      sx={{ paddingLeft: 0 }}
    >
      <Container component="main" sx={{ border: "0px solid", borderRadius: 0, padding: 2, backgroundColor: 'white' }}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4">
            {recipeName}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: "flex-end"
          }}
        >
          <Typography variant="caption"
            onClick={() => { navigate(`/profile/${contributorName}`) }}
            sx={{ cursor: "pointer" }}>
            <>
              posted by {contributorName}
              {(contributorName === username) &&
                <IconButton onClick={() => { (navigate(`/updaterecipe/${recipeId}`)) }}>
                  <EditIcon />
                </IconButton>}
              {editButton()}
            </>
          </Typography>

        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          {description}
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Card
            variant="outlined"
          >
            <Image
              src={recipeImage}
              duration={0}
              style={{
                paddingLeft: 0,
                paddingRight: 0,
                marginTop: '30'
              }}
            />
          </Card>
          <Grid container spacing={5} sx={{ padding: 3 }}>
            <Grid item sm={3}>
              <Typography variant="h5">
                Ingredients
              </Typography>
              <ul>
                {listIngredient}
              </ul>
            </Grid>
            <Grid item sm={9}>
              <Typography variant="h5">
                Cooking Instructions
              </Typography>
              <List>
                {listInstructions}</List>
            </Grid>
          </Grid>
        </Box>
        <Box
          sx={{
            padding: 2,
            alignItems: 'center',
          }}
        >
          <Typography variant="h5">
            Similar Recipes
          </Typography>
          <Carousel
            autoPlay={false}
            animation={"slide"}
          >
            {
              items.map((item, key) =>
                <Grid key={key} container spacing={2} sx={{ padding: 3 }}>
                  {item}
                </Grid>
              )
            }
          </Carousel>
        </Box>
        <Box
          component="form"
          onSubmit={handleComment}
          sx={{
            padding: 2,
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" sx={{
            paddingBottom: 3
          }}>
            Comments
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: "flex-start"
            }}
          >
            <ListItemAvatar>
              <Avatar sx={{ maring: "5" }} alt="R" src={testimg} />
            </ListItemAvatar>
            <TextField
              fullWidth
              variant='standard'
              InputProps={{
                endAdornment:
                  <IconButton
                    color='secondary'
                    type="submit">
                    <SendIcon />
                  </IconButton>
              }}
              name="comment"
              id="comment"
              placeholder="Add a Comment"
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: "flex-end"
            }}
          >
          </Box>
          <List sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}>
            {listComments}
          </List>
        </Box>
      </Container>
    </Grid>
  )
}

export default Recipe