import React, { useEffect } from 'react'
import { IconButton, Avatar, Divider, ListItemAvatar, CardContent, CardActionArea, ListItemText, List, ListItem, CardMedia, Card, Box, Button, Checkbox, Container, createTheme, CssBaseline, FormControlLabel, Grid, TextField, Typography } from '@mui/material'
import Carousel from 'react-material-ui-carousel'
import testimg from '../static/images/authbackground.jpeg'
import SendIcon from '@mui/icons-material/Send';
import { graphqlOperation } from "aws-amplify";
import Amplify, { API, Auth, Storage } from "aws-amplify";
type Props = {}

type Comment = {
  author: string,
  comment: string,
}

const Recipe = (props: Props) => {

  // React.useEffect(() => {
  //   fetchRecipe();
  // }, []);

  const [recipes, setRecipes] = React.useState([]);

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
  // const fetchRecipe = async () => {
  //   try {
  //     const apiData: any = await API.graphql({
  //     query: getRecipe,
  //     variables: { id: '826ee6a4-0891-4732-aa84-2c47cfce255d' }
  //     });

  //     const recipes = apiData.data.getRecipe;

  //     console.log(recipes)
  //   } catch (error) {
  //     console.log("error on fetching recipe", error);
  //   }
  // };

  // try {
  //   const apiData: any = await API.graphql({ query: listRecipes });
  //   const recipeData = apiData.data;
  //   console.log(recipeData)
  // } catch (error) {
  //   console.log("error on fetching recipe", error);
  // }
  const [recipeName, setRecipeName] = React.useState<string>("Beef Wellington");
  const [contributorName, setContributorName] = React.useState<string>("Matthew");
  const [ingredients, setIngredients] = React.useState(["2 x 400g beef fillets", "Olive oil, for frying", "500g mixture of wild mushrooms, cleaned", "1 thyme sprig, leaves only", "500g puff pastry", "8 slices of Parma ham", "2 egg yolks, beaten with 1 tbsp water and a pinch of salt", "Sea salt and freshly ground black peppe"]);
  const [instructions, setInstruction] = React.useState(["Wrap each piece of beef tightly in a triple layer of cling film to set its shape, then chill overnight.", "Remove the cling film, then quickly sear the beef fillets in a hot pan with a little olive oil for 30-60 seconds until browned all over and rare in the middle. Remove from the pan and leave to cool.", "Finely chop the mushrooms and fry in a hot pan with a little olive oil, the thyme leaves and some seasoning. When the mushrooms begin to release their juices, continue to cook over a high heat for about 10 minutes until all the excess moisture has evaporated and you are left with a mushroom paste (known as a duxelle). Remove the duxelle from the pan and leave to cool.", "Cut the pastry in half, place on a lightly floured surface and roll each piece into a rectangle large enough to envelop one of the beef fillets. Chill in the refrigerator.", "Lay a large sheet of cling film on a work surface and place 4 slices of Parma ham in the middle, overlapping them slightly, to create a square. Spread half the duxelle evenly over the ham."]);
  const [similarRecipes, setSimilarRecipes] = React.useState([1,2,3,4,5,6,7])
  const [comments, setComments] = React.useState([{author: "Gordon Ramsay", comment: "This lamb is so undercooked, it’s following Mary to school!"}, {author: "Gordon Ramsay", comment: "My gran could do better! And she’s dead!"}, {author: "Gordon Ramsay", comment: "This pizza is so disgusting, if you take it to Italy you’ll get arrested."}])
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
        <Grid item sm={0} sx={{paddingTop: 0.75}}>
          <Typography variant="h5">
            {key + 1}
          </Typography>
        </Grid>
        <Grid item sm={10} sx={{borderLeft: "1px solid", padding: 0, paddingLeft: 1, margin: 1}}>
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
    <ListItem  alignItems="flex-start">
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
    <Divider variant="inset"/>
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
      author: "Raymond Chung",
      comment: JSON.parse(JSON.stringify(formData.get("comment"))),
    };
    setComments([data, ...comments]);
  };


  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      style={bgStyles}
      sx={{paddingLeft: 0}}
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
          <Typography variant="caption">
            posted by {contributorName}
          </Typography>

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
            <CardMedia
              image={testimg}
              style={{
                height: 0,
                paddingLeft: 0,
                paddingRight: 0,
                paddingTop: '56.25%', // 16:9,
                marginTop:'30'
              }}
            />
          </Card>
          <Grid container spacing={5} sx={{padding: 3}}>
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
            // navButtonsAlwaysVisible={true}
          >
              {
                  items.map( (item, key) =>
                      <Grid key={key} container spacing={2} sx={{padding: 3}}>
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
            paddingBottom:3
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
            <Avatar sx={{maring:"5"}} alt="R" src={testimg}/>
          </ListItemAvatar>
          <TextField
            fullWidth
            variant='standard'
            InputProps={{ endAdornment:
            <IconButton
            color='secondary'
            type="submit">
              <SendIcon />
            </IconButton> }}
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
          {/* <Button
              type="submit"
              size="medium"
              variant="contained"
              color="secondary"
            >
              Comment
            </Button> */}
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