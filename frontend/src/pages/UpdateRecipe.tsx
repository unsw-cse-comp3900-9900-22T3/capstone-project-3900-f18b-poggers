import React, { useEffect } from 'react'
import { IconButton, Avatar, Divider, ListItemAvatar, CardContent, CardActionArea, ListItemText, List, ListItem, CardMedia, Card, Box, Button, Checkbox, Container, createTheme, CssBaseline, FormControlLabel, Grid, TextField, Typography } from '@mui/material'
import Carousel from 'react-material-ui-carousel'
import testimg from '../static/images/authbackground.jpeg'
import AddIcon from '@mui/icons-material/Add';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import RemoveIcon from '@mui/icons-material/Remove';
import Amplify, { API, Auth, Storage } from "aws-amplify";
import { graphqlOperation } from "aws-amplify";
import { useNavigate } from 'react-router-dom';
import { DescriptionTwoTone } from '@mui/icons-material';
const { v4: uuidv4 } = require('uuid');
type Props = {}

type Comment = {
  author: string,
  comment: string,
}

type Recipe = {
  id: string,
  name: string,
  content: string,
  contributor: string,
  fileImage: string,
  createdAt: string,
  updatatedAt: string,
  owner: string,
}

const updateRecipe = /* GraphQL */ `
  mutation UpdateRecipe(
    $input: UpdateRecipeInput!
    $condition: ModelRecipeConditionInput
  ) {
    updateRecipe(input: $input, condition: $condition) {
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

const UpdateRecipe = (props: Props) => {
  React.useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const apiData2: any = await API.graphql({
          query: getRecipe,
          variables: { id: recipeId }
          });
        const recipeById = apiData2.data.getRecipe;
        console.log(recipeById);
        setRecipeName(recipeById.name);
        setDescription(JSON.parse(recipeById.content)[2])
        setContributorName(recipeById.contributor);
        if (recipeById.content[0] != null) {
          console.log(JSON.parse(recipeById.content)[0].length);
          setIngredients(JSON.parse(recipeById.content)[0]);
          let tempIngredients = [];
          for (let x of (JSON.parse(recipeById.content)[0])) {
            tempIngredients.push(JSON.stringify(x));
          }
          setIngredientsData([...ingredientsData, ...tempIngredients]);
        }
        if (recipeById.content[1] != null) {
          setInstructions(JSON.parse(recipeById.content)[1]);
          let tempInstructions = [];
          for (let x of (JSON.parse(recipeById.content)[1])) {
            tempInstructions.push(JSON.stringify(x));
          }
          setInstructionsData([...instructionsData, ...tempInstructions]);

        }
        const fileAccessURL = await Storage.get(recipeById.fileImage.slice(5,-1), { expires: 30 ,level: "public"});
        setRecipeImage(fileAccessURL);
        setImgKey(recipeById.fileImage);
        if (recipeById != null) {
          recipeById.name = "hi";
        }
        setRecipe(recipeById);
      } catch (error) {
        console.log("error on fetching recipe", error);
      }
    };
    fetchRecipes();
  }, []);

  const pathname = window.location.pathname;
  const recipeId = pathname.slice(14);

  const navigate = useNavigate();
  const [recipe, setRecipe] = React.useState<Recipe>();
  const [recipeImage, setRecipeImage] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [recipeName, setRecipeName] = React.useState<string>("");
  const [contributorName, setContributorName] = React.useState<string>("Matthew");
  const [ingredients, setIngredients] = React.useState<string[]>([]);
  const [instructions, setInstructions] = React.useState<string[]>([]);
  const [selectedImage, setSelectedImage] = React.useState<File>();
  const [preview, setPreview] = React.useState<string>("");
  const [imgKey, setImgKey] = React.useState<boolean>(false);
  const [ingredientText, setIngredientText] = React.useState<string>("");
  const [instructionText, setInstructionText] = React.useState<string>("");

  const [ingredientsData, setIngredientsData] = React.useState<string[]>([]);
  const [instructionsData, setInstructionsData] = React.useState<string[]>([]);

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

  const bgStyles = {
    minHeight: `calc(100vh - 64px)`,
    backgroundColor: "#d3d3d3",
  }

  const handleInstruction = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log(formData.get("instruction"))
    setInstructionsData([...instructionsData, JSON.stringify(formData.get("instruction"))]);
    setInstructions([...instructions, JSON.parse(JSON.stringify(formData.get("instruction")))]);
    setInstructionText("");
  };

  const handleIngredient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log(formData.get("ingredient"))
    setIngredientsData([...ingredientsData, JSON.stringify(formData.get("ingredient"))]);
    setIngredients([...ingredients, JSON.parse(JSON.stringify(formData.get("ingredient")))]);
    setIngredientText("");
  };

  const handleRemoveIngredient = () => {
    const copy = [...ingredients];
    const copyData = [...ingredientsData];
    copy.pop();
    copyData.pop();
    setIngredients(copy);
    setIngredientsData(copyData);

  };

  const handleRemoveInstruction = () => {
    const copy = [...instructions];
    const copyData = [...instructionsData];
    copy.pop();
    copyData.pop();
    setInstructions(copy);
    setInstructionsData(copyData);

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
        <Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
            >
            <Typography variant="h5">
              Recipe Name
            </Typography>
            <TextField
              value={recipeName}
              fullWidth
              id="recipeName"
              name="recipeName"
              variant="standard"
              onChange={(e) => {
                setRecipeName(e.target.value);
              }}
            />
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
              alignItems: "flex-start"
            }}
            >
                <Typography variant="h5">
                  Description
                </Typography>
                <TextField
              fullWidth
              value={description}
              id="description"
              name="description"
              label=""
              variant="standard"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
            >

              <Box>
                <IconButton color="primary" aria-label="upload picture" component="label">
                  <input hidden accept="image/*" type="file" onChange={(e) => {
                  e.preventDefault();
                  console.log(e.target.value);
                  if (e.target.files != null) {
                    setSelectedImage(e.target.files[0]);
                    setPreview(e.target.files[0].name);
                    setImgKey(true);
                    console.log(e.target.files[0]);
                  }
                }}/>
                  <AddPhotoAlternateIcon fontSize='large' sx={{}}/>
                </IconButton>
                {preview}
              </Box>

            <Grid container spacing={5} sx={{padding: 3}}>
              <Grid item sm={3}>
                <Typography variant="h5">
                  Ingredients
                </Typography>
                <ul>
                  {listIngredient}
                </ul>
                <Box
                  component="form"
                  onSubmit={handleIngredient}
                >
                  <TextField
                    value={ingredientText}
                    fullWidth
                    variant='standard'
                    onChange={(e) => {setIngredientText(e.target.value)}}
                    InputProps={{ endAdornment:
                    <>
                    <IconButton
                    color='secondary'
                    onClick={(e) => {handleRemoveIngredient()}}>
                      <RemoveIcon />
                    </IconButton>
                    <IconButton
                    color='secondary'
                    type="submit">
                      <AddIcon />
                    </IconButton>
                    </>

                    }}
                    name="ingredient"
                    id="ingredient"
                    placeholder="Add another ingredient"
                  />
                </Box>
              </Grid>
              <Grid item sm={9}>
                <Typography variant="h5">
                  Cooking Instructions
                </Typography>
                <List>
                  {listInstructions}</List>
                  <Box
                    component="form"
                    onSubmit={handleInstruction}
                  >
                    <TextField
                      value={instructionText}
                      fullWidth
                      variant='standard'
                      onChange={(e) => {setInstructionText(e.target.value)}}
                      InputProps={{ endAdornment:
                        <>
                        <IconButton
                        color='secondary'
                        onClick={(e) => {handleRemoveInstruction()}}>
                          <RemoveIcon />
                        </IconButton>
                        <IconButton
                        color='secondary'
                        type="submit">
                          <AddIcon />
                        </IconButton>
                        </>}}
                      name="instruction"
                      id="instruction"
                      placeholder="Add another cooking instruction"
                    />
                  </Box>
              </Grid>
            </Grid>
                  <Box
                    paddingTop={0}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: "flex-end"
                    }}
                  >
                    <Button variant="contained"
                      onClick={async () => {
                        if (recipe !== undefined) {

                          let newRecipe = {
                            id: recipe.id,
                            name: recipeName,
                            content: [ingredientsData, instructionsData, JSON.stringify(description)],
                            contributor: contributorName,
                            fileImage: recipe.fileImage,
                          };
                          if (imgKey === true) {
                            const storageResult = await Storage.put(
                              uuidv4(),
                              selectedImage
                            );
                            newRecipe.fileImage = `{key=${storageResult.key}}`;
                          }
                          console.log(recipe);
                          try {
                            const data: any = await API.graphql(graphqlOperation(updateRecipe,{input:newRecipe}));
                            const id = data.data.updateRecipe.id;
                            navigate(`/recipe/${id}`)
                            console.log(newRecipe);

                          } catch (error) {
                            console.log("error on fetching recipe", error);
                          }
                        }

                      }}
                    >Update</Button>
                  </Box>
          </Box>
        </Box>
      </Container>
    </Grid>
  )
}
export default UpdateRecipe