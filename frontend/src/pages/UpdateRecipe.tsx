import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Box, Button, Container, CssBaseline, Grid, IconButton, TextField, Typography } from '@mui/material';
import Image from 'mui-image';
import React from 'react';
import { Tag } from '../types/instacook-types';
import RecipeContents from '../components/recipe/RecipeContents';
import { useNavigate, useParams } from 'react-router-dom';
import { Recipe } from '../types/instacook-types';

type Props = {}

const UpdateRecipe = (props: Props) => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = React.useState<Recipe>();
  const [description, setDescription] = React.useState<string>("");
  const [recipeName, setRecipeName] = React.useState<string>("");
  const [contributorName, setContributorName] = React.useState<string>("Matthew");
  const [ingredients, setIngredients] = React.useState<string[]>([]);
  const [instructions, setInstructions] = React.useState<string[]>([]);
  const [preview, setPreview] = React.useState<string>("");
  const [imgData, setImgData] = React.useState<any>('');
  const [ingredientsData, setIngredientsData] = React.useState<string[]>([]);
  const [instructionsData, setInstructionsData] = React.useState<string[]>([]);

  const [allTags, setAllTags] = React.useState<Tag[]>([]);
  const [tagsText, setTagsText] = React.useState<string[]>([]);
  const [tags, setTags] = React.useState<string[]>([]);


  React.useEffect(() => {
    const fetchRecipes = async () => {
      try {
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
        setTags(apiData.data.getRecipeById.tags)
        console.log(apiData.data.getRecipeById.tags)
        const requestBody1 = {
          query: `
            query{
              getTags {
                  _id
                  content
              }
          }
          `
        }

        const res1 = await fetch('http://localhost:3000/graphql', {
          body: JSON.stringify(requestBody1),
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const apiData1 = await res1.json();
        if (apiData1.errors) {
          throw new Error(apiData.errors[0].message);
        }
        setAllTags(apiData1.data.getTags);
        let tagIds = [];
        for (let tag of apiData1.data.getTags) {
          if (apiData.data.getRecipeById.tags.includes(tag.content)) {
            tagIds.push(tag._id)
          }
        }
        setTags([...tags, ...tagIds])
        setTagsText(apiData.data.getRecipeById.tags)

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

  const handleUpdate = async () => {
    if (recipe !== undefined) {
      const d = new Date();
      const tagsData = tags.map(i => `"${i}"`);
      const requestBody = {
        query: `
          mutation {
            updateRecipe(recipeID: "${recipeId}", recipeInput:
                {
                    title: "${recipeName}",
                    content: """[[${ingredientsData}], [${instructionsData}], [${JSON.stringify(description)}], "${imgData}"]""",
                    dateCreated: "${d.toString()}",
                    tags: [${tagsData}]

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
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const apiData1 = await res.json();
      console.log(apiData1);
      navigate(`/recipe/${recipeId}`)

    }
  }

  const handleInstruction = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setInstructionsData([...instructionsData, JSON.stringify(formData.get("instruction"))]);
    setInstructions([...instructions, JSON.parse(JSON.stringify(formData.get("instruction")))]);
  };

  const handleIngredient = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setIngredientsData([...ingredientsData, JSON.stringify(formData.get("ingredient"))]);
    setIngredients([...ingredients, JSON.parse(JSON.stringify(formData.get("ingredient")))]);
  };

  const handleTag = (newTag : string) => {
    let newTagText = "";
    for (let tag of allTags) {
      if (tag._id === newTag && tag.content) {
        newTagText = tag.content
      }
    }
    const copy = [...tags];
    const copyTagsText = [...tagsText]
    let index = copy.indexOf(newTag)
    let indexTagsText = copyTagsText.indexOf(newTagText)
    if (index > -1) {
      console.log("removed tag")
      copy.splice(index,1)
      copyTagsText.splice(indexTagsText, 1)
      setTags(copy)
      setTagsText(copyTagsText)
    } else {
      console.log("added tag")
      setTags([...tags, newTag])
      setTagsText([...tagsText, newTagText])
    }
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
                  if (e.target.files != null) {
                    setPreview(e.target.files[0].name);
                    const reader = new FileReader();
                    reader.addEventListener("load", () => {
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
              tags={tagsText}
              allTags={allTags}
              handleInstruction={handleInstruction}
              handleIngredient={handleIngredient}
              handleRemoveIngredient={handleRemoveIngredient}
              handleRemoveInstruction={handleRemoveInstruction}
              handleTag={handleTag}
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
                onClick={handleUpdate}
              >Update</Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Grid>
  )
}
export default UpdateRecipe