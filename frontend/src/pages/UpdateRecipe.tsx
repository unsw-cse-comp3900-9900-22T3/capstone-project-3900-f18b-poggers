import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Box, Button, Container, CssBaseline, Grid, IconButton, TextField, Typography } from '@mui/material';
import { API, graphqlOperation, Storage } from "aws-amplify";
import Image from 'mui-image';
import React from 'react';
import RecipeContents from '../components/recipe/RecipeContents';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

type Props = {}

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
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = React.useState<Recipe>();
  const [description, setDescription] = React.useState<string>("");
  const [recipeName, setRecipeName] = React.useState<string>("");
  const [contributorName, setContributorName] = React.useState<string>("Matthew");
  const [ingredients, setIngredients] = React.useState<string[]>([]);
  const [instructions, setInstructions] = React.useState<string[]>([]);
  const [selectedImage, setSelectedImage] = React.useState<File>();
  const [preview, setPreview] = React.useState<string>("");
  const [imgKey, setImgKey] = React.useState<boolean>(false);
  const [imgData, setImgData] = React.useState<any>('');
  const [ingredientsData, setIngredientsData] = React.useState<string[]>([]);
  const [instructionsData, setInstructionsData] = React.useState<string[]>([]);

  const [tags, setTags] = React.useState<string[]>([]);
  const [token, setToken] = React.useState<string>("");


  React.useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const apiData2: any = await API.graphql({
          query: getRecipe,
          variables: { id: recipeId }
        });

        const recipeById = apiData2.data.getRecipe;
        console.log(recipeById);
        setToken("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzVmNzcwNWNjNTA0ZDJjZjMwYTQ0MWUiLCJlbWFpbCI6InNoYWRvd0BnbWFpbC5jb20iLCJpYXQiOjE2NjczMDA4NzksImV4cCI6MTY2NzMwNDQ3OX0.dLRKvEKXBKnm7FEdctMQNDMpNDmlBC1uN4gsdf8yYok")
        // setRecipeName(recipeById.name);
        // setDescription(JSON.parse(recipeById.content)[2])
        // setContributorName(recipeById.contributor);

        // if (recipeById.content[0] != null) {
        //   console.log(JSON.parse(recipeById.content)[0].length);
        //   setIngredients(JSON.parse(recipeById.content)[0]);
        //   let tempIngredients = [];
        //   for (let x of (JSON.parse(recipeById.content)[0])) {
        //     tempIngredients.push(JSON.stringify(x));
        //   }
        //   setIngredientsData([...ingredientsData, ...tempIngredients]);
        // }

        // if (recipeById.content[1] != null) {
        //   setInstructions(JSON.parse(recipeById.content)[1]);
        //   let tempInstructions = [];
        //   for (let x of (JSON.parse(recipeById.content)[1])) {
        //     tempInstructions.push(JSON.stringify(x));
        //   }
        //   setInstructionsData([...instructionsData, ...tempInstructions]);
        // }

        // setImgKey(recipeById.fileImage);

        // if (recipeById != null) {
        //   recipeById.name = "hi";
        // }

        const requestBody = {
          query: `
            query {
              getRecipeById(recipeID: "${recipeId}") {
                  title
                  content
                  dateCreated
                  contributorUsername
                  numberLike
                  listComments {
                      userName
                      recipeID
                      content
                      dateCreated
                  }
                  tags
              }
          }
          `
        }

        const res = await fetch('http://localhost:3000/graphql', {
          body: JSON.stringify(requestBody),
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log("TRIGGERRREDD");
        const apiData = await res.json();
        setRecipe(apiData.data.getRecipeById);
        if (apiData.errors) {
          throw new Error(apiData.errors[0].message);
        }
        console.log(apiData);
        setRecipeName(apiData.data.getRecipeById.title)
        setDescription(JSON.parse(apiData.data.getRecipeById.content)[2])
        setContributorName(apiData.data.getRecipeById.contributorUsername)
        setImgData(JSON.parse(apiData.data.getRecipeById.content)[3])
        if (apiData.data.getRecipeById.content[0] != null) {
          setIngredients(JSON.parse(apiData.data.getRecipeById.content)[0]);
          let tempIngredients = [];
          for (let x of (JSON.parse(apiData.data.getRecipeById.content)[0])) {
            tempIngredients.push(JSON.stringify(x));
          }
          setIngredientsData([...ingredientsData, ...tempIngredients]);
        }
        if (apiData.data.getRecipeById.content[1] != null) {
          setInstructions(JSON.parse(apiData.data.getRecipeById.content)[1]);
          let tempInstructions = [];
          for (let x of (JSON.parse(apiData.data.getRecipeById.content)[1])) {
            tempInstructions.push(JSON.stringify(x));
          }
          setInstructionsData([...instructionsData, ...tempInstructions]);
        }



      } catch (error) {
        console.log("error on fetching recipe", error);
      }
    };
    fetchRecipes();
  }, [recipeId]);

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
  };

  const handleIngredient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log(formData.get("ingredient"))
    setIngredientsData([...ingredientsData, JSON.stringify(formData.get("ingredient"))]);
    setIngredients([...ingredients, JSON.parse(JSON.stringify(formData.get("ingredient")))]);
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
      sx={{ paddingLeft: 0 }}
    >
      <Container component="main" sx={{ border: "0px solid", borderRadius: 0, padding: 2, backgroundColor: 'white' }}>
        <CssBaseline />
        <Box>

        {/* Recipe Title */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
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

          {/* Contributor Name */}
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

          {/* Recipe Description */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: "flex-start"
            }}
          >
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

          {/* Upload an Image */}
            <Box>
              <IconButton color="primary" aria-label="upload picture" component="label">
                <input hidden accept="image/*" type="file" onChange={(e) => {
                  e.preventDefault();
                  console.log(e.target.value);
                  if (e.target.files != null) {
                    setSelectedImage(e.target.files[0]);
                    setPreview(e.target.files[0].name);
                    setImgKey(true);
                    const reader = new FileReader();
                    reader.addEventListener("load", () => {
                      console.log("below")
                      console.log(reader.result);
                      setImgData(reader.result);
                    });
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }} />
                <AddPhotoAlternateIcon fontSize='large' sx={{}} />
              </IconButton>
              {imgData.length !== 0 && <Image
                src={imgData}
                duration={0}
                style={{
                  paddingLeft: 0,
                  paddingRight: 0,
                  marginTop: '30'
                }}
              />}
              {preview}
            </Box>

            {/* Ingredients and Instructions */}
            <RecipeContents
              ingredients={ingredients}
              instructions={instructions}
              tags={tags}
              handleInstruction={handleInstruction}
              handleIngredient={handleIngredient}
              handleRemoveIngredient={handleRemoveIngredient}
              handleRemoveInstruction={handleRemoveInstruction}
            />

            {/* Update Button */}
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
                    // let newRecipe = {
                    //   id: recipe.id,
                    //   name: recipeName,
                    //   content: [ingredientsData, instructionsData, JSON.stringify(description)],
                    //   contributor: contributorName,
                    //   fileImage: recipe.fileImage,
                    // };
                    // if (imgKey === true) {
                    //   const storageResult = await Storage.put(
                    //     uuidv4(),
                    //     selectedImage
                    //   );
                    //   newRecipe.fileImage = `{key=${storageResult.key}}`;
                    // }
                    // console.log(recipe);
                    // try {
                    //   const data: any = await API.graphql(graphqlOperation(updateRecipe, { input: newRecipe }));
                    //   const id = data.data.updateRecipe.id;
                    //   navigate(`/recipe/${id}`)
                    //   console.log(newRecipe);

                    // } catch (error) {
                    //   console.log("error on fetching recipe", error);
                    // }
                    const requestBody = {
                      query: `
                        mutation {
                          updateRecipe(recipeID: "${recipeId}", recipeInput:
                              {
                                  title: "${recipeName}",
                                  content: """[[${ingredientsData}], [${instructionsData}], [${JSON.stringify(description)}], "${imgData}"]""",
                                  dateCreated: "2023-03-25",
                                  tags: []

                              }
                          )
                      }
                      `
                    }
                    console.log(requestBody)
                    const res = await fetch('http://localhost:3000/graphql', {
                      body: JSON.stringify(requestBody),
                      method: "POST",
                      headers: {
                        Authorization: token,
                        'Content-Type': 'application/json'
                      }
                    });
                    console.log("TRIGGERRREDD");
                    const apiData1 = await res.json();
                    console.log(apiData1);
                    navigate(`/recipe/${recipeId}`)

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