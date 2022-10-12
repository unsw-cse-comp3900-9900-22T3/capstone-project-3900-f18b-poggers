import React from 'react'
import { IconButton, ListItemText, List, ListItem, Box, Button, Container, CssBaseline, Grid, TextField, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { API, Auth, Storage } from "aws-amplify";
import { graphqlOperation } from "aws-amplify";
import { useNavigate } from 'react-router-dom';
import RemoveIcon from '@mui/icons-material/Remove';
const { v4: uuidv4 } = require('uuid');
type Props = {}


const createRecipe = /* GraphQL */ `
  mutation CreateRecipe(
    $input: CreateRecipeInput!
    $condition: ModelRecipeConditionInput
  ) {
    createRecipe(input: $input, condition: $condition) {
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

const CreateRecipe = (props: Props) => {

  const navigate = useNavigate();
  const [recipeName, setRecipeName] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [contributorName, setContributorName] = React.useState<string>("Matthew");
  const [ingredients, setIngredients] = React.useState<string[]>([]);
  const [instructions, setInstructions] = React.useState<string[]>([]);
  const [selectedImage, setSelectedImage] = React.useState<File>();
  const [preview, setPreview] = React.useState<string>("");
  const [ingredientText, setIngredientText] = React.useState<string>("");
  const [instructionText, setInstructionText] = React.useState<string>("");

  const [ingredientsData, setIngredientsData] = React.useState<string[]>([]);
  const [instructionsData, setInstructionsData] = React.useState<string[]>([]);

  React.useEffect(() => {
    const setUserData = async () => {
      console.log("setUserData in Feed.tsx called");
      try {
        // TS types are wrong: https://github.com/aws-amplify/amplify-js/issues/4927
        const user = await Auth.currentAuthenticatedUser({
          bypassCache: false
        })
        console.log(user)
        setContributorName(user.username);
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
  }, [navigate])

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
    // formData.set("")
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
            <TextField
              fullWidth
              id="recipeName"
              name="recipeName"
              label="Enter Recipe Name Here"
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
                {/* <Typography variant="h5">
                  Description
                </Typography> */}
                <TextField
              fullWidth
              id="description"
              name="description"
              label="Enter Description Here"
              variant="standard"
              onChange={(e) => {
                setDescription(JSON.stringify(e.target.value));
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
                        </>
                      }}
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
                        const storageResult = await Storage.put(
                          uuidv4(),
                          selectedImage
                        );

                        // Insert predictions code here later
                        console.log(storageResult);
                        const newRecipe = {
                          name: recipeName,
                          content: [ingredientsData, instructionsData, description],
                          contributor: contributorName,
                          fileImage: storageResult,
                        };
                        const data: any = await API.graphql(graphqlOperation(createRecipe,{input:newRecipe}));
                        const id = data.data.createRecipe.id;

                        navigate(`/recipe/${id}`)
                      }}
                    >Done</Button>
                  </Box>
          </Box>
        </Box>
      </Container>
    </Grid>
  )
}
export default CreateRecipe